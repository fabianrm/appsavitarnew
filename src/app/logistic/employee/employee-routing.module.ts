import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeCreateComponent } from './employee-create/employee-create.component';
import { EmployeeEditComponent } from './employee-edit/employee-edit.component';
import { AuthGuard } from '../../auth/auth.guard';

const routes: Routes = [
  { path: 'employees', component: EmployeeListComponent, data: { title: 'Empleados' }, canActivate: [AuthGuard] },
  { path: 'employeeCreate', component: EmployeeCreateComponent },
  { path: 'employeeEdit/:id', component: EmployeeEditComponent },
];



@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
