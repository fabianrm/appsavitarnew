import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ReqRouter } from './Models/ResponseRouter';
import { TestResponse } from './Models/TestResponse';
import { SyncResponse } from './Models/SyncResponse';
import { RouterMetricsResponse, RouterLiveCheck } from './Models/RouterMetricsResponse';

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

  deleteRouter(id: number): Observable<{ message: string; script: string | null }> {
    return this.clienteHttp.delete<{ message: string; script: string | null }>(this.API + 'routers/' + id, { headers: this.headers })
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


  getInfiltrados(id: number): Observable<SyncResponse> {
    return this.clienteHttp.post<SyncResponse>(this.API + 'routers/' + id + '/sync-contacts', { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }

  getRouterMetrics(id: number): Observable<RouterMetricsResponse> {
    return this.clienteHttp.get<RouterMetricsResponse>(this.API + 'routers/' + id + '/metrics', { headers: this.headers });
  }

  getRouterLiveCheck(id: number): Observable<RouterLiveCheck> {
    return this.clienteHttp.get<RouterLiveCheck>(this.API + 'routers/' + id + '/live', { headers: this.headers });
  }

  getRouterInterfaces(id: number): Observable<{ data: RouterInterface[] }> {
    return this.clienteHttp.get<{ data: RouterInterface[] }>(this.API + 'routers/' + id + '/interfaces', { headers: this.headers });
  }

  getRouterTraffic(id: number, interfaceName: string): Observable<RouterTraffic> {
    return this.clienteHttp.get<RouterTraffic>(this.API + 'routers/' + id + '/traffic', {
      headers: this.headers.set('X-Skip-Spinner', '1'),
      params: { interface: interfaceName },
    });
  }

  provisionVpn(id: number): Observable<VpnScriptResponse> {
    return this.clienteHttp.post<VpnScriptResponse>(this.API + 'routers/' + id + '/vpn/provision', {}, { headers: this.headers });
  }

  getVpnScript(id: number): Observable<VpnScriptResponse> {
    return this.clienteHttp.get<VpnScriptResponse>(this.API + 'routers/' + id + '/vpn/script', { headers: this.headers });
  }

}

export interface VpnScriptResponse {
  success: boolean;
  ip?: string;
  script?: string;
  message?: string;
}

export interface RouterInterface {
  name: string;
  type: string;
  running: boolean;
}

export interface RouterTraffic {
  interface: string;
  rx_bps: number;
  tx_bps: number;
  rx_pps: number;
  tx_pps: number;
  timestamp: string;
}
