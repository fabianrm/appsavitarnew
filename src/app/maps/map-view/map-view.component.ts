import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { PlacesService } from '../places.service';
import { Map } from 'mapbox-gl';
import mapboxgl from 'mapbox-gl';
import { MapsService } from '../maps.service';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrl: './map-view.component.scss'
})
export class MapViewComponent implements AfterViewInit {

  @ViewChild('mapDiv') mapDivElement!: ElementRef;
  map!: mapboxgl.Map;
  currentMarker!: mapboxgl.Marker | null;

  constructor(private locationService: PlacesService,
    private mapService: MapsService
  ) { }

  ngAfterViewInit() {
   // console.log(this.locationService.location);
    

    if (!this.locationService.location) throw Error('No hay localización');

    this.map =  new mapboxgl.Map({
      container: this.mapDivElement.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [-81.058287, -4.908505], // starting position [lng, lat]
      //center: this.locationService.location, // starting position [lng, lat]
      zoom: 14, // starting zoom
    });

    // Añadir control de navegación (zoom y rotación)
    this.map.addControl(new mapboxgl.NavigationControl());

    // Inicializar currentMarker a null
    this.currentMarker = null;

    // Añadir evento de clic para poner marcador
    this.map.on('click', (event) => {
      const coordinates: any = [event.lngLat.lng, event.lngLat.lat];

      // Eliminar el marcador anterior si existe
      if (this.currentMarker) {
        this.currentMarker.remove();
      }

      // Crear el marcador
      this.currentMarker = new mapboxgl.Marker()
        .setLngLat(coordinates)
        .addTo(this.map);
      
      // Enviar las coordenadas al servicio
      this.mapService.changeCoordinates(coordinates);

      console.log(`Coordenadas del marcador: ${coordinates}`);
    });
  }





}


  
