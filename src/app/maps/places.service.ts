import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  location?: [number, number]; //[long, lat]

  get locationReady(): boolean {
    return !!this.location;
  }

  
  constructor() {
    this.getLocation();
   }


  public async getLocation(): Promise<[number, number]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(

        ({ coords }) => {
          this.location = [coords.longitude, coords.latitude];
          resolve(this.location)
        }, (err) => {
          alert('No se pudo obtener la geolocalización');
          reject();
        }

      )
    });
  }
}
