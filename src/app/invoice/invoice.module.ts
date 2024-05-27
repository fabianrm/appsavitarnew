import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceCreateComponent } from './invoice-create/invoice-create.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { InvoiceRoutingModule } from './invoice-routing.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { InvoicePaidComponent } from './invoice-paid/invoice-paid.component';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    InvoiceCreateComponent,
    InvoiceListComponent,
    InvoicePaidComponent
  ],
  imports: [
    CommonModule,
    InvoiceRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatMenu,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatDatepickerModule,
    MatSelectModule,
  ]
})
export class InvoiceModule { }
