import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Service } from '../Models/ServiceResponse';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { ContractService } from '../contract.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-iptv',
  standalone: false,
  templateUrl: './change-iptv.component.html',
  styleUrl: './change-iptv.component.scss',
})
export class ChangeIptvComponent implements OnInit {
  formContrato!: FormGroup;

  constructor(
    public formulario: FormBuilder,
    private contractService: ContractService,
    private snackbarService: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public getData: Service[],
    private dialogRef: MatDialogRef<ChangeIptvComponent>,
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    const tieneIptv = this.getData[0].iptv;
    this.formContrato = this.formulario.group({
      iptv: [tieneIptv],
      userIptv: [
        { value: this.getData[0].userIptv, disabled: !tieneIptv },
        tieneIptv ? Validators.required : [],
      ],
      passIptv: [
        { value: this.getData[0].passIptv, disabled: !tieneIptv },
        tieneIptv ? Validators.required : [],
      ],
    });

    // Escuchar cambios en el checkbox
    this.formContrato.get('iptv')!.valueChanges.subscribe((activo: boolean) => {
      const userCtrl = this.formContrato.get('userIptv')!;
      const passCtrl = this.formContrato.get('passIptv')!;
      if (activo) {
        userCtrl.enable();
        passCtrl.enable();
        userCtrl.setValidators(Validators.required);
        passCtrl.setValidators(Validators.required);
      } else {
        userCtrl.disable();
        passCtrl.disable();
        userCtrl.clearValidators();
        passCtrl.clearValidators();
      }
      userCtrl.updateValueAndValidity();
      passCtrl.updateValueAndValidity();
    });
  }

  enviarDatos(): void {
    if (this.formContrato.valid) {
      const activo = this.formContrato.get('iptv')!.value;
      const dataToSend = {
        iptv: activo,
        userIptv: activo ? this.formContrato.get('userIptv')!.value : null,
        passIptv: activo ? this.formContrato.get('passIptv')!.value : null,
      };
      this.contractService
        .updateIptv(this.getData[0].id, dataToSend)
        .subscribe({
          next: () => {
            this.snackbarService.showSuccess(
              'Las credenciales IPTV se actualizaron correctamente',
            );
            this.dialogRef.close();
          },
          error: () => {
            this.snackbarService.showError(
              'Ocurrió un error al actualizar las credenciales IPTV',
            );
          },
        });
    }
  }
}
