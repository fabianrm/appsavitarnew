import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateTicketComponent } from './create-ticket/create-ticket.component';
import { EditTicketComponent } from './edit-ticket/edit-ticket.component';
import { ListTicketComponent } from './list-ticket/list-ticket.component';
import { TicketRoutingModule } from './ticket-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatOptionModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AssignTicketComponent } from './assign-ticket/assign-ticket.component';
import { ShowTicketComponent } from './show-ticket/show-ticket.component';
import { MapleafModule } from '../../isp/mapleaf/mapleaf.module';



@NgModule({
  declarations: [
    CreateTicketComponent,
    EditTicketComponent,
    ListTicketComponent,
    AssignTicketComponent,
    ShowTicketComponent
  ],
  imports: [
    CommonModule,
    TicketRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatMenu,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatDatepickerModule,
    MatSelectModule,
    MatListModule,
    MatCardSubtitle,
    MatOptionModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    MapleafModule

  ]
})
export class TicketModule { }
