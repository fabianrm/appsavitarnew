import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DistanceService {

  // Método para calcular la distancia entre dos coordenadas usando la fórmula de Haversine
  getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distancia en km
    return distance;
  }

  // Método para convertir grados a radianes
  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  // Método para filtrar coordenadas dentro de un radio
  filterCoordinatesWithinRadius(center: [number, number], coordinates: [number, number][], radiusInMeters: number): [number, number][] {
    const radiusInKm = radiusInMeters / 1000;
    return coordinates.filter(coord => {
      const distance = this.getDistanceFromLatLonInKm(center[0], center[1], coord[0], coord[1]);
      return distance <= radiusInKm;
    });
  }
}
