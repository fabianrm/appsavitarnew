import { Component, Inject } from '@angular/core';
import { ReqPlan, ResponsePlan } from '../../plan/Models/ResponsePlan';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Promotion, PromotionResponse } from '../../promotion/models';
import { PlanService } from '../../plan/plan.service';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { ContractService } from '../contract.service';
import { PromotionService } from '../../promotion/promotion.service';
import { Service } from '../Models/ServiceResponse';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-promo',
  standalone: false,
  templateUrl: './add-promo.component.html',
  styleUrl: './add-promo.component.scss'
})
export class AddPromoComponent {

  formContrato!: FormGroup;
  allPromotions: Promotion[] = [];
  promotions: Promotion[] = [];

  constructor(public fb: FormBuilder,
    private snackbarService: SnackbarService,
    private contractService: ContractService,
    private promotionService: PromotionService,
    @Inject(MAT_DIALOG_DATA) public getData: Service,
    private dialogRef: MatDialogRef<AddPromoComponent>) { }


  ngOnInit(): void {
    this.initForm();
    this.getPromotions(this.getData.planId);
  }

  initForm() {
    this.formContrato = this.fb.group({
      id: [this.getData.id, Validators.required],
      promotionId: [''],
    });
  }


  //Promociones
  getPromotions(idPromo: number) {
    this.promotionService.getPromotions().subscribe((respuesta: PromotionResponse) => {
      if (respuesta.data.length > 0) {
        this.promotions = respuesta.data.filter(x => x.status === 'Activa' && x.plan.id === idPromo);
        console.log('1');

      }
    });
  }

  //Obtener la promo seleccionada
  get selectedPromotion(): Promotion | undefined {
    const selectedId = this.formContrato.get('promotionId')?.value;
    return this.promotions.find(p => p.id === selectedId);
  }


  enviarDatos(): any {
    if (this.formContrato.valid) {
      this.contractService.addPromoCustomer(this.getData.id, this.formContrato.value).subscribe({
        next: (resp) => {
          this.dialogRef.close();
          this.snackbarService.showSuccess(resp.message);
        },
        error: (err) => {
          this.snackbarService.showError(err);
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


}
