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

  };
  constructor(private Request: RequestService) { }
  getDetail(code: string) {
    let url = this.getAPI('details');
    return this.Request.get(url, { Code: code });
  }
  exportDetail(data: any = {}) {
    const url = this.getAPI('exportDetail');
    return this.Request.download(url, data);
  }
  getAPI(name: string) {
    let url = this.urlList[name];
    return `${configs.SFT}/${window.getRootPath().toLowerCase()}/${url}`;
  }
}
