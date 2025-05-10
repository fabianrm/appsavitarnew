import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuspensionRoutingModule } from './suspension-routing.module';
import { ListSuspensionComponent } from './list-suspension/list-suspension.component';


@NgModule({
  declarations: [
    ListSuspensionComponent
  ],
  imports: [
    CommonModule,
    SuspensionRoutingModule
  ]
})
export class SuspensionModule { }
