import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { EmployeeService } from '../employee.service';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Employee } from '../models/EmployeeResponse';
import { AuthService } from '../../../auth/auth.service';

@Component({
    selector: 'app-employee-edit',
    templateUrl: './employee-edit.component.html',
    styleUrl: './employee-edit.component.scss',
    standalone: false
})
export class EmployeeEditComponent {

  formCreate!: FormGroup;
  color: ThemePalette = 'accent';
  checked = true;
  disabled = false;
  selected = 'normal';

  id_employee!: number;

  constructor(public formulario: FormBuilder,
    private employeService: AuthService,
    @Inject(MAT_DIALOG_DATA) public getData: Employee,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<EmployeeEditComponent>) { }


  ngOnInit(): void {
    this.id_employee = this.getData.id;
    this.initForm();
  }

  initForm() {
    this.formCreate = this.formulario.group({
      dni: [this.getData.dni, Validators.required],
      name: [this.getData.name, Validators.required],
      address: [ this.getData.address , Validators.required],
      phone: [this.getData.phone, Validators.required],
      position: [this.getData.position, Validators.required],
  
      status: this.getData.status,
    });
  }


  enviarDatos() {
    if (this.formCreate.valid) {
      this.employeService.updateUser(this.id_employee!, this.formCreate.value).subscribe(respuesta => {
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
