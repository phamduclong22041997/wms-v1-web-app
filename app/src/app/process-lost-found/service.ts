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
    'list': `api/v1/lost/list`,
    'create': `api/v1/lost/create`,
    'cancel': `api/v1/lost/cancel`,
    'getLostDetail': `api/v1/lost/getDetail`,
    'getFoundDetail': `api/v1/found/getDetail`,
    'getSKULost': `api/v1/lost/getSKULost`,
    'scanBarcode': `api/v1/found/scan`,
    'listFound': `api/v1/found/list`,
    'createFound': `api/v1/found/create`,
    'GetLostFoundMapping': `api/v1/lost-found/autoMapping`,
    'importFound': `api/v1/found/import`,
    'saveDataFound': `api/v1/found/saveDataFound`,
    'autoMapping': 'api/v1/lostfound/autoMapping',
    'loadAutoMapping': 'api/v1/lostfound/loadMappingSession',
    'loadCurrentMapping': 'api/v1/lostfound/loadCurrentMapping',
    'createSession': 'api/v1/lostfound/createSession',
    'getSessionMachingList': 'api/v1/lostfound/getSessionMachingList',
    'getSessionMaching': 'api/v1/lostfound/getSessionMaching',
    'getTransferList': 'api/v1/lostfound/getTransferList',
    'getTransfer': 'api/v1/lostfound/getTransfer',
    'cancelFound': `api/v1/found/cancel`,
    'downloadTemplate': `api/v1/template/download`,
    'importLostFound': `api/v1/lostfound/import`,
    'saveDataIssue': `api/v1/lostfound/saveDataIssue`,
    'getLostList': `api/v1/transferlost/getlostlist`,
    'getLostDetailTransfer': `api/v1/transferlost/getLostDetail`,
    'createTransferLost': `api/v1/transferlost/createTransferLost`,
    'createMutilTransferLost': `api/v1/transferlost/createMutilTransferLost`,
    'getTransfers': `api/v1/transferlost/getTransfers`,
    'getTransferDetails': `api/v1/transferlost/getTransferDetails`,
    'getLostBinPhycical': `api/v1/transferlost/getLostBinPhycical`,
  };
  constructor(private Request: RequestService) { }
  getAPI(name: string) {
    let url = this.urlList[name];
    return `${configs.SFT}/${window.getRootPath().toLowerCase()}/${url}`;
  }
  saveDataIssue(data: any) {
    let url = this.getAPI('saveDataIssue');
    data['WarehouseCode'] = window.getRootPath().toUpperCase();
    return this.Request.post(url, data, {}, 1);
  }
  saveDataFound(data: any) {
    let url = this.getAPI('saveDataFound');
    data['WarehouseCode'] = window.getRootPath().toUpperCase();
    return this.Request.post(url, data, {}, 1);
  }
  getTransfer(data:any) {
    let url = this.getAPI('getTransfer');
    data['WarehouseCode'] = window.getRootPath().toUpperCase();
    return this.Request.get(url, data);
  }
  getSessionMaching(data:any) {
    let url = this.getAPI('getSessionMaching');
    data['WarehouseCode'] = window.getRootPath().toUpperCase();
    return this.Request.get(url, data);
  }
  createSession(data:any) {
    let url = this.getAPI('createSession');
    data['WarehouseCode'] = window.getRootPath().toUpperCase();
    return this.Request.post(url, data, {}, 1);
  }
  loadAutoMapping(data:any) {
    let url = this.getAPI('loadAutoMapping');
    data['WarehouseCode'] = window.getRootPath().toUpperCase();
    return this.Request.post(url, data, {}, 1);
  }
  autoMapping(data:any) {
    let url = this.getAPI('autoMapping');
    data['WarehouseCode'] = window.getRootPath().toUpperCase();
    return this.Request.post(url, data, {}, 1);
  }
  loadCurrentMapping(data:any) {
    let url = this.getAPI('loadCurrentMapping');
    data['WarehouseCode'] = window.getRootPath().toUpperCase();
    return this.Request.post(url, data, {}, 1);
  }
  createFound(data: any) {
    let url = this.getAPI('createFound');
    data['WarehouseCode'] = window.getRootPath().toUpperCase();
    return this.Request.post(url, data, {}, 1);
  }
  scanBarcode(data: any) {
    let url = this.getAPI('scanBarcode');
    data['WarehouseCode'] = window.getRootPath().toUpperCase();
    return this.Request.post(url, data, {}, 1);
  }
  createLost(data: any) {
    let url = this.getAPI('create');
    data['WarehouseCode'] = window.getRootPath().toUpperCase();
    return this.Request.post(url, data, {}, 1);
  }
  cancelLost(data: any) {
    let url = this.getAPI('cancel');
    data['WarehouseCode'] = window.getRootPath().toUpperCase();
    return this.Request.post(url, data, {}, 1);
  }
  cancelFound(data: any) {
    let url = this.getAPI('cancelFound');
    data['WarehouseCode'] = window.getRootPath().toUpperCase();
    return this.Request.post(url, data, {}, 1);
  }
  getSKULost(data: any) {
    let url = this.getAPI('getSKULost');
    return this.Request.get(url, data);
  }
  getFoundDetail(code: string) {
    let url = this.getAPI('getFoundDetail');
    return this.Request.get(url, { Code: code });
  }
  getLostDetail(code: string) {
    let url = this.getAPI('getLostDetail');
    return this.Request.get(url, { Code: code });
  }
  getDetail(code: string) {
    let url = this.getAPI('getDetail');
    return this.Request.get(url, { Code: code });
  }
  searchLostFoundMapping(data: any) {
    let url = this.getAPI('GetLostFoundMapping');
    data['WarehouseCode'] = window.getRootPath().toUpperCase();
    return this.Request.post(url, data, {}, 1);
  }
  importFound(data: any, WarehouseCode: string)
  {
    let url = this.getAPI('importFound') + (WarehouseCode ? '?WarehouseCode=' + WarehouseCode : '');
    return this.Request.upload(url, data);
  }
  importLostFound(data: any, WarehouseCode: string, ClientCode: string, WarehouseSiteId: string)
  {
    let params = `?WarehouseCode=${WarehouseCode || ""}&ClientCode=${ClientCode || ""}&WarehouseSiteId=${WarehouseSiteId || ""}`
    let url = this.getAPI('importLostFound') + params;
    return this.Request.upload(url, data);
  }
  downloadTemplate(fileName: string) {
    const url = this.getAPI('downloadTemplate');
    return this.Request.download(url, { FileName: fileName });
  }
  getLostListTransfer(data: any) {
    let url = this.getAPI('getLostList');
    return this.Request.get(url, data);
  }
  getLostDetailTransfer(data: any) {
    let url = this.getAPI('getLostDetailTransfer');
    return this.Request.get(url, data);
  }
  createTransferLost(data: any) {
    let url = this.getAPI('createTransferLost');
    data['WarehouseCode'] = window.getRootPath().toUpperCase();
    return this.Request.post(url, data, {}, 1);
  }
  createMutilTransferLost(data: any) {
    let url = this.getAPI('createMutilTransferLost');
    data['WarehouseCode'] = window.getRootPath().toUpperCase();
    return this.Request.post(url, data, {}, 1);
  }
  getTransfers(data: any) {
    let url = this.getAPI('getTransfers');
    return this.Request.get(url, data);
  }
  getTransferDetails(data: any) {
    let url = this.getAPI('getTransferDetails');
    return this.Request.get(url, data);
  }
  getLostBinPhycical(data: any) {
    let url = this.getAPI('getLostBinPhycical');
    return this.Request.get(url, data);
  }
}
