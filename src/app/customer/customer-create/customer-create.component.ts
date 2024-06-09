import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ThemePalette } from '@angular/material/core';
import { CustomerService } from './../customer.service';
import { City } from '../../city/Models/CityResponse';
import { CityService } from '../../city/city.service';


interface Tipo {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-customer-create',
  templateUrl: './customer-create.component.html',
  styleUrl: './customer-create.component.css'
})


export class CustomerCreateComponent implements OnInit {

 // @ViewChild('documentNumber') documentNumber: ElementRef | undefined;

  formCliente!: FormGroup;
  color: ThemePalette = 'accent';
  checked = true;
  disabled = false;
  selected = 'natural';

  cities: City[] = [];

  tipos: Tipo[] = [
    { value: 'natural', viewValue: 'Natural' },
    { value: 'juridica', viewValue: 'Juridica' },
  ]

  constructor(public formulario: FormBuilder,
    private cityService: CityService,
    private customerService: CustomerService,
    @Inject(MAT_DIALOG_DATA) public getData: any,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<CustomerCreateComponent>) { }

  
  ngOnInit(): void {
    this.getCities();
    this.initForm();
   // this.documentNumber!.nativeElement.focus();
  }


  initForm() {
    const formControlsConfig = {
      type: [this.selected, Validators.required],
      documentNumber: ['', Validators.required],
      name: ['', Validators.required],
      cityId: ['', Validators.required],
      address: ['', Validators.required],
      reference: [''],
      latitude: [''],
      longitude: [''],
      phoneNumber: [''],
      email: [''],
      status: [true],
    }

    this.formCliente = this.formulario.group(formControlsConfig);

    Object.keys(formControlsConfig).forEach(key => {
      if (key === 'note' || key === 'description' || key === 'voutcher') {
        this.formCliente.get(key)?.valueChanges.subscribe(value => {
          this.formCliente.get(key)?.setValue(value.toUpperCase(), { emitEvent: false });
        });
      }
    });
    
  }

  enviarDatos() {
    if (this.formCliente.valid) {
      //const equipment = this.formContrato.get('equipmentId')!.value;
      const form = this.formCliente.value;
      const documento = form.documentNumber
      this.customerService.getCustomerByDocument(documento).subscribe(respuesta => {
      
        if (respuesta.exists == false) {
          this.customerService.addCustomer(this.formCliente.value).subscribe(respuesta => {
            this.msgSusscess('Cliente agregado correctamente');
            this.dialogRef.close();
            // console.log(respuesta);
          });
        } else {
          this.msgSusscess("☹️ Cliente ya se encuentra registrado");
        }
        
      });  

    }
  }

  getCities() {
    this.cityService.getCities().subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        this.cities = respuesta.data
      }
    });
  }

  msgSusscess(mensaje: string) {
    this._snackBar.open(mensaje, 'SAVITAR', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    })
  }



}
