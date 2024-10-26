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
  _url = `api/v3/por/`;
  urlList: object = {
    'downloadTemplate': `api/v3/template/download`,
    // config so
    'getPORList': `api/v3/por/list`,
    'details': `api/v3/por/details`,
    'cancel': `api/v3/por/cancelSO`,
    "processGIGR": `api/v3/por/processGIGR`,
    'exportPOR': `api/v2/ops/por/export`,
    "getStatusSAPTracking": `api/v2/ops/por/getSAPResultPOR`,
    'autoPPRequest': `api/v3/so/autoPPRequest`,

    //print
    'printFile': 'cloud-print/v1/print',
    'uploadDocument': `api/v3/document/upload`,
    'removeDocument': `api/v3/document/remove`,
    'downloadDocument': `api/v3/document/download`,
    'getDocuments': `api/v3/documents`,
    "getPackageNo": `api/v3/handover/packedNo`,
    "getPackageDetails": `api/v3/handover/packedNoDetails`,
    "getStatusTracking": `api/v3/so/statustracking`,
   
   
    'getHTML': 'cloud-print/v1/html',
    'printPackageDetail': 'api/v3/print/printPackageDetail',
    "getProductItemTransaction": `api/v3/handover/getProductItemTransaction`,
    "getTransportItems": `api/v3/getTransportItems`,


    //Pick pack
    'loadSO': `api/v3/autopp/loadSOList`,
    'createPickList': 'api/v3/autopp/auto',
    'exportErrorPickList': 'api/v3/autopp/exportErrorPickList',
    'exportAutoPickPack': 'api/v3/autopp/exportPickLists',
    'pickLists': 'api/v3/autopp/pickLists',
    'assignGatheredPoint': 'api/v3/autopp/assignGatheredPoint',
    'removeGatheredPoint': 'api/v3/autopp/removeGatheredPoint',

    'getPickwaveList': `api/v3/autopp/getPickwaveList`,
    'getPickwaveDetail': `api/v3/autopp/getPickwaveDetail`,
    'exportPickwaveDetail': `api/v3/autopp/exportPickwaveDetail`,

    'getPickingListPrint': `api/v3/autopp/getPickingListPrint`,
    'getPickingListEvenPrint': `api/v3/autopp/getPickingListEvenPrint`,
    'exportPickingListPrint': `api/v3/autopp/exportPickingListPrint`,
    'cancelAutoPickList': 'api/v3/autopp/cancelAutoPickList',
    'pickListDetails':'api/v3/autopp/pickList/',
    'exportPicklistDetail': 'api/v3/autopp/exportPicklistDetail',

    'ProcessTaskToSchedule': 'api/v3/autopp/ProcessTaskToSchedule',
    'getListTaskProcess': 'api/v3/autopp/getListTaskProcess',

    'importProcessSO': 'api/v3/autopp/importSO',
    'saveDataImport': 'api/v3/autopp/saveDataImport',

    'AssignEmployeePickLists': 'api/v3/autopp/AssignEmployeePickList',
    'AssignPickLists': 'api/v3/autopp/getPickListForAssign',
    'getPackingStation': 'api/v3/point/getPackingStation',
    'scanCodePacking': `api/v3/packing/scanCodePacking`,
    'getCurrentPackingTask': 'api/v3/packing/getCurrentPackingTask',
    'scanTote': 'api/v3/packing/scanTote',
    'Packingitem': 'api/v3/packing/packingitems',
    "removeItem": "api/v3/packing/removeItem",
    "createPackage": "api/v3/packing/createPackage",
    "finishPacking": "api/v3/packing/finishPacking",
    'getSODetails': `api/v3/so/details`,
    'autoPackingItems': 'api/v3/packing/autoPackingItems',
    'confirmSkipItem': 'api/v3/autopp/pickListConfirms/confirmSkipItem',
    'exportConfirmPick': 'api/v3/autopp/exportConfirmPickLists',

  };

  constructor(private request: RequestService) { }

  // so
  getPackageNo(soCode: string, pickingType: String) {
    let url = this.getAPI('getPackageNo');
    return this.request.get(url, { ObjectCode: soCode, PickingType: pickingType });
  }
  getPORList() {
    return this.getAPI('getPORList');
  }
  getPORDetails(SOCode: string, pickingType: String = "") {
    let url = this.getAPI('details');
    return this.request.get(url, { SOCode: SOCode, PickingType: pickingType });
  }
  processGIGRPOR(data: any){
    const url = this.getAPI('processGIGR');
    return this.request.post(url, data, {}, 1);
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
  uploadPOLISTKM(data: any) {
    return this.request.upload(this.getAPI('uploadPOLISTKM'), data);
  }
  uploadSTO(data: any) {
    return this.request.upload(this.getAPI('uploadSTO'), data);
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
  uploadRocketSTO(data: any) {
    return this.request.upload(this.getAPI('rocketSTO'), data);
  }
  rocketSTOList(data: any) {
    return this.request.post(this.getAPI('rocketSTOList'), data);
  }
  analyzeRocketSTO(data: any) {
    const url = this.getAPI('analyzeRocketSTO');
    return this.request.post(url, data, {}, 1);
  }
  exportRocketSTO(data: any = {}) {
    const url = this.getAPI('exportRocketSTO');
    return this.request.download(url, data);
  }
  downloadTemplate(fileName: string) {
    const url = this.getAPI('downloadTemplate');
    return this.request.download(url, { FileName: fileName });
  }
  uploadDocument(data: any) {
    let url = this.getAPI('uploadDocument')
    return this.request.upload(url, data);
  }
  getDocuments(data: any) {
    let url = this.getAPI('getDocuments')
    return this.request.get(url, data);
  }
  removeDocument(data: any) {
    let url = this.getAPI('removeDocument')
    return this.request.post(url, data, {}, 1);
  }
  downloadDocument(data: any) {
    let url = this.getAPI('downloadDocument')
    return this.request.download(url, data);
  }
  smartPrint(data: any) {
    let url = `https://api-supra.winmart.vn/${this.urlList['printFile']}`;
    return this.request.post(url, data, {}, 1);
  }
  getPackageDetails(data: any) {
    let url = this.getAPI('getPackageDetails');
    if (data["PickingType"] == "PickWave") {
      url = this.getAPI('getProductItemTransaction');
    }
    return this.request.get(url, data);
  }
  getPackageDetailBySO(data:any) {
    let url = this.getAPI('getPackageDetails');
    if (data["PickingType"] == "PickWave") {
      url = this.getAPI('getProductItemTransaction');
    }
    return this.request.get(url, data);
  }
  getStatusTracking(code: string, pickingType: String = "") {
    let url = this.getAPI('getStatusTracking');
    return this.request.get(url, { Code: code, PickingType: pickingType });
  }
  getStatusSAPTracking(data: any) {
    let url = this.getAPI('getStatusSAPTracking', true);
    return this.request.get(url, data);
  }
  cancelPOR(data: any) {
    let url = this.getAPI('cancel')
    return this.request.post(url, data, {}, 1);
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
  exportPOR(data: any = {}) {
    const url = this.getAPI('exportPOR', true);
    return this.request.download(url, data);
  }
  getHTML(data: object) {
    const url = `${configs.OVSmartPrint}/${this.urlList['getHTML']}`;
    return this.request.post(url, data, {}, 1);
  }
  printPackageDetail(data: any) {
    let url = this.getAPI("printPackageDetail");
    console.log("Debug ~ file: service.ts:198 ~ Service ~ printPackageDetail ~ url:", url)
    return this.request.get(url, data);
  }
  autoPPRequest(data: any){
    let url = this.getAPI('autoPPRequest')
    return this.request.post(url, data, {}, 1);
  }
  getTransportItems(data: any) {
    let url = this.getAPI('getTransportItems')
    return this.request.get(url, data);
  }


  //Pick pack
  loadSOList(data: any) {
    let url = this.getAPI('loadSO');
    data['WarehouseCode'] = Utils.getWarehouseCode();
    data["FromPOR"] = 1;
    return this.request.post(url, data, {}, 1);
  }
  createPickList(data: any) {
    let url = this.getAPI('createPickList');
    data['WarehouseCode'] = Utils.getWarehouseCode();
    data["FromPOR"] = 1;
    return this.request.post(url, data, {}, 1);
  }
  exportError(data: any) {
    const url = this.getAPI('exportErrorPickList');
    data["FromPOR"] = 1;
    return this.request.download(url, data);
  }
  exportAutoPickPack(data: any) {
    const url = this.getAPI('exportAutoPickPack');
    data["FromPOR"] = 1;
    return this.request.download(url, data);
  }
  assignGatheredPoint(data: any) {
    let url = this.getAPI('assignGatheredPoint');
    data['WarehouseCode'] = Utils.getWarehouseCode();
    data["FromPOR"] = 1;
    return this.request.post(url, data, {}, 1);
  }
  removeGatheredPoint(data: any) {
    let url = this.getAPI('removeGatheredPoint');
    data['WarehouseCode'] = Utils.getWarehouseCode();
    data["FromPOR"] = 1;
    return this.request.post(url, data, {}, 1);
  }
  getPickwaveDetail(data: any) {
    let url = this.getAPI("getPickwaveDetail");
    data["FromPOR"] = 1;
    return this.request.get(url, data);
  }
  exportPickwaveDetail(data: any) {
    let url = this.getAPI("exportPickwaveDetail");
    data["FromPOR"] = 1;
    return this.request.download(url, data);
  }
  getPickingListPrint(data: any) {
    let url = this.getAPI('getPickingListPrint');
    data["FromPOR"] = 1;
    return this.request.post(url, data, {}, 1);
  }
  getPickingListEvenPrint(data: any) {
    let url = this.getAPI('getPickingListEvenPrint');
    data["FromPOR"] = 1;
    return this.request.post(url, data, {}, 1);
  }
  exportPickingListPrint(data: any) {
    let url = this.getAPI('exportPickingListPrint');
    data["FromPOR"] = 1;
    return this.request.downloadPost(url, data, {});
  }
  cancelPicklist(data: any) {
    let url = this.getAPI('cancelAutoPickList');
    data['WarehouseCode'] = Utils.getWarehouseCode();
    data["FromPOR"] = 1;
    return this.request.post(url, data, {}, 1);
  }
  loadPickListDetails(code: string) {
    let url = this.getAPI('pickListDetails') + code;
    return this.request.get(url, {}, {});
  }
  exportPicklistDetail(data: any) {
    const url = this.getAPI('exportPicklistDetail');
    data["FromPOR"] = 1;
    return this.request.download(url, data);
  }
  ProcessTaskToSchedule(data: any) {
    let url = this.getAPI('ProcessTaskToSchedule');
    data["FromPOR"] = 1;
    return this.request.post(url, data, {},1);
  }
  getListTaskProcess(data: any) {
    let url = this.getAPI('getListTaskProcess');
    data["FromPOR"] = 1;
    return this.request.post(url, data, {},1);
  }
  importProcessSO(data: any, TaskType: String) {
    let url = `${this.getAPI('importProcessSO')}?TaskType=${TaskType}&FromPOR=1`;
    data["FromPOR"] = 1;
    return this.request.upload(url, data);
  }
  saveDataImport(data: any) {
    let url = this.getAPI('saveDataImport');
    data["FromPOR"] = 1;
    return this.request.post(url, data, {}, 1);
  }
  AssignEmployeePickLists(data: any) {
    let url = this.getAPI('AssignEmployeePickLists');
    data['WarehouseCode'] = Utils.getWarehouseCode();
    data["FromPOR"] = 1;
    return this.request.post(url, data, {}, 1);
  }
  GetAssignPickLists(data: any) {
    let url = this.getAPI('AssignPickLists');
    data['WarehouseCode'] = Utils.getWarehouseCode();
    data["FromPOR"] = 1;
    return this.request.post(url, data, {}, 1);
  }
  getPackingStation(data: any) {
    let url = this.getAPI('getPackingStation');
    data["FromPOR"] = 1;
    return this.request.post(url, data, {}, 1);
  }
  scanCodePacking(data: any) {
    let url = this.getAPI('scanCodePacking');
    data["FromPOR"] = 1;
    return this.request.post(url, data, {}, 1);
  }
  getCurrentPackingTask() {
    const url = this.getAPI('getCurrentPackingTask');
    return this.request.post(url, {"FromPOR": 1}, 1);
  }
  scanTote(data: any) {
    const url = this.getAPI('scanTote');
    data["FromPOR"] = 1;
    return this.request.post(url, data, {}, 1);
  }
  Packingitem(data: any) {
    const url = this.getAPI('Packingitem');
    data["FromPOR"] = 1;
    return this.request.post(url, data, {}, 1);
  }
  removeItem(data: any) {
    const url = this.getAPI('removeItem');
    data["FromPOR"] = 1;
    return this.request.post(url, data, {}, 1);
  }
  createPackage(data: any) {
    const url = this.getAPI('createPackage');
    data["FromPOR"] = 1;
    return this.request.post(url, data, {}, 1);
  }
  finishPacking(data: any) {
    const url = this.getAPI('finishPacking');
    data["FromPOR"] = 1;
    return this.request.post(url, data, {}, 1);
  }
  getSODetails(SOCode: string) {
    const url = this.getAPI('getSODetails');
    return this.request.get(url, { SOCode: SOCode, FromPOR: 1 });
  }
  autoPackingItems(data: any) {
    const url = this.getAPI('autoPackingItems');
    data["FromPOR"] = 1;
    return this.request.post(url, data, {}, 1);
  }
  ConfirmSkipItem(data: any) {
    let url = this.getAPI('confirmSkipItem');
    data['WarehouseCode'] = Utils.getWarehouseCode();
    data["FromPOR"] = 1;
    return this.request.post(url, data, {}, 1);
  }
  exportConfirmPick(data: any) {
    const url = this.getAPI('exportConfirmPick');
    data["FromPOR"] = 1;
    return this.request.download(url, data);
  }
}
