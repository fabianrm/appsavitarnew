import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PresentationResponse } from './models/PresentationResponse';
import { PresentationRequest } from './models/PresentationRequest';

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


  getPresentations(): Observable<any> {
    return this.clienteHttp.get<PresentationResponse>(this.API + 'presentations', { headers: this.headers })
  }

  addPresentation(datos: PresentationRequest): Observable<any> {
    return this.clienteHttp.post(this.API + 'presentations', datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }


  updatePresentation(id: number, datos: PresentationRequest): Observable<any> {
    return this.clienteHttp.put(this.API + 'presentations/' + id, datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }

  getPresentationByID(id: number): Observable<any> {
    return this.clienteHttp.get(this.API + 'presentations/' + id, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }

}
