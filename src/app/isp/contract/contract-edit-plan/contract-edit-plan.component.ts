import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlanService } from '../../plan/plan.service';
import { ReqPlan, ResponsePlan } from '../../plan/Models/ResponsePlan';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ContractService } from '../contract.service';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { Service } from '../Models/ServiceResponse';
import { RouterService } from '../../router/router.service';

@Component({
  selector: 'app-contract-edit-plan',
  templateUrl: './contract-edit-plan.component.html',
  styleUrl: './contract-edit-plan.component.scss',
  standalone: false
})
export class ContractEditPlanComponent implements OnInit {

  formContrato!: FormGroup;
  planes: ReqPlan[] = [];
  planInicial = 1;
  planSelected: any;
  statusMK: string = '---';

  constructor(public fb: FormBuilder,
    private planService: PlanService,
    private routerService: RouterService,
    private snackbarService: SnackbarService,
    private contractService: ContractService,
    @Inject(MAT_DIALOG_DATA) public getData: Service,
    private dialogRef: MatDialogRef<ContractEditPlanComponent>) { }


  ngOnInit(): void {
    // console.log('Contrato', this.getData.id);
    this.initForm();
    this.checkMK(this.getData.routerId);
    this.getPlans();

  }

  initForm() {
    this.formContrato = this.fb.group({
      id: [this.getData.id, Validators.required],
      plan_id: [this.planInicial, Validators.required],
      mikrotik: [false, Validators.required],
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
    this.contractService
      .updatePlantCustomer(this.getData.id, this.planSelected[0].id)
      .subscribe({
        next: (res) => {
          console.log(res);
          
          if (res.success==true) {
            // 1) contrato OK
            this.showSuccess(); // “Plan actualizado correctamente”

            // 2) aviso opcional si Mikrotik falló
            if (res.mikrotik_ok === false && res.mikrotik_msg) {
              this.snackbarService.showError(res.mikrotik_msg);
            }

            // 3) cerrar diálogo y refrescar
            this.dialogRef.close();
          } else {
            // solo si hubiera success = false
            this.snackbarService.showError(res.message || 'No se pudo actualizar el plan');
          }
        },
        error: (err) => {
          // solo si el backend devolviera 4xx/5xx sin este JSON
          this.snackbarService.showError(err?.error?.message || 'Error inesperado');
        }
      });
  }
}



  showError() {
    this.snackbarService.showError('Ocurrio un error...');
  }

  showSuccess() {
    this.snackbarService.showSuccess('Plan actualizado correctamente');
  }

  checkMK(idR: number) {
    this.routerService.getTestConnection(idR).subscribe({
      next: (respuesta) => {
        console.log(respuesta);
        // this.testMK = respuesta;
        if (respuesta.conectado === true) {
          this.statusMK = '🟢 En línea';
          this.formContrato.get('mikrotik')?.setValue(true);

        } else {
          this.formContrato.get('mikrotik')?.setValue(false);
          this.statusMK = '🔴 Desconectado';
        }
      },

      error: (error) => {
        this.formContrato.get('mikrotik')?.setValue(false);
        this.statusMK = '🔴 Desconectado';
      },

    });

  }

}
