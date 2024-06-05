import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReasonListComponent } from './reason-list/reason-list.component';
import { ReasonCreateComponent } from './reason-create/reason-create.component';
import { ReasonEditComponent } from './reason-edit/reason-edit.component';
import { ReasonRoutingModule } from './reason-routing.module';



@NgModule({
  declarations: [
    ReasonListComponent,
    ReasonCreateComponent,
    ReasonEditComponent
  ],
  imports: [
    CommonModule,
    ReasonRoutingModule
  ]
})
export class ReasonModule { }
