import { Component, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Expense } from '../Models/ExpenseResponse';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ExpenseService } from '../expense.service';

// import { registerLocaleData } from '@angular/common';
// import localeEsPe from '@angular/common/locales/es-PE';
// registerLocaleData(localeEsPe, 'es-PE');

@Component({
    selector: 'app-expense-report',
    templateUrl: './expense-report.component.html',
    styleUrl: './expense-report.component.scss',
    standalone: false
})
export class ExpenseReportComponent {
  displayedColumns: string[] = ['datePaid','type', 'reason', 'description', 'amount'];
  dataSource = new MatTableDataSource<Expense>();
  totalInvoices = 0;
  perPage = 0;
  isLoadingResults = true;
  subscription!: Subscription

  qDesde = new Date();
  qHasta = new Date();

  qf1?: string = '';
  qf2?: string = '';

  total: number = 0;



  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(
    private expenseService: ExpenseService) { }
  
  
  getInvoiceReport() {

    this.qf1 = new Date(this.qDesde!).toISOString().split('T')[0];
    this.qf2 = new Date(this.qHasta!).toISOString().split('T')[0];

    this.expenseService.getExpenseReport(this.qf1, this.qf2).subscribe((respuesta) => {
    //console.log(respuesta);
      if (respuesta.data.length > 0) {
        this.dataSource = new MatTableDataSource(respuesta.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        //this.total = respuesta.data.map((t: { amount: number; }) => t.amount).reduce((acc: number, value: number) => acc + value, 0);
        this.total = respuesta.totalAmount;
         

      }

    });
  }


  searchInvoices() {
    this.getInvoiceReport()
  }

  exportInvoices() {
    throw new Error('Method not implemented.');
  }

}
