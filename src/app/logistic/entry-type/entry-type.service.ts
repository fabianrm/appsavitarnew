import { Injectable } from '@angular/core';
import { EntryTypeResponse } from './models/EntryTypeResponse';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EntryTypeService {

  private _refresh$ = new Subject<void>()

  API: string = environment.servidor;

  constructor(private clienteHttp: HttpClient) { }

  get refresh$() {
    return this._refresh$;
  }

  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });


  getEntryTypes(): Observable<EntryTypeResponse> {
    return this.clienteHttp.get<EntryTypeResponse>(this.API + 'entry-types', { headers: this.headers })
  }
}
