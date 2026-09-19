import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsNotificationsComponent } from './settings-notifications/settings-notifications.component';
import { SettingsNetworkComponent } from './settings-network/settings-network.component';
import { AuthGuard } from '../../auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'notifications', pathMatch: 'full' },
  { path: 'notifications', component: SettingsNotificationsComponent, data: { title: 'Notificaciones' }, canActivate: [AuthGuard] },
  { path: 'network', component: SettingsNetworkComponent, data: { title: 'Red' }, canActivate: [AuthGuard] },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
