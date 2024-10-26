/**
 * Copyright (c) 2019 OVTeam
 * Modified by: Duy Huynh
 * Modified date: 2020/08
 */

import { Injectable } from '@angular/core';
import { RequestService } from '../../../shared/request.service';
import { configs } from '../../../shared/config';

@Injectable({
    providedIn: 'root'
})
export class ServiceRegion {
    urlList: object = {
        'area': `${configs.SFT}/wft/v1/api/regions`,
    };
    constructor(private Request: RequestService) { }

    getArea(params:any = {}) {
        let url = this.getAPI('area');
        return this.Request.get(url, params);
    }

    getAPI(name: string) {
        let url = this.urlList[name];
        return url;
    }

}
