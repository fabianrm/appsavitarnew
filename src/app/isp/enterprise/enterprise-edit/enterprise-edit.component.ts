import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Enterprise } from '../Models/EnterpriseResponse';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { City } from '../../city/Models/CityResponse';
import { Subscription } from 'rxjs';
import { CityService } from '../../city/city.service';
import { PlacesService } from '../../mapleaf/places.service';
import { MapleafService } from '../../mapleaf/mapleaf.service';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EnterpriseService } from '../enterprise.service';

@Component({
  selector: 'app-enterprise-edit',
  templateUrl: './enterprise-edit.component.html',
  styleUrl: './enterprise-edit.component.scss'
})
export class EnterpriseEditComponent implements OnInit {

  formEnterprise!: FormGroup;
  color: ThemePalette = 'accent';
  disabled = false;
  citySelected = 1;
  cities: City[] = [];

  coordinates: [number, number][] = [];
  coordsBox: [number, number][] = [];
  initCoords: [number, number] = [0, 0];
  coordinatesSubscription!: Subscription;

  id!: number;
  dataEnterprise?: Enterprise;

  address: string = '';

  constructor(public formulario: FormBuilder,
    private enterpriseService: EnterpriseService,
    private cityService: CityService,
    private locationService: PlacesService,
    private mapleafService: MapleafService,
    private snackbarService: SnackbarService,
    private router: Router,
    private route: ActivatedRoute


  ) { }


  ngOnInit(): void {
    this.initForm();
    this.clearCoordinates();
    this.getLocations();
    this.getCities();
    this.getEnterpriseById();

    //Obtener la direccion
    this.mapleafService.currentAddress.subscribe(address => {
      this.address = address;
      this.formEnterprise.patchValue({
        address: this.address,
      });
    });
  }



  //Initform
  initForm() {

    const formControlsConfig = {
      ruc: ['', Validators.required],
      name: ['', Validators.required],
      cityId: [this.citySelected, Validators.required],
      address: ['', Validators.required],
      phone: ['',],
      logo: ['',],
    }

    this.formEnterprise = this.formulario.group(formControlsConfig);

    //Convertir a mayusculas
    Object.keys(formControlsConfig).forEach(key => {
      if (key === 'name' || key === 'address') {
        this.formEnterprise.get(key)?.valueChanges.subscribe(value => {
          this.formEnterprise.get(key)?.setValue(value.toUpperCase(), { emitEvent: false });
        });
      }
    });

  }


  //Obtener customer por id
  getEnterpriseById() {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam !== null) {
        this.id = +idParam; // Usa el símbolo "+" para convertir a número
        this.fetchEnterpriseDetails(this.id); // Llama a la función para obtener los detalles del cliente
      } else {
        // Manejar el caso cuando idParam es null, asignando un valor por defecto o manejando el error
        console.error('ID parameter is null');
      }
    });
  }


  fetchEnterpriseDetails(id: number) {
    this.enterpriseService.getEnterpriseByID(id).subscribe((respuesta) => {
      this.dataEnterprise = respuesta.data;
      this.mapleafService.changeMoveToCoordinate(respuesta.data.coordinates);

      this.formEnterprise.patchValue({

        ruc: this.dataEnterprise.ruc,
        name: this.dataEnterprise.name,
        cityId: this.dataEnterprise.cityId,
        address: this.dataEnterprise.address,
        phone: this.dataEnterprise.phone,

      });

      this.setNewCoordinates(this.dataEnterprise.coordinates[0], this.dataEnterprise.coordinates[1]);
    });
  }

  fetchCityDetails(id: number) {
    this.cityService.getCityByID(id).subscribe((respuesta) => {
      this.initCoords = respuesta.data.coordinates;
      this.mapleafService.changeMoveToCoordinate(this.initCoords);
    });
  }



  //Localizacion del equipo
  get locationReady() {
    return this.locationService.locationReady;
  }

  //Obtener coordenadas
  getLocations() {
    this.coordinatesSubscription = this.mapleafService.currentCoordinates.subscribe(coordinates => {
      this.coordinates = coordinates;
      if (this.coordinates.length > 0) {
        // Actualizar los campos del formulario
        this.formEnterprise.patchValue({
          latitude: this.coordinates[0][0],
          longitude: this.coordinates[0][1]
        });
      }
    });
  }


  //Setear coordenadas (edit)
  setNewCoordinates(long: number, lat: number) {
    const singleCoordinate: [number, number] = [long, lat];
    this.mapleafService.setSingleCoordinate(singleCoordinate);
  }


  //Cities
  getCities() {
    this.cityService.getCities().subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        this.cities = respuesta.data
      }
    });
  }

  enviarDatos() {

    if (this.formEnterprise.valid) {

      const formData = this.formEnterprise.value;

      const dataToSend = {
        ...formData,

      };

      this.enterpriseService.updateEnterprise(this.dataEnterprise!.id, dataToSend).subscribe(respuesta => {
        this.showSuccess();
        this.router.navigate(['/dashboard/enterprise/enterpriseDetails/' + this.dataEnterprise?.id]); // Navega al componente "contracts"
      });
    }
  }

  //Limpiar las coordenadas
  clearCoordinates() {
    this.mapleafService.clearCoordinates();
  }

  goEnterprise() {
    this.router.navigate(['/dashboard/enterprise/enterpriseDetails/' + this.dataEnterprise?.id]); // Navega al componente "cliente"
  }

  showError() {
    this.snackbarService.showError('☹️ Error al editar datos del contrato');
  }

  showSuccess() {
    this.snackbarService.showSuccess('Datos del contrato actualizados correctamente');
  }

  ngOnDestroy(): void {
    // Desuscribirse de los cambios de coordenadas para evitar fugas de memoria
    if (this.coordinatesSubscription) {
      this.coordinatesSubscription.unsubscribe();
    }
  }


}
