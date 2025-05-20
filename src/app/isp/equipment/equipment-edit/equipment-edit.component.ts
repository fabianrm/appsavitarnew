import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EquipmentCreateComponent } from '../equipment-create/equipment-create.component';
import { EquipmentService } from '../equipment.service';
import { Equipment } from '../Models/EquipmentResponse';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { Brand } from '../../brand/Models/BrandResponse';
import { BrandService } from '../../brand/brand.service';
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
    selector: 'app-equipment-edit',
    templateUrl: './equipment-edit.component.html',
    styleUrl: './equipment-edit.component.scss',
    standalone: false
})
export class EquipmentEditComponent {

  formEquipment!: FormGroup;
  color: ThemePalette = 'accent';
  checked = true;
  disabled = false;

  brands: Brand[] = [];

  date = new Date();

  tipos: Tipo[] = [
    { value: 'ROUTER', viewValue: 'ROUTER' },
    { value: 'SWITCH', viewValue: 'SWITCH' },
  ]


  estados: Estado[] = [
    { value: 'BUENO', viewValue: 'BUENO' },
    { value: 'REGULAR', viewValue: 'REGULAR' },
    { value: 'MALO', viewValue: 'MALO' },
  ]

  constructor(public formulario: FormBuilder,
    private equipmentService: EquipmentService, @Inject(MAT_DIALOG_DATA) public getData: any,
    private snackbarService: SnackbarService,
    private brandService: BrandService,
    private datePipe: DatePipe,
    private dialogRef: MatDialogRef<EquipmentCreateComponent>
  ) { }


  ngOnInit(): void {

    this.initForm();
    this.getBrands();

  }

  initForm() {


    const purchaseDate = this.getData[0].purchaseDate;


    let fechaDate = new Date(purchaseDate + ' 0:00:00');

    const formControlsConfig = {
      id: [this.getData[0].id, Validators.required],
      type: [this.getData[0].type, Validators.required],
      mac: [this.getData[0].mac,],
      serie: [this.getData[0].serie,],
      model: [this.getData[0].model, Validators.required],
      brandId: [this.getData[0].brandId],
      purchaseDate: [fechaDate, Validators.required],
      status: [this.getData[0].status, Validators.required],
    }

    this.formEquipment = this.formulario.group(formControlsConfig);

    //Convertir a mayusculas
    Object.keys(formControlsConfig).forEach(key => {
      if (key === 'serie' || key === 'model') {
        this.formEquipment.get(key)?.valueChanges.subscribe(value => {
          this.formEquipment.get(key)?.setValue(value.toUpperCase(), { emitEvent: false });
        });
      }
    });

  }


  //Marcas
  getBrands() {
    this.brandService.getBrands().subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        this.brands = respuesta.data
      }
    });
  }


  enviarDatos() {

    const formData = this.formEquipment.value;
    const purchaseDate = new Date(formData.purchaseDate).toISOString().split('T')[0];

    const dataToSend = {
      ...formData,
      purchaseDate: purchaseDate,
    };

    if (this.formEquipment.valid) {
      this.equipmentService.updateEquipment(this.getData[0].id, dataToSend).subscribe(respuesta => {
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
