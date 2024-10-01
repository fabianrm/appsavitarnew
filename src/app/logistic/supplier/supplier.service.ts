import { Injectable } from '@angular/core';
import { SupplierResponse, SupplierSingleResponse } from './models/SupplierResponse';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SupplierRequest } from './models/SupplierRequest';

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

  getSupplierById(id: number,): Observable<SupplierSingleResponse> {
    return this.clienteHttp.get<SupplierSingleResponse>(this.API + 'suppliers/' + id, { headers: this.headers })
  }

  addSupplier(datos: SupplierRequest): Observable<any> {
    return this.clienteHttp.post(this.API + 'suppliers/', datos, { headers: this.headers })
      .pipe(
        catchError(error => {
          return of({
            data: {
              status: false,
              message: error.message || 'Error desconocido al registrar el proveedor'
            }
          });
        }), tap(() => {
          this._refresh$.next()
        })
      );
  }

  updateSupplier(id: number, datos: SupplierRequest): Observable<any> {
    return this.clienteHttp.put(this.API + 'suppliers/' + id, datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }


  deleteSupplier(id: number): Observable<any> {
    return this.clienteHttp.delete(this.API + 'suppliers/' + id, { headers: this.headers })
      .pipe(
        catchError(error => {
          return of({
            data: {
              status: false,
              message: error.message || 'Error desconocido al eliminar Proveedor'
            }
          });
        }), tap(() => {
          this._refresh$.next()
        })
      );
  }


}
