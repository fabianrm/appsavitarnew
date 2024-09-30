import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { KardexResponse, KardexSingleResponse } from './models/KardexResponse';

@Injectable({
  providedIn: 'root'
})
export class KardexService {

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


  getKardex(): Observable<KardexResponse> {
    return this.clienteHttp.get<KardexResponse>(this.API + 'kardex', { headers: this.headers })
  }

  getKardexByID(id: number,): Observable<KardexResponse> {
    return this.clienteHttp.get<KardexResponse>(this.API + 'kardex/' + id, { headers: this.headers })
  }

}
