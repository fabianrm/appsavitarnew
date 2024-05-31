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
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats } from '@angular/material/core';

//Para fechas en spanish
import localeEs from "@angular/common/locales/es";
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeEs, 'es');


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
    SpinnerComponent
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
    DashboardModule,
    SweetAlert2Module
    
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'es' },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
