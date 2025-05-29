import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginResponse } from './Models/LoginResponse';
import { UserRequest } from './Models/UserRequest';
import { EmployeeResponse } from '../logistic/employee/models/EmployeeResponse';

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

  login(email: string, password: string, enterprise_id: number): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.API + 'login', { email, password, enterprise_id }, { headers: this.headers });
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

  getUsers(): Observable<EmployeeResponse> {
    return this.http.get<EmployeeResponse>(this.API + 'users', { headers: this.headers });
  }


  getUserByID(id: number): Observable<any> {
    return this.http.get(this.API + 'users/' + id, { headers: this.headers });
  }

  addUser(datos: UserRequest): Observable<any> {
    return this.http.post(this.API + 'users', datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }),
        catchError(err => {
          return throwError(() => err.error.message);
        })
      );
  }


  updateUser(id: number, datos: UserRequest): Observable<any> {
    return this.http.put(this.API + 'users/' + id, datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }


  updateRole(id: number, datos: any): Observable<any> {
    return this.http.put(this.API + 'role-user/' + id, datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }


  getRoleByID(id: number): Observable<any> {
    return this.http.get(this.API + 'role-user/' + id, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }


}
