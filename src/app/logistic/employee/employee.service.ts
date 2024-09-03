import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EmployeeResponse } from './models/EmployeeResponse';
import { EmployeeRequest } from './models/EmployeeRequest';

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

  addEmployee(datos: EmployeeRequest): Observable<any> {
    return this.clienteHttp.post(this.API + 'employees', datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }


  updateEmployee(id: number, datos: EmployeeRequest): Observable<any> {
    return this.clienteHttp.put(this.API + 'employees/' + id, datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }

  getEmployeeByID(id: number): Observable<any> {
    return this.clienteHttp.get(this.API + 'employees/' + id, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }





}
