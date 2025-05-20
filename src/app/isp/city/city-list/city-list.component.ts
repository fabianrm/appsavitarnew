import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { City, CityResponse } from '../Models/CityResponse';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { CityService } from '../city.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';

@Component({
    selector: 'app-city-list',
    templateUrl: './city-list.component.html',
    styleUrl: './city-list.component.scss',
    standalone: false
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
    private router: Router,
    private snackbarService: SnackbarService,
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


  deleteCity(id: number) {
    Swal.fire({
      title: "Esta seguro?",
      text: "No podrá recuperarlo después de eliminar!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#43a047",
      cancelButtonColor: "#e91e63",
      confirmButtonText: "Si, eliminar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.cityService.deleteCity(id).subscribe((respuesta) => {
          if (respuesta.data.status === true) {
            Swal.fire(
              'Eliminado!',
              respuesta.data.message,
              'success'
            )
          } else {
            this.snackbarService.showError(`☹️ Ocurrio un error: ${respuesta.data.message}`);
          }
        }, error => {
          this.snackbarService.showError(`☹️ Ocurrio un error al eliminar el registro`);
          console.log('Error al eliminar la ciudad', error.message);
        });
      }
    });
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
