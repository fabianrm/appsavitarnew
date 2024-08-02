import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth/auth.component';
import { NavigationComponent } from './navigation/navigation.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: AuthComponent },
  {
    path: 'dashboard', component: NavigationComponent,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'factibillity',
        loadChildren: () => import('./isp/factibillity/factibillity.module').then(m => m.FactibillityModule)
      },
      {
        path: 'city',
        loadChildren: () => import('./isp/city/city.module').then(m => m.CityModule)
      },
      {
        path: 'customer',
        loadChildren: () => import('./isp/customer/customer.module').then(m => m.CustomerModule)
      },
      {
        path: 'box',
        loadChildren: () => import('./isp/box/box.module').then(m => m.BoxModule)
      },
      {
        path: 'router',
        loadChildren: () => import('./isp/router/router.module').then(m => m.RouterModule)
      },
      {
        path: 'plan',
        loadChildren: () => import('./isp/plan/plan.module').then(m => m.PlanModule)
      },
      {
        path: 'contract',
        loadChildren: () => import('./isp/contract/contract.module').then(m => m.ContractModule)
      },
      {
        path: 'equipment',
        loadChildren: () => import('./isp/equipment/equipment.module').then(m => m.EquipmentModule)
      },
      {
        path: 'invoices',
        loadChildren: () => import('./isp/invoice/invoice.module').then(m => m.InvoiceModule)
      },
      {
        path: 'reports',
        loadChildren: () => import('./isp/invoice/invoice.module').then(m => m.InvoiceModule)
      },
      {
        path: 'expenses',
        loadChildren: () => import('./isp/expense/expense.module').then(m => m.ExpenseModule)
      },

      {
        path: 'report',
        loadChildren: () => import('./isp/expense/expense.module').then(m => m.ExpenseModule)
      },
      {
        path: 'reason',
        loadChildren: () => import('./isp/reason/reason.module').then(m => m.ReasonModule)
      },
      {
        path: 'enterprise',
        loadChildren: () => import('./isp/enterprise/enterprise.module').then(m => m.EnterpriseModule)
      },
      {
        path: 'material',
        loadChildren: () => import('./logistic/material/material.module').then(m => m.MaterialModule)
      },
      {
        path: 'login',
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
