export interface DataPoint {
    id: number;
    name: string;
    availablePorts: number;
    note: string;
    status: number;
    coordinates: [number, number];
}