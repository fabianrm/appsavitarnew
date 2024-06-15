import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { EquipmentService } from '../equipment.service';
import { MatDialogRef } from '@angular/material/dialog';
import { BrandService } from '../../brand/brand.service';
import { Brand } from '../../brand/Models/BrandResponse';
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
  selector: 'app-equipment-create',
  templateUrl: './equipment-create.component.html',
  styleUrl: './equipment-create.component.scss'
})
export class EquipmentCreateComponent implements OnInit {

  formEquipment!: FormGroup;
  color: ThemePalette = 'accent';
  checked = true;
  disabled = false;
  selectedTipo = 'ROUTER';
  selectedEstado = 'BUENO';

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
    private equipmentService: EquipmentService,
    private snackbarService: SnackbarService,
    private brandService: BrandService,
    private dialogRef: MatDialogRef<EquipmentCreateComponent>
  ) { }


  ngOnInit(): void {
    this.getBrands();
    this.initForm();
    
  }

  initForm() {

    const formControlsConfig = {
      type: [this.selectedTipo, Validators.required],
      serie: ['', Validators.required],
      model: ['', Validators.required],
      brandId: [''],
      purchaseDate: [''],
      status: [this.selectedEstado, Validators.required],
  
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
      this.equipmentService.addEquipment(dataToSend).subscribe(respuesta => {
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
    this.snackbarService.showSuccess('Equipo agregado correctamente');
  }



}
