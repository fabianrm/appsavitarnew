import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { InvoiceResponse } from './Models/InvoiceResponse';
import { RequestPaid } from './Models/RequestPaid';


@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private _refresh$ = new Subject<void>()

  API: string = environment.servidor;

  constructor(private clienteHttp: HttpClient) { }

  get refresh$() {
    return this._refresh$;
  }

  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });


  getInvoices(status?: string, qCustomer?: string, page: number = 1, pageSize: number = 15): Observable<InvoiceResponse> {

    return this.clienteHttp.get<InvoiceResponse>(`${this.API}invoices/search?status=${status}&customer_name=${qCustomer}&page=${page}&perPage=${pageSize}`, { headers: this.headers });


    // if (status != "") {
    //   return this.clienteHttp.get<InvoiceResponse>(`${this.API}invoices/search?status=${status}&page=${page}&perPage=${pageSize}`, { headers: this.headers });
    // } else {
    //   return this.clienteHttp.get<InvoiceResponse>(`${this.API}invoices/search?page=${page}&perPage=${pageSize}`, { headers: this.headers });
    // }



  }


  generateInvoices(): Observable<any> {
    return this.clienteHttp.post<any>(this.API + 'invoices/generate', { headers: this.headers })
  }


  paidInvoice(invoiceID: number, datos: RequestPaid): Observable<RequestPaid> {
    return this.clienteHttp.patch<RequestPaid>(`${this.API}invoices/${invoiceID}`, datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }

}
