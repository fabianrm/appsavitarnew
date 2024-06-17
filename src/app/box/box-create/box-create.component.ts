import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { BoxService } from '../box.service';
import { CityService } from '../../city/city.service';
import { City } from '../../city/Models/CityResponse';
import { PlacesService } from '../../maps/places.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';
import { MapleafService } from '../../mapleaf/mapleaf.service';
import { Subscription } from 'rxjs';

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
  coordinates: [number, number][] = [];
  coordinatesSubscription!: Subscription;


  constructor(public formulario: FormBuilder,
    private boxService: BoxService,
    private cityService: CityService,
    private locationService: PlacesService,
    private mapleafService: MapleafService,
    private router: Router,
    
    private snackbarService: SnackbarService,
   ) { }


  ngOnInit(): void {
    this.initForm();
    this.clearCoordinates();
    // Suscribirse a los cambios de coordenadas
    this.coordinatesSubscription = this.mapleafService.currentCoordinates.subscribe(coordinates => {
      this.coordinates = coordinates;
      if (this.coordinates.length > 0) {
        // Actualizar los campos del formulario
        this.formBox.patchValue({
          latitude: this.coordinates[0][0],
          longitude: this.coordinates[0][1]
        });
      }
    });
    this.getCities();
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
    return this.locationService.locationReady;
  }

  clearCoordinates() {
    this.mapleafService.clearCoordinates();
  }

  resetForm() {
    this.formBox.reset();
  }

  //Cancelar
  goBoxes() {
    this.router.navigate(['/dashboard/box/boxes']);
  }

  enviarDatos() {
    if (this.formBox.valid) {
      this.boxService.addBox(this.formBox.value).subscribe(respuesta => {
        this.router.navigate(['/dashboard/box/boxes']);
        this.showSuccess();
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
