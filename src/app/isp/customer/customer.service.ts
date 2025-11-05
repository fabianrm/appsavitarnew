import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, Subject, catchError, map, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CustomerRequest } from './Models/CustomerRequest';

import { CustomerResponseU } from './Models/CustomerResponseU';
import { CustomerResponse } from './Models/CustomerResponse';
import { Historical } from './Models/Historical';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

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

  getCustomers(): Observable<CustomerResponse> {
    return this.clienteHttp.get<CustomerResponse>(this.API + 'customers', { headers: this.headers })
  }

  getCustomersPipe(): Observable<any> {
    return this.clienteHttp.get(this.API + 'customers', { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }

  addCustomer(datos: CustomerRequest): Observable<any> {
    return this.clienteHttp.post(this.API + 'customers', datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }

  updateCustomer(id: number, datos: CustomerRequest): Observable<any> {
    return this.clienteHttp.put(this.API + 'customers/' + id, datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }

  //Suspender o activar el cliente
  suspendCustomer(id: number, data: any,): Observable<any> {
    return this.clienteHttp.patch(`${this.API}customers/${id}/suspend`, data, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }

  //Activar el cliente
  activateCustomer(id: number,): Observable<any> {
    return this.clienteHttp.patch(`${this.API}customers/${id}/activate`, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }




  deleteCustomer1(id: number): Observable<any> {
    return this.clienteHttp.delete(this.API + 'customers/' + id, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }

  deleteCustomer(id: number): Observable<any> {
    return this.clienteHttp.delete(this.API + 'customers/' + id, { headers: this.headers })
      .pipe(
        catchError(error => {
          return of({
            data: {
              status: false,
              message: error.message || 'Error desconocido al eliminar cliente'
            }
          });
        }), tap(() => {
          this._refresh$.next()
        })
      );
  }

  getCustomerById(id: number): Observable<CustomerResponseU> {
    return this.clienteHttp.get<CustomerResponseU>(`${this.API}customers/${id}?includeServices=true`, { headers: this.headers });
  }

  getCustomerByDocument(document: string): Observable<any> {
    return this.clienteHttp.get<any>(`${this.API}customers/check-exists?documentNumber=${document}`, { headers: this.headers });
  }

  exportCustomers() {
    return this.clienteHttp.get(this.API + 'export-customers', { responseType: 'blob' });
  }

  getCustomerByDNI(dni: string) {
    const headers: HttpHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer 546055cac6cf4b7ebb0ba79b86cd86ece522e23686314f7f848da2883d8af6ea',
    });
    return this.clienteHttp.post<any>(`https://apiperu.dev/api/dni?dni=${dni}`, { headers: headers });
  }

  getHistory(id: number): Observable<Historical> {
    return this.clienteHttp.get<Historical>(`${this.API}customers/${id}/historical-summary`, { headers: this.headers });
  }


}
