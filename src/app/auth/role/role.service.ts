import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RoleResponse } from './Models/RoleResponse';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private _refresh$ = new Subject<void>()

  API: string = environment.servidor;

  constructor(private clienteHttp: HttpClient) { }

  get refresh$() {
    return this._refresh$;
  }

  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });


  getRoles(): Observable<any> {
    return this.clienteHttp.get<RoleResponse>(this.API + 'roles', { headers: this.headers })
  }

  addRole(datos: RoleResponse): Observable<any> {
    return this.clienteHttp.post(this.API + 'roles', datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }


  updateRole(id: number, datos: RoleResponse): Observable<any> {
    return this.clienteHttp.put(this.API + 'roles/' + id, datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }

  getRoleByID(id: number): Observable<any> {
    return this.clienteHttp.get(this.API + 'roles/' + id, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }

}
