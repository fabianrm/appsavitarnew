import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, Subject, tap, throwError } from 'rxjs';
import { Enterprise, EnterpriseRequest, EnterpriseResponse, RoleUserRequest } from './models';


@Injectable({
  providedIn: 'root'
})
export class EnterpriseService {

  private _refresh$ = new Subject<void>()

  API: string = environment.servidor;

  constructor(private clienteHttp: HttpClient) { }

  get refresh$() {
    return this._refresh$;
  }

  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });


  addEnterprise(enterprise: EnterpriseRequest, imageFile: File | null): Observable<any> {
    const url = `${this.API}enterprises`;
    const formData = new FormData();
    formData.append('name', enterprise.name);
    formData.append('ruc', enterprise.ruc);
    formData.append('cityId', enterprise.cityId.toString());
    formData.append('address', enterprise.address);
    formData.append('phone', enterprise.phone);
    formData.append('status', enterprise.status ? '1' : '0');

    // Adjuntar el archivo de imagen
    if (imageFile) {
      formData.append('logo', imageFile);
    }
    // Configurar headers
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.clienteHttp.post<Enterprise>(url, formData, { headers })
      .pipe(
        catchError(err => {
          return throwError(() => err.error);
        }),
      );

  }

  //Actualizar Producto
  updateEnterprise(enterprise: EnterpriseRequest, imageFile: File | null): Observable<Enterprise> {
    const url = `${this.API}enterprises/${enterprise.id}`;

    const formData = new FormData();
    formData.append('name', enterprise.name);
    formData.append('ruc', enterprise.ruc);
    formData.append('cityId', enterprise.cityId.toString());
    formData.append('address', enterprise.address);
    formData.append('phone', enterprise.phone);
    formData.append('status', enterprise.status ? '1' : '0');

    if (imageFile) {
      formData.append('logo', imageFile);
    }

    // Agrega el campo `_method` para simular el método PUT
    formData.append('_method', 'PUT');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.clienteHttp.post<Enterprise>(url, formData, { headers })
      .pipe(
        catchError(err => {
          return throwError(() => err.error);
        }),
      );
  }


  addRoleUser(datos: RoleUserRequest): Observable<any> {
    return this.clienteHttp.patch(this.API + 'add-admin', datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }),
        catchError(err => {
          return throwError(() => err.error.message);
        })
      );
  }




  getEnterpriseByID(id: number): Observable<Enterprise> {
    return this.clienteHttp.get<{ data: Enterprise }>(this.API + 'enterprises/' + id, { headers: this.headers })
      .pipe(
        map(response => response.data),
        catchError(err => {
          return throwError(() => err.error);
        }),
      )
  }


  getEnterprises(): Observable<EnterpriseResponse> {
    return this.clienteHttp.get<EnterpriseResponse>(this.API + 'enterprises', {
      headers: this.headers,
    });
  }


}

