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
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

export class Service {
  uri = "api/v3/payroll/";
  urlList: object = {
    "getBoardList": `${this.uri}getBoardList`
  };
  constructor(private Request: RequestService, private http: HttpClient) { }

  getBoardList(data: any) {
    let url = this.getAPI(`getBoardList`);
    return this.Request.get(url, data);
  }


  getAPI(name: string) {
    let url = this.urlList[name];
    return `${configs.REPORT}/${url}`;
    // return `${configs.HOST_URI}/${window.getRootPath().toLowerCase()}/${url}`;
  }


}
