import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EquipmentCreateComponent } from '../equipment-create/equipment-create.component';
import { EquipmentService } from '../equipment.service';
import { Equipment } from '../Models/Equipment';

interface Tipo {
  value: string;
  viewValue: string;
}

interface Estado {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-equipment-edit',
  templateUrl: './equipment-edit.component.html',
  styleUrl: './equipment-edit.component.scss'
})
export class EquipmentEditComponent {

  formEquipment!: FormGroup;
  color: ThemePalette = 'accent';
  checked = true;
  disabled = false;
  selectedTipo = this.getData.type;
  selectedEstado = this.getData.status;

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
    private equipmentService: EquipmentService, @Inject(MAT_DIALOG_DATA) public getData: Equipment,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<EquipmentCreateComponent>
  ) { }


  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.formEquipment = this.formulario.group({
      id: [this.getData.id, Validators.required],
      type: [this.selectedTipo, Validators.required],
      serie: [this.getData.serie, Validators.required],
      model: [this.getData.model, Validators.required],
      brand: [this.getData.brand],
      purchase_date: [this.getData.purchase_date, ''],
      status: [this.selectedEstado, Validators.required],
    });
  }

  enviarDatos() {
    if (this.formEquipment.valid) {
      this.equipmentService.updateEquipment(this.getData.id, this.formEquipment.value).subscribe(respuesta => {
        this.msgSusscess('Equipo editado correctamente');
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
