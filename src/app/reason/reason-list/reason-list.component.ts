import { Component, ViewChild } from '@angular/core';
import { Reason } from '../Models/ReasonResponse';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ReasonService } from '../reason.service';
import { ReasonCreateComponent } from '../reason-create/reason-create.component';

@Component({
  selector: 'app-reason-list',
  templateUrl: './reason-list.component.html',
  styleUrl: './reason-list.component.scss'
})
export class ReasonListComponent {

  displayedColumns: string[] = ['id', 'type', 'name', 'status', 'acciones'];
  public dataSource!: MatTableDataSource<Reason>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  subscription!: Subscription

  public respuesta: Reason[] = [];

  constructor(private reasonService: ReasonService, public dialog: MatDialog) { }

  ngOnInit() {
    this.getReasons();
    this.subscription = this.reasonService.refresh$.subscribe(() => {
      this.getReasons()
    });

  }

  //Filtro de la tabla
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  //Obtener los motivos
  getReasons() {
    this.reasonService.getReasons().subscribe((respuesta) => {

      if (respuesta.data.length > 0) {
        this.dataSource = new MatTableDataSource(respuesta.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      //  console.log(respuesta)
    });
  }


  //abrir el form create
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';
    this.dialog.open(ReasonCreateComponent, dialogConfig);

    this.dialog.afterAllClosed.subscribe(() => {
    })
  }

  //formulario editar
  openEditDialog(id: number) {

    // this.boxService.getBoxByID(id).subscribe(respuesta => {
    //   this.respuesta = respuesta.data;

    //   if (respuesta.data) {

    //     const dialogConfig = new MatDialogConfig();

    //     dialogConfig.disableClose = true;
    //     dialogConfig.autoFocus = true;
    //     dialogConfig.width = '40%';
    //     dialogConfig.data = this.respuesta;

    //     this.dialog.open(BoxEditComponent, dialogConfig);
    //     this.dialog.afterAllClosed.subscribe(() => { })
    //   }
    // });
  }



}
