import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MapleafService } from '../../mapleaf/mapleaf.service';
import { DataPoint } from '../../mapleaf/Models/DataPoint';
import { BoxService } from '../../box/box.service';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrl: './customer-details.component.css'
})
export class CustomerDetailsComponent implements OnInit {

  dataPoints: DataPoint[] = [];
  filteredDataPoints: DataPoint[] = [];
  
  constructor(private coordinateService: MapleafService, private boxService: BoxService,) { }


  ngOnInit(): void {
    this.coordinateService.currentDataPoints.subscribe(dataPoints => {
      this.filteredDataPoints = dataPoints;
      console.log('Nuevas coordenadas filtradas:', dataPoints);
    });

    this.getCoords();

  }

  //Coordenadas de cajas
  getCoords(){
    // Obtener datos desde el servicio
    this.boxService.getBoxes().subscribe(response => {
      this.dataPoints = response.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        availablePorts: item.availablePorts,
        status: item.status,
        coordinates: [parseFloat(item.coordinates[0]), parseFloat(item.coordinates[1])]
      }));
    });
  }


  filterCoordinates(center: [number, number]) {
    const filteredCoords = this.coordinateService.filterCoordinatesWithinRadius(center, 300, this.dataPoints);
    this.coordinateService.changeDataPoints(filteredCoords);
  }



}
