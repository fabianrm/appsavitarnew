import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
    "Content-Type": "application/json",
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  });


  getInvoices(status?: string, qCustomer?: string, qDesde?: string, qHasta?: string, page: number = 1, pageSize: number = 10): Observable<InvoiceResponse> {

    return this.clienteHttp.get<InvoiceResponse>(
      `${this.API}invoices/search?status=${status}&start_date=${qDesde}&end_date=${qHasta}&customer_name=${qCustomer}&page=${page}&perPage=${pageSize}`, { headers: this.headers });
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

  //Exportar facturas

  exportInvoices(filters: any) {
    let params = new HttpParams();
    if (filters.status) {
      params = params.append('status', filters.status);
    }
    if (filters.start_date) {
      params = params.append('start_date', filters.start_date);
    }
    if (filters.end_date) {
      params = params.append('end_date', filters.end_date);
    }
    if (filters.customer_name) {
      params = params.append('customer_name', filters.customer_name);
    }

    return this.clienteHttp.get(`${this.API}invoices/export`, {
      params,
      responseType: 'blob'
    });
  }


  //Ingresos
  getPaidInvoicesReport(startDate: string, endDate: string): Observable<any> {
    let params = new HttpParams()
      .set('start_date', startDate)
      .set('end_date', endDate);

    return this.clienteHttp.get(`${this.API}invoices/paid-report`, { params });
  }

}
