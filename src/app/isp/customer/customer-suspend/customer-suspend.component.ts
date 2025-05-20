import { Component, Inject } from '@angular/core';
import { CustomerService } from '../customer.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Service } from '../../contract/Models/ServiceResponse';
import { ContractSuspendComponent } from '../../contract/contract-suspend/contract-suspend.component';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { Customer } from '../Models/CustomerResponseU_bak';

@Component({
    selector: 'app-customer-suspend',
    templateUrl: './customer-suspend.component.html',
    styleUrl: './customer-suspend.component.scss',
    standalone: false
})
export class CustomerSuspendComponent {
  formContrato!: FormGroup;

  constructor(public fb: FormBuilder,
    private snackbarService: SnackbarService,
    private customerService: CustomerService,
    @Inject(MAT_DIALOG_DATA) public getData: Customer,
    private dialogRef: MatDialogRef<ContractSuspendComponent>) { }


  ngOnInit(): void {
    // console.log('Contrato', this.getData.id);
    this.initForm();
  }


  initForm() {
    this.formContrato = this.fb.group({
      status: [0, Validators.required],
      observation: ['', Validators.required],
    });
  }


  enviarDatos(): any {
    if (this.formContrato.valid) {
      //console.log('agregar....')
      this.customerService.suspendOrActivateCustomer(this.getData.id, this.formContrato.value).subscribe(respuesta => {
        this.showSuccess();
        this.dialogRef.close();
      });
    }
  }

  showError() {
    this.snackbarService.showError('Ocurrio un error al suspender el contrato...');
  }

  showSuccess() {
    this.snackbarService.showSuccess('Contrato suspendido correctamente');
  }


}
