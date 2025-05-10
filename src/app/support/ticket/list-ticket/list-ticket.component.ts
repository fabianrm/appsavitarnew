import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Ticket } from '../Models/TicketResponse';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { TicketService } from '../ticket.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { CategoryTicketService } from '../../category-ticket/categoryTicket.service';
import { CategoryTicket } from '../../category-ticket/Models/CategoryTicketResponse';
import { AssignTicketComponent } from '../assign-ticket/assign-ticket.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-list-ticket',
  templateUrl: './list-ticket.component.html',
  styleUrl: './list-ticket.component.scss'
})
export class ListTicketComponent implements OnInit {

  availableColumns: string[] = ['id', 'code', 'subject', 'description', 'category', 'customer', 'technician', 'admin', 'assigned_at', 'resolved_at', 'closed_at', 'created_at', 'status',  'acciones'];

  displayedColumns: string[] = ['code', 'created_at', 'subject', 'customer', 'technician', 'status', 'acciones'];

  public dataSource!: MatTableDataSource<Ticket>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatMenuTrigger) columnasMenuTrigger!: MatMenuTrigger;


  subscription!: Subscription

  public respuesta!: Ticket[];
  formTicket!: FormGroup;

 
  constructor(
    public formulario: FormBuilder,
    private ticketService: TicketService,
    public dialog: MatDialog, private router: Router,
    private snackbarService: SnackbarService,) { }


  ngOnInit(): void {
    this.initForm();
    this.getTickets();

    this.subscription = this.ticketService.refresh$.subscribe(() => {
      this.getTickets();
    });
  }


  initForm() {
    const formControlsConfig = {
      changed_by: this.UserID,
      status: ['atencion'],
    }
    this.formTicket = this.formulario.group(formControlsConfig);
  }



  actualizarColumnasVisibles(columnasSeleccionadas: any[]) {
    this.displayedColumns = columnasSeleccionadas.map(opcion => opcion.value);
  }


  //Cargar tickets
  getTickets() {
    this.ticketService.getTickets().subscribe((respuesta) => {
     // console.log(respuesta.data)
      if (respuesta.data.length > 0) {
        this.dataSource = new MatTableDataSource(respuesta.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.respuesta = respuesta.data;
      }
    });

  }

  exportToExcel() { }
  
  newTicket() {
    this.router.navigate(['/support/tickets/create-ticket']); // Navega al componente "customer create"
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  assign(row: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "400px";
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = row;
    this.dialog.open(AssignTicketComponent, dialogConfig);
    this.dialog.afterAllClosed.subscribe(() => { });
  }

  showTicket(id: number) {
    this.router.navigate(['/support/tickets/detail-ticket/' + id]); // Navega al componente "detail ticket"
  }

  editTicket(id: number) {
    this.router.navigate(['/support/tickets/edit-ticket/' + id]); // Navega al componente "edit ticket"
  }

  //Guardar
  attendTicket(id: number) {
    const formData = this.formTicket.value;
    const dataToSend = {
      ...formData,
    };

    if (this.formTicket.valid) {
      this.ticketService.updateStatus(id, dataToSend).subscribe(respuesta => {
       // console.log(respuesta);
        this.showSuccess();
        this.router.navigate(['/support/tickets/attend-ticket/' + id]); // Navega al componente "attend"
      });
    }
   
  }


  registerEvent(id: number) {
    this.router.navigate(['/support/tickets/attend-ticket/' + id]); // Navega al componente "attend"
  }



  //Usuario
  get UserID() {
    return localStorage.getItem('id_user');
  }


  showError() {
    this.snackbarService.showError('Ocurrio un error al actualizar los datos...');
  }

  showSuccess() {
    this.snackbarService.showSuccess('Los datos se actualizarón correctamente');
  }


  //Usuario
  get Role() {
    return localStorage.getItem('role');
  }

}
