import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { AuthService } from '../../../auth/auth.service';
import { RoleService } from '../../../auth/role/role.service';
import { Role } from '../../../auth/role/Models/RoleResponse';

@Component({
  selector: 'app-employee-create',
  templateUrl: './employee-create.component.html',
  styleUrl: './employee-create.component.scss',
  standalone: false
})
export class EmployeeCreateComponent {

  formCreate!: FormGroup;
  color: ThemePalette = 'accent';
  checked = true;
  disabled = false;
  selected = 'normal';
  passwordMismatch: boolean = false;
  roles: Role[] = [];
  cargos: String[] = ['Empleado', 'Técnico'];

  constructor(public formulario: FormBuilder,
    private employeService: AuthService,
    private roleService: RoleService,
    @Inject(MAT_DIALOG_DATA) public getData: any,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<EmployeeCreateComponent>) { }


  ngOnInit(): void {
    this.getRoles();
    this.initForm();
  }

  initForm() {
    this.formCreate = this.formulario.group({
      dni: ['', Validators.required],
      name: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required],
      phone: ['', Validators.required],
      position: ['', Validators.required],
      status: [this.checked],
      role_id: ['', Validators.required],
      enterprise_id: [this.enterprise, Validators.required],
    }, { validator: this.passwordMatchValidator });
  }

  get enterprise() {
    return localStorage.getItem('enterprise_id');
  }

  enviarDatos() {
    if (this.formCreate.valid) {
      this.employeService.addUser(this.formCreate.value).subscribe({
        next: (respuesta) => {
          this.snackbarService.showSuccess(respuesta.message);
          this.dialogRef.close();
        },
        error: (err) => {
          this.snackbarService.showError(err);
        }

      });
    } else {
      console.log('El formulario tiene errores.');
    }
  }

  // Validador personalizado
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('password_confirmation');

    return password && confirmPassword && password.value === confirmPassword.value
      ? null
      : { passwordMismatch: true };
  }

  getRoles() {
    this.roleService.getRoles().subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        this.roles = respuesta.data.filter((x: any) => x.id !== 1);
      }
    });
  }

  showError() {
    this.snackbarService.showError('☹️ Ocurrio un error');
  }

  showSuccess() {
    this.snackbarService.showSuccess('Registro agregado correctamente');
  }

}
