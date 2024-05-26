import {  Component, Inject, LOCALE_ID, OnInit} from '@angular/core';
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
import { City } from '../../city/Models/CityResponse';
import { CityService } from '../../city/city.service';
import { EquipmentService } from '../../equipment/equipment.service';
import { Equipment } from '../../equipment/Models/Equipment';
import { DatePipe } from '@angular/common';

//TODO: QUITAR LOS CAMPOS DIA DE FACTURACION Y CORTE Y AGREGARLOS EN EL INVOICE

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
  styleUrl: './contract-create.component.css',
})
export class ContractCreateComponent implements OnInit {

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

  date = new Date();

  constructor(public formulario: FormBuilder,
    private contractService: ContractService,
    private planService: PlanService,
    private routerService: RouterService,
    private boxService: BoxService,
    private cityService: CityService,
    private equipmentService: EquipmentService,
    @Inject(MAT_DIALOG_DATA) public getData: ReqCustomer,
    private _snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private dialogRef: MatDialogRef<ContractCreateComponent>) { }


  ngOnInit(): void {
    this.initForm()
    this.getPlans()
    this.getCities()
    this.getRouters()
    this.getBoxs()
    this.getEquipments()
  }


  initForm() {
    this.formContrato = this.formulario.group({
      customerId: [this.getData.id],
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
  }

  getPlans() {
    this.planService.getPlans().subscribe((respuesta: ResponsePlan) => {
      // console.log(respuesta.data.length);
      if (respuesta.data.length > 0) {
        this.planes = respuesta.data;
        //const defaultPlanId = this.planes[0]?.id; // Asegúrate de que hay planes y selecciona el primero
        // this.formContrato.patchValue({ plan_id: this.planInicial });
        //Después de cargar los planes llamamos al seleccionado
        this.getPlanbyID(this.planInicial);

      }
    });
  }


  getPlanbyID(id: number) {

    if (this.planes.length > 0) {
      this.planSelected = this.planes.filter(plan => plan.id == id);
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

    const formData = this.formContrato.value;
    const installDate = new Date(formData.installationDate).toISOString().split('T')[0]; 

    const dataToSend = {
      ...formData,
      installationDate: installDate,
    };


    if (this.formContrato.valid) {
      //console.log('agregar....')
      this.contractService.addService(dataToSend).subscribe(respuesta => {

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
