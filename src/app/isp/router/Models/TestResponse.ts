export interface TestResponse {
    ip: string;
    usuario: string;
    conectado: boolean;
    mensaje: string;
    system_info: SystemInfo;
}

export interface SystemInfo {
    headers: Headers;
    original: Original[];
    exception: null;
}

export interface Headers {
}

export interface Original {
    uptime: string;
    version: string;
    "build-time": string;
    "factory-software": string;
    "free-memory": string;
    "total-memory": string;
    cpu: string;
    "cpu-count": string;
    "cpu-frequency": string;
    "cpu-load": string;
    "free-hdd-space": string;
    "total-hdd-space": string;
    "write-sect-since-reboot": string;
    "write-sect-total": string;
    "architecture-name": string;
    "board-name": string;
    platform: string;
}
