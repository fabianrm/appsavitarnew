import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { CRouter } from '../Models/CRouter';
import { Box } from '../../box/Models/BoxResponse';
import { RouterCreateComponent } from '../router-create/router-create.component';
import { RouterEditComponent } from '../router-edit/router-edit.component';
import { RouterService } from '../router.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { TestComponent } from '../test/test.component';
import { InfiltradosComponent } from '../infiltrados/infiltrados.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-router-list',
  templateUrl: './router-list.component.html',
  styleUrl: './router-list.component.css',
  standalone: false
})
export class RouterListComponent {

  availableColumns: string[] = ['id', 'ip', 'usuario', 'password', 'port', 'api_connection', 'status', 'acciones'];
  displayedColumns: string[] = ['id', 'ip', 'usuario', 'status', 'acciones'];
  public dataSource!: MatTableDataSource<CRouter[]>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatMenuTrigger) columnasMenuTrigger!: MatMenuTrigger;

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

  actualizarColumnasVisibles(columnasSeleccionadas: any[]) {
    this.displayedColumns = columnasSeleccionadas.map(opcion => opcion.value);
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


  openDialogTest(id: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';
    dialogConfig.data = id
    this.dialog.open(TestComponent, dialogConfig);

    this.dialog.afterAllClosed.subscribe(() => {
    })
  }


  openInfiltrados(id: number) {


    Swal.fire({
      title: "Auditar Router",
      text: '...',
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#43a047",
      cancelButtonColor: "#e91e63",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Conectar",
      input: "password",
      inputLabel: 'Digite clave maestra',
    }).then((result) => {
      if (result.value === 'Ch1p1l1n') {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = '40%';
        dialogConfig.data = id
        this.dialog.open(InfiltradosComponent, dialogConfig);

        this.dialog.afterAllClosed.subscribe(() => {
        })
      }

    })

  }


  openEditDialog(id: number) {

    this.routerService.getRouterByID(id).subscribe(respuesta => {
      this.respuesta = respuesta.data;
      //console.log(respuesta);

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
