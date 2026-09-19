import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EnterpriseService } from '../../enterprise/enterprise.service';

@Component({
  selector: 'app-settings-notifications',
  templateUrl: './settings-notifications.component.html',
  styleUrl: './settings-notifications.component.css',
  standalone: false
})
export class SettingsNotificationsComponent implements OnInit {

  form: FormGroup;
  enterpriseId?: number;

  loading = true;
  saving = false;
  testing = false;
  testResult: { success: boolean; message: string } | null = null;

  constructor(
    private fb: FormBuilder,
    private enterpriseService: EnterpriseService,
    private snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      telegramBotToken: [''],
      telegramChatId: [''],
    });
  }

  ngOnInit(): void {
    this.enterpriseService.getMyEnterprise().subscribe({
      next: (enterprise) => {
        this.loading = false;
        this.enterpriseId = enterprise.id;
        this.form.patchValue({
          telegramBotToken: enterprise.telegramBotToken ?? '',
          telegramChatId: enterprise.telegramChatId ?? '',
        });
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  get canTest(): boolean {
    return !!this.form.value.telegramBotToken && !!this.form.value.telegramChatId;
  }

  save(): void {
    if (!this.enterpriseId) return;

    this.saving = true;
    this.testResult = null;
    this.enterpriseService.updateTelegramConfig(this.enterpriseId, this.form.value).subscribe({
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
    this.enterpriseService.testTelegram().subscribe({
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
