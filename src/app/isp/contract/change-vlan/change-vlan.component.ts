import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterService } from '../../router/router.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Service } from '../Models/ServiceResponse';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { ContractService } from '../contract.service';
import { ReqRouter, ResponseRouter } from '../../router/Models/ResponseRouter';

@Component({
  selector: 'app-change-vlan',
  templateUrl: './change-vlan.component.html',
  styleUrl: './change-vlan.component.scss'
})
export class ChangeVlanComponent {

  constructor(
    public formulario: FormBuilder,
    private routerService: RouterService,

    private contractService: ContractService,
    private snackbarService: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public getData: Service[],
    private dialogRef: MatDialogRef<ChangeVlanComponent>) { }

  formContrato!: FormGroup;
  routers: ReqRouter[] = [];


  ngOnInit(): void {
    this.initForm();
    this.getRouters();
  }


  initForm() {
    const formControlsConfig = {
      routerId: [this.getData[0].routerId, Validators.required],
    }
    this.formContrato = this.formulario.group(formControlsConfig);

  }


  //Vlan, caja , port
  getRouters() {
    this.routerService.getRouters().subscribe((respuesta: ResponseRouter) => {
      if (respuesta.data.length > 0) {
        this.routers = respuesta.data;
      }
    });
  }

  enviarDatos(): any {

    const formData = this.formContrato.value;

    if (this.formContrato.valid) {
      this.contractService.updateVlanCustomer(this.getData[0].id, formData).subscribe(respuesta => {
        this.showSuccess();
        this.dialogRef.close();
      });
    }
  }

  showError() {
    this.snackbarService.showError('Ocurrio un error al actualizar los datos...');
  }

  showSuccess() {
    this.snackbarService.showSuccess('Los datos se actualizarón correctamente');
  }

}
