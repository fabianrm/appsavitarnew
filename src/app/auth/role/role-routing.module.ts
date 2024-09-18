import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RoleCreateComponent } from './role-create/role-create.component';
import { RoleListComponent } from './role-list/role-list.component';
import { AuthGuard } from '../auth.guard';


const routes: Routes = [
  { path: 'roles', component: RoleListComponent, data: { title: 'Roles' }, canActivate: [AuthGuard] },
  { path: 'role-create', component: RoleCreateComponent },

];



@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleRoutingModule { }
