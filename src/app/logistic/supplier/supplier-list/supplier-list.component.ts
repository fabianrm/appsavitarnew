import { Component, ViewChild } from '@angular/core';
import { Supplier } from '../models/SupplierResponse';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { SupplierService } from '../supplier.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SupplierCreateComponent } from '../supplier-create/supplier-create.component';
import { SupplierEditComponent } from '../supplier-edit/supplier-edit.component';

@Component({
    selector: 'app-supplier-list',
    templateUrl: './supplier-list.component.html',
    styleUrl: './supplier-list.component.scss',
    standalone: false
})
export class SupplierListComponent {

  displayedColumns: string[] = ['id', 'ruc', 'name', 'address', 'phone', 'email', 'status', 'acciones'];
  public dataSource!: MatTableDataSource<Supplier>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  subscription!: Subscription


  constructor(
    private supplierService: SupplierService,
    private router: Router,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.getSuppliers();
    this.subscription = this.supplierService.refresh$.subscribe(() => {
      this.getSuppliers()
    });

  }

  getSuppliers() {
    this.supplierService.getSuppliers().subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        this.dataSource = new MatTableDataSource(respuesta.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  newSupplier() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(SupplierCreateComponent, dialogConfig);
    this.dialog.afterAllClosed.subscribe(() => { });
  }

  editSupplier(row: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = row;
    this.dialog.open(SupplierEditComponent, dialogConfig);
    this.dialog.afterAllClosed.subscribe(() => { });
  }


}
