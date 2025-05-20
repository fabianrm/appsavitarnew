import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleService } from '../../../auth/role/role.service';
import { Role } from '../../../auth/role/Models/RoleResponse';
import { AuthService } from '../../../auth/auth.service';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-edit-role',
    templateUrl: './edit-role.component.html',
    styleUrl: './edit-role.component.scss',
    standalone: false
})
export class EditRoleComponent {
  formRole!: FormGroup;
  roles: Role[] = [];
  


  constructor(public fb: FormBuilder,
    private roleService: RoleService,
    private userService: AuthService,
    private snackbarService: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public getData: any,
    private dialogRef: MatDialogRef<EditRoleComponent>,) { }

  ngOnInit() {
    console.log(this.getData);


    this.initForm();
    this.getRoles();
  }

  initForm() {
    this.formRole = this.fb.group({
      role_id: [this.getData.role_id, Validators.required],
      user_id: [this.getData.user_id,],

    });

  }

  enviarDatos() {
    if (this.formRole.valid) {
      this.userService.updateRole(this.getData.user_id, this.formRole.value).subscribe(respuesta => {
        this.showSuccess();
        this.dialogRef.close();
        // console.log(respuesta);
      });
    }
  }


  getRoles() {
    this.roleService.getRoles().subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        this.roles = respuesta.data;
      }
    });
  }


  showError() {
    this.snackbarService.showError('☹️ Ocurrio un error');
  }

  showSuccess() {
    this.snackbarService.showSuccess('Registro actualizado correctamente');
  }


  onCancel() {
    this.dialogRef.close();
  }

}
