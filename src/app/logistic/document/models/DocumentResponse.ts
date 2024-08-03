export interface DocumentResponse {
    data: Document[];
}

export interface Document {
    id: number;
    name: string;
    status: number;
}
