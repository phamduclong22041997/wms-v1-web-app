/**
 * Copyright (c) 2019 OVTeam
 * Modified by: Duy Huynh
 * Modified date: 2020/08
 */

import { Injectable } from '@angular/core';
import { of as observableOf } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { RequestService } from '../../shared/request.service';
import { configs } from '../../shared/config';
@Injectable({
  providedIn: 'root'
})
export class Service {
  urlList: object = {
    'resetPassword': `${configs.OVAUTHEN}/api/v1/user/resetpassword`,
  };
  constructor(private Request: RequestService) { }
  resetPassword(data: object) {
    const url = this.getAPI('resetPassword');
    return this.Request.post(url, data);
  }
  getAPI(name: string) {
    let url = this.urlList[name];
    if (url) {
      const wh = window.localStorage.getItem('_warehouse') || 'none';
      url = url.replace('%warehouse%', wh);
    }
    return url;
  }
}
