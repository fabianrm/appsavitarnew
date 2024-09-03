import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, Subject, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DestinationResponse } from './models/DestinationResponse';
import { DestinationRequest } from './models/DestinationRequest';

@Injectable({
  providedIn: 'root'
})
export class DestinationService {


  private _refresh$ = new Subject<void>()

  API: string = environment.servidor;

  constructor(private clienteHttp: HttpClient) { }

  get refresh$() {
    return this._refresh$;
  }

  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });


  getDestinations(): Observable<DestinationResponse> {
    return this.clienteHttp.get<DestinationResponse>(this.API + 'destinations', { headers: this.headers })
  }


  getDestineById(id: number): Observable<any> {
    return this.clienteHttp.get(this.API + 'destinations/' + id, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }


  getDestineUseById(id: number): Observable<any> {
    return this.clienteHttp.get(this.API + 'destination-use/' + id, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }


  addDestine(datos: DestinationRequest): Observable<any> {
    return this.clienteHttp.post(this.API + 'destinations', datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }


  updateDestine(id: number, datos: DestinationRequest): Observable<any> {
    return this.clienteHttp.put(this.API + 'destinations/' + id, datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }




}
