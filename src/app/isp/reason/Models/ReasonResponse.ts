export interface ReasonResponse {
    data: Reason[];
}

export interface Reason {
    id: number;
    type: Type;
    name: string;
    status: number;
}

export enum Type {
    Fijo = "fijo",
    Variable = "variable",
}
