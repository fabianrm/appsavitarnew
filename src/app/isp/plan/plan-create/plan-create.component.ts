import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PlanService } from '../plan.service';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';

@Component({
  selector: 'app-plan-create',
  templateUrl: './plan-create.component.html',
  styleUrl: './plan-create.component.scss',
  standalone: false
})
export class PlanCreateComponent {
  formCreate!: FormGroup;
  color: ThemePalette = 'accent';
  checked = true;
  disabled = false;
  selected = 'normal';

  constructor(public formulario: FormBuilder,
    private planService: PlanService,
    @Inject(MAT_DIALOG_DATA) public getData: any,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<PlanCreateComponent>) { }


  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.formCreate = this.formulario.group({
      name: ['', Validators.required],
      download: ['', Validators.required],
      upload: ['', Validators.required],
      price: ['', Validators.required],
      priority: [this.selected, Validators.required],
      guaranteedSpeed: [''],
      burstLimit: [0],
      burstThreshold: [0],
      burstTime: [0],
      status: [this.checked],
    });
  }


  enviarDatos() {
    if (this.formCreate.valid) {
      this.planService.addPlan(this.formCreate.value).subscribe(respuesta => {
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
    this.snackbarService.showSuccess('Registro agregado correctamente');
  }


}
