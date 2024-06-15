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
import { Router } from '@angular/router';
import { Equipment } from '../../equipment/Models/EquipmentResponse';
import { PlacesService } from '../../maps/places.service';
import { MapsService } from '../../maps/maps.service';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';

@Component({
  selector: 'app-contract-create-new',
  templateUrl: './contract-create-new.component.html',
  styleUrl: './contract-create-new.component.scss'
})
export class ContractCreateNewComponent implements OnInit {

  formContrato!: FormGroup;
  color: ThemePalette = 'accent';
  customer?: { id: number, customerName: string, customerCode: string };
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
    private router: Router
  ) { }


  ngOnInit(): void {
   // console.log(this.locationService.location);

    this.getCustomer();
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
      customerId: [this.customer?.id],
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
    }

    this.formContrato = this.formulario.group(formControlsConfig);

    Object.keys(formControlsConfig).forEach(key => {
      if (key === 'addressInstallation' || key === 'reference') {
        this.formContrato.get(key)?.valueChanges.subscribe(value => {
          this.formContrato.get(key)?.setValue(value.toUpperCase(), { emitEvent: false });
        });
      }
    });


    this.filteredEquipos = this.formContrato.get('equipmentId')!.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value?.serie)),
      map(serie => (serie ? this._filter(serie) : this.equipments.slice()))
    );

    this.formContrato.get('equipmentId')!.valueChanges.subscribe(value => {
      this.selectedEquipment = typeof value === 'object' ? value : null;
    });

  }

  //cliente:
  getCustomer() {
    this.customer = this.customerService.getCustomer();
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

  getBoxs() {
    this.boxService.getBoxes().subscribe((respuesta) => {
      if (respuesta.data.boxs.length > 0) {
        this.boxs = respuesta.data.boxs;
      }
    });
  }

  getPorts(id: number) {
    this.boxService.getPortsAvailables(id).subscribe((respuesta: Ports[]) => {
      if (respuesta.length > 0) {
        this.ports = respuesta
      }
    });
  }

  //Equipo
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
    const formData = this.formContrato.value;
    const installDate = new Date(formData.installationDate).toISOString().split('T')[0];
    const equipmentId = this.equipmentIdValue;

    const dataToSend = {
      ...formData,
      installationDate: installDate,
      equipmentId: equipmentId
    };

    if (this.formContrato.valid) {
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
    this.snackbarService.showError('El equipo se encuentra asignado a otro cliente...');
  }

  showSuccess() {
    this.snackbarService.showSuccess('Operación exitosa');
  }

}
