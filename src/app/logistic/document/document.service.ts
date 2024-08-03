import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DocumentResponse } from './models/DocumentResponse';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  private _refresh$ = new Subject<void>()

  API: string = environment.servidor;

  constructor(private clienteHttp: HttpClient) { }

  get refresh$() {
    return this._refresh$;
  }

  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });


  getDocuments(): Observable<DocumentResponse> {
    return this.clienteHttp.get<DocumentResponse>(this.API + 'documents', { headers: this.headers })
  }
}
