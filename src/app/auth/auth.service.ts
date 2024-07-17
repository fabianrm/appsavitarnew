import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginResponse } from './Models/LoginResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _refresh$ = new Subject<void>()

  API: string = environment.servidor;

  constructor(private http: HttpClient) { }

  get refresh$() {
    return this._refresh$;
  }

  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.API + 'login', { email, password }, { headers: this.headers });
  }

  register(data: any): Observable<any> {
    return this.http.post<any>(this.API + 'register', data, { headers: this.headers });
  }

  logout(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.delete<any>(this.API + 'logout', { headers });
  }

  getUserPermissions(): Observable<any> { 
    return this.http.get<any>(this.API + 'user/permissions', { headers: this.headers });
  }

}
