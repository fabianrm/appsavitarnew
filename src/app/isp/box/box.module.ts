import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoxRoutingModule } from './box-routing.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { BoxListComponent } from './box-list/box-list.component';
import { BoxCreateComponent } from './box-create/box-create.component';
import { BoxEditComponent } from './box-edit/box-edit.component';
import { BoxConnectionsComponent } from './box-connections/box-connections.component';
import { BoxConnectionDialogComponent } from './box-connections/box-connection-dialog/box-connection-dialog.component';
import { BoxConnectionsListComponent } from './box-connections/box-connections-list/box-connections-list.component';
import { BoxRouteFilterDialogComponent } from './box-connections/box-route-filter-dialog/box-route-filter-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MapleafModule } from '../mapleaf/mapleaf.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';



@NgModule({
  declarations: [
    BoxCreateComponent,
    BoxEditComponent,
    BoxListComponent,
    BoxConnectionsComponent,
    BoxConnectionDialogComponent,
    BoxConnectionDialogComponent,
    BoxConnectionsListComponent,
    BoxRouteFilterDialogComponent
  ],
  imports: [
    CommonModule,
    BoxRoutingModule,
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
    ReactiveFormsModule,
    FormsModule,
    MapleafModule,
    MatMenuModule,
    TextFieldModule,
    MatProgressSpinnerModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatCheckboxModule
  ]
})
export class BoxModule { }
