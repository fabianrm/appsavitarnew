import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ExpenseListComponent } from './expense-list/expense-list.component';
import { AuthGuard } from '../auth/auth.guard';
import { ExpenseCreateComponent } from './expense-create/expense-create.component';
import { ExpenseEditComponent } from './expense-edit/expense-edit.component';
import { ExpenseDetailsComponent } from './expense-details/expense-details.component';
import { ExpenseReportComponent } from './expense-report/expense-report.component';

const routes: Routes = [
  { path: 'fixes', component: ExpenseListComponent, data: { title: 'Gastos Fijos', tipo:'fijo' }, canActivate: [AuthGuard] },
  { path: 'variables', component: ExpenseListComponent, data: { title: 'Gastos Variables', tipo:'variable' }, canActivate: [AuthGuard] },
  { path: 'report', component: ExpenseReportComponent, data: { title: 'Egresos'}, canActivate: [AuthGuard] },
  { path: 'expensesCreate', component: ExpenseCreateComponent },
  { path: 'expensesEdit/:id', component: ExpenseEditComponent },
  { path: 'expensesDetails/:id', component: ExpenseDetailsComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpenseRoutingModule { }
