import { Component,  OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ThemePalette } from '@angular/material/core';
import { CustomerService } from './../customer.service';
import { City } from '../../city/Models/CityResponse';
import { CityService } from '../../city/city.service';
import { PlacesService } from '../../maps/places.service';
import { MapsService } from '../../maps/maps.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';


interface Tipo {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-customer-create',
  templateUrl: './customer-create.component.html',
  styleUrl: './customer-create.component.css'
})


export class CustomerCreateComponent implements OnInit {

 // @ViewChild('documentNumber') documentNumber: ElementRef | undefined;

  formCliente!: FormGroup;
  color: ThemePalette = 'accent';
  checked = true;
  disabled = false;
  selected = 'natural';

  cities: City[] = [];
  coordinates: [number, number] | null = null;

  tipos: Tipo[] = [
    { value: 'natural', viewValue: 'Natural' },
    { value: 'juridica', viewValue: 'Juridica' },
  ]

  constructor(public formulario: FormBuilder,
    private cityService: CityService,
    private customerService: CustomerService,
    private locationService: PlacesService,
    private mapService: MapsService,
    private router: Router,
    private snackbarService: SnackbarService

) { }

  
  ngOnInit(): void {
    this.initForm();
    this.getCities();
    this.getLocations();
   // this.documentNumber!.nativeElement.focus();
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
        this.formCliente.patchValue({
          latitude: coordinates[1],
          longitude: coordinates[0]
        });
      }
      console.log('Coordenadas recibidas en ContractComponent:', this.coordinates);
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
