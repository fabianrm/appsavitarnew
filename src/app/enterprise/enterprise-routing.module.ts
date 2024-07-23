import { NgModule } from '@angular/core';
import { AuthGuard } from '../auth/auth.guard';
import { RouterModule, Routes } from '@angular/router';
import { EnterpriseDetailsComponent } from './enterprise-details/enterprise-details.component';
import { EnterpriseEditComponent } from './enterprise-edit/enterprise-edit.component';

const routes: Routes = [
  { path: 'enterpriseDetails/:id', component: EnterpriseDetailsComponent, data: { title: 'Datos de la Empresa' }, canActivate: [AuthGuard] },
  { path: 'enterpriseEdit/:id', component: EnterpriseEditComponent, data: { title: 'Editar Empresa' }, canActivate: [AuthGuard] },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnterpriseRoutingModule { }
