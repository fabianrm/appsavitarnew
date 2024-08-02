import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CategoryResponse } from './models/CategoryResponse';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private _refresh$ = new Subject<void>()

  API: string = environment.servidor;

  constructor(private clienteHttp: HttpClient) { }

  get refresh$() {
    return this._refresh$;
  }

  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });


  getCategories(): Observable<CategoryResponse> {
    return this.clienteHttp.get<CategoryResponse>(this.API + 'categories', { headers: this.headers })
  }
}
