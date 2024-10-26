

/**
 * Copyright (c) 2019 OVTeam
 * Modified by: Duy Huynh
 * Modified date: 10/03/2021
 */


import { Component, OnInit } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { RequestService } from './../../../shared/request.service';
import { configs } from './../../../shared/config';
import { of as observableOf } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SocketService } from './../../../shared/socket.service';
import { RegionModalComponent } from '../region-modal/component';
import { MatDialog } from '@angular/material';
import { RegionService } from '../../../shared/region-storage.service';
import { ServiceRegion } from './../region-modal/service';

import { PrinterComponent } from './../../../components/printer/printer.component';
import { ResetPasswordComponent } from './../../../components/reset-password/component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [],
  providers: [SocketService]
})
export class AppHeaderComponent implements OnInit {
  public config: PerfectScrollbarConfigInterface = {};

  displayName: string = "";
  warehouseInfo: string = "";
  Id: string = "";
  numberNotification: number = 0;
  soPackedStatus: object[] = [];
  // This is for Notifications
  notifications: Object[] = [];
  // This is for Mymessages
  mymessages: Object[] = [];
  region = {};
  openModal = false;
  constructor(
    private service: RequestService,
    private router: Router,
    private socket: SocketService,
    public dialog: MatDialog,
    public regionService: RegionService,
    private serviceRegion: ServiceRegion,
  ) {
    localStorage.removeItem('_info');

    // this.loadRegion();
    this.loadUserInfo();
  }

  ngOnInit() {
    // this.getAPINotification();
    // this.initSocket();
    // this.regionService.changes.subscribe(data => {
    //   if (data.key === 'region') {
    //     location.reload();
    //   }
    // })
  }

  ngOnDestroy() {
    this.socket.close();
  }

  openChangePassowrd() {
    this.dialog.open(ResetPasswordComponent, {
      width: '400px',
      panelClass: 'custom-change-password'
    });
  }

  onSelectPrinter() {
    const dialogRef = this.dialog.open(PrinterComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.search(null);
      }
    });
  }

  loadUserInfo() {
    let loadingStr = '.';
    let getNameInterval = setInterval(() => {
      if (window.localStorage.getItem('_info')) {
        let info = window.localStorage.getItem('_info');
        if (info) {
          info = JSON.parse(info);
          this.displayName = info['Id'];
          this.Id = info['Id'];

          if(info['SiteInfo']){
            this.warehouseInfo = ` - ${info['SiteInfo']['Name']}(${info['SiteInfo']['Code']})`
          }
        }
        clearInterval(getNameInterval);
      } else {
        this.displayName = `Loading${loadingStr}`;
      }
      loadingStr = loadingStr.length === 3 ? '' : loadingStr += '.';
      if (this.Id) {
        this.detectRegion();
      }
    }, 1000);
  }

  loadRegion() {
    let loadingStr = '.';
    let getNameInterval = setInterval(() => {
      if (window.localStorage.getItem('_info')) {
        let info = window.localStorage.getItem('_info');
        if (info) {
          info = JSON.parse(info);
          this.displayName = info['Id'];
          this.Id = info['Id'];
        }
        clearInterval(getNameInterval);
      } else {
        this.displayName = `Loading${loadingStr}`;
      }
      loadingStr = loadingStr.length === 3 ? '' : loadingStr += '.';
      if (this.Id) {
        this.detectRegion();
      }
    }, 1000);
  }

  detectRegion() {
    // let warehouse: any = window.localStorage.getItem("_warehouse");
    // if (warehouse) {
    //   this.serviceRegion.getArea({})
    //     .subscribe((resp: any) => {
    //       if (resp.Status && resp.Data && resp.Data.length) {
    //         this.regionService.store("region", resp.Data[0], false);
    //         this.openRegion();
    //       }
    //     })
    // } else {
    // this.openRegion();
    // }
  }

  openRegion(flag = false) {
    const region = this.regionService.get('region');
    if (!region || flag) {
      window.localStorage.removeItem("_warehouse");
      // let warehouse: any = window.localStorage.getItem("_warehouse");
      // if (warehouse) {
      //   return;
      // }
      const dialogRef = this.dialog.open(RegionModalComponent, {
        width: '500px',
        data: {},
        disableClose: true,
        hasBackdrop: true
      });
      dialogRef.afterClosed().subscribe(result => {
        // console.log(result);
      })
    } else {
      this.region = region;
    }
  }

  initSocket() {
    this.socket.connect('ovenfield')
      .on('connect', function () {
        console.log('Connected');
        this.emit('join_room', { room: 'notification' });
      })
      .on('on_notification', (data: any) => {
        if (data) {
          this.soPackedStatus = data.data.Rows;
          this.numberNotification = data.data.Total === 0 ? '' : data.data.Total;
          this.playAudio();
        }
      });
  }

  playAudio() {
    const audio = new Audio();
    audio.src = "assets/audio/notification-sound.mp3";
    audio.volume = 1.0;
    audio.load();
    audio.play();
  }

  getAPINotification() {
    this.callAPINotification({
      filter: JSON.stringify({
        IsProcess: '0',
      }),
      limit: 5,
      page: 1
    })
      .subscribe((resp: any) => {
        if (resp.Data) {
          this.soPackedStatus = resp.Data.Rows;
          this.numberNotification = resp.Data.Total === 0 ? '' : resp.Data.Total;
        } else {
          this.numberNotification = 0;
        }
      });
  }

  callAPINotification(data: any) {
    let url = 'https://ovr-sanbox.eton.vn/wft/v1/%warehouse%/sopackedstatus';
    let wh = window.localStorage.getItem('_warehouse') || 'none'
    url = url.replace('%warehouse%', wh);
    return this.service.get(url, data)
      .pipe(
        map(data => {
          return data;
        }),
        catchError(() => {
          return observableOf({ Success: false, Data: '' });
        })
      );
  }

  showMore(data: any) {
    const _queryParams = {};
    if (data !== undefined) {
      _queryParams['code'] = data.trim();
    }
    this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
      this.router.navigate([`/app/so/notification`], { queryParams: _queryParams });
    });
  }

  onSignout() {
    if (this.Id) {
      this.service.post(`${configs.OVAUTHEN}/api/auth/logout`, {
        UserName: this.Id,
        Token: window.localStorage.getItem('APISID'),
        SID: window.localStorage.getItem('sid')
      })
        .subscribe(() => {
          window.localStorage.removeItem("APISID");
          window.localStorage.removeItem("SCID");
          window.localStorage.removeItem("sid");
          window.localStorage.removeItem("_token");
          window.localStorage.removeItem("_info");
          window.localStorage.removeItem("_warehouse");
          window.location.href = configs.OVAUTHEN;
        });
    }
  }
}
