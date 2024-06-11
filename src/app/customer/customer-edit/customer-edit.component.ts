import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from '../customer.service';
import { ThemePalette } from '@angular/material/core';
import { City } from '../../city/Models/CityResponse';
import { CityService } from '../../city/city.service';


interface Tipo {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrl: './customer-edit.component.css'
})
export class CustomerEditComponent implements OnInit {

  formEditar!: FormGroup;
  color: ThemePalette = 'accent';
  checked: boolean = false;
  disabled = false;

  // id_customer = this.getData;

  tipos: Tipo[] = [
    { value: 'natural', viewValue: 'Natural' },
    { value: 'juridica', viewValue: 'Juridica' },
  ]

  cities: City[] = [];


  constructor(public formulario: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public getId: number,
    private cityService: CityService,
    private _snackBar: MatSnackBar,
    private customerService: CustomerService,
    private dialogRef: MatDialogRef<CustomerEditComponent>) { }

  ngOnInit(): void {

    const formControlsConfig = {
      type: ['', Validators.required],
      documentNumber: ['', Validators.required],
      name: ['', Validators.required],
      cityId: ['', Validators.required],
      address: ['', Validators.required],
      reference: [''],
      latitude: [''],
      longitude: [''],
      phoneNumber: ['', Validators.required],
      email: [''],
      status: ['', Validators.required],
    }
    this.formEditar = this.formulario.group(formControlsConfig);

    Object.keys(formControlsConfig).forEach(key => {
      if (key === 'note' || key === 'description' || key === 'voutcher') {
        this.formEditar.get(key)?.valueChanges.subscribe(value => {
          this.formEditar.get(key)?.setValue(value.toUpperCase(), { emitEvent: false });
        });
      }
    });


    this.getCities();
    this.getCustomer(this.getId);
  }


  getCustomer(id: number) {
    this.customerService.getCustomerById(id).subscribe(customer => {

      this.formEditar.patchValue({
        type: customer.type,
        documentNumber: customer.documentNumber,
        name: customer.customerName,
        cityId: customer.cityId,
        address: customer.address,
        reference: customer.reference,
        latitude: customer.latitude,
        longitude: customer.longitude,
        phoneNumber: customer.phoneNumber,
        email: customer.email,
        status: (customer.status==true) ? this.checked = true : false

      });

    });
  }


  getCities() {
    this.cityService.getCities().subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        this.cities = respuesta.data
      }
    });
  }

  msgSusscess(mensaje: string) {
    this._snackBar.open('Cliente editado correctamente', 'Info', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    })
  }


  enviarDatos(id: number) {
   // console.log(this.formEditar.value);
    
    if (this.formEditar.valid) {
      this.customerService.updateCustomer(id, this.formEditar.value).subscribe(respuesta => {
        this.msgSusscess('Cliente editado correctamente');
        this.dialogRef.close();
        // console.log(respuesta);
      });
    }
  }


}
