import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsNotificationsComponent } from './settings-notifications/settings-notifications.component';
import { SettingsWhatsappComponent } from './settings-whatsapp/settings-whatsapp.component';
import { SettingsWhatsappFailuresComponent } from './settings-whatsapp-failures/settings-whatsapp-failures.component';
import { SettingsNetworkComponent } from './settings-network/settings-network.component';

@NgModule({
  declarations: [
    SettingsNotificationsComponent,
    SettingsWhatsappComponent,
    SettingsWhatsappFailuresComponent,
    SettingsNetworkComponent,
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatTableModule,
    MatTooltipModule,
  ]
})
export class SettingsModule { }
