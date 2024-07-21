import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CityListComponent } from './city-list/city-list.component';
import { CityCreateComponent } from './city-create/city-create.component';
import { CityEditComponent } from './city-edit/city-edit.component';

const routes: Routes = [
  { path: 'cities', component: CityListComponent, data: { title: 'Ciudades' } },
  { path: 'city-create', component: CityCreateComponent, data: { title: 'Crear Ciudad' } },
  { path: 'city-edit/:id', component: CityEditComponent, data: { title: 'Editar Ciudad' } },
]

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CityRoutingModule { }
