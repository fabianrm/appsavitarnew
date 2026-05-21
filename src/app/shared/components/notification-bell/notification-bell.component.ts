import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NotificationService } from '../../services/notification.service';
import { AppNotification } from '../../models/notification.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationsModalComponent } from '../notifications-modal/notifications-modal.component';
import { MatDivider } from "@angular/material/divider";

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatMenuModule,
    MatDialogModule,
    MatDivider
  ],
  templateUrl: './notification-bell.component.html',
  styleUrls: ['./notification-bell.component.scss']
})
export class NotificationBellComponent implements OnInit, OnDestroy {
  unreadNotifications: AppNotification[] = [];
  unreadCount = 0;
  private sub?: Subscription;

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadUnreadNotifications();

    this.sub = this.notificationService.notificationsUpdated$.subscribe(() => {
      this.loadUnreadNotifications();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  loadUnreadNotifications(): void {
    this.notificationService.getUnreadNotifications().subscribe({
      next: (res) => {
        this.unreadNotifications = res;
        this.unreadCount = res.length;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading notifications', err)
    });
  }

  markAsRead(notification: AppNotification): void {
    this.notificationService.markAsRead(notification.id).subscribe();
    // Navigate to ticket
    this.router.navigate(['/support/tickets', notification.data.ticket_id]);
  }

  markAllAsRead(event: Event): void {
    event.stopPropagation();
    this.notificationService.markAllAsRead().subscribe();
  }

  openAllNotificationsModal(): void {
    this.dialog.open(NotificationsModalComponent, {
      width: '600px',
      maxWidth: '95vw',
      panelClass: 'notifications-dialog-panel'
    });
  }
}
