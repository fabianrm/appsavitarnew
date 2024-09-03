import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DestinationListComponent } from './destination-list/destination-list.component';
import { DestinationCreateComponent } from './destination-create/destination-create.component';
import { DestinationEditComponent } from './destination-edit/destination-edit.component';
import { DestinationRoutingModule } from './destination-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { UseMaterialsComponent } from './use-materials/use-materials.component';



@NgModule({
  declarations: [
    DestinationListComponent,
    DestinationCreateComponent,
    DestinationEditComponent,
    UseMaterialsComponent
  ],
  imports: [
    CommonModule,
    DestinationRoutingModule,
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
    MatMenuModule,
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
  ]
})
export class DestinationModule { }
