import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { DestinationService } from '../destination.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';

@Component({
    selector: 'app-destination-create',
    templateUrl: './destination-create.component.html',
    styleUrl: './destination-create.component.scss',
    standalone: false
})
export class DestinationCreateComponent {

  formCreate!: FormGroup;
  color: ThemePalette = 'accent';
  checked = true;
  disabled = false;
  selected = 'normal';

  constructor(public formulario: FormBuilder,
    private destineService: DestinationService,
    @Inject(MAT_DIALOG_DATA) public getData: any,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<DestinationCreateComponent>) { }


  ngOnInit(): void {
    this.initForm();
  }

  initForm() {

    const formControlsConfig = {
      name: ['', Validators.required],
      status: 1,
    }

    this.formCreate = this.formulario.group(formControlsConfig);

    Object.keys(formControlsConfig).forEach(key => {
      if (key === 'name') {
        this.formCreate.get(key)?.valueChanges.subscribe(value => {
          this.formCreate.get(key)?.setValue(value.toUpperCase(), { emitEvent: false });
        });
      }
    });


  }


  enviarDatos() {
    if (this.formCreate.valid) {
      this.destineService.addDestine(this.formCreate.value).subscribe(respuesta => {
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
