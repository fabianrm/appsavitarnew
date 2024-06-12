import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { EquipmentService } from '../equipment.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrandService } from '../../brand/brand.service';
import { Brand } from '../../brand/Models/BrandResponse';


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
    private _snackBar: MatSnackBar,
    private brandService: BrandService,
    private dialogRef: MatDialogRef<EquipmentCreateComponent>
  ) { }


  ngOnInit(): void {
    this.getBrands();
    this.initForm();
    
  }

  initForm() {
    this.formEquipment = this.formulario.group({
      type: [this.selectedTipo, Validators.required],
      serie: ['', Validators.required],
      model: ['', Validators.required],
      brandId: [''],
      purchaseDate: [''],
      status: [this.selectedEstado, Validators.required],
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
