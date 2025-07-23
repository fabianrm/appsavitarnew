export interface SyncResponse {
    success: boolean;
    message: string;
    procesados: number;
    total: number;
    usuarios_discrepantes: string[];
}
