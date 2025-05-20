import { Component, ViewChild } from '@angular/core';
import { Category, CategoryResponse } from '../models/CategoryResponse';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { CategoryService } from '../category.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CategoryCreateComponent } from '../category-create/category-create.component';
import { CategoryEditComponent } from '../category-edit/category-edit.component';

@Component({
    selector: 'app-category-list',
    templateUrl: './category-list.component.html',
    styleUrl: './category-list.component.scss',
    standalone: false
})
export class CategoryListComponent {

  displayedColumns: string[] = ['id', 'name', 'status', 'acciones'];
  public dataSource!: MatTableDataSource<Category[]>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  subscription!: Subscription

  public respuesta?: CategoryResponse;

  constructor(private categoryService: CategoryService, public dialog: MatDialog) { }

  ngOnInit() {
    this.getBrands();
    this.subscription = this.categoryService.refresh$.subscribe(() => {
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
    this.categoryService.getCategories().subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        this.dataSource = new MatTableDataSource(respuesta.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      //  console.log(respuesta)
    });
  }


  getBrandById(id: number) {
    this.categoryService.getCategoryByID(id).subscribe(respuesta => {
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
    this.dialog.open(CategoryCreateComponent, dialogConfig);

    this.dialog.afterAllClosed.subscribe(() => {
    })
  }

  openEditDialog(id: number) {

    this.categoryService.getCategoryByID(id).subscribe(respuesta => {
      console.log(respuesta.data);

      this.respuesta = respuesta.data;

      if (respuesta.data) {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        // dialogConfig.width = '40%';
        dialogConfig.height = '380px';
        dialogConfig.data = this.respuesta;

        this.dialog.open(CategoryEditComponent, dialogConfig);
        this.dialog.afterAllClosed.subscribe(() => { })
      }
    });
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
