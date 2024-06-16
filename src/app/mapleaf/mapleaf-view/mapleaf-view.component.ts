import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MapleafService } from '../mapleaf.service';

// const iconRetinaUrl = 'assets/marker-icon-2x.png';
// const iconUrl = 'assets/marker-icon.png';
// const shadowUrl = 'assets/marker-shadow.png';
// const iconDefault = L.icon({
//   iconRetinaUrl,
//   iconUrl,
//   shadowUrl,
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   tooltipAnchor: [16, -28],
//   shadowSize: [41, 41]
// });
// L.Marker.prototype.options.icon = iconDefault;


@Component({
  selector: 'app-mapleaf-view',
  templateUrl: './mapleaf-view.component.html',
  styleUrl: './mapleaf-view.component.scss'
})
export class MapleafViewComponent implements OnInit, AfterViewInit, OnDestroy  {
  @ViewChild('mapDiv') mapDivElement!: ElementRef;
  @Input() allowMultipleMarkers: boolean = true; // Parámetro de configuración
  map!: L.Map;
  markers: L.Marker[] = [];
  coordinatesSubscription!: Subscription;

  constructor(private coordinateService: MapleafService) { }

  ngOnInit(): void {
    // Suscribirse a los cambios de coordenadas
    this.coordinatesSubscription = this.coordinateService.currentCoordinates.subscribe(coordinates => {
      this.setMarkers(coordinates);
    });

    // Configurar la ruta de los iconos de Leaflet
    (L.Icon.Default as any).imagePath = 'assets/';
  }

  ngAfterViewInit(): void {
    this.initializeMap();

    // Espera un momento para asegurarte de que el mapa se haya renderizado completamente y luego invalida el tamaño
    setTimeout(() => {
      this.map.invalidateSize();
    }, 100); // Puedes ajustar el retraso si es necesario
  }

  ngOnDestroy(): void {
    // Desuscribirse de los cambios de coordenadas para evitar fugas de memoria
    if (this.coordinatesSubscription) {
      this.coordinatesSubscription.unsubscribe();
    }
  }

  initializeMap() {
    this.map = L.map(this.mapDivElement.nativeElement).setView([-4.907195, -81.057193], 14.5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    // Añadir evento de clic para agregar coordenadas
    this.map.on('click', (event: L.LeafletMouseEvent) => {
      const coordinates: [number, number] = [event.latlng.lat, event.latlng.lng];
      if (this.allowMultipleMarkers) {
        this.coordinateService.addCoordinate(coordinates);
      } else {
        this.setSingleMarker(coordinates);
        this.coordinateService.setSingleCoordinate(coordinates);
      }
    });

    // Invalida el tamaño del mapa
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

  // Setear un único marcador
  setSingleMarker(coordinates: [number, number]) {
    // Eliminar todos los marcadores actuales
    this.markers.forEach(marker => marker.remove());
    this.markers = [];

    // Añadir nuevo marcador
    const marker = L.marker([coordinates[0], coordinates[1]]).addTo(this.map);
    this.markers.push(marker);
  }




}
