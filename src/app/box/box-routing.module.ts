import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoxListComponent } from './box-list/box-list.component';
import { BoxCreateComponent } from './box-create/box-create.component';
import { BoxEditComponent } from './box-edit/box-edit.component';

const routes: Routes = [
  { path: 'boxs', component: BoxListComponent },
  { path: 'boxCreate', component: BoxCreateComponent },
  { path: 'boxEdit/:id', component: BoxEditComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoxRoutingModule { }
