export interface CategoryResponse {
    data: Category[];
}

export interface CategorySingleResponse {
    data: Category;
}

export interface Category {
    id: number;
    name: string;
    status: number;
}
