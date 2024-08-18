import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { City } from '../../city/Models/CityResponse';
import { ContractService } from '../contract.service';
import { CityService } from '../../city/city.service';
import { PlacesService } from '../../mapleaf/places.service';
import { MapleafService } from '../../mapleaf/mapleaf.service';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Service } from '../Models/ServiceResponse';

@Component({
  selector: 'app-contract-edit-basics',
  templateUrl: './contract-edit-basics.component.html',
  styleUrl: './contract-edit-basics.component.scss'
})
export class ContractEditBasicsComponent implements OnInit {


  formContrato!: FormGroup;
  color: ThemePalette = 'accent';
  disabled = false;
  citySelected = 1;
  cities: City[] = [];

  coordinates: [number, number][] = [];
  coordsBox: [number, number][] = [];
  coordinatesSubscription!: Subscription;

  id!: number;
  service?: Service;
  address: string = '';

  constructor(public formulario: FormBuilder,
    private contractService: ContractService,
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
    this.getServiceById();
    this.getLocations();
    this.getCities();

    //Obtener la direccion
    this.mapleafService.currentAddress.subscribe(address => {
      this.address = address;
      this.formContrato.patchValue({
        addressInstallation: this.address,
      });
    });
  }



  //Initform
  initForm() {

    const formControlsConfig = {
      cityId: [this.citySelected, Validators.required],
      addressInstallation: ['', Validators.required],
      reference: ['', Validators.required],
      installationDate: ['', Validators.required],
      latitude: [0, Validators.required],
      longitude: [0, Validators.required],

    }

    this.formContrato = this.formulario.group(formControlsConfig);

    //Convertir a mayusculas
    Object.keys(formControlsConfig).forEach(key => {
      if (key === 'addressInstallation' || key === 'reference') {
        this.formContrato.get(key)?.valueChanges.subscribe(value => {
          this.formContrato.get(key)?.setValue(value.toUpperCase(), { emitEvent: false });
        });
      }
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
        this.formContrato.patchValue({
          latitude: this.coordinates[0][0],
          longitude: this.coordinates[0][1]
        });
      }
    });
  }


  //Obtener contract por id
  getServiceById() {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam !== null) {
        this.id = +idParam; // Usa el símbolo "+" para convertir a número
        this.fetchserviceDetails(this.id); // Llama a la función para obtener los detalles del box
      } else {
        // Manejar el caso cuando idParam es null, asignando un valor por defecto o manejando el error
        console.error('ID parameter is null');
      }
    });
  }


  fetchserviceDetails(id: number) {
    this.contractService.getServiceByID(id).subscribe((respuesta) => {
      this.service = respuesta.data;
      this.mapleafService.changeMoveToCoordinate(respuesta.data.coordinates);
      // console.log(this.service);

      let fechaDate = new Date(this.service.installationDate + ' 0:00:00');

      this.formContrato.patchValue({
        cityId: this.service.cityId,
        addressInstallation: this.service.addressInstallation,
        reference: this.service.reference,
        installationDate: fechaDate,
        latitude: this.service.latitude,
        longitude: this.service.latitude,
      });

      this.setNewCoordinates(this.service.latitude, this.service.longitude);
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

    if (this.formContrato.valid) {

      const formData = this.formContrato.value;
      const installDate = new Date(formData.installationDate).toISOString().split('T')[0];

      const dataToSend = {
        ...formData,
        installationDate: installDate,
      };

      this.contractService.updateServiceBasic(this.service!.id, dataToSend).subscribe(respuesta => {
        this.showSuccess();
        this.router.navigate(['/dashboard/contract/contracts']); // Navega al componente "contracts"
      });
    }
  }

  //Limpiar las coordenadas
  clearCoordinates() {
    this.mapleafService.clearCoordinates();
  }

  goContractsList() {
    this.router.navigate(['/dashboard/contract/contracts']); // Navega al componente "cliente"
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
