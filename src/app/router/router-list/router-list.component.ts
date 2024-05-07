import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { CRouter } from '../Models/CRouter';
import { Box } from '../../box/Models/ResponseBox';
import { RouterCreateComponent } from '../router-create/router-create.component';
import { RouterEditComponent } from '../router-edit/router-edit.component';
import { RouterService } from '../router.service';

@Component({
  selector: 'app-router-list',
  templateUrl: './router-list.component.html',
  styleUrl: './router-list.component.css'
})
export class RouterListComponent {
  displayedColumns: string[] = ['id', 'ip', 'usuario', 'password', 'port', 'api_connection', 'status', 'acciones'];
  public dataSource!: MatTableDataSource<CRouter[]>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  subscription!: Subscription

  public respuesta?: Box;

  constructor(private routerService: RouterService, public dialog: MatDialog) { }

  ngOnInit() {
    this.getBoxes();
    this.subscription = this.routerService.refresh$.subscribe(() => {
      this.getBoxes()
    });

  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getBoxes() {
    this.routerService.getRouters().subscribe((respuesta) => {

      if (respuesta.data.length > 0) {
        this.dataSource = new MatTableDataSource(respuesta.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      //  console.log(respuesta)
    });
  }


  getBoxById(id: number) {
    this.routerService.getRouterByID(id).subscribe(respuesta => {
      this.respuesta = respuesta;
      //  console.log(respuesta);
    });
  }


  openDialog(row: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';
    this.dialog.open(RouterCreateComponent, dialogConfig);

    this.dialog.afterAllClosed.subscribe(() => {
    })
  }


  openEditDialog(id: number) {

    this.routerService.getRouterByID(id).subscribe(respuesta => {
      this.respuesta = respuesta.data;
      console.log(respuesta);

      if (respuesta.data) {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = '40%';
        dialogConfig.data = this.respuesta;

        this.dialog.open(RouterEditComponent, dialogConfig);
        this.dialog.afterAllClosed.subscribe(() => { })
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
}
