import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CityListComponent } from './city-list/city-list.component';
import { CitytRoutingModule } from './cityt-routing.module';



@NgModule({
  declarations: [
    CityListComponent
  ],
  imports: [
    CommonModule,
    CitytRoutingModule
  ]
})
export class CityModule { }
