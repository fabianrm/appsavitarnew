import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PresentationListComponent } from './presentation-list/presentation-list.component';
import { PresentationCreateComponent } from './presentation-create/presentation-create.component';
import { PresentationEditComponent } from './presentation-edit/presentation-edit.component';
import { AuthGuard } from '../../auth/auth.guard';

const routes: Routes = [
  { path: 'presentations', component: PresentationListComponent, data: { title: 'Presentaciones' }, canActivate: [AuthGuard] },
  { path: 'presentationCreate', component: PresentationCreateComponent },
  { path: 'presentationEdit/:id', component: PresentationEditComponent },
];



@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PresentationRoutingModule { }
