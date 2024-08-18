import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DataService } from 'src/app/shared/data/data.service';
import { MenuItem, SideBarData } from 'src/app/shared/models/models';
import { routes } from 'src/app/shared/routes/routes';
import { SideBarService } from 'src/app/shared/side-bar/side-bar.service';
import { AuthService } from 'src/app/shared/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  base = '';
  page = '';
  currentUrl = '';
  public classAdd = false;

  public multilevel: Array<boolean> = [false, false, false];

  public routes = routes;
  public sidebarData: Array<SideBarData> = [];

  constructor(
    private data: DataService,
    private router: Router,
    private sideBar: SideBarService,
    private authService: AuthService // Asegúrate de usar AuthService para obtener el rol
  ) {
    this.sidebarData = this.data.sideBar;
    router.events.subscribe((event: object) => {
      if (event instanceof NavigationEnd) {
        this.filterSidebarDataBasedOnRole(); // Filtra el menú cada vez que cambia la ruta
        this.getRoutes(event);
      }
    });
  }

  ngOnInit(): void {
    this.filterSidebarDataBasedOnRole(); // Filtra el menú basado en el rol del usuario
  }

  private filterSidebarDataBasedOnRole(): void {
    const userRole = this.authService.getUserRole(); // Obtén el rol del usuario desde AuthService

    if (userRole === '1') {
      this.sidebarData = this.sidebarData.map((sideBarItem) => {
        const filteredMenu = sideBarItem.menu.filter((menuItem) => {
          // Filtra fuera Dashboard y Doctores para el rol '1'
          return menuItem.menuValue !== 'Dashboard' && menuItem.menuValue !== 'Doctores';
        });

        return {
          ...sideBarItem,
          menu: filteredMenu
        };
      });
    }
  }

  public expandSubMenus(menu: MenuItem): void {
    sessionStorage.setItem('menuValue', menu.menuValue);
    this.sidebarData.map((mainMenus: SideBarData) => {
      mainMenus.menu.map((resMenu: MenuItem) => {
        if (resMenu.menuValue === menu.menuValue) {
          menu.showSubRoute = !menu.showSubRoute;
        } else {
          resMenu.showSubRoute = false;
        }
      });
    });
  }

  private getRoutes(route: { url: string }): void {
    const bodyTag = document.body;

    bodyTag.classList.remove('slide-nav');
    bodyTag.classList.remove('opened');
    this.currentUrl = route.url;

    const splitVal = route.url.split('/');

    this.base = splitVal[1];
    this.page = splitVal[2];
  }

  public miniSideBarMouseHover(position: string): void {
    if (position === 'over') {
      this.sideBar.expandSideBar.next('true');
    } else {
      this.sideBar.expandSideBar.next('false');
    }
  }
}