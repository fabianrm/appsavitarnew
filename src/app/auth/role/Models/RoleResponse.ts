export interface RoleResponse {
    data: Role[];
    total: number;
}

export interface RoleSingleResponse {
    data: Role;
}

export interface Role {
    id: number;
    name: string;
}
