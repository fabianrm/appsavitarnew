import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { Box } from '../../box/Models/BoxResponse';
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
import { Observable, Subscription, map, startWith } from 'rxjs';
import { CustomerService } from '../../customer/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Equipment } from '../../equipment/Models/EquipmentResponse';
import { PlacesService } from '../../mapleaf/places.service';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';

import { MapleafService } from '../../mapleaf/mapleaf.service';
import { Customer } from '../../customer/Models/CustomerResponseU';
import { PromotionService } from './../../promotion/promotion.service';
import { Promotion, PromotionResponse } from '../../promotion/models';
import { MikrotikService } from '../../mikrotik/mikrotik.service';


@Component({
  selector: 'app-contract-create-new',
  templateUrl: './contract-create-new.component.html',
  styleUrl: './contract-create-new.component.scss',
  standalone: false
})
export class ContractCreateNewComponent implements OnInit, OnDestroy {

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

  allPromotions: Promotion[] = [];
  promotions: Promotion[] = [];

  filteredBox!: Observable<Box[]>;
  selectedBox!: Box | null;

  date = new Date();
  coordinates: [number, number][] = [];
  initCoords: [number, number] = [0, 0];
  coordsBox: [number, number][] = [];
  coordinatesSubscription!: Subscription;

  id!: number;
  customer?: Customer;

  address: string = '';

  installPayment?: false;

  constructor(public formulario: FormBuilder,
    private customerService: CustomerService,
    private contractService: ContractService,
    private planService: PlanService,
    private routerService: RouterService,
    private boxService: BoxService,
    private cityService: CityService,
    private promotionService: PromotionService,
    private equipmentService: EquipmentService,
    private locationService: PlacesService,
    private mapleafService: MapleafService,

    private snackbarService: SnackbarService,
    private datePipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute,
    private mkservice: MikrotikService

  ) { }


  ngOnInit(): void {
    // console.log(this.locationService.location);
    this.initForm();
    this.clearCoordinates();
    this.getPromotions();
    this.getLocations();
    this.getCustomerById();

    this.getPlans()
    this.getCities();
    this.getRouters();
    this.getBoxs();
    this.getEquipments();

    // this.getProfiles();

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
      userPppoe: ['', Validators.required],
      passPppoe: ['', Validators.required],
      iptv: [false, Validators.required],
      userIptv: ['',],
      passIptv: ['',],
      promotionId: [''],
      installationPayment: [false, Validators.required],
      installationAmount: ['',],
      prepayment: [true, Validators.required],
      check: [false],
      mikrotik: [true]
    }

    this.formContrato = this.formulario.group(formControlsConfig);

    //Convertir a mayusculas
    Object.keys(formControlsConfig).forEach(key => {
      if (key === 'addressInstallation' || key === 'reference' || key === 'serie') {
        this.formContrato.get(key)?.valueChanges.subscribe(value => {
          this.formContrato.get(key)?.setValue(value.toUpperCase(), { emitEvent: false });
        });
      }
    });

    //Subscribirse a los cambios del combo equipo
    this.formContrato.get('equipmentId')!.valueChanges.subscribe(value => {
      this.selectedEquipment = typeof value === 'object' ? value : null;
    });


