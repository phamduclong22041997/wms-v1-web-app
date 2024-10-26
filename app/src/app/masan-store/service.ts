/**
 * Copyright (c) 2019 OVTeam
 * Modified by: Duy Huynh
 * Modified date: 2020/08
 */

import { Injectable } from '@angular/core';
import { RequestService } from '../shared/request.service';
import { configs } from '../shared/config';


@Injectable({
  providedIn: "root",
})
export class Service {
  urlList: object = {
    list: `api/v1/stores`,
    createAddress: `api/v1/address/create`,
    createStore: `api/v1/stores/create`,
    editStore: `api/v1/stores/edit`,
    checkFinish: `api/v1/stores/checkfinish`,
    importStore: `api/v1/stores/importstore`,
    exportStore: `api/v1/stores/exportstore`,
    exportTemplateStore: `api/v1/stores/exporttemplate`
  };
  constructor(private Request: RequestService) { }
  get(data: any) {
    let url = this.getAPI("list");
    return this.Request.get(url, data);
  }
  getAPI(name: string) {
    let url = this.urlList[name];
    return `${configs.SFT}/${window.getRootPath().toLowerCase()}/${url}`;
  }
  editStore(data: any) {
    let url = this.getAPI("editStore");
    return this.Request.post(url, data);
  }
  createAddress(data: any) {
    let url = this.getAPI("createAddress");
    return this.Request.post(url, data);
  }
  createStore(data: any) {
    let url = this.getAPI("createStore");
    return this.Request.post(url, data);
  }
  checkFinish(data: any) {
    let url = this.getAPI("checkFinish");
    return this.Request.post(url, data);
  }
  importStore(data: any) {
    let url = this.getAPI("importStore");
    return this.Request.post(url, data);
  }
  exportStore(data: any) {
    let url = this.getAPI("exportStore");
    return this.Request.post(url, data);
  }
  exportTemplateStore(data: any) {
    let url = this.getAPI("exportTemplateStore");
    return this.Request.post(url, data);
  }
}
