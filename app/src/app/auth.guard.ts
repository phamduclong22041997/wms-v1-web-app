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
import { RequestService } from './shared/request.service';
import { configs } from "./shared/config";

import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(private routes: Router, private request: RequestService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    // let _token: any = localStorage.getItem('APISID');
    // if (_token) {
    //   return true;
    // }
    // let redirectUrl = window.location.href;
    // window.location.href = configs.OVAUTHEN + `?redirect=${redirectUrl}`;
    return true;
  }
}
