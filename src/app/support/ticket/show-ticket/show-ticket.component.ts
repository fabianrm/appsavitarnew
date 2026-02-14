import { Component } from '@angular/core';
import { Ticket } from '../Models/TicketResponse';
import { ActivatedRoute } from '@angular/router';
import { TicketService } from '../ticket.service';
import { PlacesService } from '../../../isp/mapleaf/places.service';
import { MapleafService } from '../../../isp/mapleaf/mapleaf.service';
import { environment } from '../../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-show-ticket',
  templateUrl: './show-ticket.component.html',
  styleUrl: './show-ticket.component.scss',
  standalone: false,
})
export class ShowTicketComponent {
  id!: number;
  dataTicket?: Ticket;
  SRVIMG: string = environment.servidor_img;

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private locationService: PlacesService,
    private mapleafService: MapleafService,
  ) {}

  ngOnInit(): void {
    this.getTicketByID();
  }

  get locationReady() {
    return this.locationService.locationReady;
  }

  //Obtener customer por id
  getTicketByID() {
    this.route.paramMap.subscribe((params) => {
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
      // console.log(this.dataTicket);
      this.setNewCoordinates(
        this.dataTicket.customer.latitude,
        this.dataTicket.customer.longitude,
      );
    });
  }

  //Setear coordenadas (edit)
  setNewCoordinates(long: number, lat: number) {
    const singleCoordinate: [number, number] = [long, lat];
    this.mapleafService.setSingleCoordinate(singleCoordinate);
  }

  // Check if file is an image based on extension
  isImage(filePath: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    const extension = filePath
      .toLowerCase()
      .substring(filePath.lastIndexOf('.'));
    return imageExtensions.includes(extension);
  }

  // Get attachment URL
  getAttachmentUrl(attachmentId: number): string {
    return `${this.SRVIMG}apisavitar/api/v1/tickets/attachments/${attachmentId}/view`;
  }

  // Handle image load errors
  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/no-image.png'; // Fallback image
  }

  // View attachment in modal
  viewAttachment(attachmentId: number) {
    const imageUrl = this.getAttachmentUrl(attachmentId);

    Swal.fire({
      imageUrl: imageUrl,
      imageAlt: 'Ticket Attachment',
      showCloseButton: true,
      showConfirmButton: false,
      width: '800px',
      padding: '20px',
      customClass: {
        popup: 'swal-attachment-popup',
        image: 'swal-attachment-image',
      },
      didOpen: () => {
        // Adjust for mobile
        const popup = document.querySelector(
          '.swal-attachment-popup',
        ) as HTMLElement;
        if (popup && window.innerWidth < 768) {
          popup.style.width = '95%';
          popup.style.maxWidth = '500px';
        }
      },
    });
  }
}
