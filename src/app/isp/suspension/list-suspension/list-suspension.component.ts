import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Suspension } from '../models/SuspensionResponse';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { SuspensionService } from '../suspension.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-list-suspension',
  templateUrl: './list-suspension.component.html',
  styleUrl: './list-suspension.component.scss'
})
export class ListSuspensionComponent implements OnInit {

  displayedColumns: string[] = ['id', 'codigo_contrato', 'cliente', 'plan', 'fecha_inicio', 'fecha_fin', 'motivo', 'observacion', 'status', 'acciones'];
  public dataSource!: MatTableDataSource<Suspension[]>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  subscription!: Subscription

  public respuesta?: Suspension;

  constructor(private suspensionService: SuspensionService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getSuspensions();
  }


  getSuspensions() {
    this.suspensionService.getSuspensions().subscribe(data => {
      console.log(data);
    })
  }

}
