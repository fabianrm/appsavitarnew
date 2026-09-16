import { Component, OnInit } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';
import Swal from 'sweetalert2';
import { PushNotificationService } from './shared/services/push-notification.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    standalone: false
})
export class AppComponent implements OnInit {
  title = 'SAVITAR ISP';

  constructor(private swUpdate: SwUpdate, private pushNotificationService: PushNotificationService) {}

  ngOnInit(): void {
    this.pushNotificationService.subscribeIfTechnician();

    if (!this.swUpdate.isEnabled) {
      return;
    }

    this.swUpdate.versionUpdates
      .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
      .subscribe(() => {
        Swal.fire({
          title: 'Nueva versión disponible',
          text: 'Hay una actualización de Savitar lista para usar.',
          icon: 'info',
          confirmButtonText: 'Actualizar ahora',
          allowOutsideClick: false,
        }).then(() => {
          document.location.reload();
        });
      });
  }
}
