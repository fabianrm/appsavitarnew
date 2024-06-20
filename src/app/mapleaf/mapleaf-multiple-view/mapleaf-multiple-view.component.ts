import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { MapleafService } from '../mapleaf.service';
import { Subscription } from 'rxjs';
import { DataPoint } from '../Models/DataPoint';

@Component({
  selector: 'app-mapleaf-multiple-view',
  templateUrl: './mapleaf-multiple-view.component.html',
  styleUrls: ['./mapleaf-multiple-view.component.scss']
})
export class MapleafMultipleViewComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapDiv') mapDivElement!: ElementRef;
  @Input() filterByRadius: boolean = false;
  @Input() dataPoints: DataPoint[] = [];
  @Input() showAllMarkers = true;
  centerMarker: L.Marker | null = null; // Para almacenar el marcador central

  // Crear un icono personalizado
  customIcon = L.icon({
    iconUrl: 'assets/icon-home.png', // Ruta al icono personalizado
    shadowUrl: 'assets/marker-shadow.png',
    shadowAnchor: [0,50],
    iconSize: [40, 45], // Tamaño del icono
    iconAnchor: [12, 41], // Punto de anclaje del icono
  });

  map!: L.Map;
  markers: L.Marker[] = [];
  dataPointSubscription!: Subscription;

  constructor(private coordinateService: MapleafService) { }

  ngOnInit(): void {
    this.dataPointSubscription = this.coordinateService.currentDataPoints.subscribe(dataPoints => {
      this.setMarkers(dataPoints);
    });

    (L.Icon.Default as any).imagePath = 'assets/';
  }

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  ngOnDestroy(): void {
    if (this.dataPointSubscription) {
      this.dataPointSubscription.unsubscribe();
    }
  }

  initializeMap() {
    this.map = L.map(this.mapDivElement.nativeElement).setView([-4.906832, -81.05745], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (event: L.LeafletMouseEvent) => {
      const coordinates: [number, number] = [event.latlng.lat, event.latlng.lng];
      if (!this.showAllMarkers) {
       
        this.coordinateService.clearCoordinates();
        if (this.filterByRadius) { 
          const filteredDataPoints = this.coordinateService.filterCoordinatesWithinRadius(coordinates, 100, this.dataPoints);
          this.coordinateService.changeDataPoints(filteredDataPoints);
        } else {
          const newPoint: DataPoint = {
            id: Date.now(),
            name: "Nuevo Marcador",
            availablePorts: 0,
            status: 1,
            coordinates
          };
          this.coordinateService.addDataPoint(newPoint);
        }
      }
      // Añadir el marcador central
      if (this.centerMarker) {
        this.map.removeLayer(this.centerMarker);
      }

      this.centerMarker = L.marker(coordinates, { icon: this.customIcon }).addTo(this.map)
        .bindPopup(`<b>Cliente</b><br>Lat: ${coordinates[0]}<br>Lng: ${coordinates[1]}`);
    });
  }


  setMarkers(dataPoints: DataPoint[]) {
    if (!this.map) return;

    // Limpiar los marcadores actuales
    // this.markers.forEach(marker => this.map.removeLayer(marker));
    // this.markers = [];

    // Limpiar los marcadores actuales, pero mantener el marcador central si existe
    this.markers.forEach(marker => {
      if (marker !== this.centerMarker) {
        this.map.removeLayer(marker);
      }
    });
    this.markers = [];


    if (dataPoints.length === 0) {
      // No añadir marcadores si no hay puntos de datos
      return;
    }

    // Añadir nuevos marcadores
    dataPoints.forEach(dataPoint => {
      const marker = L.marker([dataPoint.coordinates[0], dataPoint.coordinates[1]])
        .addTo(this.map)
        .bindPopup(`<b>${dataPoint.name}</b><br>Available Ports: ${dataPoint.availablePorts}`);
      this.markers.push(marker);
    });
  }

  clearMarkers() {
    // Limpiar los marcadores actuales
    this.markers.forEach(marker => this.map.removeLayer(marker));
    this.markers = [];
  }
}
