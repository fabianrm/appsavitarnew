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

    this.initForm();
    this.getCities();
    // this.documentNumber!.nativeElement.focus();
  }

  initForm() {

    const formControlsConfig ={
      id: [this.getData.id, Validators.required],
      name: [this.getData.name, Validators.required],
      city_id: [this.getData.city_id, Validators.required],
      address: [this.getData.address, Validators.required],
      reference: [this.getData.reference],
      latitude: [this.getData.latitude],
      longitude: [this.getData.longitude],
      totalPorts: [this.getData.totalPorts],
      availablePorts: [this.getData.availablePorts],
      status: [this.checked],

    }

    this.formEditBox = this.formulario.group(formControlsConfig);

    Object.keys(formControlsConfig).forEach(key => {
      if (key === 'name' || key === 'address' || key === 'reference') {
        this.formEditBox.get(key)?.valueChanges.subscribe(value => {
          this.formEditBox.get(key)?.setValue(value.toUpperCase(), { emitEvent: false });
        });
      }
    });

  }


  getCities() {
    this.cityService.getCities().subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        this.cities = respuesta.data
      }
    });
  }


  getBoxById(id: number) {
    this.boxService.getBoxByID(id).subscribe((respuesta) => {
      this.box = respuesta.data;
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
