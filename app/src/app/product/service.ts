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
    'list': `api/v1/products`,
    'getlistproductinventory': `${configs.SFT}/wft/v1/%warehouse%/masanproduct/getlistproductinventory`,
    'editProduct': `api/v1/product/edit`,
    'details': `api/v1/product/details`,
    'productunits': `api/v1/productunits`,
    'productbarcodes': `api/v1/productbarcodes`,
    'removeunit': `api/v1/productunit/remove`,
    'units': `api/v1/units`,
    'createunit': `api/v1/productunit/create`,
    'editunit': `api/v1/productunit/edit`,
    'createbarcode': `api/v1/productbarcode/create`,
    'removebarcode': `api/v1/productbarcode/remove`,
    'editbarcode': `api/v1/productbarcode/edit`,
    'importbarcode': `api/v1/productbarcode/import`,
    'clients': `api/v1/clients`,
    'adjustProductList': `api/v1/adjustproduct/list`,
    'getCurrentTask': `api/v1/adjustproduct/getCurrentTask`,
    'scanAdjustProduct': `api/v1/adjustproduct/scanCode`,
    'adjustItem': `api/v1/adjustproduct/adjustItem`,
    'removeAdjustItem': `api/v1/adjustproduct/removeAdjustItem`,
    'adjustProductDetails': `api/v1/adjustproduct/details`,
    'scanItemAdjustProduct': `api/v1/adjustproduct/scanItem`,
    'getProductVendorBySKU': `api/v1/vendor/getVendorBySKU`,
    'getObjectTracking': 'api/v1/report/getObjectTracking',
    'uploadProductImage': 'api/v1/document/uploadProductImage',
    'exportProducts': 'api/v1/product/exportProducts'
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
    return `${configs.SFT}/${window.getRootPath().toLowerCase()}/${url}`;
  }
  editProduct(data: any) {
    let url = this.getAdminAPI('editProduct');
    return this.Request.post(url, data);
  }
  getAdjustProductDetail(data:any) {
    let url = this.getAPI('adjustProductDetails');
    return this.Request.get(url, data);
  }  
  getProductDetails(data:any) {
    let url = this.getAdminAPI('details');
    return this.Request.get(url, data);
  }  
  getProductUnits(data: any) {
    let url = this.getAdminAPI('productunits');
    return this.Request.get(url, data);
  } 
  getProductBarcodes(data:any) {
    let url = this.getAdminAPI('productbarcodes');
    return this.Request.get(url, data);
  } 
  getUnits(codes: string) {
    let url = this.getAdminAPI('units');
    return this.Request.get(url, { Codes: codes });
  } 
  getAdminAPI(name: string) {
    let url = this.urlList[name];
    return `${configs.SFT}/${window.getRootPath().toLowerCase()}/${url}`;
  }

  createBarcode(data: any) {
    let url = this.getAPI('createbarcode')
    return this.Request.post(url, data, {}, 1);
  }
  importBarcode(data: any) {
    let url = this.getAPI('importbarcode')
    return this.Request.post(url, data, {}, 1);
  }
  editBarcode(data: any) {
    let url = this.getAPI('editbarcode')
    return this.Request.post(url, data, {}, 1);
  }
  removeBarcode(data: any) {
    let url = this.getAPI('removebarcode')
    return this.Request.post(url, data, {}, 1);
  }

  createUnit(data: any) {
    let url = this.getAPI('createunit')
    return this.Request.post(url, data, {}, 1);
  }

  editUnit(data: any) {
    let url = this.getAPI('editunit')
    return this.Request.post(url, data, {}, 1);
  }
  getClients(content: string) {
    let url = this.getAPI('clients');
    return this.Request.get(url, { Content: content });
  } 
  removeUnit(data: any){
    let url = this.getAPI('removeunit')
    return this.Request.post(url, data, {}, 1);
  }
  getCurrentTask(data: any) {
    const url = this.getAPI('getCurrentTask');
    return this.Request.post(url, data, {}, 1);
  }
  scanAdjustProduct(data: any){
    let url = this.getAPI('scanAdjustProduct')
    return this.Request.post(url, data, {}, 1);
  }
  scanItemAdjustProduct(data: any){
    let url = this.getAPI('scanItemAdjustProduct')
    return this.Request.post(url, data, {}, 1);
  }
  adjustItem(data: any){
    let url = this.getAPI('adjustItem')
    return this.Request.post(url, data, {}, 1);
  }
  removeAdjustItem(data: any){
    let url = this.getAPI('removeAdjustItem')
    return this.Request.post(url, data, {}, 1);
  }
  getProductVendorBySKU(data: any) {
    let url = this.getAdminAPI('getProductVendorBySKU');
    return this.Request.get(url, data);
  }
  getObjectTracking(data: any) {
    let url = this.getAdminAPI('getObjectTracking');
    return this.Request.get(url, data);
  }

  exportProducts(data: any = {}) {
    const url = this.getAPI("exportProducts");
    return this.Request.download(url, data);
  }
}
