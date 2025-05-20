import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Role } from '../../../auth/role/Models/RoleResponse';
import { AuthService } from '../../../auth/auth.service';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { RoleService } from '../../../auth/role/role.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-add-role',
    templateUrl: './add-role.component.html',
    styleUrl: './add-role.component.scss',
    standalone: false
})
export class AddRoleComponent {

  formRole!: FormGroup;
  roles: Role[] = [];


  constructor(public fb: FormBuilder,
    private roleService: RoleService,
    private userService: AuthService,
    private snackbarService: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public getData: any,
    private dialogRef: MatDialogRef<AddRoleComponent>,) {}

  ngOnInit() {
    this.initForm();
    this.getRoles();
  }

  initForm() {
    this.formRole = this.fb.group({
      role_id: ['', Validators.required],
      user_id: [this.getData,],

    });

  }


  enviarDatos() {
    if (this.formRole.valid) {
      this.userService.addRole(this.formRole.value).subscribe(respuesta => {
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
    this.snackbarService.showSuccess('Registro agregado correctamente');
  }


  onCancel() {
    this.dialogRef.close();
  }

}
