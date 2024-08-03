import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../auth/auth.guard';
import { EntryListComponent } from './entry-list/entry-list.component';
import { EntryCreateComponent } from './entry-create/entry-create.component';

const routes: Routes = [
  { path: 'entries', component: EntryListComponent, data: { title: 'Entradas a Almacén' }, canActivate: [AuthGuard] },
  { path: 'entry-create', component: EntryCreateComponent, data: { title: 'Registrar entradas' }, canActivate: [AuthGuard] },
  
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntryRoutingModule { }
