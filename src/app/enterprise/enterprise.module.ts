import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnterpriseListComponent } from './enterprise-list/enterprise-list.component';
import { EnterpriseCreateComponent } from './enterprise-create/enterprise-create.component';
import { EnterpriseEditComponent } from './enterprise-edit/enterprise-edit.component';



@NgModule({
  declarations: [
    EnterpriseListComponent,
    EnterpriseCreateComponent,
    EnterpriseEditComponent
  ],
  imports: [
    CommonModule
  ]
})
export class EnterpriseModule { }
