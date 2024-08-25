import { Component, Inject, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Entry } from '../models/EntryResponse';
import { EntryDetail, EntryDetailResponse } from '../models/EntryDetailResponse';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EntryService } from '../entry.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-entry-details',
  templateUrl: './entry-details.component.html',
  styleUrl: './entry-details.component.scss'
})
export class EntryDetailsComponent {

  displayedColumns: string[] = ['code', 'material', 'presentation', 'quantity', 'price', 'subtotal', 'warehouse', 'location'];
  public dataSource!: MatTableDataSource<EntryDetail>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public respuesta!: EntryDetail;

  constructor(
    @Inject(MAT_DIALOG_DATA) public getId: number,
    private entryService: EntryService,
    private dialogRef: MatDialogRef<EntryDetailsComponent>) { }

  ngOnInit() {
    console.log(this.getId);
    this.getEntryDetails(this.getId)
  }

  getEntryDetails(id: number) {
    this.entryService.getEntryByID(id).subscribe((respuesta) => {
      if (respuesta) {
        this.dataSource = new MatTableDataSource(respuesta.data.entry_details);
        // console.log(respuesta.data.entry_details);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }

    });

  }


}
