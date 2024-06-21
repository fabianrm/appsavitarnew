import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlanService } from '../../plan/plan.service';
import { ReqPlan, ResponsePlan } from '../../plan/Models/ResponsePlan';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ContractService } from '../contract.service';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';
import { Service } from '../Models/ServiceResponse';

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
    private snackbarService: SnackbarService,
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
        this.showSuccess();
        this.dialogRef.close();
      });
    }
  }

  showError() {
    this.snackbarService.showError('Ocurrio un error...');
  }

  showSuccess() {
    this.snackbarService.showSuccess('Plan actualizado correctamente');
  }

}
