import { Component, HostBinding, OnInit, Renderer2, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { filter, map, shareReplay } from 'rxjs/operators';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { EnterpriseService } from '../isp/enterprise/enterprise.service';


interface MenuNode {
  name: string;
  icon: string;
  route: string;
  children?: MenuNode[];
}

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent implements OnInit {

  currentTitle: string = 'ISP CRM';
  @HostBinding('class') class: string = '';
  isDark: boolean = false;


  isExpanded = true;

  treeData: MenuNode[] = [];
  activeRoute: string | null = null;

  id: number = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private enterpriseService : EnterpriseService,
    private renderer: Renderer2) {
  }


  toggleMenu() {
    this.isExpanded = !this.isExpanded;
  }


  ngOnInit() {
    this.getUserPermissions()
    this.getEnterprise();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentRoute = this.router.routerState.snapshot.root;
        this.currentTitle = this.getTitle(currentRoute);
      });

    this.isDark = localStorage.getItem('theme') == 'dark';
    this.setTheme(this.isDark);


  }


  setActiveRoute(route: string) {
    this.activeRoute = route;
  }

  isActive(route: string): boolean {
    return this.activeRoute === route;
  }


  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );


  getUserPermissions() {
    this.authService.getUserPermissions().subscribe(response => {
      this.treeData = response.data;
    });
  }


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
        localStorage.removeItem('coords');
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error(error);
        alert('Error al cerrar sesión.');
      }
    );
  }


  getEnterprise(): void {
    this.enterpriseService.getEnterprise().subscribe((response) => {
      this.id = response.data.id;
    //  console.log(this.id);
    })
  }


  //TODO:Traer todas las ciudades con limit 1
  detailEnterprise(id: number) {
    this.router.navigate(['/dashboard/enterprise/enterpriseDetails/' + id]); // Navega al componente "enterprise edit"
  }

  goCities() {
    this.router.navigate(['/dashboard/city/cities']); // Navega al componente "customer edit"
  }

}
