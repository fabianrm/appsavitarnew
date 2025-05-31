import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OutputResponse, OutputSingleResponse } from './models/OutputResponse';
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

  getOutputByID(id: number): Observable<OutputSingleResponse> {
    return this.clienteHttp.get<OutputSingleResponse>(this.API + 'outputs/' + id, { headers: this.headers })
  }

  addOutput(datos: OutputRequest): Observable<any> {
    return this.clienteHttp.post(this.API + 'outputs', datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }),
        catchError(err => {
          return throwError(() => err.error.message);
        }));
  }

}
