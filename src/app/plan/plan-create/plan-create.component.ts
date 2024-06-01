import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlanService } from '../plan.service';

@Component({
  selector: 'app-plan-create',
  templateUrl: './plan-create.component.html',
  styleUrl: './plan-create.component.css'
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
    private _snackBar: MatSnackBar,
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
        this.msgSusscess('Plan agregado correctamente');
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
