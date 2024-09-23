export interface PermissionRoleResponse {
    data: PermissionRole[];
}

export interface PermissionRole {
    id: number;
    name: string;
    icon: string;
    route: null | string;
    parent_id: number | null;
    created_at: Date | null;
    updated_at: Date | null;
    pivot: Pivot;
}

export interface Pivot {
    role_id: number;
    permission_id: number;
}
