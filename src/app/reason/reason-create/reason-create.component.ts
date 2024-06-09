import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { ReasonService } from '../reason.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

interface Tipo {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-reason-create',
  templateUrl: './reason-create.component.html',
  styleUrl: './reason-create.component.scss'
})
export class ReasonCreateComponent implements OnInit {


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
    private dialogRef: MatDialogRef<ReasonCreateComponent>) { }

  ngOnInit(): void {
    this.initForm();
  }


  initForm() {
    const formControlsConfig = {
      type: [this.selected, Validators.required],
      name: ['', Validators.required],
      status: [this.checked],
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

          this.reasonService.addReason(this.frmRq.value).subscribe(respuesta => {
            this.msgSusscess('Motivo de gasto registrado correctamente');
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
