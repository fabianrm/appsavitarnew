import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { CustomerService } from './../customer.service';
import { City } from '../../city/Models/CityResponse';
import { CityService } from '../../city/city.service';
import { PlacesService } from '../../mapleaf/places.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { MapleafService } from '../../mapleaf/mapleaf.service';
import { Subscription } from 'rxjs';

interface Tipo {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-customer-create',
  templateUrl: './customer-create.component.html',
  styleUrl: './customer-create.component.css'
})


export class CustomerCreateComponent implements OnInit, OnDestroy {

  formCliente!: FormGroup;
  color: ThemePalette = 'accent';
  checked = true;
  disabled = false;
  selected = 'natural';

  cities: City[] = [];
  coordinates: [number, number][] = [];
  initCoords: [number, number] = [0, 0];
  coordinatesSubscription!: Subscription;

  address: string = '';

  tipos: Tipo[] = [
    { value: 'natural', viewValue: 'Natural' },
    { value: 'juridica', viewValue: 'Juridica' },
  ]

  constructor(public formulario: FormBuilder,
    private cityService: CityService,
    private mapleafService: MapleafService,
    private customerService: CustomerService,
    private locationService: PlacesService,
    private router: Router,
    private snackbarService: SnackbarService

  ) { }


  ngOnInit(): void {
    this.initForm();
    this.clearCoordinates();
    // Suscribirse a los cambios de coordenadas
    this.coordinatesSubscription = this.mapleafService.currentCoordinates.subscribe(coordinates => {
      this.coordinates = coordinates;
      if (this.coordinates.length > 0) {
        // Actualizar los campos del formulario
        this.formCliente.patchValue({
          latitude: this.coordinates[0][0],
          longitude: this.coordinates[0][1]
        });
      }
    });

    //Obtener la direccion
    this.mapleafService.currentAddress.subscribe(address => {
      this.address = address;
      this.formCliente.patchValue({
        address: this.address,
      });
    });


    this.getCities();
  }

  ngOnDestroy(): void {
    // Desuscribirse de los cambios de coordenadas para evitar fugas de memoria
    if (this.coordinatesSubscription) {
      this.coordinatesSubscription.unsubscribe();
    }
  }

  clearCoordinates() {
    this.mapleafService.clearCoordinates();
  }


  initForm() {
    const formControlsConfig = {
      type: [this.selected, Validators.required],
      documentNumber: ['', Validators.required],
      name: ['', Validators.required],
      cityId: ['', Validators.required],
      address: ['', Validators.required],
      reference: [''],
      latitude: [''],
      longitude: [''],
      phoneNumber: [''],
      whatsapp: ['', [Validators.required, Validators.pattern('^[5,1]{2}[0-9]{9}$')]],
      email: [''],
      status: [true],
    }

    this.formCliente = this.formulario.group(formControlsConfig);

    Object.keys(formControlsConfig).forEach(key => {
      if (key === 'name' || key === 'address' || key === 'reference') {
        this.formCliente.get(key)?.valueChanges.subscribe(value => {
          this.formCliente.get(key)?.setValue(value.toUpperCase(), { emitEvent: false });
        });
      }
    });

  }


  fetchCityDetails(id: number) {
    this.cityService.getCityByID(id).subscribe((respuesta) => {
      this.initCoords = respuesta.data.coordinates;
      this.mapleafService.changeMoveToCoordinate(this.initCoords);
    });
  }

  // setSingleCoordinate() {
  //   const singleCoordinate: [number, number] = [-4.905, -81.045];
  //   this.mapleafService.setSingleCoordinate(singleCoordinate);
  // }

  get locationReady() {
    return this.locationService.locationReady;
  }


  //Guardar datos
  enviarDatos() {
    if (this.formCliente.valid) {
      //const equipment = this.formContrato.get('equipmentId')!.value;
      const form = this.formCliente.value;
      const documento = form.documentNumber
      this.customerService.getCustomerByDocument(documento).subscribe(respuesta => {

        if (respuesta.exists == false) {
          this.customerService.addCustomer(this.formCliente.value).subscribe(respuesta => {
            this.showSuccess();
            this.router.navigate(['/dashboard/customer/customers']); // Navega al componente "cliente"
          });
        } else {
          this.showError();
        }

      });
    }
  }

  getCustomerByDNI(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const dni = inputElement.value;

    if (dni) {
      this.formCliente.patchValue({ documentNumber: dni });
      this.customerService.getCustomerByDNI(dni).subscribe(respuesta => {
        if (respuesta.success) {
          this.formCliente.patchValue({ name: respuesta.data.nombre_completo });
        } else {
          this.snackbarService.showError('DNI inválido o no se encuentra en la BD');
          this.formCliente.patchValue({ name: '' });
        }

      });
    }
  }

  goCustomers() {
    this.router.navigate(['/dashboard/customer/customers']);
  }

  getCities() {
    this.cityService.getCities().subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        this.cities = respuesta.data
      }
    });
  }

  showError() {
    this.snackbarService.showError('☹️ Cliente ya se encuentra registrado');
  }

  showSuccess() {
    this.snackbarService.showSuccess('Cliente agregado correctamente');
  }


}
