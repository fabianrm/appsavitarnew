import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RoleCreateComponent } from './role-create/role-create.component';
import { RoleListComponent } from './role-list/role-list.component';
import { AuthGuard } from '../auth.guard';
import { RoleEditComponent } from './role-edit/role-edit.component';


const routes: Routes = [
  { path: 'roles', component: RoleListComponent, data: { title: 'Roles' }, canActivate: [AuthGuard] },
  { path: 'role-create', component: RoleCreateComponent, data: { title: 'Crear Rol' }, canActivate: [AuthGuard] },
  { path: 'role-create', component: RoleEditComponent, data: { title: 'Editar Rol' }, canActivate: [AuthGuard] },

];



@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleRoutingModule { }
