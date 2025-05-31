// utils/menu-utils.ts

import { MenuNode } from "./menu-node.model";

/**
 * Aplana un árbol de nodos en un solo array
 */
export function flattenMenu(menu: MenuNode[]): MenuNode[] {
    const result: MenuNode[] = [];

    const recurse = (items: MenuNode[]) => {
        for (const item of items) {
            result.push(item);
            if (item.children?.length) {
                recurse(item.children);
            }
        }
    };

    recurse(menu);
    return result;
}

/**
 * Reconstruye el árbol jerárquico a partir de una lista plana
 */
export function buildMenuTree(flatMenu: MenuNode[]): MenuNode[] {
    const menuMap = new Map<number, MenuNode>();
    const tree: MenuNode[] = [];

    // Clonar nodos y agregar children vacíos
    flatMenu.forEach(item => {
        menuMap.set(item.id, { ...item, children: [] });
    });

    // Construir la jerarquía
    flatMenu.forEach(item => {
        const node = menuMap.get(item.id)!;
        if (item.parent_id === null) {
            tree.push(node);
        } else {
            const parent = menuMap.get(item.parent_id);
            if (parent) {
                parent.children!.push(node);
            }
        }
    });

    // Ordenar recursivamente los nodos por el campo `order`
    const sortByOrder = (nodes: MenuNode[]) => {
        nodes.sort((a, b) => a.order - b.order);
        nodes.forEach(n => {
            if (n.children?.length) {
                sortByOrder(n.children);
            }
        });
    };

    sortByOrder(tree);

    return tree;
}
