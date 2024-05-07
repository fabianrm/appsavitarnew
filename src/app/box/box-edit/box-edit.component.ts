import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BoxService } from '../box.service';
import { Box } from '../Models/ResponseBox';
import { City } from '../../city/Models/CityResponse';
import { CityService } from '../../city/city.service';
import { ReqBox, RequestBox } from '../Models/RequestBox';

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
  cities: City[] = [];
  box: ReqBox[] = [];


  constructor(public formulario: FormBuilder,
    private boxService: BoxService,
    private cityService: CityService,
    @Inject(MAT_DIALOG_DATA) public getData: ReqBox,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<BoxEditComponent>) { }



  ngOnInit(): void {

   // this.getBoxById(this.getData.name);

    this.initForm();
    this.getCities();
    // this.documentNumber!.nativeElement.focus();
  }

  initForm() {

    this.formEditBox = this.formulario.group({
      id: [this.getData.id, Validators.required],
      city_id: [this.getData.city_id, Validators.required],
      address: [this.getData.address, Validators.required],
      reference: [this.getData.reference],
      latitude: [this.getData.latitude],
      longitude: [this.getData.longitude],
      totalPorts: [this.getData.totalPorts],
      availablePorts: [this.getData.availablePorts],
      status: [this.checked],

    });
  }


  getCities() {
    this.cityService.getCities().subscribe((respuesta) => {

      if (respuesta.data.length > 0) {
        this.cities = respuesta.data
      }

      //  console.log(this.cities);

    });
  }


  getBoxById(id: number) {
    this.boxService.getBoxByID(id).subscribe((respuesta) => {

      this.box = respuesta.data;
     // console.log(this.box);
      

    });
  }




  enviarDatos(id: number) {
    if (this.formEditBox.valid) {
      this.boxService.updateBox(id, this.formEditBox.value).subscribe(respuesta => {
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
