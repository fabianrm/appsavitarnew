import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { RouterService } from '../router.service';
import { ReqRouter } from '../Models/ResponseRouter';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';


@Component({
  selector: 'app-router-edit',
  templateUrl: './router-edit.component.html',
  styleUrl: './router-edit.component.css',
  standalone: false
})
export class RouterEditComponent {
  formEditRouter!: FormGroup;
  color: ThemePalette = 'accent';
  checked = (this.getData.status == 1) ? true : false;
  disabled = false;


  constructor(public formulario: FormBuilder,
    private routerService: RouterService,
    @Inject(MAT_DIALOG_DATA) public getData: ReqRouter,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<RouterEditComponent>) { }


  ngOnInit(): void {
    this.initForm();
    // this.documentNumber!.nativeElement.focus();
  }

  initForm() {
    this.formEditRouter = this.formulario.group({

      id: [this.getData.id, Validators.required],
      ip: [this.getData.ip, Validators.required],
      vlan: [this.getData.vlan, Validators.required],
      usuario: [this.getData.usuario, Validators.required],
      password: [this.getData.password],
      port: [this.getData.port],
      apiConnection: [this.getData.api_connection],
      status: [this.checked],
    });
  }


  enviarDatos(id: number) {
    if (this.formEditRouter.valid) {
      this.routerService.updateRouter(id, this.formEditRouter.value).subscribe(respuesta => {
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
    this.snackbarService.showSuccess('Registro editado correctamente');
  }

  test() {
    this.routerService.getTestConnection(this.getData.id).subscribe(respuesta => {
      console.log(respuesta);
    });

  }

}
