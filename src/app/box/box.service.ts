import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ReqBox } from './Models/ResponseBox';

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

  getBoxes(): Observable<any> {
    return this.clienteHttp.get(this.API + 'boxs', { headers: this.headers })
  }

  addBox(datos: ReqBox): Observable<any> {
    return this.clienteHttp.post(this.API + 'boxs', datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }


  updateBox(id: number, datos: ReqBox): Observable<any> {
    return this.clienteHttp.put(this.API + 'boxs/' + id, datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }

  getBoxByID(id: number): Observable<any> {
    return this.clienteHttp.get(this.API + 'boxs/' + id, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }


  getPortsAvailables(id: number): Observable<any> {
    return this.clienteHttp.get(this.API + 'ports/' + id, { headers: this.headers })
  }



}
