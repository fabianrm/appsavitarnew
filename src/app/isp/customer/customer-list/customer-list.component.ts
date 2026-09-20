import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { formatDate } from '@angular/common';
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { CustomerService } from '../customer.service';
import { Subscription, merge, startWith } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Customer } from '../Models/CustomerResponse';
import { saveAs } from 'file-saver';
import { ContractsListComponent } from '../contracts-list/contracts-list.component';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { CustomerSuspendComponent } from '../customer-suspend/customer-suspend.component';
import { CityService } from '../../city/city.service';
import { City } from '../../city/Models/CityResponse';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.css',
  standalone: false
})
export class CustomerListComponent implements OnInit, AfterViewInit, OnDestroy {

  availableColumns: string[] = ['id', 'customerCode', 'customerName', 'city', 'address', 'reference', 'latitude', 'longitude', 'phoneNumber', 'status', 'acciones'];

  displayedColumns: string[] = ['customerCode', 'customerName', 'city', 'address', 'reference', 'phoneNumber', 'status', 'acciones'];

  public dataSource: MatTableDataSource<Customer> = new MatTableDataSource<Customer>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  subscription!: Subscription

  cities: City[] = [];
  totalCustomers = 0;
  isLoadingResults = false;

  // true una vez que el usuario modifica el rango de fechas por su cuenta
  private dateRangeTouched = false;

  filterName = '';
  filterCityId: number | null = null;
  filterStatus: boolean | null = null;
  rangoFechas = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor(
    private customerService: CustomerService,
    public dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router,
    private cityService: CityService
  ) { }


