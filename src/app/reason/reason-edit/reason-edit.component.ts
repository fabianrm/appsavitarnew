import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReasonCreateComponent } from '../reason-create/reason-create.component';
import { ReasonService } from '../reason.service';
import { ReasonRequest } from '../Models/ReasonRequest';
import { ReasonResponse } from '../Models/ReasonResponse';


interface Tipo {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-reason-edit',
  templateUrl: './reason-edit.component.html',
  styleUrl: './reason-edit.component.scss'
})
export class ReasonEditComponent {
  frmRq!: FormGroup;
  color: ThemePalette = 'accent';
  checked = true;
  disabled = false;
  selected = 'variable';

  tipos: Tipo[] = [
    { value: 'variable', viewValue: 'Variable' },
    { value: 'fijo', viewValue: 'Fijo' },
  ]


  constructor(public fb: FormBuilder,
    private reasonService: ReasonService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public getData: any,
    private dialogRef: MatDialogRef<ReasonCreateComponent>) { }

  ngOnInit(): void {
    this.initForm();
  }


  initForm() {
    const formControlsConfig = {
      type: [this.getData.type, Validators.required],
      name: [this.getData.name, Validators.required],
      status: [this.getData.status],
    }

    this.frmRq = this.fb.group(formControlsConfig);

    Object.keys(formControlsConfig).forEach(key => {
      if (key === 'name') {
        this.frmRq.get(key)?.valueChanges.subscribe(value => {
          this.frmRq.get(key)?.setValue(value.toUpperCase(), { emitEvent: false });
        });
      }
    });

  }

  enviarDatos() {
    if (this.frmRq.valid) {

      this.reasonService.updateReason( this.getData.id, this.frmRq.value).subscribe(respuesta => {
        this.msgSusscess('Motivo de gasto actualizado correctamente');
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
