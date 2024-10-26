/**
 * Copyright (c) 2019 OVTeam
 * Modified by: Duy Huynh
 * Modified date: 2020/08
 */

import { Injectable } from '@angular/core';
import { of as observableOf } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { RequestService } from '../shared/request.service';
import { configs } from '../shared/config';


@Injectable({
  providedIn: 'root'
})

export class Service {
  urlList: object = {
    'list': `${configs.SFT}/${window.getRootPath().toLowerCase()}/api/v1/products`,
    'getlistproductinventory': `${configs.SFT}/wft/v1/%warehouse%/masanproduct/getlistproductinventory`,
    'editProduct': `${configs.SFT}/api/v1/product/edit`
  };
  constructor(private Request: RequestService) { }
  get(data: any) {
    let url = this.getAPI('list');
    return this.Request.get(url, data); 
  }
  getlistproductinventory(data: any) {
    let url = this.getAPI('getlistproductinventory');
    return this.Request.get(url, data);
  }
  getAPI(name: string) {
    let url = this.urlList[name];
    if (url) {
      const wh = window.localStorage.getItem('_warehouse') || 'none';
      url = url.replace('%warehouse%', wh);
    }
    return url;
  }
  editProduct(data: any) {
    let url = this.getAPI('editProduct');
    return this.Request.post(url, data);
  }
}
