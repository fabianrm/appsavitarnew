import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { EmployeeService } from '../employee.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';

@Component({
  selector: 'app-employee-create',
  templateUrl: './employee-create.component.html',
  styleUrl: './employee-create.component.scss'
})
export class EmployeeCreateComponent {

  formCreate!: FormGroup;
  color: ThemePalette = 'accent';
  checked = true;
  disabled = false;
  selected = 'normal';

  constructor(public formulario: FormBuilder,
    private employeService: EmployeeService,
    @Inject(MAT_DIALOG_DATA) public getData: any,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<EmployeeCreateComponent>) { }


  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.formCreate = this.formulario.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      user_id: [null],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      position: ['', Validators.required],
      department: ['', Validators.required],
      status: 1,
    });
  }


  enviarDatos() {
    if (this.formCreate.valid) {
      this.employeService.addEmployee(this.formCreate.value).subscribe(respuesta => {
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
