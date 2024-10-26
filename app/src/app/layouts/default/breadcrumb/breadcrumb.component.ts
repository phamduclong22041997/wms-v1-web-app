/**
 * Copyright (c) 2019 OVTeam
 * Modified by: Duy Huynh
 * Modified date: 2019/11
 */

import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { MenuItems } from '../../../shared/menu-items/menu-items';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: []
})
export class AppBreadcrumbComponent implements OnInit {
  @Input() layout: any;
  pageInfo: any;
  isShow: boolean = false;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    public menuItems: MenuItems
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .pipe(map(() => this.activatedRoute))
      .pipe(
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          this.isShow = !(this.router.url === '/app/dashboard');
          return route;
        })
      )
      // .pipe(filter(route => route.outlet === 'primary'))
      // .pipe(mergeMap(route => route.data))
      .subscribe(event => {
        this.pageInfo = event;
        const _loadingBreadcrumb = setInterval(() => {
          this.pageInfo.urls = this.parseRoute(event);
          if (this.pageInfo.urls && this.pageInfo.urls.length) {
            clearInterval(_loadingBreadcrumb);
          }
        }, 600);
      });
  }
  ngOnInit() { }
  renderLink(routeMenu: any) {
    if (routeMenu && routeMenu.level !== '') {
      return;
    }
    return routeMenu && routeMenu.url ? routeMenu.url : null;
  }
  parseRoute(route: any) {
    const menuObj = this.menuItems.menuObject;
    let info = [];
    if (typeof menuObj === 'object' && Object.keys(menuObj).length === 0) {
      return [];
    }
    if (route.snapshot) {
      let code = route.snapshot['params'] && route.snapshot['params']['code'] ? (route.snapshot['params']['code']).trim() : '';
      if (route.snapshot['params']) {
        if (route.snapshot['params']['code']) code = route.snapshot['params']['code'];
        else if (route.snapshot['params']['SOCode']) code = route.snapshot['params']['SOCode'];
        else if (route.snapshot['params']['POCode']) code = route.snapshot['params']['POCode'];
      }
      let tmp = route.snapshot;
      while (true) {
        if (!tmp.parent) {
          break;
        }
        if (tmp.routeConfig.path) {

          if (/\/[:]/i.test(tmp.routeConfig.path)) {
            info.push({
              url: '',
              title: code
            });
            if (tmp.data && tmp.data.parentTitle) {
              info.push({
                url: '',
                title: tmp.data.parentTitle
              })
            }

          } else {
            const _data = tmp.routeConfig && tmp.routeConfig.data ? tmp.routeConfig.data : null;
            const _path = tmp.routeConfig.path.split('/');
            for (const i in _path.reverse()) {
              let _pathName = _path[i];
              if (_pathName) {
                if (_data && _pathName === 'app') {
                  const icon = _data.icon;
                  _pathName = icon ? `${_pathName}_${icon}` : _pathName;
                }
                info.push({
                  url: _pathName,
                  title: menuObj[_pathName] ? menuObj[_pathName].name : '',
                  level: menuObj[_pathName] ? menuObj[_pathName].level : ''
                });
              }
            }
          }
        }
        tmp = tmp.parent;
      }
    }
    info = info.reverse();
    for (let i = 0; i < info.length; i++) {
      info[i].url = `${info[i - 1] ? info[i - 1].url : ''}` + `/${info[i].url}`;
    }
    return info;
  }
}
