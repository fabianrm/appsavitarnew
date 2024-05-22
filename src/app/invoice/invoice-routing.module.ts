import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { InvoiceCreateComponent } from './invoice-create/invoice-create.component';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  { path: 'invoices', component: InvoiceListComponent, data: { title: 'Facturas' }, canActivate: [AuthGuard] },
  { path: 'invoiceGenerate', component: InvoiceCreateComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceRoutingModule { }
