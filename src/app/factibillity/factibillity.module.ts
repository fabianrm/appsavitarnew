import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FactibillityInfoComponent } from './factibillity-info/factibillity-info.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MapleafModule } from '../mapleaf/mapleaf.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FactibillityRoutingModule } from './factibillity-routing.module';




@NgModule({
  declarations: [
    FactibillityInfoComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MapleafModule,
    MatSlideToggleModule,
    FactibillityRoutingModule,


  ]
})
export class FactibillityModule { }
