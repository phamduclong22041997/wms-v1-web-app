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
    'loadSO': `api/v1/autopp/loadSOList`,
    'loadPoints': `api/v1/points`,
    'assignPoint': 'api/v1/autopp/assignPoint',
    'createPickList': 'api/v1/autopp/auto',
    'pickLists': 'api/v1/autopp/pickLists',
    'pickListDetails':'api/v1/autopp/pickList/',
    'assignGatheredPoint': 'api/v1/autopp/assignGatheredPoint',
    'removeGatheredPoint': 'api/v1/autopp/removeGatheredPoint',
    'exportAutoPickPack': 'api/v1/autopp/exportPickLists',
    'exportConfirmPick': 'api/v1/autopp/exportConfirmPickLists',
    'getCurrentPackingTask': 'api/v1/packing/getCurrentPackingTask',
    'scanTote': 'api/v1/packing/scanTote',
    'Packingitem': 'api/v1/packing/packingitems',
    "createPackage": "api/v1/packing/createPackage",
    "finishPacking": "api/v1/packing/finishPacking",
    "removeItem": "api/v1/packing/removeItem",
    'cancelAutoPickList': 'api/v1/autopp/cancelAutoPickList',
    'autoPackingItems': 'api/v1/packing/autoPackingItems',
    'getPackingStation': 'api/v1/point/getPackingStation',
    //SOData For Print
    'getSODetails': `api/v1/so/details`,
    'getSOForHandoverPrint': `api/v1/print/getDataPrintSOHandoverForPacking`,
    'scanCodePacking': `api/v1/packing/scanCodePacking`,
    'exportPicklistDetail': 'api/v1/autopp/exportPicklistDetail',
    'exportErrorPickList': 'api/v1/autopp/exportErrorPickList',
    'AssignPickLists': 'api/v1/autopp/getPickListForAssign',
    'AssignEmployeePickLists': 'api/v1/autopp/AssignEmployeePickList',
    'importProcessSO': 'api/v1/autopp/importSO',
    'saveDataImport': 'api/v1/autopp/saveDataImport',
    'getListTaskProcess': 'api/v1/autopp/getListTaskProcess',
    'ProcessTaskToSchedule': 'api/v1/autopp/ProcessTaskToSchedule',
    "loadTaskProcessDetails": "api/v1/autopp/getDetailTaskProcess",
    "cancelTaskProcess": "api/v1/autopp/cancelTaskProcess",
    'downloadTemplate': `api/v1/template/download`,
    'pickListConfirms': 'api/v1/autopp/pickListConfirms',
    'confirmSkipItem': 'api/v1/autopp/pickListConfirms/confirmSkipItem',
    'importEmployeeAssignPicklist': `api/v1/autopp/importEmployeeAssignPicklist`,
    'autoAssignEmployeePickList': `api/v1/autopp/autoAssignEmployeePickList`,
    'exportEmployee': `api/v1/report/exportEmployee`,
    'getAutoAssignPicklist': `api/v1/report/getAutoAssignPicklist`,
    'exportAutoAssignPicklist': `api/v1/report/exportAutoAssignPicklist`,
    'getAutoAssignEmployee': `api/v1/report/getAutoAssignEmployee`
  };
  constructor(private Request: RequestService) { }

  getPackingStation(data: any) {
    let url = this.getAPI('getPackingStation');
    return this.Request.post(url, data, {}, 1);
  }
  pickListConfirms(data: any) {
    let url = this.getAPI('pickListConfirms');
    data['WarehouseCode'] = window.getRootPath().toUpperCase()
    return this.Request.get(url, data);
  }
  ConfirmSkipItem(data: any) {
    let url = this.getAPI('confirmSkipItem');
    data['WarehouseCode'] = window.getRootPath().toUpperCase()
    return this.Request.post(url, data, {}, 1);
  }
  cancelPicklist(data: any) {
    let url = this.getAPI('cancelAutoPickList');
    data['WarehouseCode'] = window.getRootPath().toUpperCase();
    return this.Request.post(url, data, {}, 1);
  }
  createPickList(data: any) {
    let url = this.getAPI('createPickList');
    data['WarehouseCode'] = window.getRootPath().toUpperCase();
    return this.Request.post(url, data, {}, 1);
  }
  loadSOList(data: any) {
    let url = this.getAPI('loadSO');
    data['WarehouseCode'] = window.getRootPath().toUpperCase()
    return this.Request.post(url, data, {}, 1);
  }
  GetAssignPickLists(data: any) {
    let url = this.getAPI('AssignPickLists');
    data['WarehouseCode'] = window.getRootPath().toUpperCase()
    return this.Request.post(url, data, {}, 1);
  }
  AssignEmployeePickLists(data: any) {
    let url = this.getAPI('AssignEmployeePickLists');
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
  assignGatheredPoint(data: any) {
    // {
      //     "SOList": ["SOWIN4EEA1D05AC"],
      //     "LocationCode": "LT.10.2"
      // }
      let url = this.getAPI('assignGatheredPoint');
      data['WarehouseCode'] = window.getRootPath().toUpperCase()
      return this.Request.post(url, data, {}, 1);
    }
  removeGatheredPoint(data: any) {
  // {
  //     "SOList": ["SOWIN4EEA1D05AC"],
  //     "LocationCode": "LT.10.2"
  // }
    let url = this.getAPI('removeGatheredPoint');
    data['WarehouseCode'] = window.getRootPath().toUpperCase()
    return this.Request.post(url, data, {}, 1);
  }
  getAPI(name: string) {
    let url = this.urlList[name];
    return `${configs.SFT}/${window.getRootPath().toLowerCase()}/${url}`;
  }
  exportAutoPickPack(data: any) {
    const url = this.getAPI('exportAutoPickPack');
    return this.Request.download(url, data);
  }
  exportConfirmPick(data: any) {
    const url = this.getAPI('exportConfirmPick');
    return this.Request.download(url, data);
  }
  getCurrentPackingTask() {
    const url = this.getAPI('getCurrentPackingTask');
    return this.Request.post(url, {}, 1);
  }

  scanTote(data: any) {
    const url = this.getAPI('scanTote');
    return this.Request.post(url, data, {}, 1);
  }
  Packingitem(data: any) {
    const url = this.getAPI('Packingitem');
    return this.Request.post(url, data, {}, 1);
  }
  createPackage(data: any) {
    const url = this.getAPI('createPackage');
    return this.Request.post(url, data, {}, 1);
  }
  finishPacking(data: any) {
    const url = this.getAPI('finishPacking');
    return this.Request.post(url, data, {}, 1);
  }
  removeItem(data: any) {
    const url = this.getAPI('removeItem');
    return this.Request.post(url, data, {}, 1);
  }
  autoPackingItems(data: any) {
    const url = this.getAPI('autoPackingItems');
    return this.Request.post(url, data, {}, 1);
  }
  getSODetails(SOCode: string) {
    const url = this.getAPI('getSODetails');
    return this.Request.get(url, { SOCode: SOCode });
  }
  getSOForHandoverPrint(SOCode: string) {
    let url = this.getAPI('getSOForHandoverPrint');
    return this.Request.get(url, { SOCode: SOCode });
  }
  scanCodePacking(data: any) {
    let url = this.getAPI('scanCodePacking');
    return this.Request.post(url, data, {}, 1);
  }
  exportPicklistDetail(data: any) {
    const url = this.getAPI('exportPicklistDetail');
    return this.Request.download(url, data);
  }
  exportError(data: any) {
    const url = this.getAPI('exportErrorPickList');
    return this.Request.download(url, data);
  }
  importProcessSO(data: any, TaskType: String)
  {
    let url = `${this.getAPI('importProcessSO')}?TaskType=${TaskType}`;
    console.log(url);    
    return this.Request.upload(url, data);
  }
  saveDataImport(data: any) {
    let url = this.getAPI('saveDataImport');
    return this.Request.post(url, data, {}, 1);
  }
  getListTaskProcess(data: any) {
    let url = this.getAPI('getListTaskProcess');
    return this.Request.post(url, data, {},1);
  }
  ProcessTaskToSchedule(data: any) {
    let url = this.getAPI('ProcessTaskToSchedule');
    return this.Request.post(url, data, {},1);
  }
  loadTaskProcessDetails(code: string) {
    console.log('loadDetails', code);
    let url = this.getAPI('loadTaskProcessDetails');
    return this.Request.post(url, {Code: code}, {}, 1);
  }
  cancelTaskProcess(data: any) {
    let url = this.getAPI('cancelTaskProcess');
    data['WarehouseCode'] = window.getRootPath().toUpperCase();
    return this.Request.post(url, data, {}, 1);
  }
  downloadTemplate(fileName: string) {
    const url = this.getAPI('downloadTemplate');
    return this.Request.download(url, { FileName: fileName });
  }
  
  importEmployeeAssignPicklist(data: any) {
    let url = this.getAPI('importEmployeeAssignPicklist');
    data['WarehouseCode'] = window.getRootPath().toUpperCase()
    return this.Request.upload(url, data);
  }
  autoAssignEmployeePickList(data: any) {
    let url = this.getAPI('autoAssignEmployeePickList');
    data['WarehouseCode'] = window.getRootPath().toUpperCase();
    return this.Request.post(url, data, {}, 1);
  }
  exportEmployee(data: any) {
    const url = this.getAPI('exportEmployee');
    data['WarehouseCode'] = window.getRootPath().toUpperCase()
    return this.Request.download(url, data);
  }
  getAutoAssignPicklist(data: any) {
    let url = this.getAPI('getAutoAssignPicklist');
    return this.Request.get(url, data);
  }
  exportAutoAssignPicklist(data: any) {
    let url = this.getAPI('exportAutoAssignPicklist');
    return this.Request.download(url, data);
  }
  getAutoAssignEmployee(data: any) {
    let url = this.getAPI('getAutoAssignEmployee');
    return this.Request.get(url, data);
  }
}
