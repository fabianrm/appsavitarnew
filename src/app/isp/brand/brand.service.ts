import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BrandRequest } from './Models/BrandRequest';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  private _refresh$ = new Subject<void>()

  API: string = environment.servidor;

  constructor(private clienteHttp: HttpClient) { }

  get refresh$() {
    return this._refresh$;
  }

  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  getBrands(): Observable<any> {
    return this.clienteHttp.get(this.API + 'brands', { headers: this.headers })
  }

  addBrand(datos: BrandRequest): Observable<any> {
    return this.clienteHttp.post(this.API + 'brands', datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }


  updateBrand(id: number, datos: BrandRequest): Observable<any> {
    return this.clienteHttp.put(this.API + 'brands/' + id, datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }

  getBrandByID(id: number): Observable<any> {
    return this.clienteHttp.get(this.API + 'brands/' + id, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }

}
