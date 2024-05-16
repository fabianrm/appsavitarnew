import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResContract } from './Models/ContractResponse';
import { ContractRequest, ReqContract } from './Models/ContractRequest';
import { ServiceResponse } from './Models/ServiceResponse';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  private _refresh$ = new Subject<void>()

  API: string = environment.servidor;

  constructor(private clienteHttp: HttpClient) { }

  get refresh$() {
    return this._refresh$;
  }

  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  getservices(): Observable<any> {
    return this.clienteHttp.get(this.API + 'services', { headers: this.headers })
  }

  addService(datos: ReqContract): Observable<any> {
    return this.clienteHttp.post(this.API + 'services', datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }


  updateService(id: number, datos: ReqContract): Observable<any> {
    return this.clienteHttp.put(this.API + 'services/' + id, datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }

  // getServiceByID(id: number): Observable<any> {
  //   return this.clienteHttp.get(this.API + 'services/' + id, { headers: this.headers })
  //     .pipe(tap(() => {
  //       this._refresh$.next()
  //     }));
  // }


  getServiceByID(id: number): Observable<ServiceResponse> {
    return this.clienteHttp.get<ServiceResponse>(this.API + 'services/' + id, { headers: this.headers })
  }


}
