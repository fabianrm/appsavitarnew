import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { RequestService } from './Models/RequestService';
import { Service, ServiceResponse, ServiceSingleResponse } from './Models/ServiceResponse';

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
    "Content-Type": "application/json",
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  });


  getservices(): Observable<ServiceResponse> {
    return this.clienteHttp.get<ServiceResponse>(this.API + 'services', { headers: this.headers })
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

  getServiceByCustomer(id: number): Observable<any> {
    return this.clienteHttp.get(this.API + 'services/by-customer/' + id, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }


  getServiceByID(id: number): Observable<ServiceSingleResponse> {
    return this.clienteHttp.get<ServiceSingleResponse>(this.API + 'services/' + id, { headers: this.headers })
  }


  //Chequear si existe el equipo en un contrato
  getServiceByEquipment(id: number): Observable<any> {
    return this.clienteHttp.get<any>(`${this.API}services/check-equipment?equipmentId=${id}` , { headers: this.headers })
  }


  //Cambiar Plan de Cliente
  updatePlantCustomer(contractId: number, planId: number): Observable<any> {
    return this.clienteHttp.patch(`${this.API}services/${contractId}/update-plan`, { plan_id: planId }, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }

  //Cambiar puerto de Cliente
  updatePortCustomer(id: number, data: any,): Observable<any> {
    return this.clienteHttp.patch(`${this.API}services/${id}/update-box-port`,  data , { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }


  //Cambiar equipo de Cliente
  updateEquipment(id: number, data: any,): Observable<any> {
    return this.clienteHttp.patch(`${this.API}services/${id}/update-equipment`, data, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }

  //Suspender el contrato
  suspendContract(id: number, data: any,): Observable<any> {
    return this.clienteHttp.patch(`${this.API}services/${id}/suspend`, data, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }

  //Suspender el contrato
  deleteContract(id: number,): Observable<any> {
    return this.clienteHttp.delete(`${this.API}services/${id}`,  { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }

}
