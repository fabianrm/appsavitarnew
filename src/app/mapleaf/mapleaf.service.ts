import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapleafService {

  private coordinatesSource = new BehaviorSubject<[number, number][]>([]);
  currentCoordinates = this.coordinatesSource.asObservable();

  constructor() { }

  changeCoordinates(coordinates: [number, number][]) {
    this.coordinatesSource.next(coordinates);
  }

  addCoordinate(coordinate: [number, number]) {
    const currentCoords = this.coordinatesSource.value;
    this.coordinatesSource.next([...currentCoords, coordinate]);
  }

  setSingleCoordinate(coordinate: [number, number]) {
    this.coordinatesSource.next([coordinate]);
  }

  clearCoordinates() {
    this.coordinatesSource.next([]);
  }
}
