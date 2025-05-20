import { Component, OnInit } from '@angular/core';
import { MapleafService } from '../../mapleaf/mapleaf.service';
import { DataPoint } from '../../mapleaf/Models/DataPoint';
import { BoxService } from '../../box/box.service';
import { CityService } from '../../city/city.service';
import { City } from '../../city/Models/CityResponse';

@Component({
    selector: 'app-factibillity-info',
    templateUrl: './factibillity-info.component.html',
    styleUrl: './factibillity-info.component.scss',
    standalone: false
})
export class FactibillityInfoComponent implements OnInit {

  dataPoints: DataPoint[] = [];
  filteredDataPoints: DataPoint[] = [];
  showAllMarkers: boolean = true;
  cities: City[] = [];
  cityId?: number;
  selectedCityName: string = 'Seleccione ciudad';

  initCoords: [number, number] = [0, 0];

  constructor(
    private coordinateService: MapleafService,
    private boxService: BoxService,
    private cityService: CityService,
  ) { }

  ngOnInit(): void {
    this.coordinateService.currentDataPoints.subscribe(dataPoints => {
      this.filteredDataPoints = dataPoints;
      // console.log('Nuevas coordenadas filtradas:', dataPoints);
    });
    this.getCoords();
    this.getCities();
  }

  getCoords() {
    this.boxService.getBoxes().subscribe(response => {
      this.dataPoints = response.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        availablePorts: item.availablePorts,
        note: item.note,
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
    }
  }

  filterCoordinates(center: [number, number]) {
    if (!this.showAllMarkers) {
      const filteredCoords = this.coordinateService.filterCoordinatesWithinRadius(center, 100, this.dataPoints);
      this.coordinateService.changeDataPoints(filteredCoords);
    }
  }

  getCities() {
    this.cityService.getCities().subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        this.cities = respuesta.data
      }
    });
  }

  fetchCityDetails(id: number) {
    this.cityService.getCityByID(id).subscribe((respuesta) => {
      this.initCoords = respuesta.data.coordinates;
      this.coordinateService.changeMoveToCoordinate(this.initCoords);
    });
  }

  selectCity(city: { id: number; name: string }): void {
    this.cityId = city.id;
    this.selectedCityName = city.name;
    this.fetchCityDetails(this.cityId);
  }


  clearCoordinates() {
    this.coordinateService.clearCoordinates();
  }

}
