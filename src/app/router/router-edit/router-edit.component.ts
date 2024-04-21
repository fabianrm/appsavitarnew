import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { RouterService } from '../router.service';
import { ReqRouter } from '../Models/ResponseRouter';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-router-edit',
  templateUrl: './router-edit.component.html',
  styleUrl: './router-edit.component.css'
})
export class RouterEditComponent {
  formEditRouter!: FormGroup;
  color: ThemePalette = 'accent';
  checked = (this.getData.status == 1) ? true : false;
  disabled = false;


  constructor(public formulario: FormBuilder,
    private routerService: RouterService,
    @Inject(MAT_DIALOG_DATA) public getData: ReqRouter,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<RouterEditComponent>) { }


  ngOnInit(): void {
    this.initForm();
    // this.documentNumber!.nativeElement.focus();
  }

  initForm() {
    this.formEditRouter = this.formulario.group({

      id: [this.getData.id, Validators.required],
      ip: [this.getData.ip, Validators.required],
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
        this.msgSusscess('Router actualizado correctamente');
        this.dialogRef.close();
        // console.log(respuesta);
      });
    }
  }

  msgSusscess(mensaje: string) {
    this._snackBar.open(mensaje, 'SAVITAR', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    })
  }


}
