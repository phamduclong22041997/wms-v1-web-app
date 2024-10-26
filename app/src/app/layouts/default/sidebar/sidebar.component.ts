/**
 * Copyright (c) 2019 OVTeam
 * Modified by: Duy Huynh
 * Modified date: 2019/11
 */

 import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { configs } from './../../../shared/config';
import { RequestService } from './../../../shared/request.service';
import { ExpireComponent } from './../../../authentication/expire/expire.component';
import { SocketService } from './../../../shared/socket.service';
import { MenuItems } from '../../../shared/menu-items/menu-items';

const ROOT_MENU_BY_ICON = ['settings', 'miscellaneous_services'];
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  providers: [SocketService]
})
export class AppSidebarComponent implements OnDestroy {
  @Input() toggleActive: Boolean;
  @Output('onToggleChange') onToggleChange = new EventEmitter<any>();
  public config: PerfectScrollbarConfigInterface = {};
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;
  status: boolean = true;

  itemSelect: number[] = []

  selectItems(i: any, j: any) {
    let index = this.itemSelect.indexOf(j);
    if (index !== -1) {
      this.itemSelect.splice(index, 1);
    } else {
      this.itemSelect[i] = j;
    }
  }

  subclickEvent() {
    this.status = true;
  }

  scrollToTop() {
    document.querySelector('.page-wrapper').scroll({
      top: 0,
      left: 0
    });
  }

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private Request: RequestService,
    public dialog: MatDialog,
    private socketService: SocketService,
    public menuItems: MenuItems,
    private router: Router
  ) {
    this.router.events.subscribe((val: any) => {
      if (val.url && ['/app/dashboard', '/'].indexOf(val.url) == -1) {
        this.onToggleChange.emit(false);
      }
    });
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.checkSession();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  clickHandle(item: any) {
    window.localStorage.setItem('SCID', item.scid);
  }
  classEllipsis(txt: string) {
    if (txt.length >= 20) {
      return 'txt-ellipsis';
    }
  }
  showExpire() {
    let config = new MatDialogConfig();
    config.disableClose = true;

    const dialogRef = this.dialog.open(ExpireComponent, config);
    setTimeout(() => {
      dialogRef.close();
      let redirectUrl = window.location.href;
      window.location.href = configs.OVAUTHEN + `?redirect=${redirectUrl}`;
    }, 2000);
  }
  onHover() {
    if (this.toggleActive === false) {
      this.toggleActive = true;
    }
    this.onToggleChange.emit(this.toggleActive);
    this.changeDetectorRef.detectChanges();
  }
  configRoute(data: any, state: object) {
    for (const i in data) {
      const tmp = data[i];
      if (!state['state']) {
        const _stateName = tmp['state'];
        const _titleName = tmp['name'] || '';
        const _icon = tmp['icon'] || '';
        const _level = tmp['level'] || '';
        if (_stateName === 'app' && ROOT_MENU_BY_ICON.indexOf(_icon) !== -1) {
          state[`${_stateName}_${_icon}`] = {
            name: _titleName,
            link: `/${_stateName}`,
            level: _level
          };
        } else {
          state[_stateName] = {
            name: _titleName,
            link: `/${_stateName}`,
            level: _level
          };
        }
      }
      if(tmp['state'] === 'app' && tmp['level'] === 1) {
        tmp['state'] = window.getRootPath();
      }else {
        if(tmp['state'] !== 'admin' && tmp['level'] === 1) {
          tmp['state'] = window.getRootPath();
        }
      }
      if (tmp.children && tmp.children.length) {
        this.configRoute(tmp.children, state);
      }
      if (tmp.subchildren && tmp.subchildren.length) {
        this.configRoute(tmp.subchildren, state);
      }
    }
    return state;
  }
  checkSession() {
    const ref: string = window.name || '';
    this.Request.post('/api/auth/sso', { ref: ref })
      .subscribe((resp) => {
        if (resp['Success'] === false) {
          this.showExpire();
        } else {
          if (resp['Data'] && resp['Data']['valid'] === false) {
            this.menuItems.getMenuitem = resp['Data']['valid'] || [];

            this.showExpire();
          } else {
            this.socketService.initSocket();
            this.menuItems.getMenuitem = resp['Data']['menu'] || [];
            window.localStorage.setItem('_token', resp['Data']['token'] || '');
            // let wh = window.localStorage.getItem("_warehouse");
            // if(!wh) {
              window.localStorage.setItem(
                '_warehouse',
                resp['Data']['info'] && resp['Data']['info']['Warehouse'] ? resp['Data']['info']['Warehouse'] : ''
              );
            // }
            let siteInfo = resp['Data']['info']['SiteInfo'] || {};
            window.localStorage.setItem('APISID', resp['Data']['apisid']);
            window.localStorage.setItem('sid', resp['Data']['sid']);
            window.localStorage.setItem('_info', JSON.stringify({
              DisplayName: resp['Data']['info'].DisplayName,
              Id: resp['Data']['info'].LoginName,
              PositionType: resp['Data']['info'].PositionType,
              SiteInfo: {
                Code: siteInfo.Code,
                Name: siteInfo.Name,
                Contact: siteInfo.Contact
              }
            }));

            const objParser = {};
            this.menuItems.menuObject = this.configRoute(this.menuItems.getMenuitem, objParser);
            document.dispatchEvent(new CustomEvent('on_app_ready', { detail: { state: true } }));
          }
        }
      });
  }
}
