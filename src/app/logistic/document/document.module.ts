import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocuementListComponent } from './docuement-list/docuement-list.component';
import { DocuementCreateComponent } from './docuement-create/docuement-create.component';



@NgModule({
  declarations: [
    DocuementListComponent,
    DocuementCreateComponent
  ],
  imports: [
    CommonModule
  ]
})
export class DocumentModule { }
