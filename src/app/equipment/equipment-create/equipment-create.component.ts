import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { EquipmentService } from '../equipment.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';

interface Tipo {
  value: string;
  viewValue: string;
}

interface Estado {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-equipment-create',
  templateUrl: './equipment-create.component.html',
  styleUrl: './equipment-create.component.scss'
})
export class EquipmentCreateComponent implements OnInit {

  formEquipment!: FormGroup;
  color: ThemePalette = 'accent';
  checked = true;
  disabled = false;
  selectedTipo = 'router';
  selectedEstado = 'bueno';

  date = new Date();

  tipos: Tipo[] = [
    { value: 'router', viewValue: 'Router' },
    { value: 'switch', viewValue: 'Switch' },
    { value: 'caja', viewValue: 'Caja' },
    { value: 'mufa', viewValue: 'Mufa' },
  ]


  estados: Estado[] = [
    { value: 'bueno', viewValue: 'Bueno' },
    { value: 'regular', viewValue: 'Regular' },
    { value: 'malo', viewValue: 'Malo' },
  ]

  constructor(public formulario: FormBuilder,
    private equipmentService: EquipmentService, @Inject(MAT_DIALOG_DATA) public getData: any,
    private _snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private dialogRef: MatDialogRef<EquipmentCreateComponent>
  ) { }


  ngOnInit(): void {
    this.initForm();
    
  }

  initForm() {
    this.formEquipment = this.formulario.group({
      type: [this.selectedTipo, Validators.required],
      serie: ['', Validators.required],
      model: ['', Validators.required],
      brand: [''],
      purchase_date: [],
      status: [this.selectedEstado, Validators.required],
    });
  }

  enviarDatos() {
    
    const formData = this.formEquipment.value;
    const purchaseDate = new Date(formData.purchase_date).toISOString().split('T')[0];

    const dataToSend = {
      ...formData,
      purchase_date: purchaseDate,

    };

    if (this.formEquipment.valid) {
      this.equipmentService.addEquipment(dataToSend).subscribe(respuesta => {
        this.msgSusscess('Equipo agregado correctamente');
        this.dialogRef.close();
        // console.log(respuesta);
      });
    }
  }


  msgSusscess(mensaje: string) {
    this._snackBar.open(mensaje, 'SAVITAR', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    })
  }


}
