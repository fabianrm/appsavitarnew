import { Injectable } from '@angular/core';
import { catchError, map, Observable, Subject, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders } from '@angular/common/http';
import { MaterialResponse, MaterialSingleResponse } from './models/MaterialResponse';
import { MaterialRequest } from './models/MaterialRequest';


@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  
  private _refresh$ = new Subject<void>()

  API: string = environment.servidor;

  constructor(private clienteHttp: HttpClient) { }

  get refresh$() {
    return this._refresh$;
  }

  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });


  getMaterials(): Observable<MaterialResponse> {
    return this.clienteHttp.get<MaterialResponse>(this.API + 'materials', { headers: this.headers })
  }

  getMaterialById(id: number,): Observable<MaterialSingleResponse> {
    return this.clienteHttp.get<MaterialSingleResponse>(this.API + 'materials/' +id, { headers: this.headers })
  }

  addMaterial(datos: MaterialRequest): Observable<any> {
    return this.clienteHttp.post(this.API + 'materials', datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }

  updateMaterial(id: number, datos: MaterialRequest): Observable<any> {
    return this.clienteHttp.put(this.API + 'materials/' + id, datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }

  deleteMaterial(id: number): Observable<any> {
    return this.clienteHttp.delete(this.API + 'materials/' + id, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }

  
  getStockMaterials(): Observable<any> {
    return this.clienteHttp.get<any>(this.API + 'materials/stock', { headers: this.headers })
  }


  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.clienteHttp.post(this.API + 'materials/uploadfile', formData, {
      reportProgress: true, // Activa el reporte de progreso
      observe: 'events'     // Observa los eventos
    });
  }



}
