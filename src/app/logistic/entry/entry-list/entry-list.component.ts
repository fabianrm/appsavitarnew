import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Entry, EntryResponse } from '../models/EntryResponse';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { EntryService } from '../entry.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EntryDetailsComponent } from '../entry-details/entry-details.component';
import Swal from 'sweetalert2';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrl: './entry-list.component.scss',
  standalone: false
})
export class EntryListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'date', 'document', 'document_number', 'supplier_id', 'entry_type_id', 'total', 'status', 'acciones'];
  public dataSource!: MatTableDataSource<Entry>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  subscription!: Subscription

  public respuesta: EntryResponse[] = [];

  constructor(private entryService: EntryService, private router: Router, public dialog: MatDialog, private snackbarService: SnackbarService,) { }

  ngOnInit() {
    this.getEntries();
    this.subscription = this.entryService.refresh$.subscribe(() => {
      this.getEntries()
    });

  }

  getEntries() {
    this.entryService.getEntries().subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        this.dataSource = new MatTableDataSource(respuesta.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        // console.log(respuesta.data);

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


  newEntry() {
    this.router.navigateByUrl('/dashboard/entry/entry-create'); // Navega al componente "contrato"
  }

  viewDetails(id: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = id;
    dialogConfig.width = '800px';
    dialogConfig.maxWidth = '95vw';
    this.dialog.open(EntryDetailsComponent, dialogConfig);
    this.dialog.afterAllClosed.subscribe(() => {
    })
  }

  deleteEntry(id: number) {
    Swal.fire({
      title: "Esta seguro?",
      text: "se procederá a eliminar el ingreso junto con sus detalles!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#43a047",
      cancelButtonColor: "#e91e63",
      confirmButtonText: "Si, eliminar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.entryService.deleteEntry(id).subscribe((respuesta) => {
          if (respuesta.status == 'true') {
            Swal.fire(
              'Eliminado!',
              respuesta.message,
              'success'
            ).then(r => {
              if (r) {
                //this.dialogRef.close();
              }
            })
          } else {
            this.snackbarService.showError(`☹️ Ocurrio un error: ${respuesta.data.message}`);
          }
        }, error => {
          console.log('Error al anular el ingreso', error.message);
        });
      }
    });

  }


  showError() {
    this.snackbarService.showError('☹️ Ocurrio un error');
  }

  showSuccess() {
    this.snackbarService.showSuccess('Registro agregado correctamente');
  }

}
