import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import { Subscription } from 'rxjs';
import { MapleafService } from '../mapleaf.service';
import { GeocodingService } from '../geocoding.service';

@Component({
  selector: 'app-mapleaf-single-view',
  templateUrl: './mapleaf-single-view.component.html',
  styleUrl: './mapleaf-single-view.component.scss'
})
export class MapleafSingleViewComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapDiv') mapDivElement!: ElementRef;

  // Crear un icono personalizado
  customIcon = L.icon({
    iconUrl: 'assets/icon-home.png', // Ruta al icono personalizado
    shadowUrl: 'assets/marker-shadow.png',
    shadowAnchor: [0, 50],
    iconSize: [40, 45], // Tamaño del icono
    iconAnchor: [12, 41], // Punto de anclaje del icono
  });

  map!: L.Map;
  marker: L.Marker | null = null;
  coordinateSubscription!: Subscription;

  constructor(private coordinateService: MapleafService, private geocodingService: GeocodingService) { }

  ngOnInit(): void {
    this.coordinateSubscription = this.coordinateService.currentCoordinates.subscribe(coordinates => {
      if (coordinates.length > 0) {
        this.setMarker(coordinates[0]);
        setTimeout(() => {
          this.moveToLocation(coordinates[0]);
        }, 50);
      }
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
    if (this.coordinateSubscription) {
      this.coordinateSubscription.unsubscribe();
    }
  }

  //TODO: Permita setear las coordenadas iniciales desde base de datos
  initializeMap() {
    this.map = L.map(this.mapDivElement.nativeElement).setView([-4.907195, -81.057193], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (event: L.LeafletMouseEvent) => {
      const coordinates: [number, number] = [event.latlng.lat, event.latlng.lng];
      this.coordinateService.setSingleCoordinate(coordinates);
      this.setMarker(coordinates);

      this.geocodingService.getAddress(event.latlng.lat, event.latlng.lng).subscribe(result => {
        if (result && result.address) {
          const road = result.address.road || 'Sin nombre de calle';
          this.coordinateService.changeAddress(road); // Enviar la dirección al servicio
        }
      });


    });

    // Invalida el tamaño del mapa
    this.map.invalidateSize();
  }

  setMarker(coordinates: [number, number]) {
    if (!this.map) return;

    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    this.marker = L.marker(coordinates, { icon: this.customIcon }).addTo(this.map);
  }

  moveToLocation(coords: [number, number]): void {
    this.map.setView(coords, 17);
  }


}
