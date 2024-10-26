/**
 * Copyright (c) 2019 OVTeam
 * Modified by: Huy Nghiem
 * Modified date: 2021/10/25
 */

import { Injectable } from '@angular/core';
import { RequestService } from '../shared/request.service';
import { configs } from '../shared/config';
@Injectable({
  providedIn: 'root',
})
export class Service {
  urlList: object = {
    getWarehouseBins:  `${configs.SFT}/api/v1/auto-pack/sku/warehouse-bins`
  };
  constructor(private Request: RequestService) {}
  getWarehouseBins(data: any) {
    const url = this.getAPI('getWarehouseBins');
    return this.Request.get(url, data);
  }
  getAPI(name: string) {
    const url = this.urlList[name];
    return url;
  }
}
