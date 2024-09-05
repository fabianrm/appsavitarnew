import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription, map } from 'rxjs';
import { Invoice } from '../Models/InvoiceResponse';
import { InvoiceService } from '../invoice.service';


@Component({
  selector: 'app-invoice-report',
  templateUrl: './invoice-report.component.html',
  styleUrl: './invoice-report.component.scss'
})
export class InvoiceReportComponent implements OnInit {



  displayedColumns: string[] = ['contractId', 'paidDated', 'periodic', 'customerName', 'planName', 'price', 'discount', 'amount'];
  dataSource = new MatTableDataSource<Invoice>();
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
    private invoiceService: InvoiceService,
    public dialog: MatDialog) { }


  ngOnInit(): void {
  }


  getInvoiceReport() {

    this.qf1 = new Date(this.qDesde!).toISOString().split('T')[0];
    this.qf2 = new Date(this.qHasta!).toISOString().split('T')[0];

    this.invoiceService.getPaidInvoicesReport(this.qf1, this.qf2).subscribe((respuesta) => {
      //console.log(respuesta);
      if (respuesta.data.length > 0) {
        this.dataSource = new MatTableDataSource(respuesta.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        //this.total = respuesta.data.map((t: { amount: number; }) => t.amount).reduce((acc: number, value: number) => acc + value, 0);
        this.total = respuesta.totalAmount;
        //  console.log(this.total);

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
