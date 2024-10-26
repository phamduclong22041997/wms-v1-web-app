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

import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Service } from '../../service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../shared/toast.service';
import { PrintService } from '../../../shared/printService';
const timezone = "Asia/Ho_Chi_Minh";
const _ = require('lodash');

@Component({
  selector: 'app-change-pass',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})

export class ChangePasswordComponent implements OnInit, AfterViewInit {
  data: any = {
    oldPass: '',
    newPass: '',
    confirmPwd: '',
    errorMsg: ''
  };
  hideOld: boolean;
  hideNew: boolean;
  hideCfg: boolean;
  disableConfirm: boolean;

  @ViewChild('inputNumber', { static: false }) inputNumber: ElementRef;
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('typeSort', { static: false }) typeSort: ElementRef;

  constructor(
    private translate: TranslateService,
    private service: Service, private toast: ToastService,
    private printService: PrintService,
    private route: ActivatedRoute,
    public dialog: MatDialog,) {
  }

  ngOnInit() {
    this.hideOld = true;
    this.hideNew = true;
    this.hideCfg = true;
    this.disableConfirm = true
  }

  initData() {

  }

  ngAfterViewInit() {
    this.initEvent();

    // setTimeout(() => {
    //   if (this.inputNumber) this.inputNumber.nativeElement.focus();
    // }, 200);

  }

  initEvent() {

  }
  confirm(event: any) {
    let ret = this.validate(0);
    console.log(this.data, ret);
    if (!ret) {
      let data = {
        OldPassword: this.data.oldPass,
        NewPassword: this.data.newPass,
        ConfirmPasswordChange: this.data.confirmPwd
      };
      this.service.resetPassword(data).subscribe(res => {
        if (res.Status) {
          this.toast.success(this.translate.instant('Print.UpdateTotalPackageSuccess'), "success_title");
        }
      });
    }
  }

  clear(event: any) {
    this.data = {
      oldPass: '',
      newPass: '',
      confirmPwd: '',
      errorMsg: ''
    };
    this.disableConfirm = true
  }
  onFocusOut(event: any) {
    this.validate(1);
  }
  validate(type: any) {

    if (this.data.oldPass == '' || this.data.oldPass.length < 6) {
      this.data.errorMsg = 'Vui lòng nhập mật khẩu cũ';
      this.disableConfirm = true;
      return true;
    }

    if (this.data.newPass == '' || this.data.newPass.length < 6) {
      this.data.errorMsg = 'Vui lòng nhập mật khẩu mới';
      this.disableConfirm = true;
      return true;
    }

    if (this.data.newPass == this.data.oldPass) {
      this.data.errorMsg = 'Vui lòng nhập mật khẩu mới khác mật khẩu cũ';
      this.disableConfirm = true;
      return true;
    }

    if (this.data.newPass && this.data.confirmPwd && this.data.newPass != this.data.confirmPwd) {
      this.data.errorMsg = 'Mật khẩu xác nhận không chính xác';
      this.disableConfirm = true;
      return true;
    }
    this.data.errorMsg = '';
    this.disableConfirm = false;
    return false;
  }
}