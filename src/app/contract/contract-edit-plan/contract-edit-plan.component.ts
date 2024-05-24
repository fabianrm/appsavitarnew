import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlanService } from '../../plan/plan.service';
import { ReqPlan, ResponsePlan } from '../../plan/Models/ResponsePlan';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { MatSnackBar } from '@angular/material/snack-bar';
import { ContractService } from '../contract.service';
import { Service } from '../Models/ResponseServices';

@Component({
  selector: 'app-contract-edit-plan',
  templateUrl: './contract-edit-plan.component.html',
  styleUrl: './contract-edit-plan.component.scss'
})
export class ContractEditPlanComponent implements OnInit {

  formContrato!: FormGroup;
  planes: ReqPlan[] = [];
  planInicial = 1;
  planSelected: any;

  constructor(public fb: FormBuilder,
    private planService: PlanService,
    private _snackBar: MatSnackBar,
    private contractService: ContractService,
    @Inject(MAT_DIALOG_DATA) public getData: Service,
    private dialogRef: MatDialogRef<ContractEditPlanComponent>) { }


  ngOnInit(): void {
   // console.log('Contrato', this.getData.id);
    this.initForm();
    this.getPlans();

  }

  initForm() {
    this.formContrato = this.fb.group({
      id: [this.getData.id, Validators.required],
      plan_id: [this.planInicial, Validators.required],
    });
  }


  getPlans() {
    this.planService.getPlans().subscribe((respuesta: ResponsePlan) => {
      if (respuesta.data.length > 0) {
        this.planes = respuesta.data;
        this.getPlanbyID(this.planInicial);
      }
      //console.log(this.planes);

    });
  }


  getPlanbyID(id: number) {
    if (this.planes.length > 0) {
      this.planSelected = this.planes.filter(plan => plan.id == id)
      // console.log('Plan', this.planSelected[0].id);
    }
  }


  enviarDatos(): any {
    if (this.formContrato.valid) {
      //console.log('agregar....')
      this.contractService.updatePlantCustomer(this.getData.id, this.planSelected[0].id).subscribe(respuesta => {
      //  console.log('Plan actualizado', respuesta);
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
