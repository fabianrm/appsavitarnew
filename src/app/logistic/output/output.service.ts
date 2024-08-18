import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OutputResponse } from './models/OutputResponse';
import { OutputRequest } from './models/OutputRequest';

@Injectable({
  providedIn: 'root'
})
export class OutputService {

  private _refresh$ = new Subject<void>()

  API: string = environment.servidor;

  constructor(private clienteHttp: HttpClient) { }

  get refresh$() {
    return this._refresh$;
  }

  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });


  getOutputs(): Observable<OutputResponse> {
    return this.clienteHttp.get<OutputResponse>(this.API + 'outputs', { headers: this.headers })
  }

  addOutput(datos: OutputRequest): Observable<any> {
    return this.clienteHttp.post(this.API + 'outputs', datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }

}
