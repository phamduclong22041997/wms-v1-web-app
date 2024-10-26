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
  _urlRocket = `${configs.SFT}/${window.getRootPath().toLowerCase()}/api/v1/`;
  urlList: object = {
    'uploadPO': `${this._url}importPODemand`,
    'exportPO': `${this._url}exportPOFile`,
    'createPO': `${this._url}createPO`,
    'getListSKUPO': `${this._url}getListSKUPO`,
    'getPoFromRocket': `${this._url}getPoFromRocket`,
    'getSTOFromRocket': `${this._url}getSTOFromRocket`,
    'analyzePO': `${this._url}analyzePO`,
    'uploadSTO': `${this._url}importSTODemand`,
    'analyzeSTO': `${this._url}analyzeSTO`,
    'createSO': `${this._url}createSO`,
    'getListSKUSTO': `${this._url}getListSKUSTO`,
    'getWarehouse': `${this._url}getWarehouse`,
    'exportSTO': `${this._url}exportSTOFile`,
    'importRocket': `${this._url}importRocket`,
    'getDemandSets': `${this._url}getDemandSets`,
    'getDemandList': `${this._url}getDemandList`,
    'getDemandListPO': `${this._url}getDemandListPO`,
    'getDemandListSTO': `${this._url}getDemandListSTO`,
    'exportSTOList': `${this._url}exportsolist`,
    'exportSTOFromRocket': `${this._url}exportSTOFromRocket`,
    'exportPOFromRocket': `${this._url}exportPOFromRocket`,
    'list': `${this._url}getReportpokm`,
    'getPOStatistical': `${this._url}getPOStatistical`,
    'uploadPOLISTKM': `${this._url}importPOListStatical`,
    'getDataByPOCode': `${this._url}getByPOCode`,
    'rocketSTO': `${configs.SFT}/api/v1/rocket/importSTO`,
    'rocketSTOList': `${configs.SFT}/api/v1/rocket/getSTOList`,
    'analyzeRocketSTO': `${configs.SFT}/api/v1/rocket/analyzeSTO`,
    'exportRocketSTO': `${configs.SFT}/api/v1/rocket/exportSTO`,
    'downloadTemplate': `${this._urlRocket}/hy1/api/v1/template/download`,
    'exportPOProcess': `${this._url}exportpolist`,
    'exportSOScc' : `${this._url}exportsoscc`,
    'exportSOErr' : `${this._url}exportsoerr`,

    'exportPOScc' : `${this._url}exportposcc`,
    'exportPOErr' : `${this._url}exportpoerr`,


  };

  constructor(private request: RequestService) { }

  analyzePO(data: any) {
    const url = this.getAPI('analyzePO');
    return this.request.post(url, data, {}, 1);
  }
  createPO(data: any) {
    const url = this.getAPI('createPO');
    return this.request.post(url, data, {}, 1);
  }
  importRocket(data: any) {
    const url = this.getAPI('importRocket');
    return this.request.post(url, data, {}, 1);
  }
  createSO(data: any) {
    const url = this.getAPI('createSO');
    return this.request.post(url, data, {}, 1);
  }
  analyzeSTO(data: any) {
    const url = this.getAPI('analyzeSTO');
    return this.request.post(url, data, {}, 1);
  }
  getDemandList(data: any) {
    const url = this.getAPI('getDemandList');
    return this.request.get(url, data);
  }
  getDemandListPO(data: any) {
    const url = this.getAPI('getDemandListPO');
    return this.request.get(url, data);
  }
  getDemandListSTO(data: any) {
    const url = this.getAPI('getDemandListSTO');
    return this.request.get(url, data);
  }
  getDemandSets(data: any) {
    const url = this.getAPI('getDemandSets');
    return this.request.get(url, data);
  }
  getListSKU(data: any) {
    const url = this.getAPI('getListSKUPO');
    return this.request.get(url, data);
  }
  getPoFromRocket(data: any) {
    const url = this.getAPI('getPoFromRocket');
    return this.request.get(url, data);
  }
  getSTOFromRocket(data: any) {
    const url = this.getAPI('getSTOFromRocket');
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
  exportPO(data: any = {}) {
    const url = this.getAPI('exportPO');
    return this.request.download(url, data);
  }
  exportSTOList(data: any = {}) {
    const url = this.getAPI('exportSTOList');
    return this.request.download(url, data);
  }
  exportSOScc(data: any = {}) {
    const url = this.getAPI('exportSOScc');
    return this.request.download(url, data);
  }
  exportSOErr(data: any = {}) {
    const url = this.getAPI('exportSOErr');
    return this.request.download(url, data);
  }
  exportPOList(data: any = {}) {
    const url = this.getAPI('exportPOFromRocket');
    return this.request.download(url, data);
  }
  exportPOScc(data: any = {}) {
    const url = this.getAPI('exportPOScc');
    return this.request.download(url, data);
  }
  exportPOErr(data: any = {}) {
    const url = this.getAPI('exportPOErr');
    return this.request.download(url, data);
  }
  // exportSKUError(data: any) {
  //   data['Client']='WKT_EVENT';
  //   return this.request.downloadPost(this.getAPI('exportSKUError'), data);
  // }
  uploadPO(data: any) {
    return this.request.upload(this.getAPI('uploadPO'), data);
  }
  uploadPOLISTKM(data: any) {
    return this.request.upload(this.getAPI('uploadPOLISTKM'), data);
  }
  uploadSTO(data: any) {
    return this.request.upload(this.getAPI('uploadSTO'), data);
  }
  uploadSTODemand(data: any) {
    return this.request.post(this.getAPI('uploadSTO'), data, {}, true);
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

  // exportFilePO(data: any = {}) {
  //   data['Client']='WKT_EVENT';
  //   const url = this.getAPI('exportFilePO');
  //   return this.request.download(url, data);
  // }

  exportSTO(data: any = {}) {
    const url = this.getAPI('exportSTO');
    return this.request.download(url, data);
  }
  exportPOProcess(data: any = {}) {
    const url = this.getAPI('exportPOProcess');
    return this.request.download(url, data);
  }

  getAPI(name: string) {
    let url = this.urlList[name];
    if (url) {
      const wh = window.localStorage.getItem('_warehouse') || 'none';
      url = url.replace('%warehouse%', wh);
    }
    return url;
  }
  getDataByPOCode(data: object) {
    const url = this.getAPI('getDataByPOCode');
    return this.request.get(url, data);
  }
  getPOStatistical(params: object) {
    const url = this.getAPI('getPOStatistical');
    return this.request.get(url, params);
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
}
