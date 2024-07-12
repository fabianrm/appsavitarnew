import { Component, HostBinding, OnInit, Renderer2, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { filter, map, shareReplay } from 'rxjs/operators';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';

interface MenuNode {
  name: string;
  icon: string;
  route: string;
  children?: MenuNode[];
}


const TREE_DATA: MenuNode[] = [
  {
    name: 'Inicio',
    icon: 'home',
    route: '/dashboard/home/home',
    children: []
  },
  {
    name: 'Factibilidad técnica',
    icon: 'wifi_tethering',
    route: '/dashboard/factibillity/factibillity-info',
    children: []
  },
  {
    name: 'Clientes',
    icon: 'people',
    route: '/dashboard/customer/customers',
    children: []
  },
  {
    name: 'Planes',
    icon: 'cast_connected',
    route: '/dashboard/plan/plans',
    children: []
  },
  {
    name: 'Routers',
    icon: 'router',
    route: '/dashboard/router/routers',
    children: []
  },
  {
    name: 'Cajas',
    icon: 'inbox',
    route: '/dashboard/box/boxes',
    children: []
  },
  {
    name: 'Equipos',
    icon: 'devices',
    route: '/dashboard/equipment/equipments',
    children: []
  },
  {
    name: 'Contratos',
    icon: 'alternate_email',
    route: '/dashboard/contract/contracts',
    children: []
  },
  {
    name: 'Facturación',
    icon: 'credit_card',
    route: '/dashboard/invoices/invoices',
    children: []
  },
  {
    name: 'Gastos',
    icon: 'paid',
    route: '',
    children: [
      {
        name: 'Fijos',
        icon: 'payments',
        route: '/dashboard/expenses/fixes',
        children: []
      },
      {
        name: 'Variables',
        icon: 'paid',
        route: '/dashboard/expenses/variables',
        children: []
      }
    ]
  },
  {
    name: 'Reportes',
    icon: 'bar_chart',
    route: '',
    children: [
      {
        name: 'Ingresos',
        icon: 'area_chart',
        route: '/dashboard/reports/report',
        children: []
      },
      {
        name: 'Ventas por mes',
        icon: 'date_range',
        route: '/dashboard/reports/monthly-sales',
        children: []
      }
    ]
  }
];







@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent implements OnInit {

  currentTitle: string = 'ISP CRM';
  @HostBinding('class') class: string = '';
  isDark: boolean = false;

  treeControl = new NestedTreeControl<MenuNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<MenuNode>();

  treeData = TREE_DATA;
  isExpanded = true;

  constructor(
    private router: Router,
    private authService: AuthService,
    private renderer: Renderer2) {
    this.dataSource.data = TREE_DATA;
  }


  hasChild = (_: number, node: MenuNode) => !!node.children && node.children.length > 0;

  toggleMenu() {
    this.isExpanded = !this.isExpanded;
  }

  



  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentRoute = this.router.routerState.snapshot.root;
        this.currentTitle = this.getTitle(currentRoute);
      });

    this.isDark = localStorage.getItem('theme') == 'dark';
    this.setTheme(this.isDark);

    
  }

  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
  );
  

  getTitle(route: ActivatedRouteSnapshot): string {
    let title = route.data['title'] || 'appsavitar';
    if (route.firstChild) {
      title = this.getTitle(route.firstChild) || title;
    }
    return title;
  }

  setTheme(isdark: boolean) {
    if (isdark) {
      this.renderer.addClass(document.body, 'dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      this.renderer.removeClass(document.body, 'dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }

  logout(): void {
    this.authService.logout().subscribe(
      (response) => {
        console.log(response);
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error(error);
        alert('Error al cerrar sesión.');
      }
    );
  }


}
