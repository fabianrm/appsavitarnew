import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CategoryTicketResponse, CategoryTicketSingleResponse } from './Models/CategoryTicketResponse';
import { CategoryTicketRequest } from './Models/CategoryTicketRequest';

@Injectable({
  providedIn: 'root'
})
export class CategoryTicketService {

  private _refresh$ = new Subject<void>()

  API: string = environment.servidor;

  constructor(private clienteHttp: HttpClient) { }

  get refresh$() {
    return this._refresh$;
  }

  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  getCategoryTickets(): Observable<CategoryTicketResponse> {
    return this.clienteHttp.get<CategoryTicketResponse>(this.API + 'categories-support', { headers: this.headers })
  }

  addCategoryTickets(datos: CategoryTicketRequest): Observable<any> {
    return this.clienteHttp.post(this.API + 'categories-support', datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }


  updateCategoryTickets(id: number, datos: CategoryTicketRequest): Observable<any> {
    return this.clienteHttp.put(this.API + 'categories-support/' + id, datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }

  getCategoryTicketsByID(id: number): Observable<CategoryTicketSingleResponse> {
    return this.clienteHttp.get<CategoryTicketSingleResponse>(this.API + 'categories-support/' + id, { headers: this.headers })
  }
}
