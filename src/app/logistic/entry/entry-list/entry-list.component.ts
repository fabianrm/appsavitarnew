import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Entry, EntryResponse } from '../models/EntryResponse';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { EntryService } from '../entry.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrl: './entry-list.component.scss'
})
export class EntryListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'date', 'document_number', 'supplier_id', 'entry_type_id', 'status', 'acciones'];
  public dataSource!: MatTableDataSource<Entry>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  subscription!: Subscription

  public respuesta: EntryResponse[] = [];

  constructor(private entryService: EntryService, private router: Router,) { }

  ngOnInit() {
    this.getEntries();
    this.subscription = this.entryService.refresh$.subscribe(() => {
      this.getEntries()
    });

  }

  getEntries() {
    this.entryService.getEntries().subscribe((respuesta) => {
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


  newEntry() {
    this.router.navigateByUrl('/dashboard/entry/entry-create'); // Navega al componente "contrato"
  }

  viewDetails(id:number):void{}

}
