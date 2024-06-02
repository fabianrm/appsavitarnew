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

  displayedColumns: string[] = ['id', 'customerCode', 'customerName', 'address', 'reference', 'latitude', 'longitude', 'phoneNumber', 'status', 'acciones'];
  public dataSource!: MatTableDataSource<Customer>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  subscription!: Subscription

  public respuesta?: Customer[];


  constructor(private customerService: CustomerService, public dialog: MatDialog) { }


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

    // this.customerService.getCustomerByID(id).subscribe(respuesta => {
    //   this.respuesta = respuesta.data;

    //     const dialogConfig = new MatDialogConfig();

    //     dialogConfig.disableClose = true;
    //     dialogConfig.autoFocus = true;
    //     dialogConfig.width = '40%';
    //     dialogConfig.data = this.respuesta;

    //     this.dialog.open(CustomerEditComponent, dialogConfig);
    //     this.dialog.afterAllClosed.subscribe(() => { })
    //  //  console.log(respuesta);
    // });

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

}
