import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapleafLoadingComponent } from './mapleaf-loading/mapleaf-loading.component';
import { MapleafViewComponent } from './mapleaf-view/mapleaf-view.component';



@NgModule({
  declarations: [
    MapleafViewComponent,
    MapleafLoadingComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MapleafViewComponent,
    MapleafLoadingComponent
  ]
})
export class MapleafModule { }
