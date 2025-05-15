import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SuspensionService } from '../suspension.service';
import { Suspension } from '../models/SuspensionResponse';

@Component({
  selector: 'app-list-suspension',
  templateUrl: './list-suspension.component.html',
  styleUrl: './list-suspension.component.scss'
})
export class ListSuspensionComponent implements OnInit {

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  displayedColumns: string[] = ['id', 'codigo_contrato', 'cliente', 'plan', 'fecha_inicio', 'fecha_fin', 'motivo', 'observacion', 'reactivacion', 'status'];
  public dataSource!: MatTableDataSource<Suspension>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  subscription!: Subscription

  public respuesta?: Suspension;

  constructor(private suspensionService: SuspensionService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getSuspensions();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getSuspensions() {
    this.suspensionService.getSuspensions().subscribe(respuesta => {
      if (respuesta.data.length > 0) {
        this.dataSource = new MatTableDataSource(respuesta.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.dataSource.filterPredicate = (data: Suspension, filter: string) => {
          const lowerCaseFilter = filter.toLowerCase();
          const customerName = data.service.customerName.toLowerCase();
          const motivo = data.reason.toLowerCase();
          const plan = data.service.planName.toLowerCase();
          const estado = data.status.toLowerCase();

          return (
            customerName.includes(lowerCaseFilter)
            || customerName.includes(lowerCaseFilter)
            || motivo.includes(lowerCaseFilter)
            || plan.includes(lowerCaseFilter)
            || estado.includes(lowerCaseFilter)
          );
        };



      }

      // console.log(respuesta.data);
    })
  }

}
