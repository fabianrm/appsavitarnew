import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from '../customer.service';
import { ThemePalette } from '@angular/material/core';
import { City } from '../../city/Models/CityResponse';
import { CityService } from '../../city/city.service';
import { MapsService } from '../../maps/maps.service';
import { PlacesService } from '../../maps/places.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from '../Models/CustomerResponseU';


interface Tipo {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrl: './customer-edit.component.css'
})
export class CustomerEditComponent implements OnInit {

  formCliente!: FormGroup;
  color: ThemePalette = 'accent';
  checked = true;
  disabled = false;
  selected = 'natural';

  cities: City[] = [];
  coordinates: [number, number] | null = null;

  id!: number;
  dataCustomer?: Customer;

  tipos: Tipo[] = [
    { value: 'natural', viewValue: 'Natural' },
    { value: 'juridica', viewValue: 'Juridica' },
  ]

  constructor(public formulario: FormBuilder,
    private cityService: CityService,
    private customerService: CustomerService,
    private locationService: PlacesService,
    private mapService: MapsService,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar,
  ) { }


  ngOnInit(): void {
    this.initForm();
    this.getCustomerById();
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
      // console.log('Coordenadas recibidas en ContractComponent:', this.coordinates);
    });
  }

  //Obtener customer por id
  getCustomerById() {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam !== null) {
        this.id = +idParam; // Usa el símbolo "+" para convertir a número
        this.fetchCustomerDetails(this.id); // Llama a la función para obtener los detalles del box
      } else {
        // Manejar el caso cuando idParam es null, asignando un valor por defecto o manejando el error
        console.error('ID parameter is null');
      }
    });
  }


  fetchCustomerDetails(id: number) {
    this.customerService.getCustomerById(id).subscribe((respuesta) => {
      this.dataCustomer = respuesta.data;
      //Llenamos el formEdit
      this.formCliente.patchValue({
        type: this.dataCustomer.type,
        documentNumber: this.dataCustomer.documentNumber,
        name: this.dataCustomer.customerName,
        cityId: this.dataCustomer.cityId,
        address: this.dataCustomer.address,
        reference: this.dataCustomer.reference,
        latitude: this.dataCustomer.latitude,
        longitude: this.dataCustomer.longitude,
        phoneNumber: this.dataCustomer.phoneNumber,
        email: this.dataCustomer.email,
        status: this.dataCustomer.status,
      });

      this.setNewCoordinates(this.dataCustomer.longitude, this.dataCustomer.latitude);

    });
  }

  //Setear coordenadas (edit)
  setNewCoordinates(long: number, lat: number) {
    const newCoordinates: [number, number] = [long, lat];
    this.mapService.changeCoordinates(newCoordinates);
  }

  //Guardar datos
  enviarDatos() {
    if (this.formCliente.valid) {
      //const equipment = this.formContrato.get('equipmentId')!.value;
      const form = this.formCliente.value;
      const documento = form.documentNumber
      this.customerService.getCustomerByDocument(documento).subscribe(respuesta => {
        this.customerService.updateCustomer(this.id, this.formCliente.value).subscribe(respuesta => {
          this.router.navigate(['/dashboard/customer/customers']); // Navega al componente "cliente"
          this.msgSusscess('Cliente editado correctamente');
        });
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

  msgSusscess(mensaje: string) {
    this._snackBar.open(mensaje, 'SAVITAR', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    })
  }


}
