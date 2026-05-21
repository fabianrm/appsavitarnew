import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AppNotification, PaginatedNotifications } from '../models/notification.model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = environment.servidor + 'notifications';
  
  // Subject to notify components when notifications are read/updated
  public notificationsUpdated$ = new Subject<void>();

  constructor(private http: HttpClient) {}

  getAllNotifications(page: number = 1): Observable<PaginatedNotifications> {
    const params = new HttpParams().set('page', page.toString());
    return this.http.get<PaginatedNotifications>(this.apiUrl, { params });
  }

  getUnreadNotifications(): Observable<AppNotification[]> {
    return this.http.get<AppNotification[]>(`${this.apiUrl}/unread`);
  }

  markAsRead(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/read`, {}).pipe(
      tap(() => this.notificationsUpdated$.next())
    );
  }

  markAllAsRead(): Observable<any> {
    return this.http.post(`${this.apiUrl}/mark-all-read`, {}).pipe(
      tap(() => this.notificationsUpdated$.next())
    );
  }
}
