import { Component, ViewChild } from '@angular/core';
import { Employee, EmployeeResponse } from '../models/EmployeeResponse';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { EmployeeService } from '../employee.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EmployeeCreateComponent } from '../employee-create/employee-create.component';
import { EmployeeEditComponent } from '../employee-edit/employee-edit.component';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent {

  displayedColumns: string[] = ['id', 'code', 'name', 'address', 'phone', 'position', 'department', 'status', 'acciones'];
  public dataSource!: MatTableDataSource<Employee>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  subscription!: Subscription

  public respuesta?: EmployeeResponse;

  constructor(private employeeService: EmployeeService, public dialog: MatDialog) { }

  ngOnInit() {
    this.getEmployees();
    this.subscription = this.employeeService.refresh$.subscribe(() => {
      this.getEmployees()
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  getEmployees() {
    this.employeeService.getEmployees().subscribe((respuesta) => {
      // console.log(respuesta.data);
      if (respuesta.data.length > 0) {
        this.dataSource = new MatTableDataSource(respuesta.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }


  // getBrandById(id: number) {
  //   this.categoryService.getCategoryByID(id).subscribe(respuesta => {
  //     this.respuesta = respuesta;
  //   });
  // }


  deleteBrand(id: number) {

  }

  openDialog(row: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    // dialogConfig.width = '40%';
    dialogConfig.height = '450px';
    this.dialog.open(EmployeeCreateComponent, dialogConfig);

    this.dialog.afterAllClosed.subscribe(() => {
    })
  }

  // openEditDialog(id: number) {

  //   this.employeeService.getCategoryByID(id).subscribe(respuesta => {
  //     console.log(respuesta.data);

  //     this.respuesta = respuesta.data;

  //     if (respuesta.data) {
  //       const dialogConfig = new MatDialogConfig();

  //       dialogConfig.disableClose = true;
  //       dialogConfig.autoFocus = true;
  //       // dialogConfig.width = '40%';
  //       dialogConfig.height = '380px';
  //       dialogConfig.data = this.respuesta;

  //       this.dialog.open(EmployeeEditComponent, dialogConfig);
  //       this.dialog.afterAllClosed.subscribe(() => { })
  //     }
  //   });
  // }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


}
