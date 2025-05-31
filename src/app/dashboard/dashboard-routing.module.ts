import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { AuthGuard } from '../auth/auth.guard';
import { RouterModule, Routes } from '@angular/router';
import { permissionGuard } from '../auth/permission.guard';

const routes: Routes = [
  { path: 'home', component: DashboardComponent, data: { title: 'Dashboard' }, canActivate: [AuthGuard, permissionGuard] },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
