import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EmployeeResponse } from './models/EmployeeResponse';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private _refresh$ = new Subject<void>()

  API: string = environment.servidor;

  constructor(private clienteHttp: HttpClient) { }

  get refresh$() {
    return this._refresh$;
  }

  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });


  getEmployees(): Observable<EmployeeResponse> {
    return this.clienteHttp.get<EmployeeResponse>(this.API + 'employees', { headers: this.headers })
  }
}
