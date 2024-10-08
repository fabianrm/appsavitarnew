import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, Subject, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Ticket, TicketResponse, TicketSingleResponse } from './Models/TicketResponse';
import { TicketRequest } from './Models/TicketRequest';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private _refresh$ = new Subject<void>()
  API: string = environment.servidor;
  constructor(private clienteHttp: HttpClient) { }

  get refresh$() {
    return this._refresh$;
  }

  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json",
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  });

  getTickets(): Observable<TicketResponse> {
    return this.clienteHttp.get<TicketResponse>(this.API + 'support', { headers: this.headers })
  }

  getTicketByID(id: number): Observable<TicketSingleResponse> {
    return this.clienteHttp.get<TicketSingleResponse>(this.API + 'support/' + id, { headers: this.headers })
  }



  addTicket(datos: TicketRequest): Observable<any> {
    return this.clienteHttp.post(this.API + 'support', datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }


  updateTicket(id: number, datos: TicketRequest): Observable<any> {
    return this.clienteHttp.patch(this.API + 'support/' + id, datos, { headers: this.headers })
      // .pipe(tap(() => {
      //   this._refresh$.next()
      // }));
  }



  assignTicket(ticketID: number ,datos: TicketRequest): Observable<any> {
    return this.clienteHttp.patch<TicketRequest>(`${this.API}tickets/${ticketID}/assign-technician`, datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }


  updateStatus(ticketID: number, datos: TicketRequest): Observable<any> {
    return this.clienteHttp.patch<TicketRequest>(`${this.API}tickets/${ticketID}/update-status`, datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }


  addAttachment(ticketId: number, file: File, filename: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', filename); 

    return this.clienteHttp.post(`${this.API}tickets/${ticketId}/attachments`, formData, {
      reportProgress: true, // Activa el reporte de progreso
      observe: 'events'     // Observa los eventos
    }).pipe(tap(() => {
      this._refresh$.next()
    }));;
  }


  getAttachments(ticketId: number): Observable<any> {
    return this.clienteHttp.get(`${this.API}tickets/${ticketId}/attachments`);
  }


}
