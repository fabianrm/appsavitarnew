import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription, interval, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { EnterpriseService } from '../../enterprise/enterprise.service';

const MAX_POLL_ATTEMPTS = 40; // ~2.5 min a 4s por intento

@Component({
  selector: 'app-settings-whatsapp',
  templateUrl: './settings-whatsapp.component.html',
  styleUrl: './settings-whatsapp.component.css',
  standalone: false
})
export class SettingsWhatsappComponent implements OnInit, OnDestroy {

  form: FormGroup;
  enterpriseId?: number;

  loading = true;
  saving = false;
  testing = false;
  testPhone = '';
  testResult: { success: boolean; message: string } | null = null;
  hidePassword = true;

  // Estado de conexión con Evolution API (crear instancia + escanear QR)
  checkingConnection = false;
  connectionState: string | null = null;
  creatingInstance = false;
  cancelling = false;
  qrCode: string | null = null;
  qrError: string | null = null;
  private pollSub?: Subscription;
  private pollAttempts = 0;

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
    this.loadEnterprise();
  }

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
  }

  private loadEnterprise(): void {
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

        if (enterprise.waInstance) {
          this.checkConnectionState();
        }
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  get hasInstance(): boolean {
    return !!this.form.value.waInstance;
  }

  get canTest(): boolean {
    return !!this.form.value.waInstance && !!this.form.value.waApiKey && !!this.testPhone;
  }

  checkConnectionState(): void {
    this.checkingConnection = true;
    this.enterpriseService.getWhatsappConnectionState().subscribe({
      next: (res) => {
        this.checkingConnection = false;
        this.connectionState = res.state;
      },
      error: () => {
        this.checkingConnection = false;
        this.connectionState = 'unknown';
      },
    });
  }

  createInstance(): void {
    this.creatingInstance = true;
    this.qrError = null;
    this.enterpriseService.createWhatsappInstance().subscribe({
      next: (res) => {
        this.creatingInstance = false;
        this.qrCode = res.qrcode;
        this.loadEnterprise();
        this.startPolling();
      },
      error: (err) => {
        this.creatingInstance = false;
        this.qrError = err?.message ?? 'No se pudo crear la instancia.';
      },
    });
  }

  reconnect(): void {
    this.creatingInstance = true;
    this.qrError = null;
    this.enterpriseService.reconnectWhatsapp().subscribe({
      next: (res) => {
        this.creatingInstance = false;
        this.qrCode = res.qrcode;
        this.startPolling();
      },
      error: (err) => {
        this.creatingInstance = false;
        this.qrError = err?.message ?? 'No se pudo generar un nuevo código QR.';
      },
    });
  }

  private startPolling(): void {
    this.pollSub?.unsubscribe();
    this.pollAttempts = 0;

    this.pollSub = interval(4000)
      .pipe(
        switchMap(() =>
          this.enterpriseService.getWhatsappConnectionState().pipe(
            // Un fallo puntual (red, timeout) no debe matar el polling --
            // se trata como "aún no sabemos" y se sigue intentando.
            catchError(() => of({ state: 'unknown' })),
          ),
        ),
      )
      .subscribe((res) => {
        this.pollAttempts++;
        this.connectionState = res.state;

        if (res.state === 'open') {
          this.qrCode = null;
          this.pollSub?.unsubscribe();
          this.snackBar.open('WhatsApp conectado correctamente', 'Cerrar', { duration: 4000 });
        } else if (this.pollAttempts >= MAX_POLL_ATTEMPTS) {
          this.pollSub?.unsubscribe();
          this.qrError = 'No se detectó la conexión. Genera un nuevo código QR e intenta de nuevo.';
          this.qrCode = null;
        }
      });
  }

  cancelInstance(): void {
    this.cancelling = true;
    this.pollSub?.unsubscribe();

    this.enterpriseService.cancelWhatsappInstance().subscribe({
      next: () => {
        this.cancelling = false;
        this.qrCode = null;
        this.qrError = null;
        this.connectionState = null;
        this.loadEnterprise();
      },
      error: (err) => {
        this.cancelling = false;
        this.qrError = err?.message ?? 'No se pudo cancelar.';
      },
    });
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
