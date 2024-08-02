import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterialListComponent } from './material-list/material-list.component';
import { MaterialCreateComponent } from './material-create/material-create.component';
import { MaterialEditComponent } from './material-edit/material-edit.component';
import { AuthGuard } from '../../auth/auth.guard';

const routes: Routes = [
  { path: 'materials', component: MaterialListComponent, data: { title: 'Materiales' }, canActivate: [AuthGuard] },
  { path: 'material-create', component: MaterialCreateComponent, data: { title: 'Registrar Material' }, canActivate: [AuthGuard] },
  { path: 'material-edit/:id', component: MaterialEditComponent, data: { title: 'Editar Material' }, canActivate: [AuthGuard] },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialRoutingModule { }
