import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { SupplierService } from '../supplier.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';

@Component({
    selector: 'app-supplier-create',
    templateUrl: './supplier-create.component.html',
    styleUrl: './supplier-create.component.scss',
    standalone: false
})
export class SupplierCreateComponent {

  formSupplier!: FormGroup;
  color: ThemePalette = 'accent';
  checked = true;
  disabled = false;


  constructor(public formulario: FormBuilder,
    private supplierService: SupplierService,
    @Inject(MAT_DIALOG_DATA) public getData: any,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<SupplierCreateComponent>) { }


  ngOnInit(): void {
    this.initForm();
    // this.documentNumber!.nativeElement.focus();
  }

  initForm() {
    this.formSupplier = this.formulario.group({

      ruc: ['', Validators.required],
      name: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      status: [true],
    });
  }


  enviarDatos() {
    if (this.formSupplier.valid) {
      this.supplierService.addSupplier(this.formSupplier.value).subscribe(respuesta => {
        //console.log(respuesta);
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
    this.snackbarService.showSuccess('Registro agregado correctamente');
  }


}
