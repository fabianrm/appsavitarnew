import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PromotionListComponent } from './promotion-list/promotion-list.component';
import { AuthGuard } from '../../auth/auth.guard';
import { PromotionCreateComponent } from './promotion-create/promotion-create.component';

const routes: Routes = [
  { path: 'promotions', component: PromotionListComponent, data: { title: 'Promociones' }, canActivate: [AuthGuard] },
  { path: 'create', component: PromotionCreateComponent, data: { title: 'Registro de Promoción' }, canActivate: [AuthGuard] },
  { path: 'edit/:id', component: PromotionCreateComponent, data: { title: 'Editar Promoción' }, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromotionRoutingModule { }
