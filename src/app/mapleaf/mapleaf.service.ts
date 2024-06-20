import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataPoint } from './Models/DataPoint';

@Injectable({
  providedIn: 'root'
})
export class MapleafService {

  private coordinatesSource = new BehaviorSubject<[number, number][]>([]);
  private dataPointsSource = new BehaviorSubject<DataPoint[]>([]);

  currentCoordinates = this.coordinatesSource.asObservable();
  currentDataPoints = this.dataPointsSource.asObservable();

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

  changeDataPoints(dataPoints: DataPoint[]) {
    this.dataPointsSource.next(dataPoints);
  }

  addDataPoint(dataPoint: DataPoint) {
    const currentDataPoints = this.dataPointsSource.value;
    this.dataPointsSource.next([...currentDataPoints, dataPoint]);
  }

  filterCoordinatesWithinRadius(center: [number, number], radius: number, dataPoints: DataPoint[]): DataPoint[] {
    const R = 6371e3; // Radio de la Tierra en metros
    const toRadians = (degrees: number) => degrees * Math.PI / 180;
    const [lat1, lon1] = center;

    return dataPoints.filter(dataPoint => {
      const [lat2, lon2] = dataPoint.coordinates;

      const φ1 = toRadians(lat1);
      const φ2 = toRadians(lat2);
      const Δφ = toRadians(lat2 - lat1);
      const Δλ = toRadians(lon2 - lon1);

      const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      const d = R * c; // Distancia en metros

      return d <= radius;
    });
  }


}
