import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { CategoryService } from '../category.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';

@Component({
    selector: 'app-category-edit',
    templateUrl: './category-edit.component.html',
    styleUrl: './category-edit.component.scss',
    standalone: false
})
export class CategoryEditComponent {

  formEdit!: FormGroup;
  color: ThemePalette = 'accent';
  checked = (this.getData.status == 1) ? true : false;
  disabled = false;
  selected = 'normal';

  constructor(public formulario: FormBuilder,
    private categoryService: CategoryService,
    @Inject(MAT_DIALOG_DATA) public getData: any,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<CategoryEditComponent>) { }


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
      this.categoryService.updateCategory(id, this.formEdit.value).subscribe(respuesta => {
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
