import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouterListComponent } from './router-list/router-list.component';
import { RouterCreateComponent } from './router-create/router-create.component';
import { RouterEditComponent } from './router-edit/router-edit.component';

const routes: Routes = [
  { path: 'routers', component: RouterListComponent },
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
