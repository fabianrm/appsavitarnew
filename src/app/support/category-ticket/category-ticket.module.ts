import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListCategoryTicketComponent } from './list-category-ticket/list-category-ticket.component';
import { CreateCategoryTicketComponent } from './create-category-ticket/create-category-ticket.component';
import { EditCategoryTicketComponent } from './edit-category-ticket/edit-category-ticket.component';
import { CategoryTicketRoutingModule } from './category-ticket-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MapleafModule } from '../../isp/mapleaf/mapleaf.module';



@NgModule({
  declarations: [
    ListCategoryTicketComponent,
    CreateCategoryTicketComponent,
    EditCategoryTicketComponent
  ],
  imports: [
    CommonModule,
    CategoryTicketRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatSelectModule,
    MatOptionModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    FormsModule,
    MapleafModule,
    MatMenuModule,
  ]
})
export class CategoryTicketModule { }
