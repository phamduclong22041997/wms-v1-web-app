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
    'downloadTemplate': `api/v1/template/download`,
    'importProductClaim': 'api/v1/claim/importProductClaim',
    'saveProductClaim': 'api/v1/claim/saveProductClaim',
    'getProductClaims': 'api/v1/claim/getProductClaims',
    'getProductClaimUploads': 'api/v1/claim/getProductClaimUploads',
    'getProductClaimUploadDetails': 'api/v1/claim/getProductClaimUploadDetails',
    'resetPassword': 'api/v1/warehouse/changePassword',
    
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

  downloadTemplate(fileName: string) {
    const url = this.getAPI('downloadTemplate');
    return this.Request.download(url, { FileName: fileName });
  }

  importProductClaim(data: any, TaskType: String) {
    let url = this.getAPI('importProductClaim');
    return this.Request.upload(url, data);
  }
  
  saveProductClaim(data: any) {
    let url = this.getAPI('saveProductClaim');
    return this.Request.post(url, data, {}, 1);
  }

  resetPassword(data: any) {
    let url = this.getAPI('resetPassword');
    return this.Request.post(url, data, {}, 1);
  }
  getProductClaims(data: any) {
    let url = this.getAPI('getProductClaims');
    return this.Request.get(url, data);
  }
  getProductClaimUploads(data: any) {
    let url = this.getAPI('getProductClaimUploads');
    return this.Request.get(url, data);
  }
  getProductClaimUploadUrl() {
    return this.getAPI('getProductClaimUploads');
  }
  getProductClaimUploadDetails(data: any) {
    let url = this.getAPI('getProductClaimUploadDetails');
    return this.Request.get(url, data);
  }
}
