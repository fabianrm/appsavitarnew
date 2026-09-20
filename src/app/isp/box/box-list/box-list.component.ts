import { Component, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { Box } from '../Models/BoxResponse';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BoxService } from '../box.service';
import { ReqBox } from '../Models/RequestBox';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { ShowServicesComponent } from '../show-services/show-services.component';
import { CityService } from '../../city/city.service';
import { City } from '../../city/Models/CityResponse';


@Component({
  selector: 'app-box-list',
  templateUrl: './box-list.component.html',
  styleUrl: './box-list.component.css',
  standalone: false,
  animations: [
    trigger('slideInOut', [
      state('true', style({ height: '*', opacity: 1 })),
      state('false', style({ height: '0px', opacity: 0 })),
      transition('true <=> false', animate('300ms ease-in-out')),
    ]),
  ],
})
export class BoxListComponent {

  displayedColumns: string[] = ['id', 'name', 'type', 'city', 'address', 'reference', 'latitude', 'longitude', 'totalPorts', 'availablePorts', 'status', 'acciones'];
  public dataSource: MatTableDataSource<Box> = new MatTableDataSource<Box>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  subscription!: Subscription

  public respuesta: ReqBox[] = [];
  servicesByBox: any[] = [];

  private allBoxes: Box[] = [];
  cities: City[] = [];

  isFilterVisible = false;
  filterName = '';
  filterType: string | null = null;
  filterCityId: number | null = null;
  filterMinAvailablePorts: number | null = null;


  constructor(private boxService: BoxService,
    public dialog: MatDialog,
    private router: Router,
    private snackbarService: SnackbarService,
    private cityService: CityService
  ) { }

  ngOnInit() {
    this.getBoxes();
    this.getCities();
    this.subscription = this.boxService.refresh$.subscribe(() => {
      this.getBoxes()
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getBoxes() {
    this.boxService.getBoxes().subscribe((respuesta) => {
      this.allBoxes = respuesta.data ?? [];
      this.dataSource.data = this.allBoxes;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  getCities() {
    this.cityService.getCities().subscribe((respuesta) => {
      this.cities = respuesta.data ?? [];
    });
  }

  applyFilters() {
    const name = this.filterName.trim().toLowerCase();

    this.dataSource.data = this.allBoxes.filter((box) => {
      if (name && !box.name?.toLowerCase().includes(name)) return false;
      if (this.filterType && box.type !== this.filterType) return false;
      if (this.filterCityId && box.city_id !== this.filterCityId) return false;
      if (
        this.filterMinAvailablePorts !== null &&
        this.filterMinAvailablePorts !== undefined &&
        box.availablePorts < this.filterMinAvailablePorts
      ) {
        return false;
      }
      return true;
    });

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearFilters() {
    this.filterName = '';
    this.filterType = null;
    this.filterCityId = null;
    this.filterMinAvailablePorts = null;
    this.dataSource.data = this.allBoxes;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  toggleFilters() {
    this.isFilterVisible = !this.isFilterVisible;
  }


  newBox() {
    this.router.navigate(['/dashboard/box/boxCreate']); // Navega al componente "contrato"
  }

  EditBox(id: number) {
    this.router.navigate(['/dashboard/box/boxEdit/' + id]); // Navega al componente "contrato"
  }


  goToLinkMap(latitude: string, longitude: string) {
    //'https://www.google.com/maps?q=-4.907545,-81.057223&hl=es-Pe&gl=pe&shorturl=1;'
    window.open(`https://www.google.com/maps?q=${latitude},${longitude}&hl=es-Pe&gl=pe&shorturl=1;`, "_blank");
  }

  deleteBox(row: any) {
    Swal.fire({
      title: "Eliminar Caja",
      text: `Está seguro de eliminar la caja: ${row.name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#43a047",
      cancelButtonColor: "#e91e63",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Si, terminar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.boxService.deleteBox(row.id).
          subscribe({
            next: (respuesta) => {
              this.snackbarService.showInfo(`${respuesta.data.message}`);
              //this.getContracts();
            },
            error: (err) => {
              this.snackbarService.showError(err);
            }
          })
      }
    });
  }

  //Obtener contratos asociados a la caja
  showServices(id: number, name: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { id: id, name: name };
    this.dialog.open(ShowServicesComponent, dialogConfig);
  }

}
