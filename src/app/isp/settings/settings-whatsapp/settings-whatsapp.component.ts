import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EnterpriseService } from '../../enterprise/enterprise.service';

@Component({
  selector: 'app-settings-whatsapp',
  templateUrl: './settings-whatsapp.component.html',
  styleUrl: './settings-whatsapp.component.css',
  standalone: false
})
export class SettingsWhatsappComponent implements OnInit {

  form: FormGroup;
  enterpriseId?: number;

  loading = true;
  saving = false;
  testing = false;
  testPhone = '';
  testResult: { success: boolean; message: string } | null = null;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private enterpriseService: EnterpriseService,
    private snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      whatsappRemindersEnabled: [true],
      waInstance: [''],
      waApiKey: [''],
      waReminderDaysBefore: [7, [Validators.min(1), Validators.max(30)]],
      waPaymentInfo: [''],
      waMessageTemplateDue: [''],
      waMessageTemplateOverdue: [''],
    });
  }

  ngOnInit(): void {
    this.enterpriseService.getMyEnterprise().subscribe({
      next: (enterprise) => {
        this.loading = false;
        this.enterpriseId = enterprise.id;
        this.form.patchValue({
          whatsappRemindersEnabled: enterprise.whatsappRemindersEnabled,
          waInstance: enterprise.waInstance ?? '',
          waApiKey: enterprise.waApiKey ?? '',
          waReminderDaysBefore: enterprise.waReminderDaysBefore ?? 7,
          waPaymentInfo: enterprise.waPaymentInfo ?? '',
          waMessageTemplateDue: enterprise.waMessageTemplateDue ?? '',
          waMessageTemplateOverdue: enterprise.waMessageTemplateOverdue ?? '',
        });
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  get canTest(): boolean {
    return !!this.form.value.waInstance && !!this.form.value.waApiKey && !!this.testPhone;
  }

  save(): void {
    if (!this.enterpriseId) return;

    this.saving = true;
    this.testResult = null;
    this.enterpriseService.updateWhatsappConfig(this.enterpriseId, this.form.value).subscribe({
      next: () => {
        this.saving = false;
        this.snackBar.open('Configuración guardada', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.saving = false;
        this.snackBar.open('No se pudo guardar la configuración', 'Cerrar', { duration: 4000 });
      },
    });
  }

  sendTest(): void {
    this.testing = true;
    this.testResult = null;
    this.enterpriseService.testWhatsapp(this.testPhone).subscribe({
      next: (res) => {
        this.testing = false;
        this.testResult = res;
      },
      error: (err) => {
        this.testing = false;
        this.testResult = err ?? { success: false, message: 'No se pudo enviar el mensaje de prueba.' };
      },
    });
  }
}
