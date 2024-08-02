import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PresentationListComponent } from './presentation-list/presentation-list.component';
import { PresentationCreateComponent } from './presentation-create/presentation-create.component';
import { PresentationEditComponent } from './presentation-edit/presentation-edit.component';
import { PresentationRoutingModule } from './presentation-routing.module';



@NgModule({
  declarations: [
    PresentationListComponent,
    PresentationCreateComponent,
    PresentationEditComponent
  ],
  imports: [
    CommonModule,
    PresentationRoutingModule
  ]
})
export class PresentationModule { }
