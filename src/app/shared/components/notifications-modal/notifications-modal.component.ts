import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { NotificationService } from '../../services/notification.service';
import { AppNotification, PaginatedNotifications } from '../../models/notification.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatPaginatorModule
  ],
  templateUrl: './notifications-modal.component.html',
  styleUrls: ['./notifications-modal.component.scss']
})
export class NotificationsModalComponent implements OnInit, OnDestroy {
  notifications: PaginatedNotifications | null = null;
  isLoading = false;
  private sub?: Subscription;

  constructor(
    public dialogRef: MatDialogRef<NotificationsModalComponent>,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
    
    // Reload if something changes (e.g. from the bell)
    this.sub = this.notificationService.notificationsUpdated$.subscribe(() => {
      if (this.notifications) {
        this.loadNotifications(this.notifications.current_page);
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  loadNotifications(page: number = 1): void {
    this.isLoading = true;
    this.notificationService.getAllNotifications(page).subscribe({
      next: (res) => {
        this.notifications = res;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    // MatPaginator is 0-indexed, API is 1-indexed
    this.loadNotifications(event.pageIndex + 1);
  }

  markAsRead(notification: AppNotification): void {
    if (!notification.read_at) {
      this.notificationService.markAsRead(notification.id).subscribe();
      // Optimistic update
      notification.read_at = new Date().toISOString();
    }
    
    // Close modal and navigate
    this.dialogRef.close();
    this.router.navigate(['/support/tickets', notification.data.ticket_id]);
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe();
    if (this.notifications) {
      this.notifications.data.forEach(n => {
        if (!n.read_at) {
          n.read_at = new Date().toISOString();
        }
      });
    }
  }
}
