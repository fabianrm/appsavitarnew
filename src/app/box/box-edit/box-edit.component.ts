import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { BoxService } from '../box.service';
import { City } from '../../city/Models/CityResponse';
import { CityService } from '../../city/city.service';
import { PlacesService } from '../../mapleaf/places.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Box } from '../Models/BoxResponseU';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';
import { Subscription } from 'rxjs';
import { MapleafService } from '../../mapleaf/mapleaf.service';

@Component({
  selector: 'app-box-edit',
  templateUrl: './box-edit.component.html',
  styleUrl: './box-edit.component.css'
})
export class BoxEditComponent implements OnInit, OnDestroy {
  formBox!: FormGroup;
  color: ThemePalette = 'accent';
  checked = true;
  disabled = false;
  id?: number;

  dataBox?: Box;

  cities: City[] = [];
  coordinates: [number, number][] = [];
  coordinatesSubscription!: Subscription;


  constructor(public formulario: FormBuilder,
    private boxService: BoxService,
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

    this.getLocations()

    this.getBoxById();
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

  //Obtener coordenadas
  getLocations() {

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
  }


  //Obtener box por id
  getBoxById() {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam !== null) {
        this.id = +idParam; // Usa el símbolo "+" para convertir a número
        this.fetchBoxDetails(this.id); // Llama a la función para obtener los detalles del box
      } else {
        // Manejar el caso cuando idParam es null, asignando un valor por defecto o manejando el error
        console.error('ID parameter is null');
      }
    });
  }


  fetchBoxDetails(id: number) {
    this.boxService.getBoxByID(id).subscribe((respuesta) => {
      this.dataBox = respuesta.data;
      //Llenamos el formEdit
      this.formBox.patchValue({
        name: this.dataBox.name,
        city_id: this.dataBox.city_id,
        address: this.dataBox.address,
        reference: this.dataBox.reference,
        latitude: this.dataBox.latitude,
        longitude: this.dataBox.longitude,
        totalPorts: this.dataBox.totalPorts,
        availablePorts: this.dataBox.availablePorts,
        status: this.dataBox.status,
      });

      this.setNewCoordinates(this.dataBox.latitude, this.dataBox.longitude);

    });
  }

  clearCoordinates() {
    this.mapleafService.clearCoordinates();
  }

  //Setear coordenadas (edit)
  setNewCoordinates(long: number, lat: number) {
    const singleCoordinate: [number, number] = [long, lat];
    this.mapleafService.setSingleCoordinate(singleCoordinate);
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
      this.boxService.updateBox(this.id!, this.formBox.value).subscribe(respuesta => {
        this.router.navigate(['/dashboard/box/boxes']); // Navega al componente "contrato"
        this.showSuccess();
      });
    }
  }


  showError() {
    this.snackbarService.showError('Ocurrio un error');
  }

  showSuccess() {
    this.snackbarService.showSuccess('Registro editado correctamente');
  }

  ngOnDestroy(): void {
    // Desuscribirse de los cambios de coordenadas para evitar fugas de memoria
    if (this.coordinatesSubscription) {
      this.coordinatesSubscription.unsubscribe();
    }
  }


}
