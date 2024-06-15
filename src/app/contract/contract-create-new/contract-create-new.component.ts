import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { Box } from '../../box/Models/ResponseBox';
import { City } from '../../city/Models/CityResponse';
import { ReqPlan, ResponsePlan } from '../../plan/Models/ResponsePlan';
import { ReqRouter, ResponseRouter } from '../../router/Models/ResponseRouter';
import { Ports } from '../Models/Ports';
import { DatePipe } from '@angular/common';
import { BoxService } from '../../box/box.service';
import { CityService } from '../../city/city.service';
import { EquipmentService } from '../../equipment/equipment.service';
import { PlanService } from '../../plan/plan.service';
import { RouterService } from '../../router/router.service';
import { ContractService } from '../contract.service';
import { Observable, map, startWith } from 'rxjs';
import { CustomerService } from '../../customer/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Equipment } from '../../equipment/Models/EquipmentResponse';
import { PlacesService } from '../../maps/places.service';
import { MapsService } from '../../maps/maps.service';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';
import { Customer } from '../../customer/Models/CustomerResponseU';

@Component({
  selector: 'app-contract-create-new',
  templateUrl: './contract-create-new.component.html',
  styleUrl: './contract-create-new.component.scss'
})
export class ContractCreateNewComponent implements OnInit {

  formContrato!: FormGroup;
  color: ThemePalette = 'accent';
  checked = true;
  disabled = false;
  planInicial = 1;
  planSelected: any;
  boxSelected = 1;
  equipmentSelected = 1;
  citySelected = 1;
  recurrent = true

  routers: ReqRouter[] = [];
  boxs: Box[] = [];
  ports: Ports[] = [];
  cities: City[] = [];
  planes: ReqPlan[] = [];
  plan: ReqPlan[] = [];
  equipment: Equipment[] = [];

  equipments: Equipment[] = [];
  filteredEquipos!: Observable<Equipment[]>;
  selectedEquipment!: Equipment | null;

  date = new Date();
  coordinates: [number, number] | null = null;

  id!: number;
  customer?: Customer;

  constructor(public formulario: FormBuilder,
    private customerService: CustomerService,
    private contractService: ContractService,
    private planService: PlanService,
    private routerService: RouterService,
    private boxService: BoxService,
    private cityService: CityService,
    private equipmentService: EquipmentService,
    private locationService: PlacesService,
    private mapService: MapsService,

    private snackbarService: SnackbarService,
    private datePipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute

  ) { }


  ngOnInit(): void {
    // console.log(this.locationService.location);

    this.getCustomerById();
    this.getPlans()
    this.getCities();
    this.getRouters();
    this.getBoxs();
    this.getEquipments();
    this.getLocations();

    this.initForm();
  }


  //Initform
  initForm() {

    const formControlsConfig = {
      customerId: [''],
      planId: [this.planInicial, Validators.required],
      routerId: ['', Validators.required],
      boxId: ['', Validators.required],
      portNumber: ['', Validators.required],
      equipmentId: ['', Validators.required],
      cityId: [this.citySelected, Validators.required],
      addressInstallation: ['', Validators.required],
      reference: ['', Validators.required],
      registrationDate: [this.datePipe.transform(this.date, "yyyy-MM-dd")],
      installationDate: ['', Validators.required],
      latitude: [0, Validators.required],
      longitude: [0, Validators.required],
      billingDate: [''],
      dueDate: [''],
      status: ['activo'],
      endDate: [''],
      check: [false],
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


    //Subscribirse a los cambios del combo equipo
    this.formContrato.get('equipmentId')!.valueChanges.subscribe(value => {
      this.selectedEquipment = typeof value === 'object' ? value : null;
    });

    //Filtrar combo equipos por serie 
    this.filteredEquipos = this.formContrato.get('equipmentId')!.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value?.serie)),
      map(serie => (serie ? this._filter(serie) : this.equipments.slice()))
    );

    //Subscribirse a los cambios del check
    this.formContrato.get('check')?.valueChanges.subscribe(checked => {
      this.onCheckboxChange(checked);
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
      this.customer = respuesta.data;
    });
  }


  //Setear direccion de cliente
  onCheckboxChange(checked: boolean) {
    if (checked) {
      this.applyAddressAndDisableControls();
      this.setNewCoordinates(this.customer!.longitude, this.customer!.latitude);
    } else {
      this.enableControls();
    }
  }

  //enable controls
  enableControls() {
    this.formContrato.get('cityId')?.enable();
    this.formContrato.get('addressInstallation')?.enable();
    this.formContrato.get('reference')?.enable();
    this.formContrato.get('longitude')?.enable();
    this.formContrato.get('latitude')?.enable();
  }

  //Disable controls
  disableControls() {
    this.formContrato.get('cityId')?.disable();
    this.formContrato.get('addressInstallation')?.disable();
    this.formContrato.get('reference')?.disable();
    this.formContrato.get('longitude')?.disable();
    this.formContrato.get('latitude')?.disable();
  }

  enableAllControls() {
    Object.keys(this.formContrato.controls).forEach(key => {
      this.formContrato.get(key)?.enable();
    });
  }


  //Obtener direccion de cliente
  applyAddressAndDisableControls() {
    this.formContrato.patchValue({
      cityId: this.customer?.cityId,
      addressInstallation: this.customer?.address,
      reference: this.customer?.reference,
      latitude: this.customer?.latitude,
      longitude: this.customer?.longitude,
    });
    this.disableControls();
  }


  //Setear coordenadas (edit)
  setNewCoordinates(long: number, lat: number) {
    const newCoordinates: [number, number] = [long, lat];
    this.mapService.changeCoordinates(newCoordinates);
  }

  //Planes
  getPlans() {
    this.planService.getPlans().subscribe((respuesta: ResponsePlan) => {
      if (respuesta.data.length > 0) {
        this.planes = respuesta.data;
        this.getPlanbyID(this.planInicial);
      }
    });
  }

