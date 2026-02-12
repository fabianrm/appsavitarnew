import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  NgZone,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as L from 'leaflet';
import 'leaflet.gridlayer.googlemutant';
import { BoxService } from '../box.service';
import { CityService } from '../../city/city.service';
import { City } from '../../city/Models/CityResponse';
import { Box } from '../Models/BoxResponse';
import { BoxConnectionDialogComponent } from './box-connection-dialog/box-connection-dialog.component';
import { BoxConnectionsListComponent } from './box-connections-list/box-connections-list.component';
import { BoxRouteService } from '../box-route.service';
import { BoxRoutePhotoService } from '../box-route-photo.service';
import { BoxRoute } from '../Models/BoxRouteResponse';
import {
  BoxRouteFilterDialogComponent,
  FilterColor,
} from './box-route-filter-dialog/box-route-filter-dialog.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-box-connections',
  templateUrl: './box-connections.component.html',
  styleUrls: ['./box-connections.component.scss'],
  standalone: false,
})
export class BoxConnectionsComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  cities: City[] = [];
  selectedCityId: number | null = null;
  selectedCity: City | null = null; // To bind in UI
  boxes: Box[] = [];
  filteredBoxes: Box[] = [];

  map!: L.Map;
  markers: L.Marker[] = [];
  polylines: L.Polyline[] = [];

  // Default to a generic location until city is picked
  initCoords: [number, number] = [-12.046374, -77.042793];

  // Drawing Mode
  isDrawingMode: boolean = false;
  currentPolyline: L.Polyline | null = null;
  previewPolyline: L.Polyline | null = null; // New property for rubber-banding
  drawPoints: L.LatLngExpression[] = [];
  startBoxId: number | null = null;
  endBoxId: number | null = null;

  // Filter State
  visibleColors: Set<string> = new Set();
  allRoutes: BoxRoute[] = [];

  private deleteRouteListener!: (event: Event) => void;
  private editRouteListener!: (event: Event) => void;

  constructor(
    private boxService: BoxService,
    private cityService: CityService,
    private routeService: BoxRouteService,
    private photoService: BoxRoutePhotoService,
    private dialog: MatDialog,
    private zone: NgZone,
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
    this.setupDeleteRouteListener();
    this.setupEditRouteListener();
  }

  loadInitialData() {
    this.boxService.getBoxes().subscribe((res) => {
      this.boxes = res.data;
      // Now fetch cities and auto-select
      this.getCities();
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
    if (this.deleteRouteListener) {
      document.removeEventListener(
        'deleteRouteEvent',
        this.deleteRouteListener,
      );
    }
    if (this.editRouteListener) {
      document.removeEventListener('editRouteEvent', this.editRouteListener);
    }
  }

  getCities() {
    this.cityService.getCities().subscribe((res) => {
      this.cities = res.data;
      if (this.cities.length > 0) {
        // Auto-select first city
        this.onCityChange(this.cities[0]);
      }
    });
  }

  private initMap(): void {
    this.map = L.map('map-connections').setView(this.initCoords, 13);

    const openStreetMapLayer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; OpenStreetMap contributors',
      },
    ).addTo(this.map);

    const googRoadmap = L.gridLayer.googleMutant({ type: 'roadmap' });
    const googSatellite = L.gridLayer.googleMutant({ type: 'satellite' });

    L.control
      .layers({
        OpenStreetMap: openStreetMapLayer,
        RoadMap: googRoadmap,
        Satellite: googSatellite,
      })
      .addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      if (this.isDrawingMode && this.startBoxId) {
        this.addPointToPolyline(e.latlng);
      }
    });

    // Add mousemove listener for rubber-banding
    this.map.on('mousemove', (e: L.LeafletMouseEvent) => {
      this.updatePreviewLine(e.latlng);
    });
  }

  updatePreviewLine(mouseLatLng: L.LatLng) {
    if (this.isDrawingMode && this.drawPoints.length > 0 && !this.endBoxId) {
      const lastPoint = this.drawPoints[this.drawPoints.length - 1];
      const previewPath = [lastPoint, mouseLatLng];

      if (!this.previewPolyline) {
        this.previewPolyline = L.polyline(previewPath, {
          color: '#FF5722', // Deep Orange for visibility
          weight: 2,
          dashArray: '5, 10',
          opacity: 0.7,
        }).addTo(this.map);
      } else {
        this.previewPolyline.setLatLngs(previewPath as L.LatLngExpression[]);
        if (!this.map.hasLayer(this.previewPolyline)) {
          this.previewPolyline.addTo(this.map);
        }
      }
    } else {
      if (this.previewPolyline) {
        this.map.removeLayer(this.previewPolyline);
        this.previewPolyline = null;
      }
    }
  }

  onCityChange(city: City) {
    this.selectedCity = city;
    this.selectedCityId = city.id;
    this.map.setView(city.coordinates, 15);
    this.filteredBoxes = this.boxes.filter((b) => b.city_id === city.id);
    this.drawMarkers();
    this.loadRoutes();
  }

  drawMarkers() {
    this.markers.forEach((m) => this.map.removeLayer(m));
    this.markers = [];

    const defaultIcon = L.icon({
      iconUrl: 'assets/box03.png',
      //shadowUrl: 'assets/marker-shadow.png',
      iconSize: [30, 31],
      iconAnchor: [12, 31],
      popupAnchor: [1, -34],
    });

    const mufaIcon = L.icon({
      iconUrl: 'assets/mufa04.png',
      shadowUrl: 'assets/marker-shadow.png',
      iconSize: [30, 41],
      iconAnchor: [12, 31],
      popupAnchor: [1, -34],
    });

    this.filteredBoxes.forEach((box) => {
      if (box.coordinates && box.coordinates.length >= 2) {
        const lat = parseFloat(box.coordinates[0]);
        const lng = parseFloat(box.coordinates[1]);

        const icon =
          box.type && box.type.toLowerCase() === 'mufa'
            ? mufaIcon
            : defaultIcon;

        const marker = L.marker([lat, lng], { icon }).addTo(this.map);

        // Add click handler for routing
        marker.on('click', () => this.handleMarkerClick(box));
        marker.bindPopup(
          `<b>${box.name}</b><br>${box.address}<br><small>${box.type || ''}</small>`,
        );

        this.markers.push(marker);
      }
    });
  }

  toggleDrawingMode() {
    this.isDrawingMode = !this.isDrawingMode;
    this.resetDrawingState();

    // Toggle cursor style
    const mapContainer = this.map.getContainer();
    if (this.isDrawingMode) {
      L.DomUtil.addClass(mapContainer, 'crosshair-cursor');
      this.map.setZoom(18); // Zoom in for easier drawing
    } else {
      L.DomUtil.removeClass(mapContainer, 'crosshair-cursor');
    }
  }

  resetDrawingState() {
    this.startBoxId = null;
    this.endBoxId = null;
    this.drawPoints = [];
    if (this.currentPolyline) {
      this.map.removeLayer(this.currentPolyline);
      this.currentPolyline = null;
    }
    if (this.previewPolyline) {
      this.map.removeLayer(this.previewPolyline);
      this.previewPolyline = null;
    }
  }

  handleMarkerClick(box: Box) {
    if (!this.isDrawingMode) return;

    if (!this.startBoxId) {
      // Start of the route
      this.startBoxId = box.id;
      const lat = parseFloat(box.coordinates[0]);
      const lng = parseFloat(box.coordinates[1]);
      this.addPointToPolyline(new L.LatLng(lat, lng));
    } else if (
      this.startBoxId &&
      !this.endBoxId &&
      this.startBoxId !== box.id
    ) {
      // End of the route
      this.endBoxId = box.id;
      const lat = parseFloat(box.coordinates[0]);
      const lng = parseFloat(box.coordinates[1]);
      this.addPointToPolyline(new L.LatLng(lat, lng));

      // Remove preview line immediately
      if (this.previewPolyline) {
        this.map.removeLayer(this.previewPolyline);
        this.previewPolyline = null;
      }

      this.openAddRouteDialog(this.startBoxId, this.endBoxId);
    }
  }

  addPointToPolyline(latlng: L.LatLng) {
    this.drawPoints.push(latlng);

    if (!this.currentPolyline) {
      this.currentPolyline = L.polyline(this.drawPoints, {
        color: 'blue',
        dashArray: '5, 10',
      }).addTo(this.map);
    } else {
      this.currentPolyline.setLatLngs(this.drawPoints);
    }
  }

  openAddRouteDialog(startId?: number, endId?: number, routeToEdit?: any) {
    if (!this.selectedCityId) {
      Swal.fire('Atención', 'Seleccione una ciudad primero', 'warning');
      return;
    }

    const dialogRef = this.dialog.open(BoxConnectionDialogComponent, {
      width: '600px',
      data: {
        boxes: this.filteredBoxes,
        startBoxId: startId,
        endBoxId: endId,
        route: routeToEdit,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // Capture points BEFORE resetting state
      const pointsToDraw = [...this.drawPoints];
      const wasDrawing = this.isDrawingMode;

      if (wasDrawing) {
        this.toggleDrawingMode();
      }

      if (result) {
        if (routeToEdit) {
          // UPDATE EXISTING ROUTE
          const updatedRoute = {
            start_box_id: result.startBoxId,
            end_box_id: result.endBoxId,
            color: result.color,
            notes: result.notes,
            type: result.type,
            status: 'active',
          };

          this.routeService.updateRoute(routeToEdit.id, updatedRoute).subscribe(
            (res: any) => {
              this.showToast('Ruta actualizada correctamente');
              this.loadRoutes(); // Reload to refresh map and data
            },
            (err) => {
              Swal.fire('Error', 'Error al actualizar la ruta', 'error');
              console.error(err);
            },
          );
        } else {
          // CREATE NEW ROUTE
          const finalPoints =
            wasDrawing && pointsToDraw.length > 2 ? pointsToDraw : null;

          const newRoute = {
            start_box_id: result.startBoxId,
            end_box_id: result.endBoxId,
            color: result.color,
            notes: result.notes,
            type: result.type,
            points: finalPoints,
            status: 'active',
          };

          this.routeService.storeRoute(newRoute).subscribe(
            (res: any) => {
              this.showToast('Ruta guardada correctamente');

              const createdId = res.data ? res.data.id : null;
              const createdRoute = res.data;

              this.drawRoute(
                result.startBoxId,
                result.endBoxId,
                result.color,
                result.type,
                finalPoints,
                createdId,
              );

              // Ask if user wants to add photos
              if (createdId) {
                Swal.fire({
                  title: '¿Agregar fotos del trabajo?',
                  text: 'Puedes añadir fotos de los trabajos realizados en esta ruta',
                  icon: 'question',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#6c757d',
                  confirmButtonText: 'Sí, agregar fotos',
                  cancelButtonText: 'Ahora no',
                }).then((promptResult) => {
                  if (promptResult.isConfirmed) {
                    // Open edit dialog with the newly created route
                    this.openAddRouteDialog(undefined, undefined, createdRoute);
                  }
                });
              }
            },
            (err) => {
              Swal.fire('Error', 'Error al guardar la ruta', 'error');
              console.error(err);
            },
          );
        }
      }
    });
  }

  showToast(title: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'center',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: false,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: 'success',
      title: title,
    });
  }

  uploadPhotosForRoute(routeId: number, files: File[]) {
    let uploadCount = 0;
    const total = files.length;

    files.forEach((file) => {
      this.photoService.uploadPhoto(routeId, file).subscribe(
        () => {
          uploadCount++;
          if (uploadCount === total) {
            Swal.fire({
              icon: 'success',
              title: `${total} foto(s) subida(s) correctamente`,
              timer: 2000,
              showConfirmButton: false,
            });
          }
        },
        (error) => {
          console.error('Error uploading photo:', error);
        },
      );
    });
  }

  drawRoute(
    startId: number,
    endId: number,
    color: string,
    type: string,
    customPoints?: L.LatLngExpression[] | null,
    dbId?: number,
  ) {
    let polyline: L.Polyline;

    const weight = type === 'principal' ? 3 : 1.5;
    if (customPoints) {
      polyline = L.polyline(customPoints, {
        color: color,
        weight: weight,
      }).addTo(this.map);
    } else {
      const startBox = this.filteredBoxes.find((b) => b.id === startId);
      const endBox = this.filteredBoxes.find((b) => b.id === endId);

      if (startBox && endBox && startBox.coordinates && endBox.coordinates) {
        const startLatLng: L.LatLngExpression = [
          parseFloat(startBox.coordinates[0]),
          parseFloat(startBox.coordinates[1]),
        ];
        const endLatLng: L.LatLngExpression = [
          parseFloat(endBox.coordinates[0]),
          parseFloat(endBox.coordinates[1]),
        ];

        polyline = L.polyline([startLatLng, endLatLng], {
          color: color,
          weight: weight,
        }).addTo(this.map);
      } else {
        return;
      }
    }

    // Attach DB ID to polyline for deletion
    if (dbId) {
      (polyline as any).boxRouteId = dbId;
    }

    const leafletId = L.Util.stamp(polyline);
    const popupContent = `
      <div style="text-align: center;">
        <button 
          style="background: #2196F3; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-right: 5px;"
          onclick="document.dispatchEvent(new CustomEvent('editRouteEvent', { detail: { id: ${leafletId} } }))">
          Editar
        </button>
        <button 
          style="background: #f44336; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;"
          onclick="document.dispatchEvent(new CustomEvent('deleteRouteEvent', { detail: { id: ${leafletId} } }))">
          Eliminar
        </button>
      </div>
    `;

    polyline.bindPopup(popupContent);
    this.polylines.push(polyline);
  }

  private setupDeleteRouteListener() {
    this.deleteRouteListener = (event: Event) => {
      this.zone.run(() => {
        const customEvent = event as CustomEvent;
        const polylineId = customEvent.detail.id;
        this.deleteRoute(polylineId);
      });
    };
    document.addEventListener('deleteRouteEvent', this.deleteRouteListener);
  }

  deleteRoute(leafletId: number) {
    const polyline = this.polylines.find((p) => L.Util.stamp(p) === leafletId);
    if (polyline) {
      // Check if it has a DB ID stored
      const routeId = (polyline as any).boxRouteId;

      if (routeId) {
        Swal.fire({
          title: '¿Está seguro?',
          text: 'No podrás revertir esto (se eliminará de la base de datos)!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, eliminar!',
        }).then((result) => {
          if (result.isConfirmed) {
            this.routeService.deleteRoute(routeId).subscribe(
              () => {
                this.map.removeLayer(polyline);
                this.polylines = this.polylines.filter((p) => p !== polyline);

                Swal.fire({
                  title: 'Eliminado!',
                  text: 'La ruta ha sido eliminada.',
                  icon: 'success',
                });
              },
              (err) => Swal.fire('Error', 'Error eliminando ruta', 'error'),
            );
          }
        });
      } else {
        // Just local deletion (unsaved route)
        this.map.removeLayer(polyline);
        this.polylines = this.polylines.filter((p) => p !== polyline);
      }
    }
  }

  loadRoutes() {
    this.routeService.getRoutes().subscribe(
      (res) => {
        const routes = res.data;
        this.allRoutes = routes;

        // Reset Polylines
        this.polylines.forEach((p) => this.map.removeLayer(p));
        this.polylines = [];

        // If visibleColors is empty (first load), add all encountered colors
        const encounteredColors = new Set(routes.map((r) => r.color));
        if (this.visibleColors.size === 0) {
          encounteredColors.forEach((c) => this.visibleColors.add(c));
        }

        routes.forEach((route: BoxRoute) => {
          let points = route.points;
          if (typeof points === 'string') {
            try {
              points = JSON.parse(points);
            } catch (e) {
              console.error('Error parsing route points', e);
              return;
            }
          }

          // Draw only if in visibleColors
          if (this.visibleColors.has(route.color)) {
            this.drawRoute(
              route.start_box_id,
              route.end_box_id,
              route.color,
              route.type,
              points,
              route.id,
            );
          }
        });

        const Toast = Swal.mixin({
          toast: true,
          position: 'center',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: false,
        });

        Toast.fire({
          icon: 'success',
          title: 'Rutas cargadas',
        });
      },
      (error) => {
        Swal.fire('Error', 'Error al cargar las rutas', 'error');
        console.error(error);
      },
    );
  }

  exportPdf() {
    window.print();
  }

  openConnectionsList() {
    const dialogRef = this.dialog.open(BoxConnectionsListComponent, {
      width: '800px',
      data: {
        boxes: this.boxes,
        cityId: this.selectedCityId,
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res && res.action === 'edit' && res.route) {
        this.openAddRouteDialog(undefined, undefined, res.route);
      }
    });
  }

  // Listener for edit
  private setupEditRouteListener() {
    this.editRouteListener = (event: Event) => {
      this.zone.run(() => {
        const customEvent = event as CustomEvent;
        const leafletId = customEvent.detail.id;
        const polyline = this.polylines.find(
          (p) => L.Util.stamp(p) === leafletId,
        );
        if (polyline) {
          const routeId = (polyline as any).boxRouteId;
          if (routeId) {
            this.routeService.showRoute(routeId).subscribe((res) => {
              this.openAddRouteDialog(undefined, undefined, res.data);
            });
          }
        }
      });
    };
    document.addEventListener('editRouteEvent', this.editRouteListener);
  }

  openFilterDialog() {
    const distinctColors = Array.from(
      new Set(this.allRoutes.map((r) => r.color)),
    );

    const filterData: FilterColor[] = distinctColors.map((c) => ({
      color: c,
      selected: this.visibleColors.has(c),
    }));

    const dialogRef = this.dialog.open(BoxRouteFilterDialogComponent, {
      width: '400px',
      data: { colors: filterData },
    });

    dialogRef.afterClosed().subscribe((result: FilterColor[]) => {
      if (result) {
        this.visibleColors.clear();
        result
          .filter((fc) => fc.selected)
          .forEach((fc) => this.visibleColors.add(fc.color));

        // Re-draw based on filter
        this.polylines.forEach((p) => this.map.removeLayer(p));
        this.polylines = [];

        this.allRoutes.forEach((route) => {
          if (this.visibleColors.has(route.color)) {
            let points = route.points;
            if (typeof points === 'string') {
              try {
                points = JSON.parse(points);
              } catch (e) {}
            }
            this.drawRoute(
              route.start_box_id,
              route.end_box_id,
              route.color,
              route.type,
              points,
              route.id,
            );
          }
        });
      }
    });
  }
}
