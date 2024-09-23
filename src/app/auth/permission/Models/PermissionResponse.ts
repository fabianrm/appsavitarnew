export interface PermissionResponse {
    data: Permission[];
    total: number;
}

export interface PermissionSingleResponse {
    data: Permission;
}

export interface Permission {
    id: number;
    name: string;
    parent_id: number | null;
    checked?: boolean;
    children?: Permission[];

}

export function buildPermissionTree(permissions: any[]): Permission[] {
    const map = new Map<number, Permission>();
    const roots: Permission[] = [];

    permissions.forEach(perm => {
        map.set(perm.id, { ...perm, children: [], checked: false });
    });

    permissions.forEach(perm => {
        const node = map.get(perm.id)!;
        if (perm.parent_id === null) {
            roots.push(node);
        } else {
            const parent = map.get(perm.parent_id);
            if (parent) {
                parent.children?.push(node);
            }
        }
    });

    return roots;
}