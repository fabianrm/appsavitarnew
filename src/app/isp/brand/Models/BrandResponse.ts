export interface BrandResponse {
    data: Brand[];
    total: number;
}

export interface BrandSingleResponse {
    data: Brand;
    total: number;
}

export interface Brand {
    id: number;
    name: string;
    status: number;
}
