import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContractListComponent } from './contract-list/contract-list.component';
import { ContractCreateComponent } from './contract-create/contract-create.component';
import { ContractEditComponent } from './contract-edit/contract-edit.component';
import { AuthGuard } from '../auth/auth.guard';
import { ContractCreateNewComponent } from './contract-create-new/contract-create-new.component';

const routes: Routes = [
  { path: 'contracts', component: ContractListComponent, data: { title: 'Contratos' }, canActivate: [AuthGuard] },
  { path: 'contractCreate', component: ContractCreateComponent, data: { title: 'Nuevo Contrato' }, canActivate: [AuthGuard] },
  { path: 'new-contract', component: ContractCreateNewComponent },
  { path: 'contractEdit/:id', component: ContractEditComponent },
];


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
  ],
  exports:[RouterModule]
})
export class ContractRoutingModule { }
