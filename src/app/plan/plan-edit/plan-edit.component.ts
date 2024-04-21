import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReqPlan } from '../Models/ResponsePlan';
import { PlanService } from '../plan.service';

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
    private _snackBar: MatSnackBar,
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
        this.msgSusscess('Plan actualizado correctamente');
        this.dialogRef.close();
        // console.log(respuesta);
      });
    }
  }

  msgSusscess(mensaje: string) {
    this._snackBar.open(mensaje, 'SAVITAR', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    })
  }

}
