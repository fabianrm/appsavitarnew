import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../customer.service';
import { ThemePalette } from '@angular/material/core';
import { City } from '../../city/Models/CityResponse';
import { CityService } from '../../city/city.service';
import { PlacesService } from '../../mapleaf/places.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from '../Models/CustomerResponseU';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { MapleafService } from '../../mapleaf/mapleaf.service';
import { Subscription, switchMap, tap } from 'rxjs';


interface Tipo {
  value: string;
  viewValue: string;
}

@Component({
    selector: 'app-customer-edit',
    templateUrl: './customer-edit.component.html',
    styleUrl: './customer-edit.component.css',
    standalone: false
})
export class CustomerEditComponent implements OnInit, OnDestroy {

  formCliente!: FormGroup;
  color: ThemePalette = 'accent';
  checked = true;
  disabled = false;
  selected = 'natural';

  cities: City[] = [];
  coordinates: [number, number][] = [];
  coordinatesSubscription!: Subscription;

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
    private mapleafService: MapleafService,
    private route: ActivatedRoute,
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

    this.fetchCustomerDetails();
    this.getCities();

  }


  initForm() {
    const formControlsConfig = {
      enterprise_id: [this.enterprise],
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

  get enterprise() {
    return localStorage.getItem('enterprise_id');
  }

  get locationReady() {
    return this.locationService.locationReady;
  }


  //Obtener customer por id
  // getCustomerById() {
  //   this.route.paramMap.subscribe(params => {
  //     const idParam = params.get('id');
  //     if (idParam !== null) {
  //       this.id = +idParam; // Usa el símbolo "+" para convertir a número
  //       this.fetchCustomerDetails(this.id); // Llama a la función para obtener los detalles del cliente
  //     } else {
  //       // Manejar el caso cuando idParam es null, asignando un valor por defecto o manejando el error
  //       console.error('ID parameter is null');
  //     }
  //   });
  // }


  fetchCustomerDetails() {

    this.route.params
      .pipe(
        tap(({ id }) => this.id = id),
        switchMap(({ id }) => this.customerService.getCustomerById(id))
      ).subscribe(customer => {
        if (!customer) return console.log('No hay cliente');
        this.dataCustomer = customer.data;

        this.mapleafService.changeMoveToCoordinate(customer.data.coordinates);

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
          whatsapp: this.dataCustomer.whatsapp,
          email: this.dataCustomer.email,
          status: this.dataCustomer.status,
        });
        this.setNewCoordinates(this.dataCustomer.latitude, this.dataCustomer.longitude);

      });



    // this.customerService.getCustomerById(id).subscribe((respuesta) => {
    //   this.dataCustomer = respuesta.data;
    //   this.mapleafService.changeMoveToCoordinate(respuesta.data.coordinates);
    //   // console.log(this.dataCustomer);

    //   //Llenamos el formEdit
    //   this.formCliente.patchValue({
    //     type: this.dataCustomer.type,
    //     documentNumber: this.dataCustomer.documentNumber,
    //     name: this.dataCustomer.customerName,
    //     cityId: this.dataCustomer.cityId,
    //     address: this.dataCustomer.address,
    //     reference: this.dataCustomer.reference,
    //     latitude: this.dataCustomer.latitude,
    //     longitude: this.dataCustomer.longitude,
    //     phoneNumber: this.dataCustomer.phoneNumber,
    //     email: this.dataCustomer.email,
    //     status: this.dataCustomer.status,
    //   });
    //   this.setNewCoordinates(this.dataCustomer.latitude, this.dataCustomer.longitude);
    // });


  }

  //Setear coordenadas (edit)
  setNewCoordinates(long: number, lat: number) {
    const singleCoordinate: [number, number] = [long, lat];
    this.mapleafService.setSingleCoordinate(singleCoordinate);
  }

  clearCoordinates() {
    this.mapleafService.clearCoordinates();
  }



  //Guardar datos
  enviarDatos() {
    if (this.formCliente.valid) {
      //const equipment = this.formContrato.get('equipmentId')!.value;
      const form = this.formCliente.value;
      const documento = form.documentNumber
      this.customerService.getCustomerByDocument(documento).subscribe(respuesta => {
        this.customerService.updateCustomer(this.id, this.formCliente.value).subscribe(respuesta => {
          this.showSuccess();
          this.router.navigate(['/dashboard/customer/customers']); // Navega al componente "cliente"
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

  showError() {
    this.snackbarService.showError('☹️ Cliente ya se encuentra registrado');
  }

  showSuccess() {
    this.snackbarService.showSuccess('Cliente editado correctamente');
  }

  ngOnDestroy(): void {
    // Desuscribirse de los cambios de coordenadas para evitar fugas de memoria
    if (this.coordinatesSubscription) {
      this.coordinatesSubscription.unsubscribe();
    }
  }


}
