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

import { Component, OnInit, Inject, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastService } from '../../../../shared/toast.service';
import { STATUS_COLOR } from './../../../../shared/constant';

@Component({
  selector: 'app-po-schedule',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class ScheduleComponent implements OnInit, AfterViewInit {
  @ViewChild('scheduleDate', { static: false }) scheduleDate: any;
  @ViewChild('lineItem', { static: false }) lineItem: any;
  schedulesConfig: any;
  lineItemConfig: any;
  info: any;
  allowConfirm: boolean;
  selectedData: any;
  showLineItem: boolean;

  constructor(public dialogRef: MatDialogRef<ScheduleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toast: ToastService) {
    this.info = this.data['Data'];
  }
  ngOnInit() {
    this.allowConfirm = false;
    this.showLineItem = false;
    this.selectedData = null;
    this.initCombo();
  }
  ngAfterViewInit() {
    this.initEvent();
  }
  initCombo() {
    this.schedulesConfig = {
      selectedFirst: false,
      isSelectedAll: false,
      val: (option: any) => {
        return option['Schedule'];
      },
      render: (option: any) => {
        return option['Schedule'];
      },
      labelStyle: (option: any) => {
        if(option["Status"] == "New") {
          return {}
        }
        let style = {
          color: STATUS_COLOR[option.Status]
        }
        return style;
      },
      labelStatus: (option: any) => {
        return option['StatusText'];
      },
      optionStyle: (option: any) => {
        if (option['Status'] == "Finished") {
          return {
            backgroundColor: "#cccccc94",
            borderBottom: "1px solid #b6b0b0"
          }
        }
      },
      type: 'autocomplete',
      filter_key: '',
      data: this.info['ScheduleDateGroups']
    };

    this.lineItemConfig = {
      selectedFirst: false,
      isSelectedAll: false,
      val: (option: any) => {
        return option['Value'];
      },
      render: (option: any) => {
        return option['Name']
      },
      labelStyle: (option: any) => {
        let style = {
          color: STATUS_COLOR[option.Status]
        }
        return style;
      },
      labelStatus: (option: any) => {
        return option['StatusText'];
      },
      optionStyle: (option: any) => {
        if (option['Status'] == "Finished") {
          return {
            backgroundColor: "#cccccc94",
            borderBottom: "1px solid #b6b0b0"
          }
        }
      },
      type: 'autocomplete',
      filter_key: '',
      data: [] //setData
    };
  }
  validate(data: any, byLineItem: boolean = false) {
    if (data.Status === 'Finished') {
      let msg = `Ngày [${data.Schedule}] đã nhận hàng thành công. Vui lòng chọn ngày nhận hàng khác.`;
      if (byLineItem) {
        msg = `Tuyến [${data.Value}] ngày [${this.selectedData.Schedule}] đã nhận hàng thành công. Vui lòng chọn ngày nhận hàng khác.`;
      }
      this.toast.warning(msg, 'warning_title');
      return false;
    }
    if (data.Status === 'Receiving') {
      let msg = `Ngày [${data.Schedule}] đang nhận hàng. Vui lòng chọn ngày nhận hàng khác.`;
      if (byLineItem) {
        msg = `Tuyến [${data.Value}] ngày [${this.selectedData.Schedule}] đang nhận hàng. Vui lòng chọn ngày nhận hàng khác.`;
      }

      if(data["LineItems"]) {
        return true;
      }

      this.toast.warning(msg, 'warning_title');
      return false;
    }
    return true;
  }
  parseLineItemData(data: any) {
    this.showLineItem = data && data["LineItems"] && data["LineItems"].length;
    if(this.showLineItem) {
      this.allowConfirm = false;
    }
    setTimeout(() => {
      if (this.showLineItem) {
        this.lineItem["setData"](data["LineItems"] || []);
        this.initLineItemEvent();
      }
    }, 500);
  }
  initEvent() {
    this.scheduleDate['change'].subscribe({
      next: (value: any) => {
        this.allowConfirm = false;
        this.selectedData = null;
        if (value) {
          this.allowConfirm = this.validate(value);
          if (this.allowConfirm) {
            this.selectedData = value;
          }
        }

        this.parseLineItemData(this.selectedData);
      }
    });

    this.initLineItemEvent();
  }

  initLineItemEvent() {
    if (!this.lineItem) {
      return;
    }
    this.lineItem['change'].subscribe({
      next: (value: any) => {
        this.allowConfirm = false;
        if (value) {
          this.allowConfirm = this.validate(value, true);
          if (this.allowConfirm) {
            this.selectedData["LineItem"] = value["Value"];
          }
        }
      }
    });
  }

  onCancelClick() {
    this.dialogRef.close(false);
  }
  onOkClick() {
    if (this.allowConfirm && this.selectedData && this.validate(this.selectedData)) {
      this.dialogRef.close(this.selectedData);
    } else {
      if (!this.selectedData) {
        this.toast.warning(`Vui lòng chọn ngày nhận hàng.`, 'warning_title');
      }
      if(this.selectedData && this.showLineItem && !this.selectedData["LineItem"]) {
        this.toast.warning(`Vui lòng chọn tuyến nhận hàng.`, 'warning_title');
      }
    }
  }
}
