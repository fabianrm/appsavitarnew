import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.gridlayer.googlemutant'; // Importa el plugin
import { Subscription } from 'rxjs';
import { MapleafService } from '../mapleaf.service';
import { GeocodingService } from '../geocoding.service';
import 'leaflet.locatecontrol';


@Component({
    selector: 'app-mapleaf-single-view',
    templateUrl: './mapleaf-single-view.component.html',
    styleUrl: './mapleaf-single-view.component.scss',
    standalone: false
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
  initCoords: [number, number] = [0, 0];

  typeMap: 'openstreetmap' | 'roadmap' | 'satellite' | 'terrain' | 'hybrid' = 'openstreetmap'; // propiedad entrada

  constructor(private coordinateService: MapleafService, private geocodingService: GeocodingService) { }

  ngOnInit(): void {

    this.initCoords = JSON.parse(localStorage.getItem("coords")!) 

    this.coordinateSubscription = this.coordinateService.currentCoordinates.subscribe(coordinates => {
      if (coordinates.length > 0) {
        this.setMarker(coordinates[0]);
      }
    });

    this.coordinateService.moveToCoordinate.subscribe(coordinate => {
      if (coordinate) {
       setTimeout(() => {
         this.moveToLocation(coordinate);
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

  initializeMap() {
    this.map = L.map(this.mapDivElement.nativeElement).setView(this.initCoords, 16);

    const openStreetMapLayer =  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
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


    // Agrega el control de geolocalización
    L.control.locate({
      position: 'bottomright', // Posición del botón en el mapa
      setView: true, // Centrar el mapa en la ubicación
      keepCurrentZoomLevel: true, // Mantener el nivel de zoom actual
      flyTo: true, // Mover suavemente la vista al usuario
      strings: {
        title: "Dónde estoy?"
      },
      icon: 'fa fa-location-arrow', // Cambiar el icono si usas FontAwesome
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const coords: [number, number] = [e.latlng.lat, e.latlng.lng];
      this.setMarker(coords);
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
    this.map.setView(coords, 16.1);
  }

}
