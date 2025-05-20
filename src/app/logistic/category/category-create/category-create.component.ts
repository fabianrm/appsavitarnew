import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { CategoryService } from '../category.service';

@Component({
    selector: 'app-category-create',
    templateUrl: './category-create.component.html',
    styleUrl: './category-create.component.scss',
    standalone: false
})
export class CategoryCreateComponent {

  formCreate!: FormGroup;
  color: ThemePalette = 'accent';
  checked = true;
  disabled = false;
  selected = 'normal';

  constructor(public formulario: FormBuilder,
    private categoryService: CategoryService,
    @Inject(MAT_DIALOG_DATA) public getData: any,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<CategoryCreateComponent>) { }


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
      this.categoryService.addCategory(this.formCreate.value).subscribe(respuesta => {
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
