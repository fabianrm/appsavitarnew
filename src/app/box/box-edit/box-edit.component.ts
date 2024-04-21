import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BoxService } from '../box.service';
import { ReqBox } from '../Models/ResponseBox';

@Component({
  selector: 'app-box-edit',
  templateUrl: './box-edit.component.html',
  styleUrl: './box-edit.component.css'
})
export class BoxEditComponent {
  formEditBox!: FormGroup;
  color: ThemePalette = 'accent';
  checked = (this.getData.status == 1) ? true : false;
  disabled = false;


  constructor(public formulario: FormBuilder,
    private boxService: BoxService,
    @Inject(MAT_DIALOG_DATA) public getData: ReqBox,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<BoxEditComponent>) { }



  ngOnInit(): void {
    this.initForm();
    // this.documentNumber!.nativeElement.focus();
  }

  initForm() {

    this.formEditBox = this.formulario.group({
      id: [this.getData.id, Validators.required],
      city: [this.getData.city, Validators.required],
      address: [this.getData.address, Validators.required],
      reference: [this.getData.reference],
      latitude: [this.getData.latitude],
      longitude: [this.getData.longitude],
      totalPorts: [this.getData.total_ports],
      availablePorts: [this.getData.available_ports],
      status: [this.checked],

    });
  }



  enviarDatos(id:number) {
    if (this.formEditBox.valid) {
      this.boxService.updateBox(id,this.formEditBox.value).subscribe(respuesta => {
        this.msgSusscess('Caja actualizada correctamente');
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
