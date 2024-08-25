import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntryListComponent } from './entry-list/entry-list.component';
import { EntryCreateComponent } from './entry-create/entry-create.component';
import { EntryRoutingModule } from './entry-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule, MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MaterialRoutingModule } from '../material/material-routing.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MaterialSelectDialogComponent } from './material-select-dialog/material-select-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { EntryDetailsComponent } from './entry-details/entry-details.component';



@NgModule({
  declarations: [
    EntryListComponent,
    EntryCreateComponent,
    MaterialSelectDialogComponent,
    EntryDetailsComponent
  ],
  imports: [
    CommonModule,
    EntryRoutingModule,
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
    MatAutocompleteModule


  ]
})
export class EntryModule { }
