/**
 * Copyright (c) 2022 OVTeam
 * Modified by: Duy Huynh
 * Modified date: 2020/08
 */

import { Injectable } from '@angular/core';
import { RequestService } from '../shared/request.service';
import { configs } from '../shared/config';
import { Config } from 'protractor';

@Injectable({
  providedIn: 'root'
})

export class Service {
  urlList: object = {
    'loadSO': `api/v1/handover/loadSOList`,
    'loadPoints': `api/v1/points`,
    'assignPoint': 'api/v1/autopp/assignPoint',
    'createHandoverSession': 'api/v1/handover/create',
    'handOverLists': 'api/v1/handover/list',
    'pickListDetails': 'api/v1/autopp/pickList/',
    'packageList': 'api/v1/handover/packageList',
    'createtransfertransport': 'api/v1/handover/createtransfertransport',
    'details': 'api/v1/handover/details',
    'detailPrint': 'api/v1/handover/detailPrint',
    "getTrackingCode": 'api/v1/handover/trackingcode',
    "updateStatusTransfer": 'api/v1/handover/updateStatusTransfer',
    "cancelCreateSession": 'api/v1/handover/cancel',
    'exportReportSODelivery': 'api/v1/handover/exportReportSODelivery',
    'getSOMissPackageSession': 'api/v1/handover/getSOMissPackageSession',
    'getWarehouse': 'api/v1/warehouses/getWarehouse'
  };
  constructor(private Request: RequestService) { }
  updateStatusTransfer(code: any) {
    let url = this.getAPI('updateStatusTransfer');
    // console.log('eeee',window.getRootPath().toUpperCase());
    // data['Code'] = window.getRootPath().toUpperCase();
    // console.log(data['Code'])
    //console.log(url);
    return this.Request.post(url, { Code: code }, {}, 1);
  }
  createHandoverSession(data: any) {
    let url = this.getAPI('createHandoverSession');
    data['WarehouseCode'] = window.getRootPath().toUpperCase();
    return this.Request.post(url, data, {}, 1);
  }
  gethandoverDetails(Code: any, WHCode: any) {
    let url = this.getAPI('details');
    return this.Request.get(url, { Code: Code, WHCode: WHCode });
  }
  gethandoverDetailPrint(Code: String[]) {
    let url = this.getAPI('detailPrint');
    return this.Request.post(url, { SOCode: Code.join(',') }, {}, 1);
  }
  exportSODelivery(Code: String[]) {
    let url = this.getAPI('exportReportSODelivery');
    return this.Request.download(url, { SOCode: Code.join(',') });
  }
  getPackageList(Code: any) {
    let url = this.getAPI('packageList');
    return this.Request.get(url, { HandOverCode: Code });
  }

  getTrackingCode(ObjectCode: any) {
    let url = this.getAPI('getTrackingCode');
    return this.Request.get(url, { ObjectCode: ObjectCode })
  }
  loadSOList(data: any) {
    let url = this.getAPI('loadSO');
    data['WarehouseCode'] = window.getRootPath().toUpperCase()
    return this.Request.post(url, data, {}, 1);
  }
  loadPoints(data: any) {
    let url = this.getAPI('loadPoints');
    data['WarehouseCode'] = window.getRootPath().toUpperCase()
    return this.Request.get(url, data, {});
  }
  assignPoint(data: any) {
    let url = this.getAPI('assignPoint');
    data['WarehouseCode'] = window.getRootPath().toUpperCase();
    return this.Request.post(url, data, {}, 1);
  }
  loadPickListDetails(code: string) {
    let url = this.getAPI('pickListDetails') + code;
    return this.Request.get(url, {}, {});
  }
  getAPI(name: string) {
    let url = this.urlList[name];
    return `${configs.SFT}/${window.getRootPath().toLowerCase()}/${url}`;
  }
  createtransfertransport(code: String) {
    const url = `${configs.SFT}/${window.getRootPath().toLowerCase()}/${this.urlList['createtransfertransport']}`;
    let data = { Code: code };
    data['WarehouseCode'] = window.getRootPath().toUpperCase()
    return this.Request.post(url, data, {}, 1);
  }
  cancelCreateSession(code: string, note: String) {
    const url = `${configs.SFT}/${window.getRootPath().toLowerCase()}/${this.urlList['cancelCreateSession']}`;
    let data = { Code: code, Note: note };
    return this.Request.post(url, data, {}, 1);
  }
  downloadFileExcel(filters) {
    const url = '';
    return this.Request.download(url, filters);
  }
  getSOMissPackageSession(code: string) {
    let url = this.getAPI('getSOMissPackageSession');
    return this.Request.get(url, { SessionCode: code }, {});
  }
  getWarehouse(data: any) {
    let url = this.getAPI('getWarehouse');
    return this.Request.get(url, data);
  }
}
