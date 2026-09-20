import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FormControl, FormGroup } from '@angular/forms';
import { formatDate } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { InvoiceService } from '../invoice.service';
import { Invoice } from '../Models/InvoiceResponse';
import { merge, startWith, Subscription } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { InvoicePaidComponent } from '../invoice-paid/invoice-paid.component';
import { saveAs } from 'file-saver';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { CancelInvoiceComponent } from '../cancel-invoice/cancel-invoice.component';
import { City } from '../../city/Models/CityResponse';
import { CityService } from '../../city/city.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.scss',
  standalone: false,
  animations: [
    trigger('slideInOut', [
      state('true', style({ height: '*', opacity: 1 })),
      state('false', style({ height: '0px', opacity: 0 })),
      transition('true <=> false', animate('300ms ease-in-out')),
    ]),
  ],
})
export class InvoiceListComponent implements OnInit, AfterViewInit, OnDestroy {

  availableColumns: string[] = ['Id', 'Contrato', 'Cliente', 'Dirección', 'Plan', 'Período', 'Precio', 'Dscto', 'Monto', 'Inicio', 'Fin', 'Vencimiento', 'F. Pago', 'Nota', 'Recibo', 'Estado', 'createdBy', 'updatedBy', 'updatedAt', 'Acciones'];
  displayedColumns: string[] = ['Contrato', 'Cliente', 'Plan', 'Dirección', 'Período', 'Precio', 'Dscto', 'Monto', 'Vencimiento', 'F. Pago', 'Estado', 'Acciones'];

  statusList: string[] = ['pendiente', 'pagada', 'vencida', 'anulada'];

  dataSource = new MatTableDataSource<Invoice>();
  totalInvoices = 0;
  isLoadingResults = true;
  isFilterVisible = false;
  subscription = new Subscription();

  // true mientras el usuario no haya aplicado filtros propios -- en ese caso
  // se muestran solo las facturas del período de facturación actual (las
  // 400 y tantas cuyo start_date..end_date incluye hoy) en vez de las
  // 10,000+ facturas históricas.
  private usingDefaultPeriod = true;

  status: string[] = [];
  qCustomer = '';
  rangoFechas = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  citySelected: number | null = null;

  cities: City[] = [];

  public esAdmin: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatMenuTrigger) columnasMenuTrigger!: MatMenuTrigger;

  constructor(
    private invoiceService: InvoiceService,
    private snackbarService: SnackbarService,
    private cityService: CityService,
    private authService: AuthService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.checkUserRole();
    this.getCities();

    this.subscription.add(
      this.invoiceService.refresh$.subscribe(() => {
        this.getInvoices();
      }),
    );
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;

    this.subscription.add(
      merge(this.sort.sortChange, this.paginator.page)
        .pipe(startWith({}))
        .subscribe(() => this.getInvoices()),
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  get role() {
    return Number(localStorage.getItem('role'));
  }

  get userID() {
    return Number(localStorage.getItem('id_user'));
  }

  checkUserRole(): void {
    this.authService.getRoleByID(this.userID).subscribe((response) => {
      this.esAdmin = (response.data.role_id === 1);
    });
  }

  private buildFilters() {
    const { start, end } = this.rangoFechas.value;

    return {
      status: this.status.length ? this.status.join(',') : undefined,
      qCustomer: this.qCustomer?.trim() || undefined,
      qDesde: start ? formatDate(start, 'yyyy-MM-dd', 'en-US') : undefined,
      qHasta: end ? formatDate(end, 'yyyy-MM-dd', 'en-US') : undefined,
      qCity: this.citySelected ?? undefined,
      currentPeriod: this.usingDefaultPeriod && !start && !end,
      page: (this.paginator?.pageIndex ?? 0) + 1,
      perPage: this.paginator?.pageSize ?? 10,
    };
  }

  getInvoices() {
    this.isLoadingResults = true;
    const f = this.buildFilters();

    this.invoiceService
      .getInvoices(f.status, f.qCustomer, f.qDesde, f.qHasta, f.qCity, f.page, f.perPage, f.currentPeriod)
      .subscribe({
        next: (respuesta) => {
          this.isLoadingResults = false;
          this.totalInvoices = respuesta.meta?.total ?? 0;
          this.dataSource.data = respuesta.data ?? [];
        },
        error: () => {
          this.isLoadingResults = false;
        },
      });
  }

  toggleFilters() {
    this.isFilterVisible = !this.isFilterVisible;
  }

  // Reinicia a la primera página y vuelve a consultar con los filtros actuales
  applyFilters() {
    this.usingDefaultPeriod = false;

    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.getInvoices();
  }

  clearFilters() {
    this.qCustomer = '';
    this.status = [];
    this.citySelected = null;
    this.rangoFechas.setValue({ start: null, end: null }, { emitEvent: false });
    this.usingDefaultPeriod = true;

    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.getInvoices();
  }

  actualizarColumnasVisibles(columnasSeleccionadas: any[]) {
    const columnasFijas = ['Estado', 'Acciones']; // Columnas que siempre estarán al final
    const columnasSinFijas = columnasSeleccionadas
      .map(opcion => opcion.value)
      .filter(columna => !columnasFijas.includes(columna)); // Excluir columnas fijas

    // Agregar las columnas fijas al final
    this.displayedColumns = [...columnasSinFijas, ...columnasFijas];
  }

  //Generar Invoices
  generateInvoices() {
    this.invoiceService.generateInvoices().subscribe((respuesta) => {
      if (respuesta.totalInvoices > 0) {
        this.snackbarService.showSuccess(`Se han generado ${respuesta.totalInvoices} facturas`);
        this.getInvoices();
      } else {
        this.snackbarService.showInfo(`No se encontraron facturas para generar`);
      }
    })
  }

  //Export
  exportInvoices() {
    const f = this.buildFilters();

    const filters = {
      status: f.status,
      start_date: f.qDesde,
      end_date: f.qHasta,
      customer_name: f.qCustomer,
      city_id: f.qCity,
    };

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

    if (this.esAdmin === false) {
      this.snackbarService.showError('☹️ Solo un Super Administrador puede anular facturas');
      return;
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    // dialogConfig.width = '40%';
    // dialogConfig.height = '100vh';
    dialogConfig.data = row;
    this.dialog.open(CancelInvoiceComponent, dialogConfig);
    this.dialog.afterAllClosed.subscribe(() => { });
  }

  //Resetear factura
  resetInvoice(row: any) {
    Swal.fire({
      title: "Resetear Factura",
      text: `¿Estás seguro de resetear la factura ${row.receipt} del cliente ${row.customerName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#43a047",
      cancelButtonColor: "#e91e63",
      confirmButtonText: "Si, resetear factura!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.invoiceService.resetInvoice(row.invoiceId)
          .subscribe({
            next: (response: any) => {
              Swal.fire(
                'Guardado!',
                'Factura reseteada con éxito.',
                'success'
              ).then(r => {
                if (r) {
                  console.log(r);
                }
              });
            },
            error: (err: Error) => {
              Swal.fire(
                'Error!',
                'Error al registrar el pago: ' + err,
                'error'
              ).then(r => {
                if (r) {
                  console.log(r);
                }
              });
            }
          });
      }
    });

  }

  getCities() {
    this.cityService.getCities().subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        this.cities = respuesta.data
      }
    });
  }

  showError() {
    this.snackbarService.showError('☹️ Cliente ya se encuentra registrado');
  }

  showSuccess() {
    this.snackbarService.showSuccess('Cliente agregado correctamente');
  }

}
