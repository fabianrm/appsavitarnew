export interface CityResponse {
    data: City[];
}

export interface CityResponseSingle {
    data: City;
}

export interface City {
    id: number;
    name: string;
    latitude: string;
    longitude: string;
    coordinates: [number, number];
    status: number;
}
