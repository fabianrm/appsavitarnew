import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipmentListComponent } from './equipment-list/equipment-list.component';
import { EquipmentCreateComponent } from './equipment-create/equipment-create.component';
import { EquipmentEditComponent } from './equipment-edit/equipment-edit.component';
import { EquipmentRoutingModule } from './equipment-routing.module';



@NgModule({
  declarations: [
    EquipmentListComponent,
    EquipmentCreateComponent,
    EquipmentEditComponent
  ],
  imports: [
    CommonModule,
    EquipmentRoutingModule
  ]
})
export class EquipmentModule { }
