import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SuspensionResponse, SuspensionSingleResponse } from './models/SuspensionResponse';
import { SuspensionRequest } from './models/SuspensionRequest';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SuspensionService {

  private _refresh$ = new Subject<void>()

  API: string = environment.servidor;

  constructor(private clienteHttp: HttpClient) { }

  get refresh$() {
    return this._refresh$;
  }

  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  getSuspensions(): Observable<SuspensionResponse> {
    return this.clienteHttp.get<SuspensionResponse>(this.API + 'suspensions', { headers: this.headers })
  }

  addSuspension(datos: SuspensionRequest): Observable<SuspensionSingleResponse> {
    const formattedEntry = {
      ...datos,
      start_date: datos.start_date instanceof Date
        ? formatDate(datos.start_date, 'yyyy-MM-dd', 'en-US')
        : datos.start_date,
      end_date: datos.end_date instanceof Date
        ? formatDate(datos.end_date, 'yyyy-MM-dd', 'en-US')
        : datos.end_date,
    };

    return this.clienteHttp.post<SuspensionSingleResponse>(this.API + 'suspensions', formattedEntry, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }),
        catchError(err => {
          return throwError(() => err.error.message);
        }),);
  }

  //reactivar el contrato
  reactiveService(id: number, mk: number): Observable<any> {
    return this.clienteHttp.patch(`${this.API}suspensions/${id}/reactive`, { mikrotik: mk }, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }),
        catchError(err => {
          return throwError(() => err.error.message);
        }),);
  }


  //reactivar el contrato
  finishService(id: number, mk: number): Observable<any> {
    return this.clienteHttp.patch(`${this.API}services/${id}/finish`, { mikrotik: mk }, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }),
        catchError(err => {
          return throwError(() => err.error.message);
        }),);
  }

}