    // Filtrar combo equipos por serie o mac
    this.filteredEquipos = this.formContrato.get('equipmentId')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        // Determinar si el valor es un string (serie o mac) o un objeto (equipo)
        const filterValue = typeof value === 'string' ? value : value?.serie || value?.mac;
        return filterValue;
      }),
      map(filterValue => (filterValue ? this._filter(filterValue) : this.equipments.slice()))
    );


    //Subscribirse a los cambios del combo box
    this.formContrato.get('boxId')!.valueChanges.subscribe(value => {
      this.selectedBox = typeof value === 'object' ? value : null;
      if (this.selectedBox !== null) {
        this.getPorts(this.selectedBox.id);
      }
      // console.log(this.selectedBox?.id);

    });

    //Filtrar combo box por name 
    this.filteredBox = this.formContrato.get('boxId')!.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value?.name)),
      map(name => (name ? this._filterBox(name) : this.boxs.slice()))
    );


    //Subscribirse a los cambios del check
    this.formContrato.get('check')?.valueChanges.subscribe(checked => {
      this.onCheckboxChange(checked);
    });


    //Subscribirse a los cambios del check
    this.formContrato.get('installationPayment')?.valueChanges.subscribe(checked => {
      this.onCheckInstallationPay(checked);
    });

  }

  getProfiles() {
    this.mkservice.getProfiles().subscribe((resp) => {
      console.log(resp);

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

  fetchCityDetails(id: number) {
    this.cityService.getCityByID(id).subscribe((respuesta) => {
      this.initCoords = respuesta.data.coordinates;
      this.mapleafService.changeMoveToCoordinate(this.initCoords);
    });
  }


  //Setear direccion de cliente
  onCheckboxChange(checked: boolean) {
    if (checked) {
      this.applyAddressAndDisableControls();
      this.setNewCoordinates(this.customer!.latitude, this.customer!.longitude);
    } else {
      this.enableControls();
    }
  }

  //agregar validacion al monto de instalacion
  onCheckInstallationPay(checked: boolean) {
    if (checked) {
      this.formContrato.get('installationAmount')?.addValidators(Validators.required);
    } else {
      //  this.formContrato.get('installationAmount')?.clearValidators;
      this.formContrato.controls["installationAmount"].clearValidators();
      this.formContrato.controls['installationAmount'].updateValueAndValidity();
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
    const singleCoordinate: [number, number] = [long, lat];
    this.mapleafService.setSingleCoordinate(singleCoordinate);
  }


  //Planes
  getPlans() {
    this.planService.getPlans().subscribe((respuesta: ResponsePlan) => {
      if (respuesta.data.length > 0) {
        this.planes = respuesta.data.filter(x => x.status === 1);
        this.getPlanbyID(this.planInicial);
      }
    });
  }

  //Promociones
  getPromotions() {
    this.promotionService.getPromotions().subscribe((respuesta: PromotionResponse) => {
      if (respuesta.data.length > 0) {
        this.allPromotions = respuesta.data.filter(x => x.status === 'Activa');
      }
    });
  }

  //Obtener la promo seleccionada
  get selectedPromotion(): Promotion | undefined {
    const selectedId = this.formContrato.get('promotionId')?.value;
    return this.promotions.find(p => p.id === selectedId);
  }

  //Obtener plan por id
  getPlanbyID(id: number) {
    if (this.planes.length > 0) {
      this.planSelected = this.planes.filter(plan => plan.id == id);
      // Filtrar promociones activas en memoria según plan
      this.promotions = this.allPromotions.filter(x => x.plan.id === id);
      // Resetear promoción seleccionada
      this.formContrato.get('promotionId')?.setValue(0);
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


  //Obtener puertos
  getPorts(id: number) {
    this.boxService.getPortsAvailables(id).subscribe((respuesta: Ports[]) => {
      if (respuesta.length > 0) {
        this.ports = respuesta
      }
    });
  }

  //Busqueda incremental de equipos
  getEquipments() {
    this.equipmentService.getEquipmentsAvailable().subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        this.equipments = respuesta.data
        // console.log(this.equipments);
      }
    });
  }

  // displayFn(equipment: Equipment): string {
  //   return equipment ? (equipment.serie ? equipment.serie : equipment.mac) : '';
  // }

  displayFn(equipment: Equipment): string {
    if (equipment) {
      if (equipment.serie) {
        return equipment.serie;
      } else if (equipment.mac) {
        return equipment.mac;
      }
    }
    return '';
  }


  // displayFn(equipment: Equipment): string {
  //   return equipment && equipment.serie ? equipment.serie : '';
  // }

  // private _filter(name: string): Equipment[] {
  //   const filterValue = name.toLowerCase();
  //   return this.equipments.filter(option => option.serie.toLowerCase().includes(filterValue));
  // }

  private _filter(name: string): Equipment[] {
    const filterValue = name.toLowerCase();

    // Filtrar por serie
    let filteredEquipments = this.equipments.filter(option =>
      option.serie.toLowerCase().includes(filterValue)
    );

    // Si no encuentra resultados, filtrar por mac
    if (filteredEquipments.length === 0) {
      filteredEquipments = this.equipments.filter(option =>
        option.mac.toLowerCase().includes(filterValue)
      );
    }

    return filteredEquipments;
  }


  // Para obtener solo el id cuando se guarda el formulario
  get equipmentIdValue(): number | null {
    const equipment = this.formContrato.get('equipmentId')!.value;
    return equipment ? equipment.id : null;
  }
  //Fin equipos

  //Obtener cajas
  getBoxs() {
    this.boxService.getBoxes().subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        this.boxs = respuesta.data;
      }
    });
  }

  displayFnBox(box: Box): string {
    return box && box.name ? box.name : '';
  }


  private _filterBox(name: string): Box[] {
    const filterValue = name.toLowerCase();
    return this.boxs.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  // Para obtener solo el id cuando se guarda el formulario
  get boxIdValue(): number | null {
    const box = this.formContrato.get('boxId')!.value;
    return box ? box.id : null;
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

  //Coordenadas de cajas
  getCoords() {
    this.boxService.getBoxes().subscribe(response => {
      this.coordsBox = response.data.map((item: any) => {
        return [parseFloat(item.coordinates[0]), parseFloat(item.coordinates[1])];
      });
    });
  }

  //Limpiar las coordenadas
  clearCoordinates() {
    this.mapleafService.clearCoordinates();
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
    const boxId = this.boxIdValue;
    const promotionID = this.formContrato.get('promotionId')?.value === 0 ? null : this.formContrato.get('promotionId')?.value;

    const dataToSend = {
      ...formData,
      customerId: this.id,
      installationDate: installDate,
      equipmentId: equipmentId,
      boxId: boxId,
      promotionId: promotionID
    };

    if (this.formContrato.valid) {
      this.disableControls();
      this.contractService.getServiceByEquipment(equipmentId!).subscribe(respuesta => {
        if (respuesta.exists == false) {
          this.contractService.addService(dataToSend).subscribe(respuesta => {
            this.router.navigate(['/dashboard/contract/contracts']); // Navega al componente "contrato"
            this.showSuccess();
          });
        } else {
          this.showError();
        }
      })
    }
  }

  showError() {
    this.snackbarService.showError('Equipo ya se encuentra asignado a otro usuario...');
  }

  showSuccess() {
    this.snackbarService.showSuccess('Contrato registrado correctamente');
  }

  ngOnDestroy(): void {
    // Desuscribirse de los cambios de coordenadas para evitar fugas de memoria
    if (this.coordinatesSubscription) {
      this.coordinatesSubscription.unsubscribe();
    }
  }

}
