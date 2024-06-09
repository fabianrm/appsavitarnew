import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ReasonResponse } from './Models/ReasonResponse';
import { ReasonRequest } from './Models/ReasonRequest';

@Injectable({
  providedIn: 'root'
})
export class ReasonService {

  private _refresh$ = new Subject<void>()

  API: string = environment.servidor;

  constructor(private clienteHttp: HttpClient) { }

  get refresh$() {
    return this._refresh$;
  }

  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });



  getReasons(): Observable<ReasonResponse> {
    return this.clienteHttp.get<ReasonResponse>(this.API + 'reasons', { headers: this.headers })
  }

  addReason(datos: ReasonRequest): Observable<any> {
    return this.clienteHttp.post(this.API + 'reasons', datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }

  updateReason(id: number,datos: ReasonRequest): Observable<any> {
    return this.clienteHttp.put(this.API + 'reasons/'+ id, datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }

  suspendReason(id: number, status: any): Observable<any> {
    return this.clienteHttp.patch(`${this.API}reasons/${id}`, status, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }
  
}
