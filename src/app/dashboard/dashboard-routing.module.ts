import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { AuthGuard } from '../auth/auth.guard';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'home', component: DashboardComponent, data: { title: 'Dashboard' }, canActivate: [AuthGuard] },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
