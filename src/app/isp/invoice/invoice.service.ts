import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { InvoiceResponse } from './Models/InvoiceResponse';
import { RequestPaid } from './Models/RequestPaid';
import { saveAs } from 'file-saver';


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


  //TODO:Agregar parametro de ciudad
  getInvoices(status?: string, qCustomer?: string, qDesde?: string, qHasta?: string, qCity?: string, page: number = 1, pageSize: number = 10): Observable<InvoiceResponse> {

    return this.clienteHttp.get<InvoiceResponse>(
      `${this.API}invoices/search?status=${status}&start_date=${qDesde}&end_date=${qHasta}&customer_name=${qCustomer}&city_id=${qCity}&page=${page}&perPage=${pageSize}`, { headers: this.headers });
  }


  generateInvoices(): Observable<any> {
    return this.clienteHttp.post<any>(this.API + 'invoices/generate', { headers: this.headers })
  }


  // paidInvoice(invoiceID: number, datos: RequestPaid): Observable<RequestPaid> {
  //   return this.clienteHttp.patch<RequestPaid>(`${this.API}invoices/${invoiceID}`, datos, { headers: this.headers })
  //     .pipe(tap(() => {
  //       this._refresh$.next()
  //     }));
  // }

  paidInvoice(invoiceID: number, datos: RequestPaid): Observable<RequestPaid> {
    return this.clienteHttp.patch<RequestPaid>(`${this.API}invoices/${invoiceID}/paid-invoice`, datos, { headers: this.headers })
      .pipe(
        catchError(err => {
          return throwError(() => err.error.message);
        }),
        tap(() => {
          this._refresh$.next()
        })
      )
  }


  //Anular factura

  cancelInvoice(invoiceID: number, datos: any): Observable<any> {
    return this.clienteHttp.patch<any>(`${this.API}invoices/${invoiceID}/cancel-invoice`, datos, { headers: this.headers })
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
    if (filters.city_id) {
      params = params.append('city_id', filters.city_id);
    }
    return this.clienteHttp.get(`${this.API}invoices/export`, {
      params,
      responseType: 'blob'
    });
  }


  //Export facturas resumen
  exportInvoicesResumen(filters: any) {
    let params = new HttpParams();

    if (filters.start_date) {
      params = params.append('start_date', filters.start_date);
    }
    if (filters.end_date) {
      params = params.append('end_date', filters.end_date);
    }

    return this.clienteHttp.get(`${this.API}invoices/export-resumen`, {
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

  //Recibo
  printInvoice(id: number,): Observable<any> {
    let params = new HttpParams()
      .set('id', id)

    return this.clienteHttp.get<any>(`${this.API}invoices/${id}/receipt`, { headers: this.headers });
  }

  downloadInvoicePDF(invoiceId: number): Observable<Blob> {

    const url = `${this.API}invoices/${invoiceId}/receipt`;
    return this.clienteHttp.get(url, { responseType: 'blob' });
  }

  savePDF(blob: Blob, filename: string) {
    saveAs(blob, filename);
  }

}
