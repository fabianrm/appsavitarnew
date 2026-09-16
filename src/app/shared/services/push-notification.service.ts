import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { environment } from '../../../environments/environment';

const TECHNICIAN_ROLE_ID = '4';
const SUBSCRIBED_FLAG = 'push_subscribed';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  API: string = environment.servidor;

  constructor(private swPush: SwPush, private http: HttpClient) {}

  subscribeIfTechnician(): void {
    if (!this.swPush.isEnabled) {
      return;
    }
    if (localStorage.getItem('role') !== TECHNICIAN_ROLE_ID) {
      return;
    }
    if (localStorage.getItem(SUBSCRIBED_FLAG) === 'true') {
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    this.http
      .get<{ publicKey: string }>(this.API + 'push/public-key', { headers })
      .subscribe({
        next: ({ publicKey }) => {
          this.swPush
            .requestSubscription({ serverPublicKey: publicKey })
            .then((subscription) => {
              this.http
                .post(this.API + 'push/subscribe', subscription.toJSON(), { headers })
                .subscribe({
                  next: () => localStorage.setItem(SUBSCRIBED_FLAG, 'true'),
                  error: (err) => console.warn('No se pudo registrar la suscripción push', err),
                });
            })
            .catch((err) => console.warn('Permiso de notificaciones no concedido', err));
        },
        error: (err) => console.warn('No se pudo obtener la llave pública VAPID', err),
      });
  }
}
