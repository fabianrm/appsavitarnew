import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ReqBox } from '../Models/ResponseBox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BoxService } from '../box.service';
import { BoxCreateComponent } from '../box-create/box-create.component';
import { BoxEditComponent } from '../box-edit/box-edit.component';
import { CBox } from '../Models/CBox';

@Component({
  selector: 'app-box-list',
  templateUrl: './box-list.component.html',
  styleUrl: './box-list.component.css'
})
export class BoxListComponent {

  displayedColumns: string[] = ['id', 'name', 'city', 'address', 'reference', 'latitude', 'longitude', 'total_ports', 'available_ports', 'status', 'acciones'];
  public dataSource!: MatTableDataSource<CBox[]>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  subscription!: Subscription

  public respuesta?: ReqBox;

  constructor(private boxService: BoxService, public dialog: MatDialog) { }

  ngOnInit() {
    this.getBoxes();
    this.subscription = this.boxService.refresh$.subscribe(() => {
      this.getBoxes()
    });

  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getBoxes() {
    this.boxService.getBoxes().subscribe((respuesta) => {

      if (respuesta.data.length > 0) {
        this.dataSource = new MatTableDataSource(respuesta.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      //  console.log(respuesta)
    });
  }


  getBoxById(id: number) {
    this.boxService.getBoxByID(id).subscribe(respuesta => {
      this.respuesta = respuesta;
      //  console.log(respuesta);
    });
  }


  openDialog(row: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';
    this.dialog.open(BoxCreateComponent, dialogConfig);

    this.dialog.afterAllClosed.subscribe(() => {
    })
  }


  openEditDialog(id: number) {

    this.boxService.getBoxByID(id).subscribe(respuesta => {
      this.respuesta = respuesta.data;
      console.log(respuesta);
      
      if (respuesta.data) {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = '40%';
        dialogConfig.data = this.respuesta;

        this.dialog.open(BoxEditComponent, dialogConfig);
        this.dialog.afterAllClosed.subscribe(() => { })
      }


    });
  }


  goToLinkMap(latitude: string, longitude: string) {
    //'https://www.google.com/maps?q=-4.907545,-81.057223&hl=es-Pe&gl=pe&shorturl=1;'
    window.open(`https://www.google.com/maps?q=${latitude},${longitude}&hl=es-Pe&gl=pe&shorturl=1;`, "_blank");
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
