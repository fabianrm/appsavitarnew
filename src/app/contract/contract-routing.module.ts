import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContractListComponent } from './contract-list/contract-list.component';
import { ContractCreateComponent } from './contract-create/contract-create.component';
import { ContractEditComponent } from './contract-edit/contract-edit.component';

const routes: Routes = [
  { path: 'contracts', component: ContractListComponent },
  { path: 'contractCreate', component: ContractCreateComponent },
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
