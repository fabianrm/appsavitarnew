import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { AuthService } from '../../../auth/auth.service';

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

  constructor(public formulario: FormBuilder,
    private employeService: AuthService,
    @Inject(MAT_DIALOG_DATA) public getData: any,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<EmployeeCreateComponent>) { }


  ngOnInit(): void {
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
    }, { validator: this.passwordMatchValidator });
  }


  enviarDatos() {
    if (this.formCreate.valid) {
      this.employeService.addUser(this.formCreate.value).subscribe(respuesta => {
        this.showSuccess();
        this.dialogRef.close();
        // console.log(respuesta);
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



  showError() {
    this.snackbarService.showError('☹️ Ocurrio un error');
  }

  showSuccess() {
    this.snackbarService.showSuccess('Registro agregado correctamente');
  }

}
