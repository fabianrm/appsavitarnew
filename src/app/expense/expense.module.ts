import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseCreateComponent } from './expense-create/expense-create.component';
import { ExpenseEditComponent } from './expense-edit/expense-edit.component';
import { ExpenseDetailsComponent } from './expense-details/expense-details.component';
import { ExpenseListComponent } from './expense-list/expense-list.component';
import { ExpenseRoutingModule } from './expense-routing.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';



@NgModule({
  declarations: [
    ExpenseCreateComponent,
    ExpenseEditComponent,
    ExpenseDetailsComponent,
    ExpenseListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ExpenseRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatCardModule,
    MatDatepickerModule

  ]
})
export class ExpenseModule { }
