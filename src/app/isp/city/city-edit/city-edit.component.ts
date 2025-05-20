import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { Subscription } from 'rxjs';
import { CityService } from '../city.service';
import { PlacesService } from '../../mapleaf/places.service';
import { MapleafService } from '../../mapleaf/mapleaf.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { City } from '../Models/CityResponse';

@Component({
    selector: 'app-city-edit',
    templateUrl: './city-edit.component.html',
    styleUrl: './city-edit.component.scss',
    standalone: false
})
export class CityEditComponent {
  formCity!: FormGroup;
  color: ThemePalette = 'accent';
  checked = true;
  disabled = false;

  id?: number;
  dataCity?: City;

  coordinates: [number, number][] = [];
  coordinatesSubscription!: Subscription;


  constructor(public formulario: FormBuilder,

    private cityService: CityService,
    private locationService: PlacesService,
    private mapleafService: MapleafService,
    private route: ActivatedRoute,
    private router: Router,

    private snackbarService: SnackbarService,
  ) { }


  ngOnInit(): void {
    this.initForm();
    this.clearCoordinates();
    this.getCityById();

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


  //Obtener city por id
  getCityById() {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam !== null) {
        this.id = +idParam; // Usa el símbolo "+" para convertir a número
        this.fetchCityDetails(this.id); // Llama a la función para obtener los detalles del box
      } else {
        // Manejar el caso cuando idParam es null, asignando un valor por defecto o manejando el error
        console.error('ID parameter is null');
      }
    });
  }


  fetchCityDetails(id: number) {
    this.cityService.getCityByID(id).subscribe((respuesta) => {
      this.dataCity = respuesta.data;
      //Llenamos el formEdit
      this.formCity.patchValue({
        name: this.dataCity.name,
        latitude: this.dataCity.latitude,
        longitude: this.dataCity.longitude,
        status: this.dataCity.status,
      });

      this.setNewCoordinates(Number(this.dataCity.latitude), Number(this.dataCity.longitude));

    });
  }


  //Setear coordenadas (edit)
  setNewCoordinates(long: number, lat: number) {
    const singleCoordinate: [number, number] = [long, lat];
    this.mapleafService.setSingleCoordinate(singleCoordinate);
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
      this.cityService.updateCity(this.id!, this.formCity.value).subscribe(respuesta => {
        this.router.navigate(['/dashboard/city/cities']);
        this.showSuccess();
      });
    }
  }

  showError() {
    this.snackbarService.showError('☹️ Ocurrio un error');
  }

  showSuccess() {
    this.snackbarService.showSuccess('Registro actualizado correctamente');
  }

  ngOnDestroy(): void {
    // Desuscribirse de los cambios de coordenadas para evitar fugas de memoria
    if (this.coordinatesSubscription) {
      this.coordinatesSubscription.unsubscribe();
    }
  }

  //TODO: Eliminar ciudad ❌
}
