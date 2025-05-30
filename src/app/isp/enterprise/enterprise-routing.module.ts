import { NgModule } from '@angular/core';
import { AuthGuard } from '../../auth/auth.guard';
import { RouterModule, Routes } from '@angular/router';
import { EnterpriseCreateComponent } from './enterprise-create/enterprise-create.component';
import { EnterpriseListComponent } from './enterprise-list/enterprise-list.component';

const routes: Routes = [
  { path: 'enterprise-new', component: EnterpriseCreateComponent, data: { title: 'Nueva Empresa' }, canActivate: [AuthGuard] },
  { path: 'list', component: EnterpriseListComponent, data: { title: 'Lista de Empresas' }, canActivate: [AuthGuard] },
  { path: 'edit/:id', component: EnterpriseCreateComponent, data: { title: 'Editar Empresa' }, canActivate: [AuthGuard] },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnterpriseRoutingModule { }
