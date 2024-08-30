import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EntryResponse, EntrySingleResponse } from './models/EntryResponse';
import { EntryRequest } from './models/EntryRequest';
import { EntryDetail, EntryDetailResponse } from './models/EntryDetailResponse';

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

  getEntryByID(id: number): Observable<EntrySingleResponse> {
    return this.clienteHttp.get<EntrySingleResponse>(this.API + 'entries/' + id, { headers: this.headers })
  }


  addEntry(datos: EntryRequest): Observable<any> {
    return this.clienteHttp.post(this.API + 'entries', datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }


  getEntryDetails(): Observable<EntryDetailResponse> {
    return this.clienteHttp.get<EntryDetailResponse>(this.API + 'entry-details', { headers: this.headers })
  }

  cancelEntry(id: number): Observable<any> {
    return this.clienteHttp.patch(this.API + 'entries/' + id + '/cancel', { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }

  deleteEntry(id: number): Observable<any> {
    return this.clienteHttp.delete(this.API + 'entries/' + id, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }


}