//Obtener plan por id
  getPlanbyID(id: number) {
    if (this.planes.length > 0) {
      this.planSelected = this.planes.filter(plan => plan.id == id);
    }
  }

  //Cities
  getCities() {
    this.cityService.getCities().subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        this.cities = respuesta.data
      }
    });
  }

  //Vlan, caja , port
  getRouters() {
    this.routerService.getRouters().subscribe((respuesta: ResponseRouter) => {
      if (respuesta.data.length > 0) {
        this.routers = respuesta.data;
      }
    });
  }

  //Obtener cajas
  getBoxs() {
    this.boxService.getBoxes().subscribe((respuesta) => {
      if (respuesta.data.boxs.length > 0) {
        this.boxs = respuesta.data.boxs;
      }
    });
  }

  //Obtener puertos
  getPorts(id: number) {
    this.boxService.getPortsAvailables(id).subscribe((respuesta: Ports[]) => {
      if (respuesta.length > 0) {
        this.ports = respuesta
      }
    });
  }

  //Equipos
  getEquipments() {
    this.equipmentService.getEquipments().subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        this.equipments = respuesta.data
      }
    });
  }

  get locationReady() {
    return this.locationService.locationReady;
  }

  displayFn(equipment: Equipment): string {
    return equipment && equipment.serie ? equipment.serie : '';
  }

  private _filter(name: string): Equipment[] {
    const filterValue = name.toLowerCase();
    return this.equipments.filter(option => option.serie.toLowerCase().includes(filterValue));
  }


  // Para obtener solo el id cuando se guarda el formulario
  get equipmentIdValue(): number | null {
    const equipment = this.formContrato.get('equipmentId')!.value;
    return equipment ? equipment.id : null;
  }

  //Obtener coordenadas
  getLocations() {
    this.mapService.currentCoordinates.subscribe(coordinates => {
      this.coordinates = coordinates;

      if (coordinates) {
        // Actualizar los campos del formulario
        this.formContrato.patchValue({
          latitude: coordinates[1],
          longitude: coordinates[0]
        });
      }
      //   console.log('Coordenadas recibidas en ContractComponent:', this.coordinates);
    });
  }

  //Cancelar
  cancel() {
    this.router.navigate(['/dashboard/customer/customers']);
  }


  //Enviar Datos
  enviarDatos(): any {
    this.enableControls();
    const formData = this.formContrato.value;
    const installDate = new Date(formData.installationDate).toISOString().split('T')[0];
    const equipmentId = this.equipmentIdValue;

    const dataToSend = {
      ...formData,
      customerId: this.id,
      installationDate: installDate,
      equipmentId: equipmentId,
    };

    if (this.formContrato.valid) {
      this.disableControls();
      this.contractService.getServiceByEquipment(equipmentId!).subscribe(respuesta => { 
        if (respuesta.exists == false) { 
          this.contractService.addService(dataToSend).subscribe(respuesta => {
            this.router.navigate(['/dashboard/customer/customers']); // Navega al componente "contrato"
            this.showSuccess();
          });
        } else {
          this.showError();
        }
      })
    }
  }

  showError() {
    this.snackbarService.showError('Ocurrio un error...');
  }

  showSuccess() {
    this.snackbarService.showSuccess('Contrato registrado correctamente');
  }

}
