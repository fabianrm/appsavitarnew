import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, Subject, tap, throwError } from 'rxjs';
import { Enterprise, EnterpriseResponse } from './Models/EnterpriseResponse';


@Injectable({
  providedIn: 'root'
})
export class EnterpriseService {

  private _refresh$ = new Subject<void>()

  API: string = environment.servidor;

  constructor(private clienteHttp: HttpClient) { }

  get refresh$() {
    return this._refresh$;
  }

  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });


  addEnterprise(datos: any): Observable<any> {
    return this.clienteHttp.post(this.API + 'enterprises', datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }

  updateEnterprise(id: number, datos: any): Observable<any> {
    return this.clienteHttp.put(this.API + 'enterprises/' + id, datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }

  getEnterpriseByID(id: number): Observable<Enterprise> {
    return this.clienteHttp.get<{ data: Enterprise }>(this.API + 'enterprises/' + id, { headers: this.headers })
      .pipe(
        map(response => response.data),
        catchError(err => {
          return throwError(() => err.error);
        }),
      )
  }


  getEnterprises(): Observable<EnterpriseResponse> {
    return this.clienteHttp.get<EnterpriseResponse>(this.API + 'enterprises', {
      headers: this.headers,
    });
  }


}

