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
    'list': `api/v1/transportdevices`,
    'details': `api/v1/transportdevice/details`,
    'palletList': `api/v1/transportdevices`,
    'pointDockPalelt': `api/v1/point/dockPallet`,
    'binDockPalelt': `api/v1/bin/dockPallet`,
    'export-device': `api/v1/transportdevice/export`,
  };
  constructor(private Request: RequestService) { }
  dockPalletUnderPoint(data: any) {
    let url = this.getAPI('pointDockPalelt');
    return this.Request.post(url, data, {}, 1);
  }
  dockPalletUnderBin(data: any) {
    let url = this.getAPI('binDockPalelt');
    return this.Request.post(url, data, {}, 1);
  }
  getDetails(code: string) {
    let url = this.getAPI('details');
    return this.Request.get(url, { Code: code });
  }
  getAPI(name: string) {
    let url = this.urlList[name];
    return `${configs.SFT}/${window.getRootPath().toLowerCase()}/${url}`;
  }
  exportTransportDevice(data: any = {}) {
    const url = this.getAPI('export-device');
    return this.Request.download(url, data);
  }
}
