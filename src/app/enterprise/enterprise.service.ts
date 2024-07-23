import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { EnterpriseResponse } from './Models/EnterpriseResponse';

@Injectable({
  providedIn: 'root'
})
export class EnterpriseService {

  private _refresh$ = new Subject<void>()

  API: string = environment.servidor;

  constructor(private clienteHttp: HttpClient) { }

  get refresh$() {
    return this._refresh$;
  }

  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });



  // addBox(datos: RequestBox): Observable<any> {
  //   return this.clienteHttp.post(this.API + 'boxs', datos, { headers: this.headers })
  //     .pipe(tap(() => {
  //       this._refresh$.next()
  //     }));
  // }


  updateEnterprise(id: number, datos: any): Observable<any> {
    return this.clienteHttp.put(this.API + 'enterprises/' + id, datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }

  getEnterpriseByID(id: number): Observable<EnterpriseResponse> {
    return this.clienteHttp.get<EnterpriseResponse>(this.API + 'enterprises/' + id, { headers: this.headers })
  }



}

