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
    'list': `api/v1/sor/list`,
    'details': `api/v1/sor/details`,
    'exportSORList': `api/v1/sor/exportSORList`,
    'exportSORDetails': `api/v1/sor/exportSORDetails`
  };

  constructor(private request: RequestService) { }

  getSODetails(data: any = {}) {
    const url = this.getAPI('details');
    return this.request.get(url, data);
  }

  getSORList(data: any) {
    const url = this.getAPI('list');
    return this.request.get(url, data);
  }

  getAPI(name: string) {
    let url = this.urlList[name];
    return `${configs.SFT}/${window.getRootPath().toLowerCase()}/${url}`;
  }
  exportSORList(data: any = {}) {
    const url = this.getAPI('exportSORList');
    return this.request.download(url, data);
  }
  exportSORDetails(data ={}){
    const url = this.getAPI('exportSORDetails');
    return this.request.download(url, data);
  }
}
