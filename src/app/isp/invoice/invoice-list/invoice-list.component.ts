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
import { saveAs } from 'file-saver';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { CancelInvoiceComponent } from '../cancel-invoice/cancel-invoice.component';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.scss'
})
export class InvoiceListComponent implements OnInit, AfterViewInit {

  availableColumns: string[] = ['invoiceId', 'contractId', 'customerName', 'planName', 'periodic', 'price', 'discount', 'amount', 'startDate', 'endDate', 'dueDate', 'paidDated', 'note', 'status', 'acciones'];
  displayedColumns: string[] = ['contractId', 'customerName', 'planName', 'periodic', 'price',  'discount', 'amount',  'dueDate', 'paidDated', 'status', 'acciones'];
  dataSource = new MatTableDataSource<Invoice>();
  totalInvoices = 0;
  perPage = 0;
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

  @ViewChild(MatMenuTrigger) columnasMenuTrigger!: MatMenuTrigger;


  constructor(
    private invoiceService: InvoiceService,
    private snackbarService: SnackbarService,
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


  actualizarColumnasVisibles(columnasSeleccionadas: any[]) {
    this.displayedColumns = columnasSeleccionadas.map(opcion => opcion.value);
  }

  //Generar Invoices
  generateInvoices() {
    this.invoiceService.generateInvoices().subscribe((respuesta) => {
      if (respuesta.totalInvoices > 0) {
        this.snackbarService.showSuccess(`Se han generado ${respuesta.totalInvoices} facturas`);
        this.loadInvoices(this.status, this.qCustomer, this.qf1, this.qf2);
      } else {
        this.snackbarService.showInfo(`No se encontraron facturas para generar`);
      }
    })
  }

  //Cargar Invoices
  loadInvoices(status?: string, qCustomer?: string, qDesde?: string, qHasta?: string) {
    this.isLoadingResults = true;
    this.invoiceService.getInvoices(status, qCustomer, qDesde, qHasta, this.paginator.pageIndex + 1, this.paginator.pageSize).subscribe(response => {

      this.isLoadingResults = false;
      this.totalInvoices = response.meta.total;
      this.perPage = response.meta.per_page;
      this.dataSource.data = response.data;
    }, () => {
      this.isLoadingResults = false;
    });
  }


  searchInvoices() {

    if (this.qDesde === undefined || this.qDesde == null) {
      this.qf1 = ''
    } else {
      this.qf1 = String(this.qDesde?.toISOString().split('T')[0]);
    }

    if (this.qHasta === undefined || this.qDesde == null) {
      this.qf2 = ''
    } else {
      this.qf2 = String(this.qHasta?.toISOString().split('T')[0]);
    }

    this.getInvoices()
  }


  //Export
  exportInvoices() {

    if (this.qDesde === undefined || this.qDesde == null) {
      this.qf1 = ''
    } else {
      this.qf1 = String(this.qDesde?.toISOString().split('T')[0]);
    }

    if (this.qHasta === undefined || this.qDesde == null) {
      this.qf2 = ''
    } else {
      this.qf2 = String(this.qHasta?.toISOString().split('T')[0]);
    }

    const filters = {
      status: this.status, // example filter
      start_date: this.qf1,
      end_date: this.qf2,
      customer_name: this.qCustomer
    };
    // console.log(filters);

    this.invoiceService.exportInvoices(filters).subscribe((blob: Blob) => {
      saveAs(blob, 'invoices.xlsx');
    });
  }


  //Aciones
  paid(row: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    // dialogConfig.width = '40%';
    // dialogConfig.height = '100vh';
    dialogConfig.data = row;
    this.dialog.open(InvoicePaidComponent, dialogConfig);
    this.dialog.afterAllClosed.subscribe(() => { });
  }

  //Imprimir recibo
  downloadInvoicePDF(row: Invoice) {
    this.invoiceService.downloadInvoicePDF(row.invoiceId).subscribe(blob => {
      const filename = `invoice_${row.contractId}_${row.customerName}.pdf`;
      this.invoiceService.savePDF(blob, filename);
    });
  }

  //Anular factura
  cancelInvoice(row: any) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    // dialogConfig.width = '40%';
    // dialogConfig.height = '100vh';
    dialogConfig.data = row;
    this.dialog.open(CancelInvoiceComponent, dialogConfig);
    this.dialog.afterAllClosed.subscribe(() => { });


  }



  showError() {
    this.snackbarService.showError('☹️ Cliente ya se encuentra registrado');
  }

  showSuccess() {
    this.snackbarService.showSuccess('Cliente agregado correctamente');
  }



}
