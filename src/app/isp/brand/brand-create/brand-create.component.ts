import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { BrandService } from '../brand.service';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-brand-create',
  templateUrl: './brand-create.component.html',
  styleUrl: './brand-create.component.scss'
})
export class BrandCreateComponent {
  formCreate!: FormGroup;
  color: ThemePalette = 'accent';
  checked = true;
  disabled = false;
  selected = 'normal';

  constructor(public formulario: FormBuilder,
    private brandService: BrandService,
    @Inject(MAT_DIALOG_DATA) public getData: any,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<BrandCreateComponent>) { }


  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.formCreate = this.formulario.group({
      name: ['', Validators.required],
      status: 1,
    });
  }


  enviarDatos() {
    if (this.formCreate.valid) {
      this.brandService.addBrand(this.formCreate.value).subscribe(respuesta => {
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
    this.snackbarService.showSuccess('Registro agregado correctamente');
  }

}
