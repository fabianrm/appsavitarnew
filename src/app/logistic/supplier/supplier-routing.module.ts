import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../auth/auth.guard';
import { SupplierListComponent } from './supplier-list/supplier-list.component';
import { SupplierCreateComponent } from './supplier-create/supplier-create.component';
import { SupplierEditComponent } from './supplier-edit/supplier-edit.component';


const routes: Routes = [
  { path: 'suppliers', component: SupplierListComponent, data: { title: 'Proveedores' }, canActivate: [AuthGuard] },
  { path: 'supplier-create', component: SupplierCreateComponent, data: { title: 'Registrar Proveedor' }, canActivate: [AuthGuard] },
  { path: 'supplier-edit/:id', component: SupplierEditComponent, data: { title: 'Editar Proveedor' }, canActivate: [AuthGuard] },
 
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierRoutingModule { }
