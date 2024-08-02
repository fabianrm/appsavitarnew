import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PresentationResponse } from './models/PresentationResponse';

@Injectable({
  providedIn: 'root'
})
export class PresentationService {

  private _refresh$ = new Subject<void>()

  API: string = environment.servidor;

  constructor(private clienteHttp: HttpClient) { }

  get refresh$() {
    return this._refresh$;
  }

  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });


  getPresentations(): Observable<PresentationResponse> {
    return this.clienteHttp.get<PresentationResponse>(this.API + 'presentations', { headers: this.headers })
  }
}
