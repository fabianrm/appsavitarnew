export interface ResponseRouter {
    data: ReqRouter[];
}

export interface ReqRouter {
    id: number;
    ip: string;
    vlan: string;
    usuario: string;
    password: string;
    port: string;
    api_connection: string;
    status: number;
}
