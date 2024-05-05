import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { City, CityResponse } from './Models/CityResponse';

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


}
