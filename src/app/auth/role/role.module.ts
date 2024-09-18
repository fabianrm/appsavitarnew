import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleListComponent } from './role-list/role-list.component';
import { RoleCreateComponent } from './role-create/role-create.component';
import { RoleRoutingModule } from './role-routing.module';



@NgModule({
  declarations: [
    RoleListComponent,
    RoleCreateComponent
  ],
  imports: [
    CommonModule,
    RoleRoutingModule
  ]
})
export class RoleModule { }
