import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MapleafService } from '../../mapleaf/mapleaf.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrl: './customer-details.component.css'
})
export class CustomerDetailsComponent implements OnInit, AfterViewInit {
  constructor(private coordinateService: MapleafService) { }

  coordinates: [number, number][] = [];
  coordinatesSubscription!: Subscription;

  ngAfterViewInit() {
   // this.setMultipleCoordinates();
    this.setSingleCoordinate();
  //  this.addCoordinate();
  }

  ngOnInit(): void {
    // Suscribirse a los cambios de coordenadas
    this.coordinatesSubscription = this.coordinateService.currentCoordinates.subscribe(coordinates => {
      this.coordinates = coordinates;
    //  console.log('Nuevas coordenadas:', this.coordinates);
    });
  }


  setSingleCoordinate() {
    const singleCoordinate: [number, number] = [-4.905 ,-81.045 ];
    this.coordinateService.setSingleCoordinate(singleCoordinate);
  }

  setMultipleCoordinates() {
    const multipleCoordinates: [number, number][] = [
      [-4.903854, -81.05783,],
      [-4.906 ,-81.046, ],
      [-4.907 ,-81.047, ]
    ];
    this.coordinateService.changeCoordinates(multipleCoordinates);
     
  }

  addCoordinate() {
    const coordinate: [number, number] = [-4.908, -81.048];
    this.coordinateService.addCoordinate(coordinate);
  }

  clearCoordinates() {
    this.coordinateService.clearCoordinates();
  }



}
