import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { CustomerService } from '../customer.service';
import { Subscription } from 'rxjs';
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
export class CustomerListComponent implements OnInit, OnDestroy {

  availableColumns: string[] = ['id', 'customerCode', 'customerName', 'city', 'address', 'reference', 'latitude', 'longitude', 'phoneNumber', 'status', 'acciones'];

  displayedColumns: string[] = ['customerCode', 'customerName', 'city', 'address', 'reference', 'phoneNumber', 'status', 'acciones'];

  public dataSource: MatTableDataSource<Customer> = new MatTableDataSource<Customer>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  subscription!: Subscription

  private allCustomers: Customer[] = [];
  cities: City[] = [];

  filterName = '';
  filterCityId: number | null = null;
  filterStatus: boolean | null = null;

  constructor(
    private customerService: CustomerService,
    public dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router,
    private cityService: CityService
  ) { }


  ngOnInit() {
    this.getCustomers();
    this.getCities();
    this.subscription = this.customerService.refresh$.subscribe(() => {
      this.getCustomers()
    });

  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getCities() {
    this.cityService.getCities().subscribe((respuesta) => {
      this.cities = respuesta.data ?? [];
    });
  }

  applyFilters() {
    const name = this.filterName.trim().toLowerCase();

    this.dataSource.data = this.allCustomers.filter((customer) => {
      if (name && !customer.customerName?.toLowerCase().includes(name)) return false;
      if (this.filterCityId && customer.cityId !== this.filterCityId) return false;
      if (this.filterStatus !== null && customer.status !== this.filterStatus) return false;
      return true;
    });

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearFilters() {
    this.filterName = '';
    this.filterCityId = null;
    this.filterStatus = null;
    this.dataSource.data = this.allCustomers;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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
    this.customerService.getCustomers().subscribe((respuesta) => {
      this.allCustomers = respuesta.data ?? [];
      this.dataSource.data = this.allCustomers;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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
