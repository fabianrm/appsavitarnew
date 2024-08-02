export interface PresentationResponse {
    data: Presentation[];
}

export interface PresentationSingleResponse {
    data: Presentation;
}

export interface Presentation {
    id: number;
    name: string;
    prefix: string;
    status: number;
}
