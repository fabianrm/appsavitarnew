import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerCreateComponent } from './customer-create/customer-create.component';
import { CustomerEditComponent } from './customer-edit/customer-edit.component';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { AuthGuard } from '../../auth/auth.guard';



const routes: Routes = [
  { path: 'customers', component: CustomerListComponent, data: { title: 'Clientes' }, canActivate: [AuthGuard] },
  { path: 'customerCreate', component: CustomerCreateComponent, data: { title: 'Registro de Cliente' }, canActivate: [AuthGuard] },
  { path: 'customerEdit/:id', component: CustomerEditComponent, data: { title: 'Editar Cliente' }, canActivate: [AuthGuard] },
  { path: 'customerDetails/:id', component: CustomerDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
