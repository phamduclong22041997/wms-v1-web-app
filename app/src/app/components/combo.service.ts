import { Injectable } from '@angular/core';
import { of as observableOf } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { RequestService } from './../shared/request.service';
import { configs } from '../shared/config';
@Injectable({
  providedIn: 'root'
})
export class ComboService {
  urlList: object = {
    SFT: {
      //NEW
      'regioncombo': `api/v1/geo/regions`,
      'wardscombo': `api/v1/geo/wards`,
      'provincescombo': `api/v1/geo/provinces`,
      'districtscombo': `api/v1/geo/districts`,
      'warehousecombo': `api/v1/warehouses`,
      'clientcombo': `api/v1/clients`,
      'vendorcombo': `api/v1/vendor/combo`,
      'servicecombo': 'api/v1/warehouse/service',
      'producttypecombo': 'api/v1/product/types',
      'storecombo': 'api/v1/stores/combo',
      'sotypecombo': 'api/v1/so/types',
      'pointscombo': 'api/v1/points/combo',
      'binsscombo': 'api/v1/bin/combo',
      'unitcombo': 'api/v1/unit/combo',
      'productunitcombo': 'api/v1/productunit/combo',
      'warehousebranchcombo': 'api/v1/warehouse/branchs',
      'enum': 'api/v1/enum',
      "branchscombo": 'api/v1/warehouse/getBranchs',
      "warehouseZone": 'api/v1/warehouse/zones',
      "foundBins": "api/v1/found/bins",
      "lostBins": "api/v1/lost/bins",
      "users": "api/v1/users",
      "employee": "api/v1/warehouse/employee",
    }
  }
  constructor(private Request: RequestService) { }
  save(type: any, data: any) {
    let _type = type.split(".");
    let url = this.urlList[_type[0]][_type[1]];
    return this.Request.post(url, data)
      .pipe(
        map(data => {
          return data;
        }),
        catchError(() => {
          return observableOf({ Success: false, Data: "" });
        })
      );
  }
  get(type: any, data: any) {
    let _type = type.split(".");
    let url = type;
    if (this.urlList[_type[0]] && this.urlList[_type[0]][_type[1]]) {
      url = this.urlList[_type[0]][_type[1]];
    }
    url = `${configs.SFT}/${window.getRootPath().toLowerCase()}/${url}`;

    return this.Request.get(url, data);
  }
  getPrinterList() {
    let url = `https://api-supra.winmart.vn/cloud-print/v1/printers`;
    return this.Request.post(url, {});
  }
}
