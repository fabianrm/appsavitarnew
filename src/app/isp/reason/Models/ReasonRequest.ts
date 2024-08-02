export interface ReasonRequest {
    type: Type;
    name: string;
    status: number;
}

export enum Type {
    Fijo = "fijo",
    Variable = "variable",
}