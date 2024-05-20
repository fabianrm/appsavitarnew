import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DATE_LOCALE, ThemePalette } from '@angular/material/core';
import { Box } from '../../box/Models/ResponseBox';
import { City } from '../../city/Models/CityResponse';
import { Equipment } from '../../equipment/Models/Equipment';
import { ReqPlan, ResponsePlan } from '../../plan/Models/ResponsePlan';
import { ReqRouter, ResponseRouter } from '../../router/Models/ResponseRouter';
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BoxService } from '../../box/box.service';
import { CityService } from '../../city/city.service';
import { EquipmentService } from '../../equipment/equipment.service';
import { PlanService } from '../../plan/plan.service';
import { RouterService } from '../../router/router.service';
import { ContractCreateComponent } from '../contract-create/contract-create.component';
import { ContractService } from '../contract.service';



interface Dias {
  value: string;
  viewValue: string;
}


interface Ports {
  id: string;
  port_number: string;
}

@Component({
  selector: 'app-contract-edit',
  templateUrl: './contract-edit.component.html',
  styleUrl: './contract-edit.component.css'
})
export class ContractEditComponent  {

  // formContrato!: FormGroup;
  // color: ThemePalette = 'accent';
  // checked = true;
  // disabled = false;
  // planSelected = this.getData.plan_id;
  // boxSelected = this.getData.box_id;
  // equipmentSelected = this.getData.equipment_id;
  // citySelected = this.getData.city_id;
  // recurrent = true;

  // respuesta?: ContractRequest;


  // routers: ReqRouter[] = [];
  // boxs: Box[] = [];
  // ports: Ports[] = [];
  // cities: City[] = [];
  // planes: ReqPlan[] = [];
  // plan: ReqPlan[] = [];
  // equipments: Equipment[] = [];
  // equipment: Equipment[] = [];


  // ciclos: Dias[] = [
  //   { value: '1', viewValue: '01' },
  //   { value: '15', viewValue: '15' },
  // ]

  // vencimientos: Dias[] = [
  //   { value: '5', viewValue: '05' },
  //   { value: '20', viewValue: '20' },
  // ]
  // dialog: any;


  // constructor(public formulario: FormBuilder,
  //   private contractService: ContractService,
  //   private planService: PlanService,
  //   private routerService: RouterService,
  //   private boxService: BoxService,
  //   private cityService: CityService,
  //   private equipmentService: EquipmentService,
  //   @Inject(MAT_DIALOG_DATA) public getData: Service,
  //   private _snackBar: MatSnackBar,
  //   private dialogRef: MatDialogRef<ContractCreateComponent>) { }

  // ngOnInit(): void {

  //   this.getPlans()
  //   this.getRouters()
  //   this.getBoxs()
  //   this.getCities()
  //   this.getEquipments()
  //   this.initForm();

  // }

  // initForm() {
  //   this.formContrato = this.formulario.group({
  //     customer_id: [this.getData.id],
  //     plan_id: [this.getData.plan_id, Validators.required],
  //     router_id: [this.getData.router_id, Validators.required],
  //     box_id: [this.getData.box_id, Validators.required],
  //     port_number: [this.getData.port_number, Validators.required],
  //     city_id: [this.getData.city_id, Validators.required],
  //     address_instalation: [this.getData.address_instalation, Validators.required],
  //     reference: [this.getData.reference, Validators.required],
  //     registration_date: [this.getData.registration_date, Validators.required],
  //     latitude: [this.getData.latitude, Validators.required],
  //     longitude: [this.getData.longitude, Validators.required],
  //     equipment_id: [this.getData.equipment_id, Validators.required],
  //     billing_date: [this.getData.billing_date, Validators.required],
  //     recurrent: [this.getData.recurrent, ''],
  //     due_date: [this.getData.due_date, Validators.required],
  //     is_active: [this.getData.is_active],
  //     status: [this.getData.status],
  //   });
  // }


  // getPlans() {
  //   this.planService.getPlans().subscribe((respuesta: ResponsePlan) => {
  //     // console.log(respuesta.data.length);
  //     if (respuesta.data.length > 0) {
  //       this.planes = respuesta.data;
  //     }

  //     // console.log(this.planes)
  //   });
  // }


  // getPlanbyID(id: number) {

  //   if (this.planes.length > 0) {
  //     this.plan = this.planes.filter(plan => plan.id == id)
  //     //  console.log('Plan', this.plan[0].name);
  //   }

  // }


  // getRouters() {
  //   this.routerService.getRouters().subscribe((respuesta: ResponseRouter) => {

  //     if (respuesta.data.length > 0) {
  //       this.routers = respuesta.data;
  //     }

  //     //  console.log(this.routers)
  //   });
  // }

  // getBoxs() {
  //   this.boxService.getBoxes().subscribe((respuesta) => {


  //     if (respuesta.data.boxs.length > 0) {
  //       this.boxs = respuesta.data.boxs;
  //     }

  //     // console.log('Boxs', this.boxs)
  //   });
  // }

  // getPorts(id: number) {
  //   this.boxService.getPortsAvailables(id).subscribe((respuesta: Ports[]) => {

  //     if (respuesta.length > 0) {
  //       this.ports = respuesta
  //     }

  //     //  console.log(this.ports);

  //   });
  // }


  // getCities() {
  //   this.cityService.getCities().subscribe((respuesta) => {

  //     if (respuesta.data.length > 0) {
  //       this.cities = respuesta.data
  //     }

  //     // console.log('Cities', this.cities);

  //   });
  // }


  // getEquipments() {
  //   this.equipmentService.getEquipments().subscribe((respuesta) => {

  //     if (respuesta.data.length > 0) {
  //       this.equipments = respuesta.data
  //     }

  //     // console.log(this.equipments);

  //   });
  // }

  // getEquipmentsByID(id: number) {

  //   if (this.equipments.length > 0) {
  //     this.equipment = this.equipments.filter(equipment => equipment.id == id)
  //     //  console.log('Equipment', this.equipment[0].type);
  //   }

  // }


  // enviarDatos(): any {
  //   if (this.formContrato.valid) {
  //     //console.log('agregar....')
  //     this.contractService.addService(this.formContrato.value).subscribe(respuesta => {

  //       this.msgSusscess('Contrato agregado correctamente');
  //       this.dialogRef.close();
  //     });
  //   }
  // }


  // msgSusscess(mensaje: string) {
  //   this._snackBar.open(mensaje, 'APPSAVITAR', {
  //     duration: 3000,
  //     horizontalPosition: 'center',
  //     verticalPosition: 'bottom'
  //   })
  // }




}


