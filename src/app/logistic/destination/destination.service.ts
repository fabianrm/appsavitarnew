import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DestinationResponse } from './models/DestinationResponse';

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
}
