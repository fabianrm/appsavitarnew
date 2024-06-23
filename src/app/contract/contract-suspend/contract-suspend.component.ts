import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';
import { Service } from '../Models/ServiceResponse';
import { ContractService } from '../contract.service';

@Component({
  selector: 'app-contract-suspend',
  templateUrl: './contract-suspend.component.html',
  styleUrl: './contract-suspend.component.scss'
})
export class ContractSuspendComponent implements OnInit {

  formContrato!: FormGroup;

  constructor(public fb: FormBuilder,
    private snackbarService: SnackbarService,
    private contractService: ContractService,
    @Inject(MAT_DIALOG_DATA) public getData: Service,
    private dialogRef: MatDialogRef<ContractSuspendComponent>) { }
  
  
  ngOnInit(): void {
    // console.log('Contrato', this.getData.id);
    this.initForm();
  }
  
  
  initForm() {
    this.formContrato = this.fb.group({
      observation: ['', Validators.required],
    });
  }


  enviarDatos(): any {
    if (this.formContrato.valid) {
      //console.log('agregar....')
      this.contractService.suspendContract(this.getData.id, this.formContrato.value).subscribe(respuesta => {
        console.log('Contrato suspendido', respuesta);
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
