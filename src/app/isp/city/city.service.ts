import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CityResponse, CityResponseSingle } from './Models/CityResponse';
import { CityRequest } from './Models/CityRequest';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  private _refresh$ = new Subject<void>()

  API: string = environment.servidor;

  constructor(private clienteHttp: HttpClient) { }

  get refresh$() {
    return this._refresh$;
  }

  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });


  getCities(): Observable<CityResponse> {
    return this.clienteHttp.get<CityResponse>(this.API + 'cities', { headers: this.headers })
  }

  getCityByID(id: number): Observable<CityResponseSingle> {
    return this.clienteHttp.get<CityResponseSingle>(this.API + 'cities/' + id, { headers: this.headers })
  }

  addCity(datos: CityRequest): Observable<any> {
    return this.clienteHttp.post(this.API + 'cities', datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }

  updateCity(id: number, datos: CityRequest): Observable<any> {
    return this.clienteHttp.put(this.API + 'cities/' + id, datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }

  deleteCity(id: number): Observable<any> {
    return this.clienteHttp.delete(this.API + 'cities/' + id, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }




}
