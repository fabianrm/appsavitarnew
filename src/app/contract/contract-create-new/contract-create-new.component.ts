import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { Box } from '../../box/Models/ResponseBox';
import { City } from '../../city/Models/CityResponse';
import { Equipment } from '../../equipment/Models/Equipment';
import { ReqPlan, ResponsePlan } from '../../plan/Models/ResponsePlan';
import { ReqRouter, ResponseRouter } from '../../router/Models/ResponseRouter';
import { Ports } from '../Models/Ports';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BoxService } from '../../box/box.service';
import { CityService } from '../../city/city.service';
import { Customer } from '../../customer/Models/CustomerResponse';
import { EquipmentService } from '../../equipment/equipment.service';
import { PlanService } from '../../plan/plan.service';
import { RouterService } from '../../router/router.service';
import { ContractCreateComponent } from '../contract-create/contract-create.component';
import { ContractService } from '../contract.service';
import { Observable, map, startWith } from 'rxjs';

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


  constructor(public formulario: FormBuilder,
    private contractService: ContractService,
    private planService: PlanService,
    private routerService: RouterService,
    private boxService: BoxService,
    private cityService: CityService,
    private equipmentService: EquipmentService,
    private _snackBar: MatSnackBar,
    private datePipe: DatePipe,
   ) { }

  
  ngOnInit(): void {
    this.getPlans()
    this.getCities();
    this.getRouters();
    this.getBoxs();
    this.getEquipments();
    this.initForm();
  }


  //Initform
  initForm() {

    this.formContrato = this.formulario.group({
      customerId: [],
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
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      billingDate: ['', Validators.required],
      dueDate: ['', Validators.required],
      status: ['activo'],
      endDate: [''],
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


}
