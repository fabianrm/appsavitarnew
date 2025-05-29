import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { EmployeeService } from '../../../logistic/employee/employee.service';
import { AuthService } from '../../../auth/auth.service';
import { Employee } from '../../../logistic/employee/models/EmployeeResponse';
import { EnterpriseService } from '../enterprise.service';

@Component({
  selector: 'app-add-admin',
  standalone: false,
  templateUrl: './add-admin.component.html',
  styleUrl: './add-admin.component.scss'
})
export class AddAdminComponent {
  formAdd!: FormGroup;

  constructor(public formulario: FormBuilder,
    private employeeService: AuthService,
    private enterpriseService: EnterpriseService,
    @Inject(MAT_DIALOG_DATA) public getData: any,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<AddAdminComponent>) { }

  employees: Employee[] = [];

  ngOnInit(): void {
    this.getUsuarios();
    this.initForm();
  }

  initForm() {
    this.formAdd = this.formulario.group({
      user_id: ['', Validators.required],
      enterprise_id: [this.getData, Validators.required],
    });
  }



  getUsuarios() {
    this.employeeService.getUsers().subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        this.employees = respuesta.data.filter(x => x.status == 1);
      }
    });
  }

  enviarDatos() {
    if (this.formAdd.valid) {
      this.enterpriseService.addRoleUser(this.formAdd.value).subscribe({
        next: (resp) => {
          this.dialogRef.close();
          this.snackbarService.showSuccess(resp.message);
        },
        error: (err) => {
          this.snackbarService.showError(err);
        }
      }
      );
    }
  }

  showError() {
    this.snackbarService.showError('☹️ Ocurrio un error');
  }

  showSuccess() {
    this.snackbarService.showSuccess('Registro agregado correctamente');
  }

}
