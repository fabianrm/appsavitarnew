import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from '../customer.service';
import { ThemePalette } from '@angular/material/core';
import { ReqCustomer } from '../Models/ResponseCustomer';

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
  checked = (this.getData.status == 1) ? true : false;
  disabled = false;

  id_customer = this.getData.id;

  tipos: Tipo[] = [
    { value: 'natural', viewValue: 'Natural' },
    { value: 'juridica', viewValue: 'Juridica' },
  ]

  constructor(public formulario: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public getData: ReqCustomer,
    private _snackBar: MatSnackBar,
    private customerService: CustomerService,
    private dialogRef: MatDialogRef<CustomerEditComponent>) { }


  ngOnInit(): void {
    this.initForm();
  }


  initForm() {
    this.formEditar = this.formulario.group({
      id: [this.getData.id, Validators.required],
      type: [this.getData.type, Validators.required],
      documentNumber: [this.getData.document_number, Validators.required],
      name: [this.getData.name, Validators.required],
      address: [this.getData.address, Validators.required],
      phoneNumber: [this.getData.phone_number],
      email: [this.getData.email],
      status: [this.checked],
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
    if (this.formEditar.valid) {
      this.customerService.updateCustomer(id, this.formEditar.value).subscribe(respuesta => {
        this.msgSusscess('Cliente editado correctamente');
        this.dialogRef.close();
        // console.log(respuesta);
      });
    }
  }


}
