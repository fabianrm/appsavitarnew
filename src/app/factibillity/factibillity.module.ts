import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FactibillityInfoComponent } from './factibillity-info/factibillity-info.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MapleafModule } from '../mapleaf/mapleaf.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FactibillityRoutingModule } from './factibillity-routing.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';




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
    MatFormFieldModule,
    MatOptionModule,
    MatInputModule,
    MatSelectModule


  ]
})
export class FactibillityModule { }
