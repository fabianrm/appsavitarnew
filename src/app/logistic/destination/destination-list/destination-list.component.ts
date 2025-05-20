import { Component, ViewChild } from '@angular/core';
import { Destination, DestinationResponse } from '../models/DestinationResponse';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { DestinationService } from '../destination.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DestinationCreateComponent } from '../destination-create/destination-create.component';
import { DestinationEditComponent } from '../destination-edit/destination-edit.component';

@Component({
    selector: 'app-destination-list',
    templateUrl: './destination-list.component.html',
    styleUrl: './destination-list.component.scss',
    standalone: false
})
export class DestinationListComponent {

  displayedColumns: string[] = ['id', 'name', 'status', 'acciones'];
  public dataSource!: MatTableDataSource<Destination>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  subscription!: Subscription

  public respuesta?: DestinationResponse;

  constructor(private destineService: DestinationService, public dialog: MatDialog) { }

  ngOnInit() {
    this.getDestinations();
    this.subscription = this.destineService.refresh$.subscribe(() => {
      this.getDestinations()
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  getDestinations() {
    this.destineService.getDestinations().subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        this.dataSource = new MatTableDataSource(respuesta.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      //  console.log(respuesta)
    });
  }


  getDestineById(id: number) {
    this.destineService.getDestineById(id).subscribe(respuesta => {
      this.respuesta = respuesta;
    });
  }


  deleteBrand(id: number) {

  }

  openDialog(row: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    // dialogConfig.width = '40%';
    dialogConfig.height = '380px';
    this.dialog.open(DestinationCreateComponent, dialogConfig);

    this.dialog.afterAllClosed.subscribe(() => {
    })
  }

  openEditDialog(id: number) {

    this.destineService.getDestineById(id).subscribe(respuesta => {
      console.log(respuesta.data);

      this.respuesta = respuesta.data;

      if (respuesta.data) {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        // dialogConfig.width = '40%';
        dialogConfig.height = '380px';
        dialogConfig.data = this.respuesta;

        this.dialog.open(DestinationEditComponent, dialogConfig);
        this.dialog.afterAllClosed.subscribe(() => { })
      }
    });
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
