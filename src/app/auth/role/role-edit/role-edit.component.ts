import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { RoleService } from '../role.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';

@Component({
    selector: 'app-role-edit',
    templateUrl: './role-edit.component.html',
    styleUrl: './role-edit.component.scss',
    standalone: false
})
export class RoleEditComponent {
  formRole!: FormGroup;
  color: ThemePalette = 'accent';
  id = this.getData.id;

  constructor(public formulario: FormBuilder,
    private roleService: RoleService,
    @Inject(MAT_DIALOG_DATA) public getData: any,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<RoleEditComponent>
  ) { }


  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.formRole = this.formulario.group({
      name: [this.getData.name, Validators.required],


    });
  }


  enviarDatos() {
    if (this.formRole.valid) {
      this.roleService.updateRole(this.id,this.formRole.value).subscribe(respuesta => {
        this.showSuccess();
        this.dialogRef.close();
      });
    }
  }

  showError() {
    this.snackbarService.showError('☹️ Ocurrio un error');
  }

  showSuccess() {
    this.snackbarService.showSuccess('Registro editado correctamente');
  }

}
