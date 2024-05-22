import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EquipmentListComponent } from './equipment-list/equipment-list.component';
import { EquipmentCreateComponent } from './equipment-create/equipment-create.component';
import { EquipmentEditComponent } from './equipment-edit/equipment-edit.component';
import { AuthGuard } from '../auth/auth.guard';


const routes: Routes = [
  { path: 'equipments', component: EquipmentListComponent, data: { title: 'Equipos' }, canActivate: [AuthGuard] },
  { path: 'equipmentCreate', component: EquipmentCreateComponent },
  { path: 'equipmentEdit/:id', component: EquipmentEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EquipmentRoutingModule { }
