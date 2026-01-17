import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


import { BoxRouteResponse } from './Models/BoxRouteResponse';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BoxRouteService {
  private apiUrl = `${environment.servidor}box-routes`;

  constructor(private http: HttpClient) { }

  getRoutes(): Observable<BoxRouteResponse> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.get<BoxRouteResponse>(this.apiUrl, { headers });
  }

  storeRoute(data: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.post<any>(this.apiUrl, data, { headers });
  }

  showRoute(id: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers });
  }

  updateRoute(id: number, data: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.put<any>(`${this.apiUrl}/${id}`, data, { headers });
  }

  deleteRoute(id: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers });
  }
}
