import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapLoadingComponent } from './map-loading/map-loading.component';
import { MapViewComponent } from './map-view/map-view.component';
import { MapButtonLocationComponent } from './map-button-location/map-button-location.component';



@NgModule({
  declarations: [
    MapLoadingComponent,
    MapViewComponent,
    MapButtonLocationComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MapLoadingComponent,
    MapViewComponent,
    MapButtonLocationComponent
  ]
})
export class MapsModule { }
