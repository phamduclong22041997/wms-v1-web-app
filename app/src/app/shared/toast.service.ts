/**
 * Copyright (c) 2019 OVTeam
 * Modified by: Duy Huynh
 * Modified date: 2019/11
 */

import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ToastService {

  lastMessage: string;
  constructor(private toastr: ToastrService, private translate: TranslateService) { 
    this.lastMessage = "";
  }

  /**
   * Show success message
   * @param message 
   * @param title 
   */
  success(message: string, title: string, params: any = null) {
    if(this.lastMessage != message) {
      this.lastMessage = message;
    } else {
      return;
    }
    let _params = {
      Default: message
    }
    if(params) {
      _params = {..._params, ...params};
    }
    this.toastr.success(this.translate.instant(message, params), this.translate.instant(title, { Default: title }), {
      closeButton: true,
      progressBar: true,
      positionClass: 'toast-bottom-left'
    }).onHidden.subscribe(() => {
      this.lastMessage = "";
    })
  }

  /**
   * Show error message
   * @param message 
   * @param title 
   */
  error(message: string, title: string, params: any = null) {
    if(this.lastMessage != message) {
      this.lastMessage = message;
    } else {
      return;
    }
    let _params = {
      Default: message
    }
    if(params) {
      _params = {..._params, ...params};
    }

    this.toastr.error(this.translate.instant(message, _params), this.translate.instant(title, { Default: title }), {
      closeButton: true,
      progressBar: true,
      positionClass: 'toast-bottom-left'
    }).onHidden.subscribe(() => {
      this.lastMessage = "";
    })
  }

  
  /**
   * Show error message
   * @param message 
   * @param title 
   */
   exception(message: string, title: string, params: any = null) {
    let _params = {
      Default: message
    }
    if(params) {
      _params = {..._params, ...params};
    }

    this.toastr.error(message, this.translate.instant(title, _params), {
      closeButton: true,
      progressBar: true,
      positionClass: 'toast-bottom-left'
    });
  }

  /**
   * Show information message
   * @param message 
   * @param title 
   */
  info(message: string, title: string, params: any = null) {
    if(this.lastMessage != message) {
      this.lastMessage = message;
    } else {
      return;
    }
    let _params = {
      Default: message
    }
    if(params) {
      _params = {..._params, ...params};
    }
    this.toastr.info(this.translate.instant(message, _params), this.translate.instant(title, { Default: title }), {
      closeButton: true,
      progressBar: true,
      positionClass: 'toast-bottom-left'
    }).onHidden.subscribe(() => {
      this.lastMessage = "";
    })
  }

  /**
   * Show information message
   * @param message 
   * @param title 
   */
  warning(message: string, title: string, params: any = null) {
    if(this.lastMessage != message) {
      this.lastMessage = message;
    } else {
      return;
    }
    let _params = {
      Default: message
    }
    if(params) {
      _params = {..._params, ...params};
    }
    this.toastr.warning(this.translate.instant(message, _params), this.translate.instant(title, { Default: title }), {
      closeButton: true,
      progressBar: true,
      positionClass: 'toast-bottom-left'
    }).onHidden.subscribe(() => {
      this.lastMessage = "";
    });
  }
}
