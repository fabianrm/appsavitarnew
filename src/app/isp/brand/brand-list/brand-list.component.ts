import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Brand, BrandResponse } from '../Models/BrandResponse';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { BrandService } from '../brand.service';
import { BrandCreateComponent } from '../brand-create/brand-create.component';
import { BrandEditComponent } from '../brand-edit/brand-edit.component';

@Component({
    selector: 'app-brand-list',
    templateUrl: './brand-list.component.html',
    styleUrl: './brand-list.component.scss',
    standalone: false
})
export class BrandListComponent {

  displayedColumns: string[] = ['id', 'name', 'status', 'acciones'];
  public dataSource!: MatTableDataSource<Brand[]>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  subscription!: Subscription

  public respuesta?: BrandResponse;

  constructor(private brandService: BrandService, public dialog: MatDialog) { }

  ngOnInit() {
    this.getBrands();
    this.subscription = this.brandService.refresh$.subscribe(() => {
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
    this.brandService.getBrands().subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        this.dataSource = new MatTableDataSource(respuesta.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      //  console.log(respuesta)
    });
  }


  getBrandById(id: number) {
    this.brandService.getBrandByID(id).subscribe(respuesta => {
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
    this.dialog.open(BrandCreateComponent, dialogConfig);

    this.dialog.afterAllClosed.subscribe(() => {
    })
  }

  openEditDialog(id: number) {

    this.brandService.getBrandByID(id).subscribe(respuesta => {
      console.log(respuesta.data);
      
      this.respuesta = respuesta.data;

      if (respuesta.data) {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        // dialogConfig.width = '40%';
        dialogConfig.height = '380px';
        dialogConfig.data = this.respuesta;

        this.dialog.open(BrandEditComponent, dialogConfig);
        this.dialog.afterAllClosed.subscribe(() => { })
      }
    });
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
