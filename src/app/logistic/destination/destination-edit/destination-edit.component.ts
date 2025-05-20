import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { DestinationService } from '../destination.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';

@Component({
    selector: 'app-destination-edit',
    templateUrl: './destination-edit.component.html',
    styleUrl: './destination-edit.component.scss',
    standalone: false
})
export class DestinationEditComponent {

  formEdit!: FormGroup;
  color: ThemePalette = 'accent';
  checked = (this.getData.status == 1) ? true : false;
  disabled = false;
  selected = 'normal';


  constructor(public formulario: FormBuilder,
    private destineService: DestinationService,
    @Inject(MAT_DIALOG_DATA) public getData: any,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<DestinationEditComponent>) { }


  ngOnInit(): void {
    this.initForm();
  }

  initForm() {

    const formControlsConfig = {
      name: [this.getData.name, Validators.required],
      status: [this.checked],
    }

    this.formEdit = this.formulario.group(formControlsConfig);

    Object.keys(formControlsConfig).forEach(key => {
      if (key === 'name') {
        this.formEdit.get(key)?.valueChanges.subscribe(value => {
          this.formEdit.get(key)?.setValue(value.toUpperCase(), { emitEvent: false });
        });
      }
    });


  }


  enviarDatos(id: number) {
    if (this.formEdit.valid) {
      this.destineService.updateDestine(id, this.formEdit.value).subscribe(respuesta => {
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
    this.snackbarService.showSuccess('Registro actualizado correctamente');
  }
  

}
