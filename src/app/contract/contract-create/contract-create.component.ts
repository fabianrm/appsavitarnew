import { Component, Inject, LOCALE_ID, OnInit, numberAttribute } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DATE_LOCALE, ThemePalette } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ContractService } from '../contract.service';
import { ReqPlan, ResponsePlan } from '../../plan/Models/ResponsePlan';
import { PlanService } from '../../plan/plan.service';
import { ReqRouter, ResponseRouter } from '../../router/Models/ResponseRouter';
import { RouterService } from './../../router/router.service';
import { Box } from '../../box/Models/ResponseBox';
import { BoxService } from '../../box/box.service';
import { ReqCustomer } from '../../customer/Models/ResponseCustomer';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { City } from '../../city/Models/CityResponse';
import { CityService } from '../../city/city.service';
import { EquipmentService } from '../../equipment/equipment.service';
import { Equipment } from '../../equipment/Models/Equipment';



interface Dias {
  value: string;
  viewValue: string;
}


interface Ports {
  id: string;
  port_number: string;
}


@Component({
  selector: 'app-contract-create',
  templateUrl: './contract-create.component.html',
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'fr' }, provideMomentDateAdapter(undefined, { useUtc: true })],
  styleUrl: './contract-create.component.css',
})
export class ContractCreateComponent implements OnInit {

  formContrato!: FormGroup;
  color: ThemePalette = 'accent';
  checked = true;
  disabled = false;
  planSelected = 1;
  boxSelected = 1;
  equipmentSelected = 1;
  citySelected = 2;
  recurrent = true

  

  routers: ReqRouter[] = [];
  boxs: Box[]=[];
  ports: Ports[] = [];
  cities: City[] = [];
  planes: ReqPlan[] = [];
  plan: ReqPlan[] = [];
  equipments: Equipment[] = [];
  equipment: Equipment[] = [];


  ciclos: Dias[] = [
    { value: '1', viewValue: '01' },
    { value: '15', viewValue: '15' },
  ]

  vencimientos: Dias[] = [
    { value: '5', viewValue: '05' },
    { value: '20', viewValue: '20' },
  ]



  constructor(public formulario: FormBuilder,
    private contractService: ContractService,
    private planService: PlanService,
    private routerService: RouterService,
    private boxService: BoxService,
    private cityService: CityService,
    private equipmentService: EquipmentService,
    @Inject(MAT_DIALOG_DATA) public getData: ReqCustomer,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ContractCreateComponent>) { }


  ngOnInit(): void {
    this.initForm()
    this.getPlans()
    this.getRouters()
    this.getBoxs()
    this.getCities()
    this.getEquipments()
    // console.log(this.getData);

  }

  initForm() {
    this.formContrato = this.formulario.group({
      customer_id: [this.getData.id],
      plan_id: [this.planSelected, Validators.required],
      router_id: ['', Validators.required],
      box_id: ['', Validators.required],
      port_number: ['', Validators.required],
      city_id: [this.citySelected, Validators.required],
      address_instalation: ['', Validators.required],
      reference: ['', Validators.required],
      registration_date: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      equipment_id: ['', Validators.required],
      
      billing_date: ['', Validators.required],
      recurrent: [true, ''],
      due_date: ['', Validators.required],
      is_active: [true],
      status: [true],
    });
  }

  getPlans() {
    this.planService.getPlans().subscribe((respuesta: ResponsePlan) => {
      // console.log(respuesta.data.length);
      if (respuesta.data.length > 0) {
        this.planes = respuesta.data;
      }

     // console.log(this.planes)
    });
  }


  getPlanbyID(id: number) {

    if (this.planes.length > 0) {
      this.plan = this.planes.filter(plan => plan.id == id)
    //  console.log('Plan', this.plan[0].name);
    }

  }


  getRouters() {
    this.routerService.getRouters().subscribe((respuesta: ResponseRouter) => {

      if (respuesta.data.length > 0) {
        this.routers = respuesta.data;
      }

    //  console.log(this.routers)
    });
  }

  getBoxs() {
    this.boxService.getBoxes().subscribe((respuesta) => {

   
      if (respuesta.data.boxs.length > 0) {
        this.boxs = respuesta.data.boxs;
      }

     // console.log('Boxs',this.boxs)
    });
  }

  getPorts(id: number) {
    this.boxService.getPortsAvailables(id).subscribe((respuesta: Ports[]) => {

      if (respuesta.length > 0) {
        this.ports = respuesta
      }

    //  console.log(this.ports);

    });
  }


  getCities() {
    this.cityService.getCities().subscribe((respuesta) => {

      if (respuesta.data.length > 0) {
        this.cities = respuesta.data
      }

     // console.log('Cities', this.cities);

    });
  }


  getEquipments() {
    this.equipmentService.getEquipments().subscribe((respuesta) => {

      if (respuesta.data.length > 0) {
        this.equipments = respuesta.data
      }

     // console.log(this.equipments);

    });
  }

  getEquipmentsByID(id: number) {

    if (this.equipments.length > 0) {
      this.equipment = this.equipments.filter(equipment => equipment.id == id)
    //  console.log('Equipment', this.equipment[0].type);
    }

  }


  enviarDatos(): any {
    if (this.formContrato.valid) {
      //console.log('agregar....')
      this.contractService.addService(this.formContrato.value).subscribe(respuesta => {

        this.msgSusscess('Contrato agregado correctamente');
        this.dialogRef.close();
      });
    }
  }

  msgSusscess(mensaje: string) {
    this._snackBar.open(mensaje, 'APPSAVITAR', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    })
  }



}
