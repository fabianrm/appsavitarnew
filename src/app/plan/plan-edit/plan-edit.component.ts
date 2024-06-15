import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReqPlan } from '../Models/ResponsePlan';
import { PlanService } from '../plan.service';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';

@Component({
  selector: 'app-plan-edit',
  templateUrl: './plan-edit.component.html',
  styleUrl: './plan-edit.component.css'
})
export class PlanEditComponent {
  formEditPlan!: FormGroup;
  color: ThemePalette = 'accent';
  checked = (this.getData.status == 1) ? true : false;
  disabled = false;


  constructor(public formulario: FormBuilder,
    private planService: PlanService,
    @Inject(MAT_DIALOG_DATA) public getData: ReqPlan,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<PlanEditComponent>) { }


  ngOnInit(): void {
    this.initForm();
    // this.documentNumber!.nativeElement.focus();
  }

  initForm() {
    this.formEditPlan = this.formulario.group({
      name: [this.getData.name, Validators.required],
      download: [this.getData.download, Validators.required],
      upload: [this.getData.upload, Validators.required],
      price: [this.getData.price, Validators.required],
      guaranteed_speed: [this.getData.guaranteed_speed],
      priority: [this.getData.priority],
      burst_limit: [this.getData.burst_limit],
      burst_threshold: [this.getData.burst_threshold],
      burst_time: [this.getData.burst_time],
      status: [this.checked],

    });
  }


  enviarDatos(id: number) {
    if (this.formEditPlan.valid) {
      this.planService.updatePlans(id, this.formEditPlan.value).subscribe(respuesta => {
        this.showSuccess();
        this.dialogRef.close();
        // console.log(respuesta);
      });
    }
  }

  showError() {
    this.snackbarService.showError('☹️ Ocurrio un error');
  }

  showSuccess() {
    this.snackbarService.showSuccess('Registro editado correctamente');
  }


}
