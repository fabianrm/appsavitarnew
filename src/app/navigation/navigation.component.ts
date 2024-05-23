import { Component, HostBinding, OnInit, Renderer2, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { filter, map, shareReplay } from 'rxjs/operators';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent implements OnInit {

  currentTitle: string = 'ISP CRM';
  @HostBinding('class') class: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private renderer: Renderer2) { }


  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentRoute = this.router.routerState.snapshot.root;
        this.currentTitle = this.getTitle(currentRoute);
      });
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
      //this.class = 'dark-theme'
    } else {
      this.renderer.removeClass(document.body, 'dark-theme');
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
