import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { CustomerService } from '../customer.service';
import { CCustomer } from '../Models/CCustomer';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CustomerCreateComponent } from '../customer-create/customer-create.component';
import { CustomerEditComponent } from '../customer-edit/customer-edit.component';
import { ReqCustomer } from '../Models/ResponseCustomer';
import { ContractCreateComponent } from '../../contract/contract-create/contract-create.component';
import { ContractService } from '../../contract/contract.service';

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

  displayedColumns: string[] = ['id', 'type', 'document_number', 'name', 'address', 'reference', 'latitude', 'longitude',  'phone_number', 'email', 'status', 'acciones'];
  public dataSource!: MatTableDataSource<CCustomer[]>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  subscription!: Subscription

  public respuesta?: ReqCustomer;


  constructor(private customerService: CustomerService, private contractService: ContractService, public dialog: MatDialog) { }


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

  getCustomerById(id: number) {
    this.customerService.getCustomerByID(id).subscribe(respuesta => {
      this.respuesta = respuesta;
      //  console.log(respuesta);
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

    this.customerService.getCustomerByID(id).subscribe(respuesta => {
      this.respuesta = respuesta.data;

      if (respuesta.data) {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = '40%';
        dialogConfig.data = this.respuesta;

        this.dialog.open(CustomerEditComponent, dialogConfig);
        this.dialog.afterAllClosed.subscribe(() => { })
      }

      // console.log(respuesta);
    });

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



}
