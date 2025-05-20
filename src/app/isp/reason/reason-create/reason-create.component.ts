import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { ReasonService } from '../reason.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';

interface Tipo {
  value: string;
  viewValue: string;
}


@Component({
    selector: 'app-reason-create',
    templateUrl: './reason-create.component.html',
    styleUrl: './reason-create.component.scss',
    standalone: false
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
    private snackbarService: SnackbarService,
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
