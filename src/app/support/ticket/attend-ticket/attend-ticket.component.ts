import { Component } from '@angular/core';
import { Ticket } from '../Models/TicketResponse';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from '../ticket.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-attend-ticket',
    templateUrl: './attend-ticket.component.html',
    styleUrl: './attend-ticket.component.scss',
    standalone: false
})
export class AttendTicketComponent {

  id!: number;
  dataTicket?: Ticket;
  formTicket!: FormGroup;
  selectedFile: File | null = null;
  filename: string ='';
  attachments: any[] = [];
  subscription!: Subscription;

  SRVIMG: string = environment.servidor_img;

  constructor(
    public formulario: FormBuilder,
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private router: Router,
    private snackbarService: SnackbarService) { }

  ngOnInit(): void {
    this.initForm();

    this.getTicketByID();
    this.subscription = this.ticketService.refresh$.subscribe(() => {
      this.getTicketByID();
    });
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
      //  this.loadAttachments(this.id); // Llama a la función para obtener los adjuntos
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

  // Adjuntos
  // onFileSelected(event: any) {
  //   this.selectedFile = event.target.files[0];
  // }



  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      this.selectedFile = file;
      this.filename = file.name;
      this.uploadAttachment();
    }
  }


//Subir adjunto
  uploadAttachment() {

    if (this.selectedFile) {
      this.ticketService.addAttachment(this.id, this.selectedFile, this.filename).subscribe(
        (response) => {
          console.log('Attachment uploaded successfully', response);
        },
        (error) => {
          console.error('Error uploading attachment', error);
        }
      );
    }
  }

  //Listar adjuntos
  loadAttachments(ticketId: number): void {
    this.ticketService.getAttachments(ticketId).subscribe(
      (data: any) => {
        this.attachments = data;
      },
      (error) => {
        console.error('Error al obtener los archivos adjuntos', error);
      }
    );
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
