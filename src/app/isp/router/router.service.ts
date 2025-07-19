import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ReqRouter } from './Models/ResponseRouter';
import { TestResponse } from './Models/TestResponse';

@Injectable({
  providedIn: 'root'
})
export class RouterService {

  private _refresh$ = new Subject<void>()

  API: string = environment.servidor;

  constructor(private clienteHttp: HttpClient) { }

  get refresh$() {
    return this._refresh$;
  }

  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  getRouters(): Observable<any> {
    return this.clienteHttp.get(this.API + 'routers', { headers: this.headers })
  }

  addRouter(datos: ReqRouter): Observable<any> {
    return this.clienteHttp.post(this.API + 'routers', datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }


  updateRouter(id: number, datos: ReqRouter): Observable<any> {
    return this.clienteHttp.put(this.API + 'routers/' + id, datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }

  getRouterByID(id: number): Observable<any> {
    return this.clienteHttp.get(this.API + 'routers/' + id, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }

  getTestConnection(id: number): Observable<TestResponse> {
    return this.clienteHttp.get<TestResponse>(this.API + 'routers/' + id + '/test', { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }

}
