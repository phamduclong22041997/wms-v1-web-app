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
  _url = `${configs.SFT}/${window.getRootPath().toLowerCase()}/api/v1/rocket-planning/`;
  urlList: object = {
    // config so
    'getSOList': `api/v1/so/list`,
    'details': `api/v1/so/details`,
    'cancel': `api/v1/so/cancelSO`,
    
    //print
    'exportSO': `api/v1/so/exportlist`,
  };

  constructor(private request: RequestService) { }

  // so
  getSOList() {
    return this.getAPI('getSOList');
  }
  getListSKU(data: any) {
    const url = this.getAPI('getListSKUPO');
    return this.request.get(url, data);
  }
  checkExportPO(data: any = {}) {
    const url = this.getAPI('exportPO');
    return this.request.get(url, data);
  }
  checkExportSTO(data: any) {
    const url = this.getAPI('exportSTO');
    return this.request.get(url, data);
  }
  exportSTO(data: any = {}) {
    const url = this.getAPI('exportSTO');
    return this.request.download(url, data);
  }
  getListSKUSTO(data: any) {
    const url = this.getAPI('getListSKUSTO');
    return this.request.get(url, data);
  }
  getWarehouse(data: any) {
    const url = this.getAPI('getWarehouse');
    return this.request.get(url, data);
  }

  list(data: any) {
    const url = this.getAPI('list');
    return this.request.get(url, data);
  }

  getDataCombo(data: any) {
    const url = this.getAPI('getDataCombo');
    return this.request.get(url, data);
  }

  cancelSO(data: any) {
    let url = this.getAPI('cancel')
    return this.request.post(url, data, {}, 1);
  }
  getAPI(name: string) {
    let url = this.urlList[name];
    return `${configs.SFT}/${window.getRootPath().toLowerCase()}/${url}`;
  }
  exportSO(data: any = {}) {
    const url = this.getAPI('exportSO');
    return this.request.download(url, data);
  }
}
