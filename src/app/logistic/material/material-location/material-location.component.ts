import { Component, Inject, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-material-location',
  templateUrl: './material-location.component.html',
  styleUrl: './material-location.component.scss'
})
export class MaterialLocationComponent {
  displayedColumns: string[] = ['warehouse', 'location'];
  public dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  subscription!: Subscription


  constructor(
    @Inject(MAT_DIALOG_DATA) public getData: any,
    private dialogRef: MatDialogRef<MaterialLocationComponent>
  ) { }

  ngOnInit() {
    this.getMaterials();
  }

  getMaterials() {
    if (this.getData) {
      console.log(this.getData);

      this.dataSource = new MatTableDataSource(this.getData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
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

  close() {
    this.dialogRef.close();

  }

}
