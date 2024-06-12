import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapsService {

  private coordinatesSource = new BehaviorSubject<[number, number] | null>(null);
  currentCoordinates = this.coordinatesSource.asObservable();

  constructor() { }

  changeCoordinates(coordinates: [number, number]) {
    this.coordinatesSource.next(coordinates);
  }

}
