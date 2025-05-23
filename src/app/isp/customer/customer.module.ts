import {  NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomerCreateComponent } from './customer-create/customer-create.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { CustomerEditComponent } from './customer-edit/customer-edit.component';
import { CustomerRoutingModule } from './customer-routing.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ContractsListComponent } from './contracts-list/contracts-list.component';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MapleafModule } from '../mapleaf/mapleaf.module';
import { CustomerSuspendComponent } from './customer-suspend/customer-suspend.component';


@NgModule({ declarations: [
        CustomerCreateComponent,
        CustomerListComponent,
        CustomerDetailsComponent,
        CustomerEditComponent,
        ContractsListComponent,
        CustomerSuspendComponent
    ], imports: [CommonModule,
        CustomerRoutingModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatDialogModule,
        MatButtonModule,
        MatCard,
        MatCardActions,
        MatMenu,
        MatMenuModule,
        MatCardContent,
        MatCardHeader,
        MatCardTitle,
        MatCardSubtitle,
        MatSelectModule,
        MatOptionModule,
        MatSlideToggleModule,
        ReactiveFormsModule,
        FormsModule,
        MatTooltipModule,
        MapleafModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class CustomerModule { }
