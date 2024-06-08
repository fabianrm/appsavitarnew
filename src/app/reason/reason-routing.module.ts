import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { ReasonCreateComponent } from './reason-create/reason-create.component';
import { ReasonEditComponent } from './reason-edit/reason-edit.component';
import { ReasonListComponent } from './reason-list/reason-list.component';

const routes: Routes = [
  { path: 'reasons', component: ReasonListComponent, data: { title: 'Motivos' }, canActivate: [AuthGuard] },
  { path: 'reasonCreate', component: ReasonCreateComponent },
  { path: 'reasonEdit/:id', component: ReasonEditComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReasonRoutingModule { }
