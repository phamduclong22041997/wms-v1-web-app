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
import { Utils } from './../shared/utils';

@Injectable({
  providedIn: 'root'
})

export class Service {
  urlList: object = {
    'finishPO': `api/v3/sor/finishSOR`,
    'cancelPO': `api/v3/sor/cancelSOR`,
    'list': `api/v3/sor/list`,
    'details': `api/v3/sor/details`,
    'receiveList': `api/v3/sor/receive/list`,
    'receiveDetails': `api/v3/sor/receive/details`,
    'scanSOR': `api/v3/sor/scanSOR`,
    'scanPallet': `api/v3/sor/scanPallet`,
    'createPallet': `api/v3/sor/createPallet`,
    'receiveItem': `api/v3/sor/receiveItem`,
    'removeItem': `api/v3/sor/removeItem`,
    'finishPallet': `api/v3/sor/finishPallet`,
    'finishReceivePO': `api/v3/sor/finishReceiveSOR`,
    'uploadDocument': 'api/v3/document/upload',
    'removeDocument': 'api/v3/document/remove',
    'downloadDocument': 'api/v3/document/download',
    'getDocuments': 'api/v3/documents',
    'printFile' : 'cloud-print/v1/print',
    'exportPO': `api/v3/sor/exportlist`,
    'getBranchs' : `api/v3/warehouse/getBranchs`,
    'getPOPallet' : `api/v3/sor/receive/pallets`,
    'scanPOAdjust': `api/v3/sor-adjust/scanSORAdjust`,
    'getCurrentTask': `api/v3/sor-adjust/getCurrentTask`,
    'scanPalletAdjustPO': `api/v3/sor-adjust/scanPallet`,
    'adjustItem': `api/v3/sor-adjust/adjustItem`,
    'removeAdjustItem': `api/v3/sor-adjust/removeItem`,
    'finishPOAdjust': `api/v3/sor-adjust/finish`,
    'finishPalletAdjust': `api/v3/sor-adjust/finishPallet`,
    'getPODetailPromotion': `api/v3/sor/receive/detailPromotion`,
    'getClient': `api/v3/client/getClient`,
    'insertSKUToPO': `api/v3/sor/insertSKUToSOR`,
    'checkSKUSystem': `api/v3/sor/checkSKUSystem`,
    'removeSKUFromPO': `api/v3/sor/removeSKUFromSOR`,
    'uploadProductImage': 'api/v3/document/uploadProductImage',
    'cancelReceiveSessionCode': 'api/v3/sor/cancelReceiveSessionCode',
    'exportSORList': `api/v2//ops/sor/exportlist`,
  };
  constructor(private Request: RequestService) { }

  getPOPallet(poCode: string) {
    let url = this.getAPI('getPOPallet');
    return this.Request.get(url, { POCode: poCode });
  }

  getPOReceiveList(poCode: string) {
    let url = this.getAPI('receiveList');
    return this.Request.get(url, { POCode: poCode });
  }

  getPOReceiveDetails(poCode: string, sessionCode: string = "") {
    let url = this.getAPI('receiveDetails');
    return this.Request.get(url, { POCode: poCode, SessionCode: sessionCode });
  }
  getBranchs(whCode: any) {
    let url = this.getAPI('getBranchs');
    return this.Request.get(url, whCode );
  }
  scanSOR(code: string, scheduleDate: string = "", lineItem: string = "") {
    let url = this.getAPI('scanSOR');
    let postData = { Code: code, WarehouseCode:  Utils.getWarehouseCode()};
    if(scheduleDate) {
      postData['ScheduleDate'] = scheduleDate;
    }
    if(lineItem) {
      postData["LineReceivingNumber"] = lineItem;
    }
    return this.Request.post(url, postData, {}, 1);
  }
  createPallet(data: any) {
    let url = this.getAPI('createPallet');
    data['WarehouseCode'] = Utils.getWarehouseCode();
    return this.Request.post(url, data, {}, 1);
  }
  scanPallet(data: any) {
    let url = this.getAPI('scanPallet');
    return this.Request.post(url, data, {}, 1);
  }
  receiveItem(data: string) {
    let url = this.getAPI('receiveItem');
    return this.Request.post(url, data, {}, 1);
  }
  removeItem(data: string) {
    let url = this.getAPI('removeItem');
    return this.Request.post(url, data, {}, 1);
  }
  finishPallet(data: any) {
    let url = this.getAPI('finishPallet')
    data['WarehouseCode'] = Utils.getWarehouseCode();
    return this.Request.post(url, data, {}, 1);
  }
  finishReceivePO(data: any) {
    let url = this.getAPI('finishReceivePO')
    return this.Request.post(url, data, {}, 1);
  }
  finishPO(data: any) {
    let url = this.getAPI('finishPO')
    data['WarehouseCode'] = Utils.getWarehouseCode();
    return this.Request.post(url, data, {}, 1);
  }
  cancelPO(data: any) {
    let url = this.getAPI('cancelPO')
    data['WarehouseCode'] = Utils.getWarehouseCode();
    return this.Request.post(url, data, {}, 1);
  }
  getPOList(data: any) {
    let url = this.getAPI('list');
    return this.Request.get(url, data);
  }
  getPODetails(poCode: string) {
    let url = this.getAPI('details');
    return this.Request.get(url, { POCode: poCode });
  }

