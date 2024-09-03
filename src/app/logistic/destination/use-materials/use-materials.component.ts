import { Component, OnInit, ViewChild } from '@angular/core';
import { DestinationUseResponse, DestineUse } from '../models/DestinationUse';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { DestinationService } from '../destination.service';
import { Destination } from '../models/DestinationResponse';

@Component({
  selector: 'app-use-materials',
  templateUrl: './use-materials.component.html',
  styleUrl: './use-materials.component.scss'
})
export class UseMaterialsComponent implements OnInit {

  displayedColumns: string[] = ['date', 'code', 'name', 'presentation', 'brand', 'model', 'quantity', 'subtotal'];
  tableFooterColumns: string[] = ['date', 'subtotal'];
  public dataSource!: MatTableDataSource<DestineUse>;

  //@ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  subscription!: Subscription
  public respuesta?: DestinationUseResponse;
  destinations: Destination[] = []
  destineId: number = 1;

  constructor(private destineService: DestinationService) { }

  ngOnInit() {
    this.getDestinations();
  }

  
  search() {

    this.destineService.getDestineUseById(this.destineId).subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        this.dataSource = new MatTableDataSource(respuesta.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.getTotalCost();
      }
      //  console.log(respuesta)
    });
  }

  //Destinations
  getDestinations() {
    this.destineService.getDestinations().subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        this.destinations = respuesta.data
      }
    });
  }


  getTotalCost() {
    return this.dataSource?.data.map(t => Number(t.subtotal)).reduce((acc, value) => acc + value, 0);
  }

  
  export(){}

}
