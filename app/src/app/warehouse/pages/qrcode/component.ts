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
import { TranslateService } from '@ngx-translate/core';
import { Utils } from '../../../shared/utils';

@Component({
  selector: 'app-warehouse-qrcode',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})

export class WarehouseQRCodeComponent implements OnInit, AfterViewInit {
  dcConfig: Object;
  clientConfig: Object;
  data: any = {
    ClientCode:'',
    WarehouseCode: '',
    WarehouseSiteId: '',
    Content: '',
    DecryptContent: '',
    IsExpired: false,
    countTimeText: '',
    // Default inital value of timer
    defaultValue: 90,
    // variable to the time
    countDownTime: 90,
    isStopped: true,
    timerID: ''
  }

  @ViewChild('dcCombo', { static: false }) dcCombo: any;
  @ViewChild('client', { static: false }) client: any;

  constructor(
    private translate: TranslateService,
    private service: Service,
    public dialog: MatDialog) { }
    
  ngOnInit() {
    this.data.WarehouseCode = window.localStorage.getItem('_warehouse') || window.getRootPath().toUpperCase();
    this.initData();
  }

  initData() {
    this.dcConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      isSorting: false,
      isFilter: true,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return this.renderValueCombo(option);
      },
      type: 'combo',
      filter_key: 'Name',
      filters: {
          data: this.data.WarehouseCode
      },
      URL_CODE: 'SFT.branchscombo'
    };

    this.clientConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      isSelectedAllValueIsEmpty: true,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return this.renderValueCombo(option);
      },
      type: 'combo',
      filter_key: 'Name',
      URL_CODE: 'SFT.clientcombo'
    };
  }
  
  ngAfterViewInit() {
    this.initEvent();
  }

  initEvent() {
    this.dcCombo['change'].subscribe({
      next: (value: any) => {
        this.data['WarehouseSiteId'] = value ? value.Code : '';
      }
    });
    this.client['change'].subscribe({
      next: (value: any) => {
        this.data['ClientCode'] = value && value.Code ? value.Code : '';

        if (this.dcCombo) {
          if(value.Code){
            this.dcCombo['reload']({ ClientCode: this.data['ClientCode'], data: this.data['WarehouseCode'] });
          } else {
            this.dcCombo['clear'](false, true);
            this.dcCombo['setDefaultValue'](this.translate.instant('combo.all'));
          }
        }     
      }
    });
  }
  
  private renderValueCombo(option: any) {
    return option['Code'] ? `${option['Code']} - ${option['Name']}` : option['Name'];
  }

  createQRCode(){
    if (this.data.WarehouseSiteId) {
      this.stopTimer();
      this.data.IsExpired = false;
      let date = new Date();
      date = Utils.addMinutes(date, 3);
      let text = Utils.getDate(date) + ':00';
      this.data.Content = Utils.encrypt(`${this.data.WarehouseSiteId}|${text}|SFT|${this.data.WarehouseCode}`, {
        WarehouseCode: this.data.WarehouseCode,
        secret_iv: 'HR$2pIjHR$2pIj12',
        key_template: '0000000000000000000000',
        pass: Utils.getDate(null, 1)
      });
      this.runCountDown();
    }
  }

  // function to execute timer
  runCountDown = () =>  {
    // decrement time
    this.data.countDownTime -= 1;
    //Display updated time
    this.data.countTimeText = this.findTimeString();

    // timeout on zero
    if (this.data.countDownTime === 0) {
      this.stopTimer();
    }
    else {
      this.startTimer();
    }
  };
  startTimer = () => {
    if (this.data.isStopped) {
      this.data.isStopped = false;
      this.data.timerID = setInterval(this.runCountDown, 1000);
    }
  };
  stopTimer = () => {
    this.data.IsExpired = true;
    this.data.isStopped = true;
    this.data.countDownTime = this.data.defaultValue;
    if (this.data.timerID) {
      clearInterval(this.data.timerID);
    }
  };
  // Function calculate time string
  findTimeString = () => {
    var minutes = String(Math.trunc(this.data.countDownTime / 60));
    var seconds = String(this.data.countDownTime % 60);
    if (minutes.length === 1 && parseInt(minutes) > 0) {
      minutes = "0" + minutes;
    }
    if (seconds.length === 1) {
      seconds = "0" + seconds;
    }
    return minutes + ":"+ seconds;
  }
}
