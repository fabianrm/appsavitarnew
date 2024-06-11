import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { CustomerService } from '../customer.service';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CustomerCreateComponent } from '../customer-create/customer-create.component';
import { CustomerEditComponent } from '../customer-edit/customer-edit.component';
import { ContractCreateComponent } from '../../contract/contract-create/contract-create.component';
import { ContractService } from '../../contract/contract.service';
import { Customer } from '../Models/CustomerResponse';
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContractListComponent } from '../../contract/contract-list/contract-list.component';
import { ContractsListComponent } from '../contracts-list/contracts-list.component';

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
    private contractService: ContractService,
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



  // deleteCustomers(id: number) {
  //   this.customerService.deleteCustomer(id).subscribe((respuesta) => {
  //     if (respuesta.data.status == true) { 
  //       console.log('cliente eliminado', respuesta.data.message);
        
  //     } else {
  //       console.log('error', respuesta.data.message);
  //     }

  //    // console.log(respuesta);
      
  //   });

  // }



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



  openDialog(row: any) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';

    this.dialog.open(CustomerCreateComponent, dialogConfig);

    this.dialog.afterAllClosed.subscribe(() => {
    })
  }

  openEditDialog(id: number) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';
    dialogConfig.data = id;

    this.dialog.open(CustomerEditComponent, dialogConfig);
    this.dialog.afterAllClosed.subscribe(() => { })
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


  openDialogContract(row: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    dialogConfig.data = row;
    this.dialog.open(ContractCreateComponent, dialogConfig);

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
