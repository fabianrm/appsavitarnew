export interface DestinationResponse {
    data: Destination[];
}

export interface DestinationSingleResponse {
    data: Destination;
}

export interface Destination {
    id: number;
    name: string;
    status: number;
}
