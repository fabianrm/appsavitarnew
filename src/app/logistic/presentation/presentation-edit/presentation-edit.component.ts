import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { PresentationService } from '../presentation.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { Presentation } from './../models/PresentationResponse';

@Component({
  selector: 'app-presentation-edit',
  templateUrl: './presentation-edit.component.html',
  styleUrl: './presentation-edit.component.scss'
})
export class PresentationEditComponent {
  formEdit!: FormGroup;
  color: ThemePalette = 'accent';
  checked = (this.getData.status == 1) ? true : false;
  disabled = false;
  selected = 'normal';

  constructor(public formulario: FormBuilder,
    private presentationService: PresentationService,
    @Inject(MAT_DIALOG_DATA) public getData: any,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<PresentationEditComponent>) { }


  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.formEdit = this.formulario.group({
      name: [this.getData.name, Validators.required],
      prefix: [this.getData.prefix, Validators.required],
      status: [this.checked],
    });
  }


  enviarDatos(id: number) {
    if (this.formEdit.valid) {
      this.presentationService.updatePresentation(id, this.formEdit.value).subscribe(respuesta => {
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
