import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { ResumeComponent } from './resume/resume.component';


@NgModule({
  declarations: [
    DashboardComponent,
    ResumeComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatMenuModule,
    DashboardRoutingModule,
  ]
})
export class DashboardModule { }
