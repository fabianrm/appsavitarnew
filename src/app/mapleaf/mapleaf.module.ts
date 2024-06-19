import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapleafLoadingComponent } from './mapleaf-loading/mapleaf-loading.component';
import { MapleafViewComponent } from './mapleaf-view/mapleaf-view.component';
import { MapleafSingleViewComponent } from './mapleaf-single-view/mapleaf-single-view.component';
import { MapleafMultipleViewComponent } from './mapleaf-multiple-view/mapleaf-multiple-view.component';



@NgModule({
  declarations: [
    MapleafViewComponent,
    MapleafLoadingComponent,
    MapleafSingleViewComponent,
    MapleafMultipleViewComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MapleafViewComponent,
    MapleafLoadingComponent,
    MapleafSingleViewComponent,
    MapleafMultipleViewComponent
  ]
})
export class MapleafModule { }
