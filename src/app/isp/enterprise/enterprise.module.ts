import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnterpriseListComponent } from './enterprise-list/enterprise-list.component';
import { EnterpriseCreateComponent } from './enterprise-create/enterprise-create.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MapleafModule } from '../mapleaf/mapleaf.module';
import { EnterpriseRoutingModule } from './enterprise-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from '../../shared/shared.module';
import { AddAdminComponent } from './add-admin/add-admin.component';



@NgModule({
  declarations: [
    EnterpriseListComponent,
    EnterpriseCreateComponent,
    AddAdminComponent
  ],
  imports: [
    CommonModule,
    EnterpriseRoutingModule,
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
    MatCardModule,
    MatSelectModule,
    MatOptionModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    FormsModule,
    MapleafModule,
    MatMenuModule,
    MatTooltipModule,
    SharedModule

  ]
})
export class EnterpriseModule { }
