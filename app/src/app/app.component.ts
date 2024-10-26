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

import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isSpinner = true;
  constructor(translate: TranslateService) {
    translate.addLangs(['vi', 'en'])
    translate.setDefaultLang('vi');
    translate.use('vi');

    
    const _href = window.location.href;
    const uris = _href.split("/");
    const params = uris[uris.length - 1].split("?");
    if (["board-view"].includes(params[0])) {
      this.isSpinner = false;
    }
  }
}