// guards/permission.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { AuthService } from './auth.service';
// Asegúrate que esta interfaz esté definida aquí

export interface MenuNode {
  name: string;
  icon: string;
  route: string;
  children?: MenuNode[];
}

//Helper para aplanar el arbol de Permisos
function flattenMenu(menu: MenuNode[]): MenuNode[] {
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


//Guard
export const permissionGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getUserPermissions().pipe(
    map((response) => {
      const menu: MenuNode[] = response.data;
      const flatMenu = flattenMenu(menu);

      // ¿Tiene permiso para 'Inicio'?
      const hasInicio = flatMenu.some(node => node.name === 'Inicio' && node.route);

      if (hasInicio) {
        return true;
      }

      // Buscar la primera ruta válida
      const firstValidRoute = flatMenu.find(node => !!node.route);

      if (firstValidRoute?.route) {
        router.navigate([firstValidRoute.route]);
      } else {
        router.navigate(['/unauthorized']);
      }

      return false;
    }),
    catchError(() => {
      router.navigate(['/unauthorized']);
      return of(false);
    })
  );
};
