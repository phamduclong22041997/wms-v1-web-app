
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import {
  ChangeDetectorRef,
  Component,
  OnDestroy
} from '@angular/core';
import { MenuItems } from '../../shared/menu-items/menu-items';

import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

/** @title Responsive sidenav */
@Component({
  selector: 'app-full-layout',
  templateUrl: 'default.component.html',
  styleUrls: ['./default.component.css']
})
export class DefaultComponent implements OnDestroy {
  baseUrl: string;
  mobileQuery: MediaQueryList;
  dir = 'ltr';
  green: boolean;
  eyellow: boolean;
  blue: boolean;
  dark: boolean;
  minisidebar: boolean;
  boxed: boolean;
  danger: boolean;
  showHide: boolean;
  url: string;
  sidebarOpened:boolean;
  toggleActive:boolean;
  sideBarState:Object = {
    "margin-left": "48px"
  }

	public showSearch = false;

  public config: PerfectScrollbarConfigInterface = {};
  private _mobileQueryListener: () => void;
    
  constructor(
	public router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems: MenuItems
  ) {
    this.dark = true;
    this.eyellow = true;
    this.toggleActive = true;
    this.sidebarOpened = true;
    // this.blue = true;
    // this.green = true;
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.baseUrl = window.location.protocol + "//" + window.location.host + "/" + window.getRootPath() + "/";    
  }

  ngAfterViewInit() {
    // this.toggleSidenav();
    // this.toggleActive = false;
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  toggleSidenav() {
    this.toggleActive = !this.toggleActive;
  }

  onToggleChange(toggle:boolean) {
    this.toggleActive = toggle;
    this.changeDetectorRef.detectChanges();
  }
}
