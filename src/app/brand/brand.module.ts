import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandListComponent } from './brand-list/brand-list.component';
import { BrandCreateComponent } from './brand-create/brand-create.component';
import { BrandRoutingModule } from './brand-routing.module';



@NgModule({
  declarations: [
    BrandListComponent,
    BrandCreateComponent
  ],
  imports: [
    CommonModule,
    BrandRoutingModule
  ]
})
export class BrandModule { }
