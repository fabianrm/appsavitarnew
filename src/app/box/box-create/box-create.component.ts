import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { BoxService } from '../box.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CityService } from '../../city/city.service';
import { City } from '../../city/Models/CityResponse';
import { MapsService } from '../../maps/maps.service';
import { PlacesService } from '../../maps/places.service';

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

  cities: City[] = [];
  coordinates: [number, number] | null = null;


  constructor(public formulario: FormBuilder,
    private boxService: BoxService,
    private cityService: CityService,
    private locationService: PlacesService,
    private mapService: MapsService,
    
    private _snackBar: MatSnackBar,
   ) { }


  ngOnInit(): void {
    // console.log(this.locationService.location);
    this.getCities();
    this.getLocations();
    this.initForm();
    // this.documentNumber!.nativeElement.focus();
  }

  initForm() {
    const formControlsConfig = {
      name: ['', Validators.required],
      city_id: ['', Validators.required],
      address: ['', Validators.required],
      reference: [''],
      latitude: [''],
      longitude: [''],
      totalPorts: [''],
      availablePorts: [''],
      status: [true],
    }
    this.formBox = this.formulario.group(formControlsConfig);

    Object.keys(formControlsConfig).forEach(key => {
      if (key === 'name' || key === 'address' || key === 'reference') {
        this.formBox.get(key)?.valueChanges.subscribe(value => {
          this.formBox.get(key)?.setValue(value.toUpperCase(), { emitEvent: false });
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

  get locationReady() {
  //  console.log(this.locationService.location);
    return this.locationService.locationReady;
  }

  //Obtener coordenadas
  getLocations() {
    this.mapService.currentCoordinates.subscribe(coordinates => {
      this.coordinates = coordinates;

      if (coordinates) {
        // Actualizar los campos del formulario
        this.formBox.patchValue({
          latitude: coordinates[1],
          longitude: coordinates[0]
        });
      }
       //  console.log('Coordenadas recibidas en ContractComponent:', this.coordinates);
    });
  }


  resetForm() {
    this.formBox.reset();
  }


  enviarDatos() {
    if (this.formBox.valid) {
      this.boxService.addBox(this.formBox.value).subscribe(respuesta => {
        this.formBox.reset();
        this.msgSusscess('Caja agregada correctamente');

       // this.dialogRef.close();
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
