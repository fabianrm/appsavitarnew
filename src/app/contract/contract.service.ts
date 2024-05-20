import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { RequestService } from './Models/RequestService';
import { ResponseServices } from './Models/ResponseServices';

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

  getservices(): Observable<ResponseServices> {
    return this.clienteHttp.get<ResponseServices>(this.API + 'services', { headers: this.headers })
  }


  addService(datos: RequestService): Observable<any> {
    return this.clienteHttp.post(this.API + 'services', datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }


  updateService(id: number, datos: RequestService): Observable<any> {
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


  getServiceByID(id: number): Observable<ResponseServices> {
    return this.clienteHttp.get<ResponseServices>(this.API + 'services/' + id, { headers: this.headers })
  }

  //Cambiar Plan de Cliente
  updatePlantCustomer(contractId: number, planId: number): Observable<any> {
    // return this.clienteHttp.put(this.API + 'services/' + contractId, datos, { headers: this.headers })
    //   .pipe(tap(() => {
    //     this._refresh$.next()
    //   }));
    return this.clienteHttp.patch(`${this.API}services/${contractId}/update-plan`, { plan_id: planId }, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }


}
