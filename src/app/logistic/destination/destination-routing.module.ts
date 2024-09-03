import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DestinationListComponent } from './destination-list/destination-list.component';
import { DestinationCreateComponent } from './destination-create/destination-create.component';
import { DestinationEditComponent } from './destination-edit/destination-edit.component';
import { AuthGuard } from '../../auth/auth.guard';
import { UseMaterialsComponent } from './use-materials/use-materials.component';


const routes: Routes = [
  { path: 'destinations', component: DestinationListComponent, data: { title: 'Categorías' }, canActivate: [AuthGuard] },
  { path: 'destineCreate', component: DestinationCreateComponent },
  { path: 'destineEdit/:id', component: DestinationEditComponent },
  { path: 'destineUse', component: UseMaterialsComponent },
];


@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DestinationRoutingModule { }
