import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouterListComponent } from './router-list/router-list.component';
import { RouterCreateComponent } from './router-create/router-create.component';
import { RouterEditComponent } from './router-edit/router-edit.component';
import { RouterDetailComponent } from './router-detail/router-detail.component';
import { AuthGuard } from '../../auth/auth.guard';

const routes: Routes = [
  { path: 'routers', component: RouterListComponent, data: { title: 'Routers' }, canActivate: [AuthGuard] },
  { path: 'routers/:id/monitor', component: RouterDetailComponent, data: { title: 'Monitoreo Router' }, canActivate: [AuthGuard] },
  { path: 'routerCreate', component: RouterCreateComponent },
  { path: 'routerEdit/:id', component: RouterEditComponent },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class RouterRoutingModule { }
