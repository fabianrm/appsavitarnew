import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Profile } from './models/profile-response';

@Injectable({
  providedIn: 'root'
})
export class MikrotikService {

  constructor() { }

  API: string = environment.servidor;
  private http = inject(HttpClient);

  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  getProfiles(): Observable<Profile> {
    return this.http.get<Profile>(`${this.API}mk/profiles`, { headers: this.headers })
      .pipe(
        catchError(err => {
          return throwError(() => err.error.message);
        }),
      )
  }


}
