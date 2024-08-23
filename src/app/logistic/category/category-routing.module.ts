import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryCreateComponent } from './category-create/category-create.component';
import { CategoryEditComponent } from './category-edit/category-edit.component';
import { AuthGuard } from '../../auth/auth.guard';

const routes: Routes = [
  { path: 'categories', component: CategoryListComponent, data: { title: 'Categorías' }, canActivate: [AuthGuard] },
  { path: 'categoryCreate', component: CategoryCreateComponent },
  { path: 'categoryEdit/:id', component: CategoryEditComponent },
];



@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule { }
