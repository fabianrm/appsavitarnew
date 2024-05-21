import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { InvoiceService } from '../invoice.service';
import { Invoice } from '../Models/InvoiceResponse';
import { merge, startWith, switchMap, map, catchError, of } from 'rxjs';
@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.scss'
})
export class InvoiceListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'serviceId', 'amount', 'dueDate', 'startDate', 'endDate', 'status'];
  dataSource = new MatTableDataSource<Invoice>();
  totalInvoices = 0;
  isLoadingResults = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private invoiceService: InvoiceService) { }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  loadInvoices(page: number = 1, pageSize: number = 15) {
    this.isLoadingResults = true;
    this.invoiceService.getInvoices(page, pageSize).subscribe(response => {
      this.dataSource.data = response.data;
      this.totalInvoices = response.meta.total;
      this.isLoadingResults = true;
    });
  }

  ngAfterViewInit() {
    merge(this.paginator.page, this.sort.sortChange)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.invoiceService.getInvoices(
            this.paginator.pageIndex + 1,
            this.paginator.pageSize
          );
        }),
        map(data => {
          this.isLoadingResults = false;
          this.totalInvoices = data.meta.total;

          return data.data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return of([]);
        })
      )
      .subscribe(data => (this.dataSource.data = data));
  }
}
