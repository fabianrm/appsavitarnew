import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { SupplierService } from '../supplier.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { SupplierRequest } from '../models/SupplierRequest';

@Component({
  selector: 'app-supplier-edit',
  templateUrl: './supplier-edit.component.html',
  styleUrl: './supplier-edit.component.scss'
})
export class SupplierEditComponent {


  formSupplier!: FormGroup;
  color: ThemePalette = 'accent';
  checked = (this.getData.status == true) ? true : false;
  disabled = false;


  constructor(public formulario: FormBuilder,
    private supplierService: SupplierService,
    @Inject(MAT_DIALOG_DATA) public getData: SupplierRequest,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<SupplierEditComponent>) { }


  ngOnInit(): void {
  
    this.initForm();
    // this.documentNumber!.nativeElement.focus();
  }

  initForm() {
    this.formSupplier = this.formulario.group({

      ruc: [this.getData.ruc, Validators.required],
      name: [this.getData.name, Validators.required],
      address: [this.getData.address,],
      phone: [this.getData.phone, ],
      email: [this.getData.email,],
      status: [this.checked],
    });
  }


  enviarDatos() {
    if (this.formSupplier.valid) {
      this.supplierService.updateSupplier(this.getData.id, this.formSupplier.value).subscribe(respuesta => {
        //console.log(respuesta.data);
        if (respuesta.status === true) {
          this.showSuccess();
          this.dialogRef.close();
        } else {
          // this.snackbarService.showError(respuesta.data.message)
          this.showError();
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  showError() {
    this.snackbarService.showError('☹️ Ocurrio un error');
  }

  showSuccess() {
    this.snackbarService.showSuccess('Registro actualizado correctamente');
  }

}
