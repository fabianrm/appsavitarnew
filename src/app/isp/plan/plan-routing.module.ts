import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlanListComponent } from './plan-list/plan-list.component';
import { PlanCreateComponent } from './plan-create/plan-create.component';
import { PlanEditComponent } from './plan-edit/plan-edit.component';
import { AuthGuard } from '../../auth/auth.guard';

const routes: Routes = [
  { path: 'plans', component: PlanListComponent, data: { title: 'Planes' }, canActivate: [AuthGuard] },
  { path: 'planCreate', component: PlanCreateComponent },
  { path: 'planEdit/:id', component: PlanEditComponent },
];



@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanRoutingModule { }
