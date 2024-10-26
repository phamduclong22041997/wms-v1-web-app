/*
 * @copyright
 * Copyright (c) 2022 OVTeam
 *
 * All Rights Reserved
 *
 * Licensed under the MIT License;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://choosealicense.com/licenses/mit/
 *
 */

import { Injectable } from '@angular/core';
import { RequestService } from '../shared/request.service';
import { configs } from '../shared/config';

@Injectable({
  providedIn: 'root'
})

export class Service {
  urlList: object = {
    'list': `api/v1/warehouse/getZoneList`,
    'details': `api/v1/warehouse/getZoneDetail`,
    'exportdetails': `api/v1/warehouse/exportZoneDetail`,
    'changeZoneOrder': `api/v1/warehouse/changeZoneOrder`,
    'settingZoneOrderDefaut': `api/v1/warehouse/settingZoneOrderDefaut`
  };
  constructor(private Request: RequestService) { }
  getDetails(code: string) {
    let url = this.getAPI('details');
    return this.Request.get(url, { Code: code });
  }
  exportDetail(data: any = {}) {
    const url = this.getAPI('exportdetails');
    return this.Request.download(url, data);
  }
  getAPI(name: string) {
    let url = this.urlList[name];
    return `${configs.SFT}/${window.getRootPath().toLowerCase()}/${url}`;
  }
  changeZoneOrder(data: any) {
    let url = this.getAPI('changeZoneOrder');
    return this.Request.post(url, data, {}, 1);
  }
  settingZoneOrderDefaut(data: any) {
    let url = this.getAPI('settingZoneOrderDefaut');
    return this.Request.post(url, data, {}, 1);
  }
}
