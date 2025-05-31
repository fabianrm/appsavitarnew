import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { OutputService } from '../output.service';
import { Router } from '@angular/router';
import { Output } from '../models/OutputResponse';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { OutputDetailsComponent } from '../output-details/output-details.component';

@Component({
  selector: 'app-output-list',
  templateUrl: './output-list.component.html',
  styleUrl: './output-list.component.scss',
  standalone: false
})
export class OutputListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'date', 'number', 'destination', 'employee', 'total', 'comment', 'status', 'acciones'];
  public dataSource!: MatTableDataSource<Output>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  subscription!: Subscription

  public respuesta: Output[] = [];

  constructor(private ouputService: OutputService, private router: Router, public dialog: MatDialog) { }

  ngOnInit() {
    this.getOutputs();
    this.subscription = this.ouputService.refresh$.subscribe(() => {
      this.getOutputs()
    });

  }

  getOutputs() {
    this.ouputService.getOutputs().subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        //console.log(respuesta.data);      
        this.respuesta = respuesta.data;
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


  newOutput() {
    this.router.navigateByUrl('/dashboard/output/output-create'); // Navega al componente "contrato"
  }


  viewDetails(row: Output) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '800px';
    dialogConfig.maxWidth = '95dvw';
    //dialogConfig.height = '380px';
    dialogConfig.data = row.output_details;
    this.dialog.open(OutputDetailsComponent, dialogConfig);

    this.dialog.afterAllClosed.subscribe(() => {
    })
  }



}
