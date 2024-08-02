export interface DataPoint {
    id: number;
    name: string;
    availablePorts: number;
    status: number;
    coordinates: [number, number];
}