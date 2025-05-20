import { Component, OnInit } from '@angular/core';
import { MapleafService } from '../../mapleaf/mapleaf.service';
import { CustomerService } from '../customer.service';
import { PlacesService } from '../../mapleaf/places.service';
import { ActivatedRoute } from '@angular/router';
import { Customer } from '../Models/CustomerResponseU';



@Component({
    selector: 'app-customer-details',
    templateUrl: './customer-details.component.html',
    styleUrls: ['./customer-details.component.scss'],
    standalone: false
})
export class CustomerDetailsComponent implements OnInit {


  id!: number;
  dataCustomer?: Customer;

  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private locationService: PlacesService,
    private mapleafService: MapleafService,) { }

  ngOnInit(): void {
    this.getCustomerById();
  }

  get locationReady() {
    return this.locationService.locationReady;
  }


  //Obtener customer por id
  getCustomerById() {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam !== null) {
        this.id = +idParam; // Usa el símbolo "+" para convertir a número
        this.fetchCustomerDetails(this.id); // Llama a la función para obtener los detalles del cliente
      } else {
        // Manejar el caso cuando idParam es null, asignando un valor por defecto o manejando el error
        console.error('ID parameter is null');
      }
    });
  }


  fetchCustomerDetails(id: number) {
    this.customerService.getCustomerById(id).subscribe((respuesta) => {
      this.dataCustomer = respuesta.data;
      console.log(this.dataCustomer);
      this.setNewCoordinates(this.dataCustomer.latitude, this.dataCustomer.longitude);
    });
  }

  //Setear coordenadas (edit)
  setNewCoordinates(long: number, lat: number) {
    const singleCoordinate: [number, number] = [long, lat];
    this.mapleafService.setSingleCoordinate(singleCoordinate);
  }


}
