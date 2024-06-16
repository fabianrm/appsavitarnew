import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { Subscription } from 'rxjs';
import { MapleafService } from '../mapleaf.service';

@Component({
  selector: 'app-mapleaf-view',
  templateUrl: './mapleaf-view.component.html',
  styleUrl: './mapleaf-view.component.scss'
})
export class MapleafViewComponent implements OnInit, OnDestroy  {
  @ViewChild('mapDiv') mapDivElement!: ElementRef;
  map!: L.Map;
  markers: L.Marker[] = [];
  coordinatesSubscription!: Subscription;

  constructor(private coordinateService: MapleafService) { }

  ngOnInit(): void {
    // Suscribirse a los cambios de coordenadas
    this.coordinatesSubscription = this.coordinateService.currentCoordinates.subscribe(coordinates => {
      this.setMarkers(coordinates);
    });
  }

  ngAfterViewInit(): void {
    // this.initializeMap();
    setTimeout(() => {
      this.initializeMap();
    }, 0);
  }

  ngOnDestroy(): void {
    // Desuscribirse de los cambios de coordenadas para evitar fugas de memoria
    if (this.coordinatesSubscription) {
      this.coordinatesSubscription.unsubscribe();
    }
  }

  initializeMap() {
    this.map = L.map(this.mapDivElement.nativeElement).setView([-4.904696, -81.056678], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    // Añadir evento de clic para agregar coordenadas
    this.map.on('click', (event: L.LeafletMouseEvent) => {
      const coordinates: [number, number] = [event.latlng.lat, event.latlng.lng];
      this.coordinateService.addCoordinate(coordinates);
    });

    // Redimensionar el mapa cuando la ventana cambia de tamaño
    this.map.invalidateSize();
  }

  // Setear múltiples marcadores
  setMarkers(coordinates: [number, number][]) {
    // Eliminar todos los marcadores actuales
    this.markers.forEach(marker => marker.remove());
    this.markers = [];

    // Añadir nuevos marcadores
    coordinates.forEach(coord => {
      const marker = L.marker([coord[0], coord[1]]).addTo(this.map);
      this.markers.push(marker);
    });
  }

}
