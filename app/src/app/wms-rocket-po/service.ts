/**
 * Copyright (c) 2019 OVTeam
 * Modified by: Duy Huynh
 * Modified date: 2020/08
 */

import { Injectable } from '@angular/core';
import { RequestService } from '../shared/request.service';
import { configs } from '../shared/config';

@Injectable({
  providedIn: 'root'
})

export class Service {
  urlList: object = {
    'cancelPO': `api/v1/po/cancelPO`,
    'list': `api/v1/po/list`,
    'exportPO': `api/v1/po/exportlist`,
  };
  constructor(private Request: RequestService) { }
  scanPO(code: string) {
    let url = this.getAPI('scanPO')
    return this.Request.post(url, { Code: code, WarehouseCode: window.getRootPath().toUpperCase() }, {}, 1);
  }
  cancelPO(data: any) {
    let url = this.getAPI('cancelPO')
    data['WarehouseCode'] = window.getRootPath().toUpperCase();
    return this.Request.post(url, data, {}, 1);
  }
  getPOList(data: any) {
    let url = this.getAPI('list');
    return this.Request.get(url, data);
  }
  getAPI(name: string) {
    let url = this.urlList[name];
    return `${configs.SFT}/${window.getRootPath().toLowerCase()}/${url}`;
  }
  exportPO(data: any = {}) {
    const url = this.getAPI('exportPO');
    return this.Request.download(url, data);
  }
}
