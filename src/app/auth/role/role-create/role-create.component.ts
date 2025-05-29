import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { RoleService } from '../role.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';

@Component({
  selector: 'app-role-create',
  templateUrl: './role-create.component.html',
  styleUrl: './role-create.component.scss',
  standalone: false
})
export class RoleCreateComponent {

  formRole!: FormGroup;
  color: ThemePalette = 'accent';

  constructor(public formulario: FormBuilder,
    private roleService: RoleService,
    @Inject(MAT_DIALOG_DATA) public getData: any,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<RoleCreateComponent>
  ) { }


  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.formRole = this.formulario.group({
      name: ['', Validators.required],


    });
  }

  enviarDatos() {
    if (this.formRole.valid) {
      this.roleService.addRole(this.formRole.value).subscribe(respuesta => {
        this.showSuccess();
        this.dialogRef.close();
      });
    } else {
      console.log('El formulario tiene errores.');
    }
  }


  showError() {
    this.snackbarService.showError('☹️ Ocurrio un error');
  }

  showSuccess() {
    this.snackbarService.showSuccess('Registro agregado correctamente');
  }

}
