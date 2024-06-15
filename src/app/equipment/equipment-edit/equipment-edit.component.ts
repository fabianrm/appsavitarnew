import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EquipmentCreateComponent } from '../equipment-create/equipment-create.component';
import { EquipmentService } from '../equipment.service';
import { Equipment } from '../Models/EquipmentResponse';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';


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
    private snackbarService: SnackbarService,
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
      purchase_date: [this.getData.purchaseDate, ''],
      status: [this.selectedEstado, Validators.required],
    });
  }

  enviarDatos() {
    if (this.formEquipment.valid) {
      this.equipmentService.updateEquipment(this.getData.id, this.formEquipment.value).subscribe(respuesta => {
        this.showSuccess();
        this.dialogRef.close();
        // console.log(respuesta);
      });
    }
  }

  showError() {
    this.snackbarService.showError('☹️ Ocurrio un error');
  }


  showSuccess() {
    this.snackbarService.showSuccess('Equipo editado correctamente');
  }


}
