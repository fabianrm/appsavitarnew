import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DestinationListComponent } from './destination-list/destination-list.component';
import { DestinationCreateComponent } from './destination-create/destination-create.component';
import { DestinationEditComponent } from './destination-edit/destination-edit.component';



@NgModule({
  declarations: [
    DestinationListComponent,
    DestinationCreateComponent,
    DestinationEditComponent
  ],
  imports: [
    CommonModule
  ]
})
export class DestinationModule { }
