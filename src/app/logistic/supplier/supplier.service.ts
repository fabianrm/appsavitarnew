import { Injectable } from '@angular/core';
import { SupplierResponse } from './models/SupplierResponse';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  private _refresh$ = new Subject<void>()

  API: string = environment.servidor;

  constructor(private clienteHttp: HttpClient) { }

  get refresh$() {
    return this._refresh$;
  }

  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });


  getSuppliers(): Observable<SupplierResponse> {
    return this.clienteHttp.get<SupplierResponse>(this.API + 'suppliers', { headers: this.headers })
  }
}
