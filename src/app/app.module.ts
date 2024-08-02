import { NgModule, LOCALE_ID, APP_INITIALIZER } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { SpinnerInterceptor } from './shared/spinner/spinner.interceptor';
import { AuthInterceptor } from './auth/auth/AuthInterceptor';

import { CustomerModule } from './isp/customer/customer.module';
import { NavigationModule } from './navigation/navigation.module';
import { AuthModule } from './auth/auth.module';

import { RouterModule } from './isp/router/router.module';
import { PlanModule } from './isp/plan/plan.module';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { InvoiceModule } from './isp/invoice/invoice.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { ExpenseModule } from './isp/expense/expense.module';
import { RetryInterceptor } from './auth/retry.interceptor';
import { ReasonModule } from './isp/reason/reason.module';
import { SharedModule } from './shared/shared.module';

//Para fechas en spanish
import { DatePipe } from '@angular/common';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats, provideNativeDateAdapter } from '@angular/material/core';
import localeEsPe from '@angular/common/locales/es-PE';
import { registerLocaleData } from '@angular/common';
import { AppConfigService } from './app-config.service';
import { ClientIdInterceptor } from './client-id.interceptor';

registerLocaleData(localeEsPe, 'es-PE');


export function initializeApp(appConfigService: AppConfigService) {
  return (): Promise<void> => {
    return new Promise<void>((resolve) => {
      appConfigService.configureEnvironment();
      resolve();
    });
  };
}


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
    RouterModule,
    PlanModule,
    InvoiceModule,
    ExpenseModule,
    ReasonModule,
    DashboardModule,
    SweetAlert2Module,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatButtonModule,
    SharedModule


  ],
  providers: [

    AppConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfigService],
      multi: true
    },

    provideClientHydration(),
    provideAnimationsAsync(),
    provideNativeDateAdapter(),
    DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: ClientIdInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'es-PE' },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
