import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { EquipmentResponse } from './Models/Equipment';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  private _refresh$ = new Subject<void>()

  API: string = environment.servidor;

  constructor(private clienteHttp: HttpClient) { }

  get refresh$() {
    return this._refresh$;
  }

  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  getEquipments(): Observable<EquipmentResponse>{
    return this.clienteHttp.get<EquipmentResponse>(this.API + 'equipments', { headers: this.headers })
  }

}
