import { Component, OnInit } from '@angular/core';
import { MapleafService } from '../../mapleaf/mapleaf.service';
import { DataPoint } from '../../mapleaf/Models/DataPoint';
import { BoxService } from '../../box/box.service';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss']
})
export class CustomerDetailsComponent implements OnInit {
  dataPoints: DataPoint[] = [];
  filteredDataPoints: DataPoint[] = [];
  showAllMarkers: boolean = true;

  constructor(private coordinateService: MapleafService, private boxService: BoxService) { }

  ngOnInit(): void {
    this.coordinateService.currentDataPoints.subscribe(dataPoints => {
      this.filteredDataPoints = dataPoints;
     // console.log('Nuevas coordenadas filtradas:', dataPoints);
    });
    this.getCoords();
  }

  getCoords() {
    this.boxService.getBoxes().subscribe(response => {
      this.dataPoints = response.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        availablePorts: item.availablePorts,
        status: item.status,
        coordinates: [parseFloat(item.coordinates[0]), parseFloat(item.coordinates[1])]
      }));

      // Actualizamos los puntos de datos en el servicio cuando se obtienen
      this.coordinateService.changeDataPoints(this.dataPoints);
    });
  }

  toggleMarkers() {
    
    if (this.showAllMarkers) {
      this.coordinateService.changeDataPoints(this.dataPoints);
    } else {
      this.coordinateService.clearCoordinates();
      this.coordinateService.changeDataPoints([]); // Esto limpiará los marcadores
     // this.coordinateService.changeDataPoints(this.dataPoints);
    }
  }

  filterCoordinates(center: [number, number]) {
    if (!this.showAllMarkers) {
      const filteredCoords = this.coordinateService.filterCoordinatesWithinRadius(center, 100, this.dataPoints);
      this.coordinateService.changeDataPoints(filteredCoords);
    
    }
  }
}
