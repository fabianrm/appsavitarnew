import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { SpinnerInterceptor } from './shared/spinner/spinner.interceptor';
import { AuthInterceptor } from './auth/auth/AuthInterceptor';

import { CustomerModule } from './customer/customer.module';
import { NavigationModule } from './navigation/navigation.module';
import { AuthModule } from './auth/auth.module';
import { BoxModule } from './box/box.module';
import { RouterModule } from './router/router.module';
import { PlanModule } from './plan/plan.module';
import { ContractModule } from './contract/contract.module';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { DatePipe } from '@angular/common';
import { InvoiceModule } from './invoice/invoice.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats, provideNativeDateAdapter } from '@angular/material/core';

//Para fechas en spanish
import localeEsPe from '@angular/common/locales/es-PE';
import { registerLocaleData } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ExpenseModule } from './expense/expense.module';
import { RetryInterceptor } from './auth/retry.interceptor';
import { ReasonModule } from './reason/reason.module';


registerLocaleData(localeEsPe, 'es-PE');


export const MY_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    NavigationModule,
    CustomerModule,
    AuthModule,
    BoxModule,
    RouterModule,
    PlanModule,
    ContractModule,
    InvoiceModule,
    ExpenseModule,
    ReasonModule,
    DashboardModule,
    SweetAlert2Module,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,

  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    provideNativeDateAdapter(),
    DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'es-PE' },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
