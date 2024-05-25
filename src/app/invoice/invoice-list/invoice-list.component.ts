import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { InvoiceService } from '../invoice.service';
import { Invoice } from '../Models/InvoiceResponse';
import { merge, startWith, switchMap, map, catchError, of, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { InvoicePaidComponent } from '../invoice-paid/invoice-paid.component';



@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.scss'
})
export class InvoiceListComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['invoiceId', 'contractId', 'customerName', 'planName', 'price', 'discount', 'amount', 'startDate', 'endDate', 'dueDate', 'paidDated', 'status', 'acciones'];
  dataSource = new MatTableDataSource<Invoice>();
  totalInvoices = 0;
  isLoadingResults = true;
  subscription!: Subscription

  status?: string = '';
  qCustomer?: string = '';
  qDesde?: Date | null;
  qHasta?: Date | null;

  qf1?: string = '';
  qf2?: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private invoiceService: InvoiceService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog) { }

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
    // this.qf1 = String(this.qDesde?.toISOString().split('T')[0]);
    // this.qf2 = String(this.qHasta?.toISOString().split('T')[0]);
  }

  getInvoices() {
    this.loadInvoices(this.status, this.qCustomer, this.qf1, this.qf2);
    merge(this.paginator.page, this.sort.sortChange)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.invoiceService.getInvoices(
            this.status,
            this.qCustomer,
            this.qf1,
            this.qf2,
            this.paginator.pageIndex + 1,
            this.paginator.pageSize
          );
        }),
        map(data => {
          this.isLoadingResults = false;
          this.totalInvoices = data.meta.total;
          return data.data;

        }),
        catchError(() => {
          this.isLoadingResults = false;
          return of([]);
        })
      )
      .subscribe(data => (this.dataSource.data = data));
  }

  //Generar Invoices
  generateInvoices() {
    this.invoiceService.generateInvoices().subscribe((respuesta) => {
      if (respuesta.totalInvoices > 0) {
        this.msgSusscess(`Se han generado ${respuesta.totalInvoices} facturas`);
        this.loadInvoices(this.status);
      } else {
        this.msgSusscess('No se encontraron facturas para generar');
      }
    })
  }

  //Cargar Invoices
  loadInvoices(status?: string, qCustomer?: string, qDesde?: string, qHasta?: string) {
    this.isLoadingResults = true;
    this.invoiceService.getInvoices(status, qCustomer, qDesde, qHasta, this.paginator.pageIndex + 1, this.paginator.pageSize).subscribe(response => {

      this.isLoadingResults = false;
      this.totalInvoices = response.meta.total;
      this.dataSource.data = response.data;
    }, () => {
      this.isLoadingResults = false;
    });
  }


  searchInvoices() {
    this.qf1 = String(this.qDesde?.toISOString().split('T')[0]);
    this.qf2 = String(this.qHasta?.toISOString().split('T')[0]);
    console.log('qf1', this.qf1);
    
    this.getInvoices()
  }


  //Aciones
  paid(row: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';
    dialogConfig.data = row;
    this.dialog.open(InvoicePaidComponent, dialogConfig);
    this.dialog.afterAllClosed.subscribe(() => { });
  }

  print(row: any) {
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
