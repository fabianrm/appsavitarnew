import { Component, Inject, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { OutputService } from '../output.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OutputDetail } from '../models/OutputResponse';

@Component({
  selector: 'app-output-details',
  templateUrl: './output-details.component.html',
  styleUrl: './output-details.component.scss'
})
export class OutputDetailsComponent {

  displayedColumns: string[] = ['code', 'material', 'presentation', 'quantity', 'price', 'subtotal'];
  public dataSource!: MatTableDataSource<OutputDetail>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public respuesta!: OutputDetail;

  constructor(
    @Inject(MAT_DIALOG_DATA) public getId: number,
    private outputService: OutputService,
    private dialogRef: MatDialogRef<OutputDetailsComponent>) { }

  ngOnInit() {
    this.getEntryDetails(this.getId)
  }

  getEntryDetails(id: number) {
    this.outputService.getOutputByID(id).subscribe((respuesta) => {
      if (respuesta) {
        this.dataSource = new MatTableDataSource(respuesta.data.output_details);
        //console.log(respuesta.data.output_details);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });

  }

}
