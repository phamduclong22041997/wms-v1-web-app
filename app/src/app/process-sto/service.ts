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
  _url = `${configs.SFT}/${window.getRootPath().toLowerCase()}/api/v1/rocket-planning/`;
  urlList: object = {
    'uploadSTO': `${this._url}importSTODemand`,
    'analyzeSTO': `${this._url}analyzeSTO`,
    'getListSKUSTO': `${this._url}getListSKUSTO`,
    'getWarehouse': `${this._url}getWarehouse`,
    'exportSTO': `${this._url}exportSTOFile`,
    'importRocket': `${this._url}importRocket`,
    'getDemandSets': `${this._url}getDemandSets`,
    'list': `${this._url}getReportpokm`,
    
    'rocketSTO': `${configs.SFT}/api/v1/rocket/importSTO`,
    'rocketSTOList': `${configs.SFT}/api/v1/rocket/getSTOList`,
    'analyzeRocketSTO': `${configs.SFT}/api/v1/rocket/analyzeSTO`,
    'exportRocketSTO': `${configs.SFT}/api/v1/rocket/exportSTO`,
    'downloadTemplate': `${configs.SFT}/api/v1/template/download`,
    // config so
    'getSOList': `api/v1/so/list`,
    'details': `api/v1/so/details`,
    'cancel': `api/v1/so/cancelSO`,
    
    //print
    'printFile' : 'cloud-print/v1/print',
    'uploadDocument': `api/v1/document/upload`,
    'removeDocument': `api/v1/document/remove`,
    'downloadDocument': `api/v1/document/download`,
    'getDocuments': `api/v1/documents`,
    "getPackageNo": `api/v1/handover/packedNo`,
    "getPackageDetails": `api/v1/handover/packedNoDetails`,
    "getStatusTracking": `api/v1/so/statustracking`,
    "getStatusSAPTracking": `api/v1/report/getSAPResult`,
    'exportSO': `api/v1/so/exportlist`,
    'getHTML': 'cloud-print/v1/html'
  };

  constructor(private request: RequestService) { }

  // so
  getPackageNo(soCode: string){
    let url = this.getAPI('getPackageNo');
    return this.request.get(url, { ObjectCode: soCode });
  }
  getSOList() {
    return this.getAPI('getSOList');
  }
  getSODetails(SOCode: string) {
    let url = this.getAPI('details');
    return this.request.get(url, { SOCode: SOCode });
  }
  importRocket(data: any) {
    const url = this.getAPI('importRocket');
    return this.request.post(url, data, {}, 1);
  }
  analyzeSTO(data: any) {
    const url = this.getAPI('analyzeSTO');
    return this.request.post(url, data, {}, 1);
  }
  getDemandSets(data: any) {
    const url = this.getAPI('getDemandSets');
    return this.request.get(url, data);
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
  getPackageDetails(code: string, isSubPackage = 0){
    let url = this.getAPI('getPackageDetails');
    return this.request.get(url, { PackageNo: code, IsSubPackage: isSubPackage });
  }
  getPackageDetailBySO(code: string, isSubPackage = 0){
    let url = this.getAPI('getPackageDetails');
    return this.request.get(url, { SOCode: code, IsSubPackage: isSubPackage });
  }
  getStatusTracking(code: string){
    let url = this.getAPI('getStatusTracking');
    return this.request.get(url, { Code: code });
  }
  getStatusSAPTracking(code: string){
    let url = this.getAPI('getStatusSAPTracking');
    return this.request.get(url, { Code: code });
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
  getHTML(data: object) {
    const url = `${configs.OVSmartPrint}/${this.urlList['getHTML']}`;
    return this.request.post(url, data, {}, 1);
}
}
