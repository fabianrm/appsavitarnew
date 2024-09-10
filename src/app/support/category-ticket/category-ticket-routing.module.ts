import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ListCategoryTicketComponent } from './list-category-ticket/list-category-ticket.component';
import { CreateCategoryTicketComponent } from './create-category-ticket/create-category-ticket.component';
import { AuthGuard } from '../../auth/auth.guard';
import { EditCategoryTicketComponent } from './edit-category-ticket/edit-category-ticket.component';



const routes: Routes = [
  { path: 'category-tickets', component: ListCategoryTicketComponent, data: { title: 'Categorías' }, canActivate: [AuthGuard] },
  { path: 'categoryCreate', component: CreateCategoryTicketComponent, data: { title: 'Crear Nueva Categoría' }, canActivate: [AuthGuard] },
  { path: 'categoryEdit/:id', component: EditCategoryTicketComponent, data: { title: 'Editar Categoría' }, canActivate: [AuthGuard] },
];



@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryTicketRoutingModule { }
