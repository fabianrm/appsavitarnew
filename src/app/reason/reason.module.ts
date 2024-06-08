import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReasonListComponent } from './reason-list/reason-list.component';
import { ReasonCreateComponent } from './reason-create/reason-create.component';
import { ReasonEditComponent } from './reason-edit/reason-edit.component';
import { ReasonRoutingModule } from './reason-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';




@NgModule({
  declarations: [
    ReasonListComponent,
    ReasonCreateComponent,
    ReasonEditComponent
  ],
  imports: [
    CommonModule,
    ReasonRoutingModule,
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
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class ReasonModule { }
