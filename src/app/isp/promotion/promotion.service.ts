import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, Subject, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PromotionRequest } from './models/PromotionRequest';
import { formatDate } from '@angular/common';
import { Promotion, PromotionResponse } from './models';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  private _refresh$ = new Subject<void>()

  API: string = environment.servidor;

  constructor(private clienteHttp: HttpClient) { }

  get refresh$() {
    return this._refresh$;
  }

  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  getPromotions(): Observable<PromotionResponse> {
    return this.clienteHttp.get<PromotionResponse>(this.API + 'promotions', { headers: this.headers })
  }


  //Obtener promocion por ID
  getPromotionById(id: number): Observable<Promotion | undefined> {
    const url = `${this.API}promotions/${id}`;
    return this.clienteHttp.get<{ data: Promotion }>(url, { headers: this.headers })
      .pipe(
        map(response => response.data),
        catchError(error => of(undefined))
      )
  }


  //Crear Promocion
  addPromotion(datos: PromotionRequest): Observable<string> {
    const formattedEntry = {
      ...datos,
      start_date: datos.start_date instanceof Date
        ? formatDate(datos.start_date, 'yyyy-MM-dd', 'en-US')
        : datos.start_date,
      end_date: datos.end_date instanceof Date
        ? formatDate(datos.end_date, 'yyyy-MM-dd', 'en-US')
        : datos.end_date,
    };

    return this.clienteHttp.post<{ message: string }>(this.API + 'promotions', formattedEntry, { headers: this.headers })
      .pipe(
        map(response => response.message),
        tap(() => {
          this._refresh$.next()
        }),
        catchError(err => {
          return throwError(() => err.error.message);
        }),);
  }



  //Crear Promocion
  updatePromotion(promotion: PromotionRequest): Observable<string> {

    if (!promotion.id) throw new Error('Id de la promoción es requerido');

    const url = `${this.API}promotions/${promotion.id}`;

    const formattedEntry = {
      ...promotion,
      start_date: promotion.start_date instanceof Date
        ? formatDate(promotion.start_date, 'yyyy-MM-dd', 'en-US')
        : promotion.start_date,
      end_date: promotion.end_date instanceof Date
        ? formatDate(promotion.end_date, 'yyyy-MM-dd', 'en-US')
        : promotion.end_date,
    };

    return this.clienteHttp.patch<{ message: string }>(url, formattedEntry, { headers: this.headers })
      .pipe(
        map(response => response.message),
        tap(() => {
          this._refresh$.next()
        }),
        catchError(err => {
          return throwError(() => err.error.message);
        }),);
  }


}
