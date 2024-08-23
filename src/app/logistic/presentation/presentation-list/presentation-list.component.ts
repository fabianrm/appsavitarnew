import { Component, ViewChild } from '@angular/core';
import { Presentation, PresentationResponse } from '../models/PresentationResponse';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PresentationService } from '../presentation.service';
import { PresentationCreateComponent } from '../presentation-create/presentation-create.component';
import { PresentationEditComponent } from '../presentation-edit/presentation-edit.component';

@Component({
  selector: 'app-presentation-list',
  templateUrl: './presentation-list.component.html',
  styleUrl: './presentation-list.component.scss'
})
export class PresentationListComponent {

  displayedColumns: string[] = ['id', 'name', 'prefix', 'status', 'acciones'];
  public dataSource!: MatTableDataSource<Presentation[]>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  subscription!: Subscription

  public respuesta?: PresentationResponse;

  constructor(private presentationService: PresentationService, public dialog: MatDialog) { }

  ngOnInit() {
    this.getBrands();
    this.subscription = this.presentationService.refresh$.subscribe(() => {
      this.getBrands()
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  getBrands() {
    this.presentationService.getPresentations().subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        this.dataSource = new MatTableDataSource(respuesta.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      //  console.log(respuesta)
    });
  }


  getBrandById(id: number) {
    this.presentationService.getPresentationByID(id).subscribe(respuesta => {
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
    this.dialog.open(PresentationCreateComponent, dialogConfig);

    this.dialog.afterAllClosed.subscribe(() => {
    })
  }

  openEditDialog(id: number) {

    this.presentationService.getPresentationByID(id).subscribe(respuesta => {
      console.log(respuesta.data);

      this.respuesta = respuesta.data;

      if (respuesta.data) {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        // dialogConfig.width = '40%';
        dialogConfig.height = '380px';
        dialogConfig.data = this.respuesta;

        this.dialog.open(PresentationEditComponent, dialogConfig);
        this.dialog.afterAllClosed.subscribe(() => { })
      }
    });
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


}
