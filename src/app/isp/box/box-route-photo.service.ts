import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BoxRoutePhoto, BoxRoutePhotoResponse } from './Models/BoxRoutePhoto';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BoxRoutePhotoService {
  private apiUrl = `${environment.servidor}box-routes`;
  private photoApiUrl = `${environment.servidor}box-route-photos`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders().set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token'),
    );
  }

  uploadPhoto(routeId: number, file: File): Observable<BoxRoutePhotoResponse> {
    const formData = new FormData();
    formData.append('photo', file);

    const headers = this.getHeaders();
    return this.http.post<BoxRoutePhotoResponse>(
      `${this.apiUrl}/${routeId}/photos`,
      formData,
      { headers },
    );
  }

  getPhotos(routeId: number): Observable<BoxRoutePhoto[]> {
    const headers = this.getHeaders();
    return this.http.get<BoxRoutePhoto[]>(`${this.apiUrl}/${routeId}/photos`, {
      headers,
    });
  }

  deletePhoto(photoId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete<any>(`${this.photoApiUrl}/${photoId}`, { headers });
  }

  getPhotoUrl(photoId: number): string {
    return `${environment.servidor_img}api/v1/box-route-photos/${photoId}/view`;
  }
}
