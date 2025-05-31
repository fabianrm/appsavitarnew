import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ReasonCreateComponent } from '../reason-create/reason-create.component';
import { ReasonService } from '../reason.service';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';


interface Tipo {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-reason-edit',
  templateUrl: './reason-edit.component.html',
  styleUrl: './reason-edit.component.scss',
  standalone: false
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
    private snackbarService: SnackbarService,
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

      this.reasonService.updateReason(this.getData.id, this.frmRq.value).subscribe(respuesta => {
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


}
