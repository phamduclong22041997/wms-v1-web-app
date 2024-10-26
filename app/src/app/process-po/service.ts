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
    'finishPO': `api/v1/po/finishPO`,
    'cancelPO': `api/v1/po/cancelPO`,
    'list': `api/v1/po/list`,
    'details': `api/v1/po/details`,
    'receiveList': `api/v1/po/receive/list`,
    'receiveDetails': `api/v1/po/receive/details`,
    'scanPO': `api/v1/po/scanPO`,
    'scanPallet': `api/v1/po/scanPallet`,
    'createPallet': `api/v1/po/createPallet`,
    'receiveItem': `api/v1/po/receiveItem`,
    'removeItem': `api/v1/po/removeItem`,
    'finishPallet': `api/v1/po/finishPallet`,
    'finishReceivePO': `api/v1/po/finishReceivePO`,
    'uploadDocument': 'api/v1/document/upload',
    'removeDocument': 'api/v1/document/remove',
    'downloadDocument': 'api/v1/document/download',
    'getDocuments': 'api/v1/documents',
    'printFile' : 'cloud-print/v1/print',
    'exportPO': `api/v1/po/exportlist`,
    'getBranchs' : `api/v1/warehouse/getBranchs`,
    'getPOPallet' : `api/v1/po/receive/pallets`,
    'scanPOAdjust': `api/v1/po-adjust/scanPOAdjust`,
    'getCurrentTask': `api/v1/po-adjust/getCurrentTask`,
    'scanPalletAdjustPO': `api/v1/po-adjust/scanPallet`,
    'adjustItem': `api/v1/po-adjust/adjustItem`,
    'removeAdjustItem': `api/v1/po-adjust/removeItem`,
    'finishPOAdjust': `api/v1/po-adjust/finish`,
    'finishPalletAdjust': `api/v1/po-adjust/finishPallet`,
    'getPODetailPromotion': `api/v1/po/receive/detailPromotion`,
    'getClient': `api/v1/client/getClient`,
    'insertSKUToPO': `api/v1/po/insertSKUToPO`,
    'checkSKUSystem': `api/v1/po/checkSKUSystem`,
    'removeSKUFromPO': `api/v1/po/removeSKUFromPO`,
    'uploadProductImage': 'api/v1/document/uploadProductImage',
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
  scanPO(code: string, scheduleDate: string = "", lineItem: string = "") {
    let url = this.getAPI('scanPO');
    let postData = { Code: code, WarehouseCode:  window.getRootPath().toUpperCase()};
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
    data['WarehouseCode'] = window.getRootPath().toUpperCase();
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
    data['WarehouseCode'] = window.getRootPath().toUpperCase();
    return this.Request.post(url, data, {}, 1);
  }
  finishReceivePO(data: any) {
    let url = this.getAPI('finishReceivePO')
    return this.Request.post(url, data, {}, 1);
  }
  finishPO(data: any) {
    let url = this.getAPI('finishPO')
    data['WarehouseCode'] = window.getRootPath().toUpperCase();
    return this.Request.post(url, data, {}, 1);
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
  getPODetails(poCode: string) {
    let url = this.getAPI('details');
    return this.Request.get(url, { POCode: poCode });
  }
  getAPI(name: string) {
    let url = this.urlList[name];
    return `${configs.SFT}/${window.getRootPath().toLowerCase()}/${url}`;
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
  uploadProductImage(data: any) {
    let url = this.getAPI('uploadProductImage')
    return this.Request.upload(url, data);
  }
}

