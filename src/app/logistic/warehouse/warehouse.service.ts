import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { WarehouseResponse } from './models/WarehouseResponse';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {

  private _refresh$ = new Subject<void>()

  API: string = environment.servidor;

  constructor(private clienteHttp: HttpClient) { }

  get refresh$() {
    return this._refresh$;
  }

  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });


  getWarehouses(): Observable<WarehouseResponse> {
    return this.clienteHttp.get<WarehouseResponse>(this.API + 'warehouses', { headers: this.headers })
  }
}
