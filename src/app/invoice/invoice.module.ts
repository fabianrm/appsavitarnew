import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceCreateComponent } from './invoice-create/invoice-create.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { InvoiceRoutingModule } from './invoice-routing.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';



@NgModule({
  declarations: [
    InvoiceCreateComponent,
    InvoiceListComponent
  ],
  imports: [
    CommonModule,
    InvoiceRoutingModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule
  ]
})
export class InvoiceModule { }
