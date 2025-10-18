import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { Service } from '../Models/ServiceResponse';
import { ContractService } from '../contract.service';
import { SuspensionService } from '../../suspension/suspension.service';
import { RouterService } from '../../router/router.service';

@Component({
  selector: 'app-contract-suspend',
  templateUrl: './contract-suspend.component.html',
  styleUrl: './contract-suspend.component.scss',
  standalone: false
})
export class ContractSuspendComponent implements OnInit {

  formContrato!: FormGroup;
  statusMK: string = '---';

  constructor(public fb: FormBuilder,
    private snackbarService: SnackbarService,
    private suspensionService: SuspensionService,
    private routerService: RouterService,
    @Inject(MAT_DIALOG_DATA) public getData: Service,
    private dialogRef: MatDialogRef<ContractSuspendComponent>) { }

  motivos = [
    { "value": "viaje", "name": "Viaje" },
    { "value": "economico", "name": "Económico" },
    { "value": "cambio_domicilio", "name": "Cambio de domicilio" },
    { "value": "otro", "name": "Otro" },
  ]



  ngOnInit(): void {
    // console.log('Contrato', this.getData.id);
    this.initForm();
    this.checkMK(this.getData.routerId);

  }


  initForm() {
    this.formContrato = this.fb.group({
      id: ['',],
      enterprise_id: [this.enterprise, Validators.required],
      service_id: [this.getData.id, Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      reason: ['', Validators.required],
      observation: ['',],
      mikrotik: [true,],
      status: [true, Validators.required],
    });
  }

  get enterprise() {
    return Number(localStorage.getItem('enterprise_id'));
  }


  enviarDatos(): any {

    if (this.formContrato.valid) {
      this.suspensionService.addSuspension(this.formContrato.value).subscribe({
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
    this.snackbarService.showError('Ocurrio un error al suspender el contrato...');
  }

  showSuccess() {
    this.snackbarService.showSuccess('Contrato suspendido correctamente');
  }

  checkMK(idR: number) {
    this.routerService.getTestConnection(idR).subscribe({
      next: (respuesta) => {
        console.log(respuesta);
        // this.testMK = respuesta;
        if (respuesta.conectado === true) {
          this.statusMK = '🟢En línea';
          this.formContrato.get('mikrotik')?.setValue(true);

        } else {
          this.formContrato.get('mikrotik')?.setValue(false);
          this.statusMK = '🔴Desconectado';
        }
      },

      error: (error) => {
        this.formContrato.get('mikrotik')?.setValue(false);
        this.statusMK = '🔴Desconectado';
      },

    });

  }



}
