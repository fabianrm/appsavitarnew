import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { BoxService } from '../box.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-box-create',
  templateUrl: './box-create.component.html',
  styleUrl: './box-create.component.css'
})
export class BoxCreateComponent {

  formBox!: FormGroup;
  color: ThemePalette = 'accent';
  checked = true;
  disabled = false;


  constructor(public formulario: FormBuilder,
    private boxService: BoxService,
    @Inject(MAT_DIALOG_DATA) public getData: any,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<BoxCreateComponent>) { }


  ngOnInit(): void {
    this.initForm();
    // this.documentNumber!.nativeElement.focus();
  }

  initForm() {
    this.formBox = this.formulario.group({

      city: ['', Validators.required],
      address: ['', Validators.required],
      reference: [''],
      latitude: [''],
      longitude: [''],
      totalPorts: [''],
      availablePorts: [''],
      status: [true],
    });
  }


  enviarDatos() {
    if (this.formBox.valid) {
      this.boxService.addBox(this.formBox.value).subscribe(respuesta => {
        this.msgSusscess('Caja agregada correctamente');
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
