import { Injectable } from '@angular/core';
import {of as observableOf} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import { RequestService } from './../../shared/request.service';

@Injectable({
  providedIn: 'root'
})
export class OperationNetworkingService {
  urlList:object = {
    Area: {
      'save': '/api/area/save',
      'list': '/api/area/getlist',
      'getone': '/api/area/getone'
    },
    Region: {
      'save': '/api/region/save',
      'list': '/api/region/getlist',
      'getone': '/api/region/getone'
    },
    Country: {
      'save': '/api/country/save',
      'list': '/api/country/getlist',
      'getone': '/api/country/getone',
      'countrycombo': '/api/country/countrycombo'
    },
    Warehouse: {
      'save': '/api/warehouse/save',
      'list': '/api/warehouse/getlist',
      'getone': '/api/warehouse/getone'
    },
    Floor: {
      'save': '/api/floor/save',
      'list': '/api/floor/getlist',
      'getone': '/api/floor/getone',
      'floorcombo': '/api/floor/getfloorcombo'
    },
    Room: {
      'save': '/api/room/save',
      'list': '/api/room/getlist',
      'getone': '/api/room/getone',
      'roomtype': '/api/room/getroomtype',
      'roomcombo': '/api/room/getroombombo'
    },
    Point: {
      'save': '/api/point/save',
      'list': '/api/point/getlist',
      'getone': '/api/point/getone',
      'pointtype': '/api/point/getpointtype'
    },
    Smartcart: {
      'save': '/api/smartcart/save',
      'list': '/api/smartcart/getlist',
      'getone': '/api/smartcart/getone',
      'configcombo': '/api/smartcart/getconfigcombo',
      'purposecombo': '/api/smartcart/getpurposecombo',
      'productsizecombo': '/api/smartcart/productsizecombo',
      'getcombo': '/api/smartcart/getcombo',
      'getTransportDevices': '/api/smartcart/gettransportdevices',
      'getbininfo': '/api/smartcart/getbininfo',
      'getconfiginfo': '/api/smartcart/getconfiginfo'
    },
    TransportDevice: {
      'save': '/api/transportdevice/save',
      'list': '/api/transportdevice/getlist',
      'getone': '/api/transportdevice/getone',
      'transportdevicetype': '/api/transportdevice/gettransportdevicetype',
      'usingstatus': '/api/transportdevice/getusingstatus',
      'getcombo': '/api/transportdevice/getcombo'
    },
    TransportDeviceOnSmartcart: {
      'save': '/api/transportdeviceonsmartcart/save',
      'list': '/api/transportdeviceonsmartcart/getlist',
      'getone': '/api/transportdeviceonsmartcart/getone'
    },
    SmartcartConfiguration: {
      'save': '/api/smartcartconfiguration/save',
      'list': '/api/smartcartconfiguration/getlist'
    }
  }
  constructor(private Request: RequestService) {
  }
  save(type, data) {
    let _type = type.split(".");
    let url = this.urlList[_type[0]][_type[1]];
    return this.Request.post(url, data)
    .pipe(
      map(data => {
        return data;
      }),
      catchError(() => {
        return observableOf({Success: false, Data: ""});
      })
    );
  }

  get(type, data) {
    let _type = type.split(".");
    let url = this.urlList[_type[0]][_type[1]];
    return this.Request.get(url, data);
  }
}
