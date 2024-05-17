import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ReqPlan } from './Models/ResponsePlan';
import { RequestPlan } from './Models/RequestPlan';



@Injectable({
  providedIn: 'root'
})
export class PlanService {

  private _refresh$ = new Subject<void>()

  API: string = environment.servidor;

  constructor(private clienteHttp: HttpClient) { }

  get refresh$() {
    return this._refresh$;
  }

  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  getPlans(): Observable<any> {
    return this.clienteHttp.get(this.API + 'plans', { headers: this.headers })
  }

  addPlan(datos: RequestPlan): Observable<any> {
    return this.clienteHttp.post(this.API + 'plans', datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }


  updatePlans(id: number, datos: ReqPlan): Observable<any> {
    return this.clienteHttp.put(this.API + 'plans/' + id, datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }

  getPlanByID(id: number): Observable<any> {
    return this.clienteHttp.get(this.API + 'plans/' + id, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }


}
