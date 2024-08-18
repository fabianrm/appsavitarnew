import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OutputListComponent } from './output-list/output-list.component';
import { OutputCreateComponent } from './output-create/output-create.component';
import { OutputRoutingModule } from './output-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule, MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MaterialRoutingModule } from '../material/material-routing.module';
import { EntrySelectDialogComponent } from './entry-select-dialog/entry-select-dialog.component';
import { MatSortModule } from '@angular/material/sort';



@NgModule({
  declarations: [
    OutputListComponent,
    OutputCreateComponent,
    EntrySelectDialogComponent
  ],
  imports: [
    CommonModule,
    OutputRoutingModule,
    MaterialRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatOptionModule,
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatDatepickerModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatSortModule
  ]
})
export class OutputModule { }
