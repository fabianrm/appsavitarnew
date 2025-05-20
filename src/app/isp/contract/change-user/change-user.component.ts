import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Service } from '../Models/ServiceResponse';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { ContractService } from '../contract.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-change-user',
    templateUrl: './change-user.component.html',
    styleUrl: './change-user.component.scss',
    standalone: false
})
export class ChangeUserComponent {

  constructor(
    public formulario: FormBuilder,
 
    private contractService: ContractService,
    private snackbarService: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public getData: Service[],
    private dialogRef: MatDialogRef<ChangeUserComponent>) { }


  formContrato!: FormGroup;



  ngOnInit() {
    this.initForm();
  }



  initForm() {
    const formControlsConfig = {
    
      userPppoe: [this.getData[0].userPppoe],
      passPppoe: [this.getData[0].passPppoe],
    }
    this.formContrato = this.formulario.group(formControlsConfig);
    //this.formContrato.setValue({ 'equipmentId': this.getData[0].equipmentSerie });

  }


  enviarDatos(): any {

    const formData = this.formContrato.value;

    const dataToSend = {
      ...formData,
  
    };

    if (this.formContrato.valid) {
      this.contractService.updateUser(this.getData[0].id, dataToSend).subscribe(respuesta => {
        // console.log(respuesta);
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
