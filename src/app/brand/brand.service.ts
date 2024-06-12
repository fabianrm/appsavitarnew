import { Injectable } from '@angular/core';
import { BrandResponse } from './Models/BrandResponse';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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


  getBrands(): Observable<BrandResponse> {
    return this.clienteHttp.get<BrandResponse>(this.API + 'brands', { headers: this.headers })
  }

}
