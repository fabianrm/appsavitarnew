import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OutputListComponent } from './output-list/output-list.component';
import { OutputCreateComponent } from './output-create/output-create.component';
import { AuthGuard } from '../../auth/auth.guard';

const routes: Routes = [
  { path: 'outputs', component: OutputListComponent, data: { title: 'Salidas de Almacén' }, canActivate: [AuthGuard] },
  { path: 'output-create', component: OutputCreateComponent, data: { title: 'Registrar salidas' }, canActivate: [AuthGuard] },

];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OutputRoutingModule { }
