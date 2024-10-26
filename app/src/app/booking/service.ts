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
    'list': `api/v1/booking/list`,
    'uploadBooking': `api/v1/booking/upload`,
    'cancelBooking': `api/v1/booking/cancel`,
    'exportBooking':  `api/v1/booking/export`,
    'downloadTemplate': `api/v1/template/download`
  };

  constructor(private request: RequestService) { }
  getAPI(name: string) {
    let url = this.urlList[name];
    return `${configs.SFT}/${window.getRootPath().toLowerCase()}/${url}`;
  }

  uploadBooking(data: any,) {
    const url = this.getAPI('uploadBooking');
    return this.request.upload(url, data);
  }
  cancelBooking(data: any) {
    let url = this.getAPI('cancelBooking')
    data['WarehouseCode'] = window.getRootPath().toUpperCase();
    return this.request.post(url, data, {}, 1);
  }
  exportBooking(data: any = {}) {
    const url = this.getAPI('exportBooking');
    return this.request.download(url, data);
  }
  downloadTemplate(fileName: string) {
    const url = this.getAPI('downloadTemplate');
    return this.request.download(url, { FileName: fileName });
  }
}
