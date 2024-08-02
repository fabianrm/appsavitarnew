import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContractListComponent } from './contract-list/contract-list.component';
import { AuthGuard } from '../../auth/auth.guard';
import { ContractCreateNewComponent } from './contract-create-new/contract-create-new.component';
import { ContractDetailComponent } from './contract-detail/contract-detail.component';
import { ContractEditBasicsComponent } from './contract-edit-basics/contract-edit-basics.component';

const routes: Routes = [
  { path: 'contracts', component: ContractListComponent, data: { title: 'Contratos' }, canActivate: [AuthGuard] },
  { path: 'new-contract/:id', component: ContractCreateNewComponent, data: { title: 'Nuevo Contrato' }, canActivate: [AuthGuard] },
  { path: 'contract-detail/:id', component: ContractDetailComponent, data: { title: 'Detalle de Contrato' }, canActivate: [AuthGuard] },
  { path: 'contract-edit-data-basic/:id', component: ContractEditBasicsComponent, data: { title: 'Editar Datos Basicos' }, canActivate: [AuthGuard] },
 
];


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
  ],
  exports:[RouterModule]
})
export class ContractRoutingModule { }
