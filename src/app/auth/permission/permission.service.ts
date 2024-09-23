import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PermissionResponse } from './Models/PermissionResponse';
import { PermissionRoleResponse } from './Models/PermissionRoleResponse';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  private _refresh$ = new Subject<void>()

  API: string = environment.servidor;

  constructor(private clienteHttp: HttpClient) { }

  get refresh$() {
    return this._refresh$;
  }

  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json",
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  });


  getPermissions(): Observable<PermissionResponse> {
    return this.clienteHttp.get<PermissionResponse>(this.API + 'permissions', { headers: this.headers })
  }


  getPermissionsByID(roleID: number): Observable<PermissionRoleResponse> {
    return this.clienteHttp.get<PermissionRoleResponse>(`${this.API}roles/${roleID}/permissions`, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }

  addPermissions(roleID: number, datos: number[]): Observable<any> {
    return this.clienteHttp.post<any>(`${this.API}roles/${roleID}/permissions`, datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }
}
