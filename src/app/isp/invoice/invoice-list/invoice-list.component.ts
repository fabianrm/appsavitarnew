import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { InvoiceService } from '../invoice.service';
import { Invoice } from '../Models/InvoiceResponse';
import { merge, startWith, switchMap, map, catchError, of, Subscription } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { InvoicePaidComponent } from '../invoice-paid/invoice-paid.component';
import { saveAs } from 'file-saver';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { CancelInvoiceComponent } from '../cancel-invoice/cancel-invoice.component';
import { City } from '../../city/Models/CityResponse';
import { CityService } from '../../city/city.service';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.scss',
  standalone: false
})
export class InvoiceListComponent implements OnInit, AfterViewInit {

  availableColumns: string[] = ['invoiceId', 'contractId', 'customerName', 'address', 'planName', 'periodic', 'price', 'discount', 'amount', 'startDate', 'endDate', 'dueDate', 'paidDated', 'note', 'status', 'acciones'];
  displayedColumns: string[] = ['contractId', 'customerName', 'planName', 'address', 'periodic', 'price', 'discount', 'amount', 'dueDate', 'paidDated', 'status', 'acciones'];

  statusList: string[] = ['pendiente', 'pagada', 'vencida', 'anulada'];

  dataSource = new MatTableDataSource<Invoice>();
  totalInvoices = 0;
  perPage = 0;
  isLoadingResults = true;
  subscription!: Subscription

  status?: string = '';
  qCustomer?: string = '';
  qDesde?: Date | null;
  qHasta?: Date | null;
  qCity?: string = '';

  qf1?: string = '';
  qf2?: string = '';

  cities: City[] = [];
  citySelected?: string = '';


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatMenuTrigger) columnasMenuTrigger!: MatMenuTrigger;


  constructor(
    private invoiceService: InvoiceService,
    private snackbarService: SnackbarService,
    private cityService: CityService,
    public dialog: MatDialog) { }

  ngOnInit(): void {

    this.getCities();

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
    // this.getInvoices()
  }

  getInvoices() {
    this.loadInvoices(this.status, this.qCustomer, this.qf1, this.qf2, this.citySelected,);
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
            this.citySelected,
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
  loadInvoices(status?: string, qCustomer?: string, qDesde?: string, qHasta?: string, qCity?: string,) {
    this.isLoadingResults = true;
    this.invoiceService.getInvoices(status, qCustomer, qDesde, qHasta, qCity, this.paginator.pageIndex + 1, this.paginator.pageSize).subscribe(response => {

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

    console.log(this.status);

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

    // if (this.qCity === undefined || this.qCity == null) {
    //   this.qCity = ''
    // } else {
    //   this.qCity = this.citySelected;
    // }

    const filters = {
      status: this.status, // example filter
      start_date: this.qf1,
      end_date: this.qf2,
      customer_name: this.qCustomer,
      city_id: this.citySelected

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

  getCities() {
    this.cityService.getCities().subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        this.cities = respuesta.data
      }
    });
  }

  // getCityId(id: number) {
  //   if (this.cities.length > 0) {
  //     this.citySelected = this.cities.filter(city => city.id == id);
  //   }
  //   console.log(this.citySelected[0].id);
  // }

  //Obtener el id del Selected
  getCityId($event: any) {
    this.citySelected = $event;
    // console.log(this.citySelected);

  }

  showError() {
    this.snackbarService.showError('☹️ Cliente ya se encuentra registrado');
  }

  showSuccess() {
    this.snackbarService.showSuccess('Cliente agregado correctamente');
  }



}
