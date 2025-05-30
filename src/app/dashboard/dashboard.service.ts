import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { SummaryResponse } from './Models/SummaryResponse';
import { ResumeResponse } from './Models/ResumeResponse';

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

  getResumen(): Observable<ResumeResponse> {
    return this.clienteHttp.get<ResumeResponse>(this.API + 'invoices/monthly-paid-amounts', { headers: this.headers })
  }

  getResumenExpense(): Observable<ResumeResponse> {
    return this.clienteHttp.get<ResumeResponse>(this.API + 'expenses/resume-paid-expenses', { headers: this.headers })
  }


}
