import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractEditComponent } from './contract-edit/contract-edit.component';
import { ContractListComponent } from './contract-list/contract-list.component';
import { ContractRoutingModule } from './contract-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { ContractEditPlanComponent } from './contract-edit-plan/contract-edit-plan.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ContractCreateNewComponent } from './contract-create-new/contract-create-new.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MapsModule } from '../maps/maps.module';


@NgModule({
  declarations: [
    ContractEditComponent,
    ContractListComponent,
    ContractEditPlanComponent,
    ContractCreateNewComponent,
  ],
  imports: [
    CommonModule,
    ContractRoutingModule,
    MapsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatSelectModule,
    MatOptionModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatTabsModule,
    MatMenu,
    MatMenuModule,
    MatAutocompleteModule,
    MatCheckboxModule
  
  ]
})
export class ContractModule { }
