import { Component } from '@angular/core';
import { Ticket } from '../Models/TicketResponse';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from '../ticket.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';

@Component({
  selector: 'app-attend-ticket',
  templateUrl: './attend-ticket.component.html',
  styleUrl: './attend-ticket.component.scss'
})
export class AttendTicketComponent {

  id!: number;
  dataTicket?: Ticket;
  formTicket!: FormGroup;

  constructor(
    public formulario: FormBuilder,
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private router: Router,
    private snackbarService: SnackbarService) { }

  ngOnInit(): void {
    this.initForm();
    this.getTicketByID();
  }



  initForm() {
    const formControlsConfig = {
      comment: ['', Validators.required],
      changed_by: [this.UserID,],
      status: ['', Validators.required],

    }
    this.formTicket = this.formulario.group(formControlsConfig);


  }

  //Obtener customer por id
  getTicketByID() {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam !== null) {
        this.id = +idParam; // Usa el símbolo "+" para convertir a número
        this.fetchTicketDetail(this.id); // Llama a la función para obtener los detalles del cliente
      } else {
        // Manejar el caso cuando idParam es null, asignando un valor por defecto o manejando el error
        console.error('ID parameter is null');
      }
    });
  }


  fetchTicketDetail(id: number) {
    this.ticketService.getTicketByID(id).subscribe((respuesta) => {
      this.dataTicket = respuesta.data;
    });
    }
    

  //Usuario
  get UserID() {
    return localStorage.getItem('id_user');
  }

  enviarDatos() {
    const formData = this.formTicket.value;
    const dataToSend = {
      ...formData,
    };

    if (this.formTicket.valid) {
      this.ticketService.updateStatus(this.id, dataToSend).subscribe(respuesta => {
        // console.log(respuesta);
        this.showSuccess();
        this.router.navigate(['/support/tickets/list-tickets']); // Navega al componente "attend"
      });
    }
  }

  //Cancelar
  goTickets() {
    this.router.navigate(['/support/tickets/list-tickets']);
  }

  showError() {
    this.snackbarService.showError('Ocurrio un error al actualizar los datos...');
  }

  showSuccess() {
    this.snackbarService.showSuccess('Los datos se actualizarón correctamente');
  }


}
