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
    'createMultiDevice': `api/v1/warehouse/createDevice`,
    'getSOForHandoverPrint': `api/v1/print/getSOForHandoverPrint`,
    'exportSOForHandoverPrint': `api/v1/print/exportSOForHandoverPrint`,
    'details': `api/v1/so/details`,
    'updateTotalPackage': `api/v1/print/updateTotalPackage`,
    'exportReportSODelivery': 'api/v1/handover/exportReportSODelivery',
    'getExportDetail': 'api/v1/handover/exportDetail',
    'getTransportDevice': 'api/v1/transportdevice/getList',
  };
  constructor(private Request: RequestService) { }

  createMultiDevice(filters: any) {
    let url = this.getAPI('createMultiDevice')
    return this.Request.post(url, filters, 1, {});
  }
  
  getAPI(name: string) {
    let url = this.urlList[name];
    return `${configs.SFT}/${window.getRootPath().toLowerCase()}/${url}`;
  }

  getSOForHandoverPrint(data: any) {
    let url = this.getAPI('getSOForHandoverPrint');
    console.log(data);
    
    return this.Request.get(url, data);
  }
  updateTotalPackage(data: any) {
    let url = this.getAPI('updateTotalPackage');
    console.log("updatedata",data);
    
    return this.Request.post(url, data);
  }
  getSODetails(SOCode: string) {
    let url = this.getAPI('details');
    return this.Request.get(url, { SOCode: SOCode });
  }
  exportSOForHandoverPrint(data: any = {}) {
    const url = this.getAPI('exportSOForHandoverPrint');
    return this.Request.download(url, data);
  }
  getDataSODelivery(Code: String[]) {
    let url = this.getAPI('getExportDetail');
    return this.Request.get(url, { SOCode: Code });
  }
  getTransportDevice(data: any = {}) {
    let url = this.getAPI('getTransportDevice');
    return this.Request.get(url, data);
  }
  exportSODelivery(Code: String[]) {
    let url = this.getAPI('exportReportSODelivery');
    return this.Request.download(url, { SOCode: Code.join(',') });
  }
}
