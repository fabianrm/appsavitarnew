import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.gridlayer.googlemutant'; // Importa el plugin
import { MapleafService } from '../mapleaf.service';
import { Subscription } from 'rxjs';
import { DataPoint } from '../Models/DataPoint';
import { GeocodingService } from '../geocoding.service';

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

  // Crear un icono personalizado
  customIcon = L.icon({
    iconUrl: 'assets/icon-home.png', // Ruta al icono personalizado
    shadowUrl: 'assets/marker-shadow.png',
    shadowAnchor: [0, 50],
    iconSize: [40, 45], // Tamaño del icono
    iconAnchor: [12, 41], // Punto de anclaje del icono
  });

  map!: L.Map;
  markers: L.Marker[] = [];
  centerMarker: L.Marker | null = null; // Para almacenar el marcador central
  dataPointSubscription!: Subscription;
  typeMap: 'openstreetmap' | 'roadmap' | 'satellite' | 'terrain' | 'hybrid' = 'openstreetmap'; // propiedad entrada

  constructor(private coordinateService: MapleafService, private geocodingService: GeocodingService) { }

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

  //TODO: Permita setear las coordenadas iniciales desde base de datos
  initializeMap() {
    this.map = L.map(this.mapDivElement.nativeElement).setView([-4.907044, -81.055051], 16.1);

    const openStreetMapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    //Estilos de mapa de google
    const googRoadmap = L.gridLayer.googleMutant({
      type: 'roadmap' // Puedes usar 'roadmap', 'satellite', 'terrain', 'hybrid'
    });

    const googTerrain = L.gridLayer.googleMutant({
      type: 'terrain' // Puedes usar 'roadmap', 'satellite', 'terrain', 'hybrid'
    });

    const googHybrid = L.gridLayer.googleMutant({
      type: 'hybrid' // Puedes usar 'roadmap', 'satellite', 'terrain', 'hybrid'
    });

    const googleSatellite = L.gridLayer.googleMutant({
      type: 'satellite' // Puedes usar 'roadmap', 'satellite', 'terrain', 'hybrid'
    });

    //Agregamos estilos de mapa
    this.map.addControl(new L.Control.Layers({
      'OpenStreetMap': openStreetMapLayer,
      'RoadMap': googRoadmap,
      'Terrain': googTerrain,
      'Satellite': googleSatellite,
      'Hybrid': googHybrid,
    }, {}))

    // const googleMutant = L.gridLayer.googleMutant({
    //   type: this.mapType // Puedes usar 'roadmap', 'satellite', 'terrain', 'hybrid'
    // }).addTo(this.map);

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
  
      // Obtener el nombre de la calle y actualizar el popup
      // this.geocodingService.getAddress(coordinates[0], coordinates[1]).subscribe(result => {
      //   if (result && result.address) {
      //     const road = result.address.road || 'Sin nombre de calle';
      //     this.centerMarker?.bindPopup(`<b>Centro</b><br>${road}<br>Lat: ${coordinates[0]}<br>Lng: ${coordinates[1]}`).openPopup();
      //   }
      // });   

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
        .bindPopup(`<b>${dataPoint.name}</b><br>Puertos disponibles: ${dataPoint.availablePorts}`);
      this.markers.push(marker);
    });
  }

  clearMarkers() {
    // Limpiar los marcadores actuales
    this.markers.forEach(marker => this.map.removeLayer(marker));
    this.markers = [];
  }


}