  ngOnInit() {
    // Por defecto solo se muestran los clientes registrados en el último
    // mes -- traer los 741+ de una sola vez no escala. En cuanto se use
    // cualquier otro filtro sin haber tocado la fecha, esta restricción se
    // quita sola (ver searchCustomers()).
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setDate(lastMonth.getDate() - 30);
    this.rangoFechas.setValue({ start: lastMonth, end: today }, { emitEvent: false });

    this.getCustomers();
    this.getCities();

    this.subscription = this.customerService.refresh$.subscribe(() => {
      this.getCustomers()
    });

    this.subscription.add(
      this.rangoFechas.valueChanges.subscribe(() => {
        this.dateRangeTouched = true;
      }),
    );
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;

    this.subscription.add(
      merge(this.sort.sortChange, this.paginator.page)
        .pipe(startWith({}))
        .subscribe(() => this.getCustomers()),
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getCities() {
    this.cityService.getCities().subscribe((respuesta) => {
      this.cities = respuesta.data ?? [];
    });
  }

  private buildFilters() {
    const { start, end } = this.rangoFechas.value;

    return {
      dateFrom: start ? formatDate(start, 'yyyy-MM-dd', 'en-US') : undefined,
      dateTo: end ? formatDate(end, 'yyyy-MM-dd', 'en-US') : undefined,
      name: this.filterName?.trim() || undefined,
      cityId: this.filterCityId ?? undefined,
      status: this.filterStatus,
      page: (this.paginator?.pageIndex ?? 0) + 1,
      perPage: this.paginator?.pageSize ?? 10,
    };
  }

  // Reinicia a la primera página y vuelve a consultar con los filtros actuales
  applyFilters() {
    // Si el usuario busca por otro campo sin haber tocado la fecha, quitamos
    // el rango "último mes" que viene por defecto para no combinarlo
    // silenciosamente -- así puede encontrar cualquier cliente por nombre,
    // ciudad o estado sin importar cuándo se registró.
    if (!this.dateRangeTouched) {
      this.rangoFechas.setValue({ start: null, end: null }, { emitEvent: false });
    }

    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.getCustomers();
  }

  clearFilters() {
    this.filterName = '';
    this.filterCityId = null;
    this.filterStatus = null;
    this.dateRangeTouched = false;

    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setDate(lastMonth.getDate() - 30);
    this.rangoFechas.setValue({ start: lastMonth, end: today }, { emitEvent: false });

    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.getCustomers();
  }

  newCustomer() {
    this.router.navigate(['/dashboard/customer/customerCreate']); // Navega al componente "customer create"
  }

  editCustomer(id: number) {
    this.router.navigate(['/dashboard/customer/customerEdit/' + id]); // Navega al componente "customer edit"
  }

  detailCustomer(id: number) {
    this.router.navigate(['/dashboard/customer/customerDetails/' + id]); // Navega al componente "customer edit"
  }

  historyCustomer(id: number) {
    this.router.navigate(['/dashboard/customer/customerHistory/' + id]); // Navega al componente "customer edit"
  }



  getCustomers() {
    this.isLoadingResults = true;
    this.customerService.getCustomersList(this.buildFilters()).subscribe({
      next: (respuesta) => {
        this.isLoadingResults = false;
        this.totalCustomers = respuesta.meta?.total ?? respuesta.data.length;
        this.dataSource.data = respuesta.data ?? [];
      },
      error: () => {
        this.isLoadingResults = false;
      },
    });
  }


  deleteCustomer(id: number) {
    Swal.fire({
      title: "Esta seguro?",
      text: "No podrá recuperarlo después de eliminar!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#43a047",
      cancelButtonColor: "#e91e63",
      confirmButtonText: "Si, eliminar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.customerService.deleteCustomer(id).subscribe((respuesta) => {
          if (respuesta.data.status == true) {

            Swal.fire(
              'Eliminado!',
              respuesta.data.message,
              'success'
            ).then(r => {
              if (r) {
                //this.dialogRef.close();
              }
            })
          } else {
            this.snackbarService.showError(`☹️ Ocurrio un error: ${respuesta.data.message}`);
          }
        }, error => {
          console.log('Error al eliminar el cliente', error.message);
        });
      }
    });
  }


  onSelectCustomer(id: number) {
    this.router.navigate(['/dashboard/contract/new-contract/' + id]); // Navega al componente "contrato"
  }


  openListContracts(row: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    dialogConfig.data = row;
    this.dialog.open(ContractsListComponent, dialogConfig);
    this.dialog.afterAllClosed.subscribe(() => {
    })
  }



  suspend(row: any) {
    if (row.status == 1) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      //dialogConfig.width = '40%';
      dialogConfig.data = row;
      this.dialog.open(CustomerSuspendComponent, dialogConfig);
      this.dialog.afterAllClosed.subscribe(() => { });
    } else {
      this.activateCustomer(row.id);
    }
  }

  activateCustomer(id: number) {
    Swal.fire({
      title: "Esta seguro?",
      text: "Volver a activar cliente suspendido!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#43a047",
      cancelButtonColor: "#e91e63",
      confirmButtonText: "Si, activar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.customerService.activateCustomer(id).subscribe((respuesta) => {
          if (respuesta.status == true) {
            Swal.fire(
              'Activado!',
              'Cliente reactivado correctamente',
              'success'
            ).then(r => {
              if (r) {
                //this.dialogRef.close();
              }
            })
          } else {
            this.snackbarService.showError(`☹️ Ocurrio un error: ${respuesta.data.message}`);
          }
        }, error => {
          console.log('Error al activar el cliente', error.message);
        });
      }
    });
  }


  viewMap(latitude: string, longitude: string) {
    //'https://www.google.com/maps?q=-4.907545,-81.057223&hl=es-Pe&gl=pe&shorturl=1;'
    window.open(`https://www.google.com/maps?q=${latitude},${longitude}&hl=es-Pe&gl=pe&shorturl=1;`, "_blank");
  }

  exportToExcel() {
    this.customerService.exportCustomers().subscribe((response) => {
      saveAs(response, 'customers.xlsx');
    });
  }


  showError() {
    this.snackbarService.showError('☹️ Ocurrio un error');
  }

  showSuccess() {
    this.snackbarService.showSuccess('Registro agregado correctamente');
  }

}
