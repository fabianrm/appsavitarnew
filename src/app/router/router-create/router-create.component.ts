import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { RouterService } from '../router.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-router-create',
  templateUrl: './router-create.component.html',
  styleUrl: './router-create.component.css'
})
export class RouterCreateComponent {
  formRouter!: FormGroup;
  color: ThemePalette = 'accent';
  checked = true;
  disabled = false;


  constructor(public formulario: FormBuilder,
    private routerService: RouterService,
    @Inject(MAT_DIALOG_DATA) public getData: any,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<RouterCreateComponent>) { }


  ngOnInit(): void {
    this.initForm();
    // this.documentNumber!.nativeElement.focus();
  }

  initForm() {
    this.formRouter = this.formulario.group({

      ip: ['', Validators.required],
      vlan: ['', Validators.required],
      usuario: ['', Validators.required],
      password: ['', Validators.required],
      port: ['', Validators.required],
      apiConnection: ['', Validators.required],
      status: [true],
    });
  }


  enviarDatos() {
    if (this.formRouter.valid) {
      this.routerService.addRouter(this.formRouter.value).subscribe(respuesta => {
        this.msgSusscess('Router agregado correctamente');
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
