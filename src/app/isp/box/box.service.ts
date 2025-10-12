import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestBox, RequestBoxUnique } from './Models/RequestBox';
import { BoxResponseU } from './Models/BoxResponseU';
import { BoxResponse } from './Models/BoxResponse';

@Injectable({
  providedIn: 'root'
})
export class BoxService {
  private _refresh$ = new Subject<void>()

  API: string = environment.servidor;

  constructor(private clienteHttp: HttpClient) { }

  get refresh$() {
    return this._refresh$;
  }

  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  getBoxes(): Observable<BoxResponse> {
    return this.clienteHttp.get<BoxResponse>(this.API + 'boxs', { headers: this.headers })
  }

  addBox(datos: RequestBox): Observable<any> {
    return this.clienteHttp.post(this.API + 'boxs', datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }


  updateBox(id: number, datos: RequestBox): Observable<any> {
    return this.clienteHttp.put(this.API + 'boxs/' + id, datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }

  getBoxByID(id: number): Observable<BoxResponseU> {
    return this.clienteHttp.get<BoxResponseU>(this.API + 'boxs/' + id, { headers: this.headers })
  }


  getPortsAvailables(id: number): Observable<any> {
    return this.clienteHttp.get(this.API + 'ports/' + id, { headers: this.headers })
  }

  getServicesByBox(id: number): Observable<any> {
    return this.clienteHttp.get(this.API + 'boxs/' + id + '/services', { headers: this.headers })
  }


  deleteBox(id: number,): Observable<any> {
    return this.clienteHttp.delete(`${this.API}boxs/${id}`, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }),
        catchError(err => {
          console.log(err);

          return throwError(() => err.error.data.message);
        }),
      );
  }

}
