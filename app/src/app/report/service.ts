/**
 * Copyright (c) 2019 OVTeam
 * Modified by: Duy Huynh
 * Modified date: 2022/03
 */

import { Injectable } from '@angular/core';
import { RequestService } from '../shared/request.service';
import { configs } from '../shared/config';


@Injectable({
  providedIn: 'root'
})

export class Service {
  urlList: object = {
    'getBinInventory': `api/v1/report/getBinInventory`,
    'exportBinInventory': `api/v1/report/exportBinInventory`,
    'exportsodetaillist': `api/v1/so/exportdetaillist`,
    'getsodetails': `api/v1/so/sodetails`,
    'getTransportUndock': `api/v1/report/getTransportUndock`,
    'exportTransportUndock': `api/v1/report/exportTransportUndock`,

    'getPODetailList': `api/v1/po/getPODetailList`,
    'exportPODetailList': `api/v1/po/exportPODetailList`,
    'getPickwaveList': `api/v1/autopp/getPickwaveList`,
    'getPickwaveDetail': `api/v1/autopp/getPickwaveDetail`,
    'exportPickwaveDetail': `api/v1/autopp/exportPickwaveDetail`,
    'getIssue': `api/v1/report/getIssue`,
    'exportIssue': `api/v1/report/exportIssue`,
    'getBalanceTrans': `api/v1/report/getBalanceTrans`,
    'exportBalanceTrans': `api/v1/report/exportBalanceTrans`,
    'getAutoProcessList': `api/v1/autoProcess/getList`,
    'getPOReceiveList': `api/v1/po/getPOReceiveList`,
    'exportPOReceiveList': `api/v1/po/exportPOReceiveList`,
    'getPickingListPrint': `api/v1/autopp/getPickingListPrint`,
    'getPickingListEvenPrint': `api/v1/autopp/getPickingListEvenPrint`,
    'exportPickingListPrint': `api/v1/autopp/exportPickingListPrint`,

    'getOpsJob': `api/v1/report/getOpsJob`,
    'removeAccessToken': `api/v1/warehouse/removeAccessToken`,
    'getWarehouseEmployee': `api/v1/warehouse/getWarehouseEmployee`,
    'getWarehouseEmployeeCombo': `api/v1/warehouse/getWarehouseEmployeeCombo`,
  };
  constructor(private Request: RequestService) { }
  
  getBinInventory(data: any) {
    let url = this.getAPI('getBinInventory');
    return this.Request.get(url, data);
  }

  getAPI(name: string) {
    let url = this.urlList[name];
    return `${configs.SFT}/${window.getRootPath().toLowerCase()}/${url}`;
  }

  exportBinInventory(data: any = {}) {
    const url = this.getAPI('exportBinInventory');
    return this.Request.download(url, data);
  }

  getSODetails(data: any) {
    let url = this.getAPI('getsodetails');
    return this.Request.get(url, data);
  }

  exportSODetailList(data: any = {}) {
    const url = this.getAPI('exportsodetaillist');
    return this.Request.download(url, data);
  }

  getTransportUndock(data: any) {
    let url = this.getAPI('getTransportUndock');
    return this.Request.get(url, data);
  }
  exportTransportUndock(data: any = {}) {
    const url = this.getAPI('exportTransportUndock');
    return this.Request.download(url, data);
  }

  getPODetailList(data: any) {
    let url = this.getAPI('getPODetailList');
    return this.Request.get(url, data);
  }
  exportPODetailList(data: any = {}) {
    const url = this.getAPI('exportPODetailList');
    return this.Request.download(url, data);
  }
  
  getPickwaveList(data: any) {
    let url = this.getAPI('getPickwaveList');
    return this.Request.get(url, data);
  }

  getPickwaveDetail(data: any) {
    let url = this.getAPI('getPickwaveDetail');
    return this.Request.get(url, data);
  }

  exportPickwaveDetail(data: any) {
    let url = this.getAPI('exportPickwaveDetail');
    return this.Request.download(url, data);
  }

  getIssue(data: any) {
    let url = this.getAPI('getIssue');
    return this.Request.get(url, data);
  }

  exportIssue(data: any) {
    let url = this.getAPI('exportIssue');
    return this.Request.download(url, data);
  }

  getBalanceTrans(data: any) {
    let url = this.getAPI('getBalanceTrans');
    return this.Request.get(url, data);
  }

  exportBalanceTrans(data: any) {
    let url = this.getAPI('exportBalanceTrans');
    return this.Request.download(url, data);
  }

  getPOReceiveList(data: any) {
    let url = this.getAPI('getPOReceiveList');
    return this.Request.get(url, data);
  }
  exportPOReceiveList(data: any) {
    let url = this.getAPI('exportPOReceiveList');
    return this.Request.download(url, data);
  }
  getPickingListPrint(data: any) {
    let url = this.getAPI('getPickingListPrint');
    return this.Request.post(url, data, {}, 1);
  }
  getPickingListEvenPrint(data: any) {
    let url = this.getAPI('getPickingListEvenPrint');
    return this.Request.post(url, data, {}, 1);
  }
  exportPickingListPrint(data: any) {
    let url = this.getAPI('exportPickingListPrint');
    return this.Request.downloadPost(url, data, {});
  }

  removeAccessToken(data: any) {
    let url = this.getAPI('removeAccessToken');
    return this.Request.post(url, data, {}, 1);
  }
  getOpsJob(data: any) {
    let url = this.getAPI('getOpsJob');
    return this.Request.get(url, data);
  }

  getWarehouseEmployee(data: any) {
    let url = this.getAPI('getWarehouseEmployee');
    return this.Request.get(url, data);
  }

  getWarehouseEmployeeCombo(data: any) {
    let url = this.getAPI('getWarehouseEmployeeCombo');
    return this.Request.get(url, data);
  }
}
