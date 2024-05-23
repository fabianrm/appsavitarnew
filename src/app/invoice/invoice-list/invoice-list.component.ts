import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { InvoiceService } from '../invoice.service';
import { Invoice } from '../Models/InvoiceResponse';
import { merge, startWith, switchMap, map, catchError, of, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.scss'
})
export class InvoiceListComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['invoiceId', 'contractId', 'customerName', 'planName', 'amount', 'startDate', 'endDate', 'dueDate', 'status', 'acciones'];
  dataSource = new MatTableDataSource<Invoice>();
  totalInvoices = 0;
  isLoadingResults = true;
  subscription!: Subscription

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private invoiceService: InvoiceService,
    private _snackBar: MatSnackBar,) { }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.subscription = this.invoiceService.refresh$.subscribe(() => {
      this.getInvoices();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.getInvoices()
  }

  getInvoices() {
    this.loadInvoices();
    merge(this.paginator.page, this.sort.sortChange)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.invoiceService.getInvoices(
            this.paginator.pageIndex + 1,
            this.paginator.pageSize
          );
        }),
        map(data => {
          this.isLoadingResults = false;
          this.totalInvoices = data.meta.total;

          return data.data.invoices;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return of([]);
        })
      )
      .subscribe(data => (this.dataSource.data = data));
  }

  generateInvoices() {
    this.invoiceService.generateInvoices().subscribe((respuesta) => {
      if (respuesta.totalInvoices > 0) {
        this.msgSusscess(`Se han generado ${respuesta.totalInvoices} facturas`);
        this.loadInvoices();
      } else {
        this.msgSusscess('No se encontraron facturas para generar');
      }
    })
  }

  loadInvoices() {
    this.isLoadingResults = true;
    this.invoiceService.getInvoices(this.paginator.pageIndex + 1, this.paginator.pageSize).subscribe(data => {
      this.isLoadingResults = false;
      this.totalInvoices = data.meta.total;
      this.dataSource.data = data.data.invoices;
    }, () => {
      this.isLoadingResults = false;
    });
  }


  //Aciones
  paid(row: any) {
    throw new Error('Method not implemented.');
  }
  print(row: any) {
    throw new Error('Method not implemented.');
  }
  applyDiscount(row: any) {
    throw new Error('Method not implemented.');
  }


  msgSusscess(mensaje: string) {
    this._snackBar.open(mensaje, 'SAVITAR', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    })
  }

}
