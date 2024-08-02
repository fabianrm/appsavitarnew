import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {

  private readonly nominatimUrl = 'https://nominatim.openstreetmap.org/reverse';

  constructor(private clienteHttp: HttpClient) { }

  getAddress(lat: number, lon: number): Observable<any> {
    return this.clienteHttp.get<any>(`${this.nominatimUrl}?lat=${lat}&lon=${lon}&format=json`);
  }
}
