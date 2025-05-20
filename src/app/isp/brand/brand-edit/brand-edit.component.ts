import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BrandService } from '../brand.service';
import { ThemePalette } from '@angular/material/core';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-brand-edit',
    templateUrl: './brand-edit.component.html',
    styleUrl: './brand-edit.component.scss',
    standalone: false
})
export class BrandEditComponent {
  formEdit!: FormGroup;
  color: ThemePalette = 'accent';
  checked = (this.getData.status == 1) ? true : false;
  disabled = false;
  selected = 'normal';

  constructor(public formulario: FormBuilder,
    private brandService: BrandService,
    @Inject(MAT_DIALOG_DATA) public getData: any,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<BrandEditComponent>) { }


  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.formEdit = this.formulario.group({
      name: [this.getData.name, Validators.required],
      status: [this.checked],
    });
  }


  enviarDatos(id: number) {
    if (this.formEdit.valid) {
      this.brandService.updateBrand(id, this.formEdit.value).subscribe(respuesta => {
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
    this.snackbarService.showSuccess('Registro actualizado correctamente');
  }

}
