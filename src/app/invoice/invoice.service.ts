import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { InvoiceResponse } from './Models/InvoiceResponse';


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


  getInvoices(page: number = 1, pageSize: number = 15): Observable<InvoiceResponse> {
    return this.clienteHttp.get<InvoiceResponse>(`${this.API}invoices?page=${page}&perPage=${pageSize}`, { headers: this.headers })
  }


}
