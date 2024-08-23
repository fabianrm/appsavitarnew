import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CategoryResponse } from './models/CategoryResponse';
import { CategoryRequest } from './models/CategoryRequest';

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


  getCategories(): Observable<any> {
    return this.clienteHttp.get<CategoryResponse>(this.API + 'categories', { headers: this.headers })
  }

  addCategory(datos: CategoryRequest): Observable<any> {
    return this.clienteHttp.post(this.API + 'categories', datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }


  updateCategory(id: number, datos: CategoryRequest): Observable<any> {
    return this.clienteHttp.put(this.API + 'categories/' + id, datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }

  getCategoryByID(id: number): Observable<any> {
    return this.clienteHttp.get(this.API + 'categories/' + id, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }



}
