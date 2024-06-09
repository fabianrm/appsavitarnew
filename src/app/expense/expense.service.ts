import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Expense, ExpenseResponse, ExpenseResponseUnique } from './Models/ExpenseResponse';
import { ExpenseRequest } from './Models/ExpenseRequest';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

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


  getExpenses(): Observable<ExpenseResponse> {
    return this.clienteHttp.get<ExpenseResponse>(this.API + 'expenses', { headers: this.headers })
  }

  getExpenseById(id:number): Observable<ExpenseResponseUnique> {
    return this.clienteHttp.get<ExpenseResponseUnique>(this.API + 'expenses/' + id, { headers: this.headers })
  }


  addExpense(datos: Expense): Observable<any> {
    return this.clienteHttp.post(this.API + 'expenses', datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }

  updateExpense(id: number, datos: Expense): Observable<any> {
    return this.clienteHttp.put(this.API + 'expenses/' + id, datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }

  suspendPaid(expenseID: number, datos:any): Observable<any> {
    return this.clienteHttp.patch<ExpenseRequest>(`${this.API}expenses/${expenseID}`, datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }


  generatePaids(): Observable<any> {
    return this.clienteHttp.post(`${this.API}expenses/generate-next-month`, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }

  updatePaid(expenseID: number, datos: any): Observable<any> {
    return this.clienteHttp.patch<ExpenseRequest>(`${this.API}expenses/${expenseID}`, datos, { headers: this.headers })
      .pipe(tap(() => {
        this._refresh$.next()
      }));
  }




}
