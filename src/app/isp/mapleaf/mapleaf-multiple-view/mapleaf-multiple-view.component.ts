import { AfterViewInit, Component, ElementRef, Input, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.gridlayer.googlemutant'; // Importa el plugin
import { MapleafService } from '../mapleaf.service';
import { Subscription } from 'rxjs';
import { DataPoint } from '../Models/DataPoint';
import { ShowServicesComponent } from '../../box/show-services/show-services.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';


@Component({
  selector: 'app-mapleaf-multiple-view',
  templateUrl: './mapleaf-multiple-view.component.html',
  styleUrls: ['./mapleaf-multiple-view.component.scss'],
  standalone: false
})
export class MapleafMultipleViewComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapDiv') mapDivElement!: ElementRef;
  @Input() filterByRadius: boolean = false;
  @Input() dataPoints: DataPoint[] = [];
  @Input() initCoords: [number, number] = [0, 0];
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

  private showServicesListener!: ((event: Event) => void);

  constructor(private coordinateService: MapleafService, public dialog: MatDialog, private zone: NgZone,) { }

  ngOnInit(): void {
    this.setupShowServicesListener();

    this.initCoords = JSON.parse(localStorage.getItem("coords")!)

    this.dataPointSubscription = this.coordinateService.currentDataPoints.subscribe(dataPoints => {
      this.setMarkers(dataPoints);
      // setTimeout(() => {
      //   this.moveToLocation(this.initCoords);
      // }, 50);
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
  }

  ngOnDestroy(): void {
    if (this.dataPointSubscription) {
      this.dataPointSubscription.unsubscribe();
    }
    document.removeEventListener('showServicesEvent', this.showServicesListener);
  }


  private setupShowServicesListener() {
    this.showServicesListener = (event: Event) => {
      // Forzar la ejecución dentro de la zona de Angular para actualizar la vista
      this.zone.run(() => {
        const customEvent = event as CustomEvent;
        // Llamar a tu función showServices con los datos del evento
        this.showServices(customEvent.detail);
      });
    };

    document.addEventListener('showServicesEvent', this.showServicesListener);
  }

  //TODO: Permita setear las coordenadas iniciales desde base de datos
  initializeMap() {
    this.map = L.map(this.mapDivElement.nativeElement).setView(this.initCoords, 16.1);

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



    // Agrega el control de geolocalización
    L.control.locate({
      position: 'bottomright', // Posición del botón en el mapa
      setView: true, // Centrar el mapa en la ubicación
      keepCurrentZoomLevel: true, // Mantener el nivel de zoom actual
      flyTo: true, // Mover suavemente la vista al usuario
      strings: {
        title: "Dónde estoy?"
      },
      icon: undefined, // Cambiar el icono si usas FontAwesome
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const coords: [number, number] = [e.latlng.lat, e.latlng.lng];
      // this.moveToLocation(coords); //Mueve y centra el mapa
    });


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
            note: '',
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

    // Limpiar marcadores, manteniendo el central si existe
    this.markers.forEach(marker => {
      if (marker !== this.centerMarker) {
        this.map.removeLayer(marker);
      }
    });
    this.markers = this.markers.filter(marker => marker === this.centerMarker);

    if (dataPoints.length === 0) {
      return;
    }

    // Añadir nuevos marcadores
    dataPoints.forEach(dataPoint => {
      // 💡 Usa un vínculo <a> con un CustomEvent para ejecutar la lógica de Angular
      const popupContent = `
      <b>${dataPoint.name}</b>
      <br>Puertos disponibles: ${dataPoint.availablePorts}
      <br>Nota: ${dataPoint.note}
      <br><a href="#" 
             style="cursor: pointer; color: #3f51b5;" 
             onclick="document.dispatchEvent(new CustomEvent('showServicesEvent', { 
               detail: { 
                 id: ${dataPoint.id}, 
                 name: '${dataPoint.name}' 
               } 
             })); return false;">
             Ver Servicios
      </a>`;

      const marker = L.marker([dataPoint.coordinates[0], dataPoint.coordinates[1]])
        .addTo(this.map)
        .bindPopup(popupContent);

      this.markers.push(marker);
    });
  }

  clearMarkers() {
    // Limpiar los marcadores actuales
    this.markers.forEach(marker => this.map.removeLayer(marker));
    this.markers = [];
  }

  moveToLocation(coords: [number, number]): void {
    this.map.setView(coords, 16.1);
  }


  showServices(data: { id: number, name: string }) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { id: data.id, name: data.name };
    this.dialog.open(ShowServicesComponent, dialogConfig);
  }


  // showServices(data: { id: number, name: string }) {
  //   console.log(`Abriendo modal para ID: ${data.id}, Nombre: ${data.name}`);

  //   // Aquí usas Angular Material para abrir el Dialog (Modal)
  //   this.dialog.open(ShowServicesComponent, {
  //     width: '400px',
  //     data: {
  //       id: data.id,
  //       name: data.name
  //     }
  //   });
  // }


}
