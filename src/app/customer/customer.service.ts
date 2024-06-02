import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, Subject, map, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Customer, CustomerResponse } from './Models/CustomerResponse';
import { CustomerRequest } from './Models/CustomerRequest';

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

  // getCustomerByID(id: number): Observable<Customer> {
  //   return this.clienteHttp.get<CustomerResponse>(this.API + 'customers/' + id, { headers: this.headers })
  //     .pipe(map(response =>response.data));
  // }


  getCustomerById(id: number): Observable<Customer> {
    return this.clienteHttp.get<any>(`${this.API}customers/${id}`, { headers: this.headers }).pipe(
      map(response => response.data)  // Asumiendo que `data` es un array y queremos el primer elemento
    );
  }



  exportCustomers() {
    return this.clienteHttp.get(this.API + 'export-customers', { responseType: 'blob' });
  }




}
