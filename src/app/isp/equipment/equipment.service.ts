import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Equipment, EquipmentResponse } from './Models/EquipmentResponse';

export interface EquipmentListFilters {
  mac?: string;
  type?: string | null;
  brandId?: number | null;
  status?: string | null;
  purchaseDateFrom?: string;
  purchaseDateTo?: string;
  createdFrom?: string;
  createdTo?: string;
  page?: number;
  perPage?: number;
}

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  private _refresh$ = new Subject<void>()

  API: string = environment.servidor;

  constructor(private clienteHttp: HttpClient) { }

  get refresh$() {
    return this._refresh$;
  }

  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  getEquipments(): Observable<any> {
    return this.clienteHttp.get<any>(this.API + 'equipments', { headers: this.headers })
  }

  getEquipmentsList(filters: EquipmentListFilters = {}): Observable<EquipmentResponse> {
    let params = new HttpParams();

    if (filters.mac) params = params.set('mac', filters.mac);
    if (filters.type) params = params.set('type', filters.type);
    if (filters.brandId) params = params.set('brand_id', filters.brandId);
    if (filters.status) params = params.set('status', filters.status);
    if (filters.purchaseDateFrom) params = params.set('purchase_date_from', filters.purchaseDateFrom);
    if (filters.purchaseDateTo) params = params.set('purchase_date_to', filters.purchaseDateTo);
    if (filters.createdFrom) params = params.set('created_from', filters.createdFrom);
    if (filters.createdTo) params = params.set('created_to', filters.createdTo);
    if (filters.page) params = params.set('page', filters.page);
    if (filters.perPage) params = params.set('per_page', filters.perPage);

    return this.clienteHttp.get<EquipmentResponse>(this.API + 'equipments', { headers: this.headers, params });
  }

  getEquipmentsAvailable(): Observable<any> {
    return this.clienteHttp.get<any>(this.API + 'equipments/available', { headers: this.headers })
  }



  getEquipmentById(id: number): Observable<any> {
    return this.clienteHttp.get<any>(`${this.API}equipments/${id}`, { headers: this.headers });
  }

  addEquipment(datos: Equipment): Observable<any> {
    return this.clienteHttp.post(this.API + 'equipments', datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }

  updateEquipment(id: number, datos: Equipment): Observable<any> {
    return this.clienteHttp.put(this.API + 'equipments/' + id, datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }


}
