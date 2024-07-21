// app-config.service.ts
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  clientId = '';

  constructor() {
    this.configureEnvironment();
  }

  public configureEnvironment(): void {

    if (environment.production) {

      const hostname = window.location.hostname;
      const subdomain = hostname.split('.')[0];
      const baseApiUrl = 'savitarperu.com';

      if (hostname === baseApiUrl) {
        this.clientId = 'savitar'
      } else {
        this.clientId = subdomain;
      }
 
    } else {
      this.clientId = 'savitar'
    }

    console.log('CLient_Id', this.clientId);

  }



  public getClientId(): string {
    return this.clientId;
  }
}