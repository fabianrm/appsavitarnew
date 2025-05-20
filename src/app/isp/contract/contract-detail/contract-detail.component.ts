import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContractService } from '../contract.service';
import { Service } from '../Models/ServiceResponse';
import { PlacesService } from '../../mapleaf/places.service';
import { MapleafService } from '../../mapleaf/mapleaf.service';

@Component({
    selector: 'app-contract-detail',
    templateUrl: './contract-detail.component.html',
    styleUrl: './contract-detail.component.scss',
    standalone: false
})
export class ContractDetailComponent implements OnInit {
  id!: number;
  contract?: Service;

  constructor(

    private route: ActivatedRoute,
    private contractService: ContractService,
    private locationService: PlacesService,
    private mapleafService: MapleafService,) { }



  ngOnInit() {
    this.getCustomerById();
  }


  //Obtener customer por id
  getCustomerById() {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam !== null) {
        this.id = +idParam; // Usa el símbolo "+" para convertir a número
        this.fetchContractDetails(this.id); // Llama a la función para obtener los detalles del box
      } else {
        // Manejar el caso cuando idParam es null, asignando un valor por defecto o manejando el error
        console.error('ID parameter is null');
      }
    });
  }

  fetchContractDetails(id: number) {
    this.contractService.getServiceByID(id).subscribe((respuesta) => {
      if (respuesta) {
        this.contract = respuesta.data;
        this.setNewCoordinates(this.contract.latitude, this.contract.longitude);
        // console.log(respuesta.data)
      }
    });
  }

  get locationReady() {
    return this.locationService.locationReady;
  }

  //Setear coordenadas (edit)
  setNewCoordinates(long: number, lat: number) {
    const singleCoordinate: [number, number] = [long, lat];
    this.mapleafService.setSingleCoordinate(singleCoordinate);

  }

}
