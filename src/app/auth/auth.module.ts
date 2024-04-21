import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth/auth.component';
import { MatSidenavModule } from '@angular/material/sidenav';


@NgModule({
  declarations: [
    AuthComponent
  ],
  imports: [
    CommonModule,
    MatSidenavModule,
  ]
})
export class AuthModule { }
