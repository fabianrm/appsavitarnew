import { Component, ViewChild } from '@angular/core';
import { CategoryTicket, CategoryTicketResponse } from '../Models/CategoryTicketResponse';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatMenuTrigger } from '@angular/material/menu';
import { Subscription } from 'rxjs';
import { CategoryTicketService } from '../categoryTicket.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CreateCategoryTicketComponent } from '../create-category-ticket/create-category-ticket.component';
import { EditCategoryTicketComponent } from '../edit-category-ticket/edit-category-ticket.component';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-list-category-ticket',
    templateUrl: './list-category-ticket.component.html',
    styleUrl: './list-category-ticket.component.scss',
    standalone: false
})
export class ListCategoryTicketComponent {

  availableColumns: string[] = ['id', 'name', 'description', 'status', 'acciones'];
  displayedColumns: string[] = ['name', 'description', 'status', 'acciones'];
  public dataSource!: MatTableDataSource<CategoryTicket>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatMenuTrigger) columnasMenuTrigger!: MatMenuTrigger;

  subscription!: Subscription

  public respuesta?: CategoryTicket;

  id!: number;

  constructor(private categoryTicketService: CategoryTicketService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.getCategories();
    this.subscription = this.categoryTicketService.refresh$.subscribe(() => {
      this.getCategories()
    });

  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  actualizarColumnasVisibles(columnasSeleccionadas: any[]) {
    this.displayedColumns = columnasSeleccionadas.map(opcion => opcion.value);
  }

  getCategories() {
    this.categoryTicketService.getCategoryTickets().subscribe((respuesta) => {

      if (respuesta.data.length > 0) {
        this.dataSource = new MatTableDataSource(respuesta.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      //  console.log(respuesta)
    });
  }


  getCategoryById(id: number) {
    this.categoryTicketService.getCategoryTicketsByID(id).subscribe(respuesta => {
      this.respuesta = respuesta.data;
      //  console.log(respuesta);
    });
  }


  newCategory() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';
    this.dialog.open(CreateCategoryTicketComponent, dialogConfig);

    this.dialog.afterAllClosed.subscribe(() => {
    })
  }


  editCategory(id: number) {

    this.categoryTicketService.getCategoryTicketsByID(id).subscribe(respuesta => {
      this.respuesta = respuesta.data;
    //  console.log(respuesta);

      if (respuesta.data) {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = '40%';
        dialogConfig.data = this.respuesta;

        this.dialog.open(EditCategoryTicketComponent, dialogConfig);
        this.dialog.afterAllClosed.subscribe(() => { })
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

}
