// models/menu-node.model.ts
export interface MenuNode {
    id: number;
    name: string;
    icon: string;
    route: string;
    parent_id: number | null;
    order: number;
    children?: MenuNode[];
}
