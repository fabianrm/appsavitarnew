import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Box } from '../Models/BoxResponse';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { BoxService } from '../box.service';
import { ReqBox } from '../Models/RequestBox';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';


@Component({
  selector: 'app-box-list',
  templateUrl: './box-list.component.html',
  styleUrl: './box-list.component.css'
})
export class BoxListComponent {

  displayedColumns: string[] = ['id', 'name', 'city', 'address', 'reference', 'latitude', 'longitude', 'totalPorts', 'availablePorts', 'status', 'acciones'];
  public dataSource!: MatTableDataSource<Box>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  subscription!: Subscription

  public respuesta: ReqBox[] = [];


  constructor(private boxService: BoxService,
    public dialog: MatDialog,
    private router: Router,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit() {
    this.getBoxes();
    this.subscription = this.boxService.refresh$.subscribe(() => {
      this.getBoxes()
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getBoxes() {
    this.boxService.getBoxes().subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        this.dataSource = new MatTableDataSource(respuesta.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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



}
