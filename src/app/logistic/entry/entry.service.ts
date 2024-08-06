import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EntryResponse } from './models/EntryResponse';
import { EntryRequest } from './models/EntryRequest';

@Injectable({
  providedIn: 'root'
})
export class EntryService {


  private _refresh$ = new Subject<void>()

  API: string = environment.servidor;

  constructor(private clienteHttp: HttpClient) { }

  get refresh$() {
    return this._refresh$;
  }

  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  getEntries(): Observable<EntryResponse> {
    return this.clienteHttp.get<EntryResponse>(this.API + 'entries', { headers: this.headers })
  }


  addEntry(datos: EntryRequest): Observable<any> {
    return this.clienteHttp.post(this.API + 'entries', datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }

}
