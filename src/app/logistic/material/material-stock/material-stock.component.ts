import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { MaterialService } from '../material.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MaterialLocationComponent } from '../material-location/material-location.component';

@Component({
  selector: 'app-material-stock',
  templateUrl: './material-stock.component.html',
  styleUrl: './material-stock.component.scss'
})
export class MaterialStockComponent {

  displayedColumns: string[] = ['code', 'name', 'brand', 'unit', 'total_stock', 'acciones'];
  public dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  subscription!: Subscription

  public respuesta: any[] = [];

  constructor(private materialService: MaterialService, private router: Router, public dialog: MatDialog) { }

  ngOnInit() {
    this.getMaterials();
    this.subscription = this.materialService.refresh$.subscribe(() => {
      this.getMaterials()
    });

  }

  getMaterials() {
    this.materialService.getStockMaterials().subscribe((respuesta) => {

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


  viewDetails(id: number) {
    this.router.navigate(['/dashboard/kardex/kardex/' + id]);
  }

 
  //Aciones
  viewLocations(id: number) {

    this.materialService.getMaterialsLocation(id).subscribe((respuesta) => {
   //   console.log(respuesta);
      if (respuesta.data) {
       // console.log('Enviando datos...');
      
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = '600px';
        dialogConfig.data = respuesta.data;
        this.dialog.open(MaterialLocationComponent, dialogConfig);
        this.dialog.afterAllClosed.subscribe(() => { });

      }

    });


   
  }

}