  getAPI(name: string, isExport = false) {
    let _path = configs.REPORT;
    if (!isExport) {
      let whCode = Utils.getWarehouseCode();
      _path = `${configs.SFT}/${whCode.toLocaleLowerCase()}`;
    }

    let url = this.urlList[name];
    return `${_path}/${url}`;
  }

  uploadDocument(data: any) {
    let url = this.getAPI('uploadDocument')
    return this.Request.upload(url, data);
  }
  getDocuments(data: any) {
    let url = this.getAPI('getDocuments')
    return this.Request.get(url, data);
  }
  removeDocument(data: any) {
    let url = this.getAPI('removeDocument')
    return this.Request.post(url, data, {}, 1);
  }
  downloadDocument(data: any) {
    let url = this.getAPI('downloadDocument')
    return this.Request.download(url, data);
  }
  smartPrint(data: any) {
    let url = `https://api-supra.winmart.vn/${this.urlList['printFile']}`;
    return this.Request.post(url, data, {}, 1);
  }
  exportPO(data: any = {}) {
    const url = this.getAPI('exportPO');
    return this.Request.download(url, data);
  }
  scanPOAdjust(data: any) {
    const url = this.getAPI('scanPOAdjust');
    return this.Request.post(url, data, {}, 1);
  }
  getCurrentTask(data: any) {
    const url = this.getAPI('getCurrentTask');
    return this.Request.post(url, data, {}, 1);
  }
  scanPalletAdjustPO(data: any) { 
    const url = this.getAPI('scanPalletAdjustPO');
    return this.Request.post(url, data, {}, 1);
  }
  adjustItem(data: any) {
    let url = this.getAPI('adjustItem');
    return this.Request.post(url, data, {}, 1);
  }
  removeAdjustItem(data: any) {
    let url = this.getAPI('removeAdjustItem');
    return this.Request.post(url, data, {}, 1);
  }
  finishPOAdjust(data: any) {
    let url = this.getAPI('finishPOAdjust');
    return this.Request.post(url, data, {}, 1);
  }
  finishPalletAdjust(data: any) {
    let url = this.getAPI('finishPalletAdjust');
    return this.Request.post(url, data, {}, 1);
  }
  getPODetailPromotion(data) {
    let url = this.getAPI('getPODetailPromotion');
    return this.Request.get(url, data);
  }
  getClient(data) {
    let url = this.getAPI('getClient');
    return this.Request.get(url, data);
  }
  checkSKUSystem(data: any){
    let url = this.getAPI('checkSKUSystem');
    return this.Request.get(url, data);
  }
  insertSKUToPO(data: any) {
    let url = this.getAPI('insertSKUToPO');
    return this.Request.post(url, data, {}, 1);
  }
  removeSKUFromPO(data: any) {
    let url = this.getAPI('removeSKUFromPO');
    return this.Request.post(url, data, {}, 1);
  }
  cancelReceiveSessionCode(data: any) {
    let url = this.getAPI('cancelReceiveSessionCode');
    return this.Request.post(url, data, {}, 1);
  }
  uploadProductImage(data: any) {
    let url = this.getAPI('uploadProductImage')
    return this.Request.upload(url, data);
  }
  exportSORList(data: any = {}) {
    const url = this.getAPI('exportSORList', true);
    return this.Request.download(url, data);
  }
}

