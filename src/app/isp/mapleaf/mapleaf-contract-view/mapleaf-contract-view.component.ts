import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.gridlayer.googlemutant';
import { Subscription } from 'rxjs';
import { MapleafService } from '../mapleaf.service';
import { GeocodingService } from '../geocoding.service';
import { Box } from '../../box/Models/BoxResponse';
import 'leaflet.locatecontrol';

@Component({
  selector: 'app-mapleaf-contract-view',
  templateUrl: './mapleaf-contract-view.component.html',
  styleUrl: './mapleaf-contract-view.component.scss',
  standalone: false
})
export class MapleafContractViewComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapDiv') mapDivElement!: ElementRef;
  
  @Input() boxes: Box[] = [];
  @Input() searchRadius: number = 100; // Radio de búsqueda en metros (default: 100m)
  @Output() nearbyBoxesChange = new EventEmitter<Box[]>();

  // Icono personalizado para el cliente
  customIcon = L.icon({
    iconUrl: 'assets/icon-home.png',
    shadowUrl: 'assets/marker-shadow.png',
    shadowAnchor: [0, 50],
    iconSize: [40, 45],
    iconAnchor: [12, 41],
  });

  // Icono para las cajas
  boxIcon = L.icon({
    iconUrl: 'assets/marker-icon.png',
    shadowUrl: 'assets/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  map!: L.Map;
  clientMarker: L.Marker | null = null;
  boxMarkers: L.Marker[] = [];
  coordinateSubscription!: Subscription;
  initCoords: [number, number] = [0, 0];

  constructor(
    private coordinateService: MapleafService,
    private geocodingService: GeocodingService
  ) { }

  ngOnInit(): void {
    this.initCoords = JSON.parse(localStorage.getItem("coords")!);

    this.coordinateSubscription = this.coordinateService.currentCoordinates.subscribe(coordinates => {
      if (coordinates.length > 0) {
        this.setClientMarker(coordinates[0]);
      }
    });

    this.coordinateService.moveToCoordinate.subscribe(coordinate => {
      if (coordinate) {
        setTimeout(() => {
          this.moveToLocation(coordinate);
        }, 50);
      }
    });

    (L.Icon.Default as any).imagePath = 'assets/';
  }

  ngAfterViewInit(): void {
    this.initializeMap();
    setTimeout(() => {
      this.map.invalidateSize();
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.coordinateSubscription) {
      this.coordinateSubscription.unsubscribe();
    }
  }

  initializeMap() {
    this.map = L.map(this.mapDivElement.nativeElement).setView(this.initCoords, 16);

    const openStreetMapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    // Estilos de mapa de Google
    const googRoadmap = L.gridLayer.googleMutant({
      type: 'roadmap'
    });

    const googTerrain = L.gridLayer.googleMutant({
      type: 'terrain'
    });

    const googHybrid = L.gridLayer.googleMutant({
      type: 'hybrid'
    });

    const googleSatellite = L.gridLayer.googleMutant({
      type: 'satellite'
    });

    // Agregar estilos de mapa
    this.map.addControl(new L.Control.Layers({
      'OpenStreetMap': openStreetMapLayer,
      'RoadMap': googRoadmap,
      'Terrain': googTerrain,
      'Satellite': googleSatellite,
      'Hybrid': googHybrid,
    }, {}));

    // Control de geolocalización
    L.control.locate({
      position: 'bottomright',
      setView: true,
      keepCurrentZoomLevel: true,
      flyTo: true,
      strings: {
        title: "Dónde estoy?"
      },
      icon: 'fa fa-location-arrow',
    }).addTo(this.map);

    // Evento de clic en el mapa
    this.map.on('click', (event: L.LeafletMouseEvent) => {
      const coordinates: [number, number] = [event.latlng.lat, event.latlng.lng];
      
      // Actualizar coordenadas en el servicio
      this.coordinateService.setSingleCoordinate(coordinates);
      
      // Establecer marcador del cliente
      this.setClientMarker(coordinates);

      // Obtener dirección
      this.geocodingService.getAddress(event.latlng.lat, event.latlng.lng).subscribe(result => {
        if (result && result.address) {
          const road = result.address.road || 'Sin nombre de calle';
          this.coordinateService.changeAddress(road);
        }
      });

      // Calcular y mostrar cajas cercanas
      this.calculateNearbyBoxes(coordinates);
    });

    this.map.invalidateSize();
  }

  setClientMarker(coordinates: [number, number]) {
    if (!this.map) return;

    // Remover marcador anterior del cliente
    if (this.clientMarker) {
      this.map.removeLayer(this.clientMarker);
    }

    // Crear nuevo marcador del cliente
    this.clientMarker = L.marker(coordinates, { icon: this.customIcon })
      .addTo(this.map)
      .bindPopup(`<b>Cliente</b><br>Lat: ${coordinates[0].toFixed(6)}<br>Lng: ${coordinates[1].toFixed(6)}`);
  }

  calculateNearbyBoxes(clientCoords: [number, number]) {
    // Limpiar marcadores de cajas anteriores
    this.clearBoxMarkers();

    // Filtrar cajas dentro del radio
    const nearbyBoxes = this.filterBoxesWithinRadius(clientCoords, this.boxes, this.searchRadius);

    // Emitir las cajas cercanas al componente padre
    this.nearbyBoxesChange.emit(nearbyBoxes);

    // Mostrar marcadores de las cajas cercanas
    this.showBoxMarkers(nearbyBoxes);
  }

  filterBoxesWithinRadius(center: [number, number], boxes: Box[], radiusInMeters: number): Box[] {
    const R = 6371e3; // Radio de la Tierra en metros
    const toRadians = (degrees: number) => degrees * Math.PI / 180;
    const [lat1, lon1] = center;

    return boxes.filter(box => {
      // Verificar que la caja tenga coordenadas válidas
      if (!box.coordinates || box.coordinates.length < 2) {
        return false;
      }

      const lat2 = parseFloat(box.coordinates[0] as any);
      const lon2 = parseFloat(box.coordinates[1] as any);

      const φ1 = toRadians(lat1);
      const φ2 = toRadians(lat2);
      const Δφ = toRadians(lat2 - lat1);
      const Δλ = toRadians(lon2 - lon1);

      const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      const distance = R * c; // Distancia en metros

      return distance <= radiusInMeters;
    });
  }

  showBoxMarkers(boxes: Box[]) {
    boxes.forEach(box => {
      if (!box.coordinates || box.coordinates.length < 2) {
        return;
      }

      const lat = parseFloat(box.coordinates[0] as any);
      const lng = parseFloat(box.coordinates[1] as any);

      const marker = L.marker([lat, lng], { icon: this.boxIcon })
        .addTo(this.map)
        .bindPopup(`
          <b>${box.name}</b><br>
          Puertos disponibles: ${box.availablePorts || 'N/A'}<br>
          Nota: ${box.note || 'Sin nota'}
        `);

      this.boxMarkers.push(marker);
    });
  }

  clearBoxMarkers() {
    this.boxMarkers.forEach(marker => this.map.removeLayer(marker));
    this.boxMarkers = [];
  }

  moveToLocation(coords: [number, number]): void {
    this.map.setView(coords, 16.1);
  }
}
