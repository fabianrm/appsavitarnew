import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from '../../auth/auth.guard';
import { RouterModule, Routes } from '@angular/router';
import { KardexMaterialComponent } from './kardex-material/kardex-material.component';

const routes: Routes = [
  { path: 'kardex/:id', component: KardexMaterialComponent, data: { title: 'Kardex' }, canActivate: [AuthGuard] },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class KardexRoutingModule { }
