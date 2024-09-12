import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListTicketComponent } from './list-ticket/list-ticket.component';
import { CreateTicketComponent } from './create-ticket/create-ticket.component';
import { EditTicketComponent } from './edit-ticket/edit-ticket.component';
import { AuthGuard } from '../../auth/auth.guard';
import { ShowTicketComponent } from './show-ticket/show-ticket.component';
import { AttendTicketComponent } from './attend-ticket/attend-ticket.component';

const routes: Routes = [
  { path: 'list-tickets', component: ListTicketComponent, data: { title: 'Tickets' }, canActivate: [AuthGuard] },
  { path: 'create-ticket', component: CreateTicketComponent, data: { title: 'Crear Ticket'}},
  { path: 'edit-ticket/:id', component: EditTicketComponent, data: { title: 'Editar Ticket' } },
  { path: 'detail-ticket/:id', component: ShowTicketComponent, data: { title: 'Detalle de Ticket' } },
  { path: 'attend-ticket/:id', component: AttendTicketComponent, data: { title: 'Registrar Evento' } },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketRoutingModule { }
