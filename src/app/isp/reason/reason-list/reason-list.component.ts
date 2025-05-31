import { Component, ViewChild } from '@angular/core';
import { Reason } from '../Models/ReasonResponse';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ReasonService } from '../reason.service';
import { ReasonCreateComponent } from '../reason-create/reason-create.component';
import { ReasonEditComponent } from '../reason-edit/reason-edit.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reason-list',
  templateUrl: './reason-list.component.html',
  styleUrl: './reason-list.component.scss',
  standalone: false
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
    this.dialog.open(ReasonCreateComponent, dialogConfig);
    this.dialog.afterAllClosed.subscribe(() => {
    })
  }

  //formulario editar
  openEditDialog(row: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    //  dialogConfig.width = '40%';
    dialogConfig.data = row;
    this.dialog.open(ReasonEditComponent, dialogConfig);
    this.dialog.afterAllClosed.subscribe(() => { })
  }

  suspendReason(id: number) {
    const datosSend = {
      status: false
    };


    Swal.fire({
      title: "Esta seguro?",
      text: "Este motivo no se mostrará al registrar nuevos egresos!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#43a047",
      cancelButtonColor: "#e91e63",
      confirmButtonText: "Si, desactivar motivo!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.reasonService.suspendReason(id, datosSend).subscribe(respuesta => {
          Swal.fire(
            'Guardado!',
            'Motivo desactivado éxito.',
            'success'
          ).then(r => {
            if (r) {
              // this.dialogRef.close();
            }
          })
        }, error => {
          console.error('Error al guardar los datos:', error);
        });
      }
    });

    // this.reasonService.suspendReason(id, status).subscribe(respuesta => {
    //   this.msgSusscess('Motivo de gasto actualizado correctamente');
    //   this.dialogRef.close();
    //   // console.log(respuesta);
    // });
  }








}
