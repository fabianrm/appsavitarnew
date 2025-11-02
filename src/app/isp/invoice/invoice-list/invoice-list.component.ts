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
import Swal from 'sweetalert2';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.scss',
  standalone: false
})
export class InvoiceListComponent implements OnInit {

  availableColumns: string[] = ['Id', 'Contrato', 'Cliente', 'Dirección', 'Plan', 'Período', 'Precio', 'Dscto', 'Monto', 'Inicio', 'Fin', 'Vencimiento', 'F. Pago', 'Nota', 'Estado', 'createdBy', 'updatedBy', 'updatedAt', 'Acciones'];
  displayedColumns: string[] = ['Contrato', 'Cliente', 'Plan', 'Dirección', 'Período', 'Precio', 'Dscto', 'Monto', 'Vencimiento', 'F. Pago', 'Estado', 'Acciones'];

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

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.subscription = this.invoiceService.refresh$.subscribe(() => {
      this.getInvoices();
    });
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


  // actualizarColumnasVisibles(columnasSeleccionadas: any[]) {
  //   this.displayedColumns = columnasSeleccionadas.map(opcion => opcion.value);
  // }


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
    // if (confirm(`¿Estás seguro de resetear la factura ${row.receipt} del cliente ${row.customerName}?`)) {
    //   this.invoiceService.resetInvoice(row.invoiceId).subscribe(() => {
    //     this.snackbarService.showSuccess('Factura reseteada correctamente');
    //     this.getInvoices();
    //   }, (error) => {
    //     this.snackbarService.showError('Error al resetear la factura: ' + error);
    //   });
    // }

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
              // console.error('Error al guardar los datos:', err);
              // this.showError();
              //this.snackbarService.showError('Error al registrar el pago: ' + err);
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
