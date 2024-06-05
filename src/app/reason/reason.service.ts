import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { ReasonResponse } from './Models/ReasonResponse';

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
  
}
