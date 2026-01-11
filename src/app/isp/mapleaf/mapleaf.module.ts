import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapleafViewComponent } from './mapleaf-view/mapleaf-view.component';
import { MapleafSingleViewComponent } from './mapleaf-single-view/mapleaf-single-view.component';
import { MapleafMultipleViewComponent } from './mapleaf-multiple-view/mapleaf-multiple-view.component';
import { MapleafLoadingComponent } from './mapleaf-loading/mapleaf-loading.component';
import { MapleafContractViewComponent } from './mapleaf-contract-view/mapleaf-contract-view.component';



@NgModule({
  declarations: [
    MapleafViewComponent,
    MapleafSingleViewComponent,
    MapleafMultipleViewComponent,
    MapleafLoadingComponent,
    MapleafContractViewComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MapleafViewComponent,
    MapleafSingleViewComponent,
    MapleafMultipleViewComponent,
    MapleafLoadingComponent,
    MapleafContractViewComponent
  ]
})
export class MapleafModule { }
