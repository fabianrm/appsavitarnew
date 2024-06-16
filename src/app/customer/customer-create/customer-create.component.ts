import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { CustomerService } from './../customer.service';
import { City } from '../../city/Models/CityResponse';
import { CityService } from '../../city/city.service';
import { PlacesService } from '../../maps/places.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';
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


export class CustomerCreateComponent implements OnInit, AfterViewInit, OnDestroy {

 // @ViewChild('documentNumber') documentNumber: ElementRef | undefined;

  formCliente!: FormGroup;
  color: ThemePalette = 'accent';
  checked = true;
  disabled = false;
  selected = 'natural';

  cities: City[] = [];
  coordinates: [number, number][] = [];
  coordinatesSubscription!: Subscription;

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
  

  ngAfterViewInit(): void {
    this.setSingleCoordinate();
  }

  
  ngOnInit(): void {
    // Suscribirse a los cambios de coordenadas
    this.coordinatesSubscription = this.mapleafService.currentCoordinates.subscribe(coordinates => {
      this.coordinates = coordinates;
      console.log('Nuevas coordenadas:', this.coordinates);
    });

    this.initForm();
    this.getCities();
  
   // this.getLocations();
   // this.documentNumber!.nativeElement.focus();
  }

  ngOnDestroy(): void {
    // Desuscribirse de los cambios de coordenadas para evitar fugas de memoria
    if (this.coordinatesSubscription) {
      this.coordinatesSubscription.unsubscribe();
    }
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

  setSingleCoordinate() {
    const singleCoordinate: [number, number] = [-4.905, -81.045];
    this.mapleafService.setSingleCoordinate(singleCoordinate);
  }

  get locationReady() {
    //  console.log(this.locationService.location);
    return this.locationService.locationReady;
  }

  //Obtener coordenadas
  getLocations() {
    this.coordinatesSubscription = this.mapleafService.currentCoordinates.subscribe(coordinates => {
      this.coordinates = coordinates;
      if (coordinates) {
        // Actualizar los campos del formulario
        // this.formCliente.patchValue({
        //   latitude: coordinates[0][1],
        //   longitude: coordinates[0][0]
        // });
      }
      console.log('Nuevas coordenadas:', this.coordinates);
    });
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
            this.router.navigate(['/dashboard/customer/customers']); // Navega al componente "cliente"
            this.showSuccess();
          });
        } else {
          this.showError();
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
