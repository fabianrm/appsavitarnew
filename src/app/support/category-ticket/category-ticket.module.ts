import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListCategoryTicketComponent } from './list-category-ticket/list-category-ticket.component';
import { CreateCategoryTicketComponent } from './create-category-ticket/create-category-ticket.component';
import { EditCategoryTicketComponent } from './edit-category-ticket/edit-category-ticket.component';
import { CategoryTicketRoutingModule } from './category-ticket-routing.module';



@NgModule({
  declarations: [
    ListCategoryTicketComponent,
    CreateCategoryTicketComponent,
    EditCategoryTicketComponent
  ],
  imports: [
    CommonModule,
    CategoryTicketRoutingModule
  ]
})
export class CategoryTicketModule { }
