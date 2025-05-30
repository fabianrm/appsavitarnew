import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/auth.service';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-change-password',
  standalone: false,
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {
  formCreate!: FormGroup;
  mostrarClaveActual = false;
  mostrarNuevaClave = false;
  mostrarConfirmacionClave = false;


  public formulario = inject(FormBuilder);
  private employeService = inject(AuthService);
  private snackbarService = inject(SnackbarService)
  private dialogRef = inject(MatDialogRef<ChangePasswordComponent>);


  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.formCreate = this.formulario.group({
      current_password: ['', Validators.required],
      new_password: ['', Validators.required],
      new_password_confirmation: ['', Validators.required],
    }, { validator: this.passwordMatchValidator });
  }


  // Validador personalizado
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('new_password')?.value;
    const confirmPassword = form.get('new_password_confirmation')?.value;
    return password && confirmPassword && password.value === confirmPassword.value
      ? null
      : { passwordMismatch: true };
  }

  enviarDatos() {
    if (this.formCreate.valid) {
      this.employeService.changePass(this.formCreate.value).subscribe({
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


}
