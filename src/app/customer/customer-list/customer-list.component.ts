import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { CustomerService } from '../customer.service';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Customer } from '../Models/CustomerResponse';
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContractsListComponent } from '../contracts-list/contracts-list.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.css'
})
export class CustomerListComponent implements OnInit, OnDestroy {

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  displayedColumns: string[] = ['id', 'customerCode', 'customerName', 'city', 'address', 'reference', 'latitude', 'longitude', 'phoneNumber', 'status', 'acciones'];
  public dataSource!: MatTableDataSource<Customer>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  subscription!: Subscription
  public respuesta?: Customer[];


  constructor(
    private customerService: CustomerService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private router: Router
  ) { }


  ngOnInit() {
    this.getCustomers();
    this.subscription = this.customerService.refresh$.subscribe(() => {
      this.getCustomers()
    });

  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
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



  getCustomers() {
    this.customerService.getCustomers().subscribe((respuesta) => {

      if (respuesta.data.length > 0) {
        this.dataSource = new MatTableDataSource(respuesta.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      //  console.log(respuesta)
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
            this.msgSusscess(`Error al eliminar el cliente: ${respuesta.data.message}`);
          
          }
        }, error => {
          console.log('Error al eliminar el cliente', error.message);
        });
      }
    });
  }


  onSelectCustomer( id: number) {
    this.router.navigate(['/dashboard/contract/new-contract/'+id]); // Navega al componente "contrato"
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


  viewMap(latitude: string, longitude: string) {
    //'https://www.google.com/maps?q=-4.907545,-81.057223&hl=es-Pe&gl=pe&shorturl=1;'
    window.open(`https://www.google.com/maps?q=${latitude},${longitude}&hl=es-Pe&gl=pe&shorturl=1;`, "_blank");
  }

  exportToExcel() {
    this.customerService.exportCustomers().subscribe((response) => {
      saveAs(response, 'customers.xlsx');
    });
  }


  msgSusscess(mensaje: string) {
    this._snackBar.open(mensaje, 'SAVITAR', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    })
  }

}
