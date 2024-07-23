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
        loadChildren: () => import('./factibillity/factibillity.module').then(m => m.FactibillityModule)
      },
      {
        path: 'city',
        loadChildren: () => import('./city/city.module').then(m => m.CityModule)
      },
      {
        path: 'customer',
        loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule)
      },
      {
        path: 'box',
        loadChildren: () => import('./box/box.module').then(m => m.BoxModule)
      },
      {
        path: 'router',
        loadChildren: () => import('./router/router.module').then(m => m.RouterModule)
      },
      {
        path: 'plan',
        loadChildren: () => import('./plan/plan.module').then(m => m.PlanModule)
      },
      {
        path: 'contract',
        loadChildren: () => import('./contract/contract.module').then(m => m.ContractModule)
      },
      {
        path: 'equipment',
        loadChildren: () => import('./equipment/equipment.module').then(m => m.EquipmentModule)
      },
      {
        path: 'invoices',
        loadChildren: () => import('./invoice/invoice.module').then(m => m.InvoiceModule)
      },
      {
        path: 'reports',
        loadChildren: () => import('./invoice/invoice.module').then(m => m.InvoiceModule)
      },
      {
        path: 'expenses',
        loadChildren: () => import('./expense/expense.module').then(m => m.ExpenseModule)
      },

      {
        path: 'report',
        loadChildren: () => import('./expense/expense.module').then(m => m.ExpenseModule)
      },
      {
        path: 'reason',
        loadChildren: () => import('./reason/reason.module').then(m => m.ReasonModule)
      },
      {
        path: 'enterprise',
        loadChildren: () => import('./enterprise/enterprise.module').then(m => m.EnterpriseModule)
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
