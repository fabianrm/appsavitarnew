import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { SummaryResponse } from './Models/SummaryResponse';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

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


  getSummary(): Observable<SummaryResponse> {
    return this.clienteHttp.get<SummaryResponse>(this.API + 'summary', { headers: this.headers })
  }

}
