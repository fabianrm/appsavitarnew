import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EntryResponse } from './models/EntryResponse';

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
}
