import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../auth/auth.guard';
import { BrandCreateComponent } from './brand-create/brand-create.component';
import { BrandEditComponent } from './brand-edit/brand-edit.component';
import { BrandListComponent } from './brand-list/brand-list.component';


const routes: Routes = [
  { path: 'brands', component: BrandListComponent, data: { title: 'Planes' }, canActivate: [AuthGuard] },
  { path: 'branCreate', component: BrandCreateComponent },
  { path: 'branEdit/:id', component: BrandEditComponent },
];



@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrandRoutingModule { }
