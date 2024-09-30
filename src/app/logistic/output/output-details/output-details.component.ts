import { Component, Inject, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OutputDetail } from '../models/OutputResponse';

@Component({
  selector: 'app-output-details',
  templateUrl: './output-details.component.html',
  styleUrl: './output-details.component.scss'
})
export class OutputDetailsComponent {

  displayedColumns: string[] = ['code', 'material', 'brand', 'presentation', 'quantity'];
  public dataSource!: MatTableDataSource<OutputDetail>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public respuesta!: OutputDetail;

  constructor(
    @Inject(MAT_DIALOG_DATA) public getData: any) { }

  ngOnInit() {
    this.getEntryDetails()
  }

  getEntryDetails() {
    if (this.getData) {
    //  console.log(this.getData);
      this.dataSource = new MatTableDataSource(this.getData);
      //console.log(respuesta.data.output_details);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }


  }

}
