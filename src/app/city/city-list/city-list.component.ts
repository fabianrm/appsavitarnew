import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { City, CityResponse } from '../Models/CityResponse';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { CityService } from '../city.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-city-list',
  templateUrl: './city-list.component.html',
  styleUrl: './city-list.component.scss'
})
export class CityListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'latitude', 'longitude', 'status', 'acciones'];
  public dataSource!: MatTableDataSource<City>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  subscription!: Subscription

  public respuesta: CityResponse[] = [];


  constructor(private cityService: CityService,
    public dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit() {
    this.getCities();
    this.subscription = this.cityService.refresh$.subscribe(() => {
      this.getCities()
    });


  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getCities() {
    this.cityService.getCities().subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        this.dataSource = new MatTableDataSource(respuesta.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }


  newCity() {
    this.router.navigateByUrl('/dashboard/city/city-create'); // Navega al componente "contrato"
  }

  EditCity(id: number) {
    this.router.navigate(['/dashboard/city/city-edit/' + id]); // Navega al componente "contrato"
  }




  goToLinkMap(latitude: string, longitude: string) {
    //'https://www.google.com/maps?q=-4.907545,-81.057223&hl=es-Pe&gl=pe&shorturl=1;'
    window.open(`https://www.google.com/maps?q=${latitude},${longitude}&hl=es-Pe&gl=pe&shorturl=1;`, "_blank");
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
