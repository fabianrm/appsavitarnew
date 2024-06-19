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
    const R = 6371; // Radius of the Earth in km

    return dataPoints.filter(point => {
      const [lat1, lon1] = center;
      const [lat2, lon2] = point.coordinates;

      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);

      const a = Math.sin(dLat / 2) * Math.sin(dLon / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c * 1000; // Distance in meters

      return distance <= radius;
    });
  }

}
