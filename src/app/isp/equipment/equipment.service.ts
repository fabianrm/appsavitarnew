import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Equipment } from './Models/EquipmentResponse';


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

  getEquipments(): Observable<any> {
    return this.clienteHttp.get<any>(this.API + 'equipments', { headers: this.headers })
  }

  getEquipmentsAvailable(): Observable<any> {
    return this.clienteHttp.get<any>(this.API + 'equipments/available', { headers: this.headers })
  }



  getEquipmentById(id: number): Observable<any> {
    return this.clienteHttp.get<any>(`${this.API}equipments/${id}`, { headers: this.headers });
  }

  addEquipment(datos: Equipment): Observable<any> {
    return this.clienteHttp.post(this.API + 'equipments', datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }

  updateEquipment(id: number, datos: Equipment): Observable<any> {
    return this.clienteHttp.put(this.API + 'equipments/' + id, datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }


}
