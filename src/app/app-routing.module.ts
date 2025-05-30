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
        path: 'entry',
        loadChildren: () => import('./logistic/entry/entry.module').then(m => m.EntryModule)
      },
      {
        path: 'output',
        loadChildren: () => import('./logistic/output/output.module').then(m => m.OutputModule)
      },
      {
        path: 'brand',
        loadChildren: () => import('./isp/brand/brand.module').then(m => m.BrandModule)
      },
      {
        path: 'category',
        loadChildren: () => import('./logistic/category/category.module').then(m => m.CategoryModule)
      },
      {
        path: 'presentation',
        loadChildren: () => import('./logistic/presentation/presentation.module').then(m => m.PresentationModule)
      },
      {
        path: 'destine',
        loadChildren: () => import('./logistic/destination/destination.module').then(m => m.DestinationModule)
      },
      {
        path: 'kardex',
        loadChildren: () => import('./logistic/kardex/kardex.module').then(m => m.KardexModule)
      },
      {
        path: 'supplier',
        loadChildren: () => import('./logistic/supplier/supplier.module').then(m => m.SupplierModule)
      },
      {
        path: 'promotion',
        loadChildren: () => import('./isp/promotion/promotion.module').then(m => m.PromotionModule)
      },
      {
        path: 'employee',
        loadChildren: () => import('./logistic/employee/employee.module').then(m => m.EmployeeModule)
      },
      {
        path: 'role',
        loadChildren: () => import('./auth/role/role.module').then(m => m.RoleModule)
      },
      {
        path: 'login',
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
      }

    ]
  },

  {
    path: 'support', component: NavigationComponent, children: [
      {
        path: 'categories',
        loadChildren: () => import('./support/category-ticket/category-ticket.module').then(m => m.CategoryTicketModule)
      },
      {
        path: 'tickets',
        loadChildren: () => import('./support/ticket/ticket.module').then(m => m.TicketModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
