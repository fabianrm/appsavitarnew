import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EnterpriseService } from '../enterprise.service';
import { PlacesService } from '../../mapleaf/places.service';
import { MapleafService } from '../../mapleaf/mapleaf.service';
import { Enterprise } from '../Models/EnterpriseResponse';

@Component({
  selector: 'app-enterprise-details',
  templateUrl: './enterprise-details.component.html',
  styleUrl: './enterprise-details.component.scss'
})
export class EnterpriseDetailsComponent {
  id!: number;
  dataEnterprise?: Enterprise;

  constructor(
    private route: ActivatedRoute,
    private enterpriseService: EnterpriseService,
    private locationService: PlacesService,
    private mapleafService: MapleafService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getEnterpriseById();
  }

  get locationReady() {
    return this.locationService.locationReady;
  }


  //Obtener customer por id
  getEnterpriseById() {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam !== null) {
        this.id = +idParam; // Usa el símbolo "+" para convertir a número
        this.fetchEnterpriseDetails(this.id); // Llama a la función para obtener los detalles del cliente
      } else {
        // Manejar el caso cuando idParam es null, asignando un valor por defecto o manejando el error
        console.error('ID parameter is null');
      }
    });
  }


  fetchEnterpriseDetails(id: number) {
    this.enterpriseService.getEnterpriseByID(id).subscribe((respuesta) => {
      this.dataEnterprise = respuesta;
      console.log(this.dataEnterprise.id);

      this.setNewCoordinates(this.dataEnterprise.coordinates[0], this.dataEnterprise.coordinates[1]);
    });
  }

  //Setear coordenadas (edit)
  setNewCoordinates(lat: number, long: number,) {
    const singleCoordinate: [number, number] = [lat, long];
    this.mapleafService.setSingleCoordinate(singleCoordinate);
  }

  editEnterprise() {
    this.router.navigate(['/dashboard/enterprise/enterpriseEdit/' + this.dataEnterprise?.id]); // Navega al componente "contrato"
  }

}





