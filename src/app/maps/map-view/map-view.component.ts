import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PlacesService } from '../places.service';
import mapboxgl from 'mapbox-gl';
import { MapsService } from '../maps.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrl: './map-view.component.scss'
})
export class MapViewComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('mapDiv') mapDivElement!: ElementRef;
  map!: mapboxgl.Map;
  currentMarker!: mapboxgl.Marker | null;

  coordinatesSubscription!: Subscription;

  constructor(private locationService: PlacesService,
    private mapService: MapsService
  ) { }


  ngOnInit(): void {
   // this.initializeMap();

    // Suscribirse a los cambios de coordenadas
    this.coordinatesSubscription = this.mapService.currentCoordinates.subscribe(coordinates => {
      if (coordinates) {
        this.setMarker(coordinates[0], coordinates[1]);
      }
    });
  }

  ngOnDestroy(): void {
    // Desuscribirse de los cambios de coordenadas para evitar fugas de memoria
    if (this.coordinatesSubscription) {
      this.coordinatesSubscription.unsubscribe();
    }
  }


  ngAfterViewInit() {
    // console.log(this.locationService.location);

    if (!this.locationService.location) throw Error('No hay localización');

    this.map = new mapboxgl.Map({
      container: this.mapDivElement.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [-81.058287, -4.908505], // starting position [lng, lat]
      //center: this.locationService.location, // starting position [lng, lat]
      zoom: 14, // starting zoom
    });

    // Añadir control de navegación (zoom y rotación)
    this.map.addControl(new mapboxgl.NavigationControl());

    this.addMarker();

    //this.setMarker(-81.05937218651854, -4.907701974265308);

  }


  addMarker() {
    // Inicializar currentMarker a null
    this.currentMarker = null;

    // Añadir evento de clic para poner marcador
    this.map.on('click', (event) => {
      const coordinates: any = [event.lngLat.lng, event.lngLat.lat];

      // Eliminar el marcador anterior si existe
      // if (this.currentMarker) {
      //   this.currentMarker.remove();
      // }

      // Crear el marcador
      // this.currentMarker = new mapboxgl.Marker()
      //   .setLngLat(coordinates)
      //   .addTo(this.map);

      // Enviar las coordenadas al servicio
      this.mapService.changeCoordinates(coordinates);

      // Crear el marcador
      this.setMarker(coordinates[0], coordinates[1]);

     // console.log(`Coordenadas del marcador: ${coordinates}`);
    });

  }


  //Setear Marcador
  setMarker(lng: number, lat: number) {
    if (this.currentMarker) {
      this.currentMarker.remove();
    }

    const coordinates: [number, number] = [lng, lat];
    this.currentMarker = new mapboxgl.Marker()
      .setLngLat(coordinates)
      .addTo(this.map);
  }


}



