import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../auth/auth.guard';
import { FactibillityInfoComponent } from './factibillity-info/factibillity-info.component';

const routes: Routes = [
  { path: 'factibillity-info', component: FactibillityInfoComponent, data: { title: 'Factibilidad Técnica' }, canActivate: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FactibillityRoutingModule { }
