import { Component } from '@angular/core';
import { Ticket } from '../Models/TicketResponse';
import { ActivatedRoute } from '@angular/router';
import { TicketService } from '../ticket.service';
import { PlacesService } from '../../../isp/mapleaf/places.service';
import { MapleafService } from '../../../isp/mapleaf/mapleaf.service';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-show-ticket',
    templateUrl: './show-ticket.component.html',
    styleUrl: './show-ticket.component.scss',
    standalone: false
})
export class ShowTicketComponent {

  id!: number;
  dataTicket?: Ticket;
  SRVIMG: string = environment.servidor_img;

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private locationService: PlacesService,
    private mapleafService: MapleafService,) { }

  ngOnInit(): void {
    this.getTicketByID();
  }

  get locationReady() {
    return this.locationService.locationReady;
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
     // console.log(this.dataTicket);
      this.setNewCoordinates(this.dataTicket.customer.latitude, this.dataTicket.customer.longitude);
    });
  }

  //Setear coordenadas (edit)
  setNewCoordinates(long: number, lat: number) {
    const singleCoordinate: [number, number] = [long, lat];
    this.mapleafService.setSingleCoordinate(singleCoordinate);
  }


}
