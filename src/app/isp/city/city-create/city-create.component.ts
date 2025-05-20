import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { Subscription } from 'rxjs';
import { CityService } from '../city.service';
import { PlacesService } from '../../mapleaf/places.service';
import { MapleafService } from '../../mapleaf/mapleaf.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';

@Component({
    selector: 'app-city-create',
    templateUrl: './city-create.component.html',
    styleUrl: './city-create.component.scss',
    standalone: false
})
export class CityCreateComponent {
  formCity!: FormGroup;
  color: ThemePalette = 'accent';
  checked = true;
  disabled = false;

  coordinates: [number, number][] = [];
  coordinatesSubscription!: Subscription;


  constructor(public formulario: FormBuilder,

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
        this.formCity.patchValue({
          latitude: this.coordinates[0][0],
          longitude: this.coordinates[0][1]
        });
      }
    });


  }

  initForm() {
    const formControlsConfig = {
      name: ['', Validators.required],
      latitude: [''],
      longitude: [''],
      status: [true],
    }
    this.formCity = this.formulario.group(formControlsConfig);

    Object.keys(formControlsConfig).forEach(key => {
      if (key === 'name') {
        this.formCity.get(key)?.valueChanges.subscribe(value => {
          this.formCity.get(key)?.setValue(value.toUpperCase(), { emitEvent: false });
        });
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
    this.formCity.reset();
  }

  //Cancelar
  getCities() {
    this.router.navigate(['/dashboard/city/cities']);
  }

  enviarDatos() {
    if (this.formCity.valid) {
      this.cityService.addCity(this.formCity.value).subscribe(respuesta => {
        this.router.navigate(['/dashboard/city/cities']);
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

  ngOnDestroy(): void {
    // Desuscribirse de los cambios de coordenadas para evitar fugas de memoria
    if (this.coordinatesSubscription) {
      this.coordinatesSubscription.unsubscribe();
    }
  }
}
