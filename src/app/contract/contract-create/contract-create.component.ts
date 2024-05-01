import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ContractService } from '../contract.service';
import { ReqPlan, ResponsePlan } from '../../plan/Models/ResponsePlan';
import { PlanService } from '../../plan/plan.service';
import { ReqRouter, ResponseRouter } from '../../router/Models/ResponseRouter';
import { RouterService } from './../../router/router.service';
import { ReqBox, ResponseBox } from '../../box/Models/ResponseBox';
import { BoxService } from '../../box/box.service';


interface Dias {
  value: string;
  viewValue: string;
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
  planSelected = 1;
  recurrent = true
  planes: ReqPlan[] = [];
  plan: ReqPlan[] = [];
  
  routers: ReqRouter[]=[];
  boxs: ReqBox[] = [];


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
    @Inject(MAT_DIALOG_DATA) public getData: any,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ContractCreateComponent>) { }


  ngOnInit(): void {
    this.initForm()
    this.getPlans()
    this.getRouters()
    this.getBoxs()
  }

  initForm() {
    this.formContrato = this.formulario.group({
      customer_id: [2],
      plan_id: ['', Validators.required],
      router_id: ['', Validators.required],
      box_id: ['', Validators.required],
      port_number: ['', Validators.required],
      city: ['', Validators.required],
      address_instalation: ['', Validators.required],
      reference: ['', Validators.required],
      registration_date: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      billing_date: ['', Validators.required],
      recurrent: [true,''],
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

    console.log(this.planes)
    });
  }


  getPlanbyID(id:number) {
   
    if (this.planes.length > 0) {
      this.plan = this.planes.filter(plan => plan.id == id)
       console.log('Plan', this.plan[0].name);
    }
    
  }


  getRouters() {
    this.routerService.getRouters().subscribe((respuesta: ResponseRouter) => {

      if (respuesta.data.length > 0) {
        this.routers = respuesta.data;
      }

      console.log(this.routers)
    });
  }

  getBoxs() {
    this.boxService.getBoxes().subscribe((respuesta: ResponseBox) => {

      if (respuesta.data.length > 0) {
        this.boxs = respuesta.data;
      }

      console.log(this.boxs)
    });
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
