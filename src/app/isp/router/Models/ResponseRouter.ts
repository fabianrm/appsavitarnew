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
    connectivity?: RouterConnectivity;
}

export interface RouterConnectivity {
    status: 'online' | 'offline' | 'desconocido' | 'no_monitoreado';
    checked_at: string | null;
}
