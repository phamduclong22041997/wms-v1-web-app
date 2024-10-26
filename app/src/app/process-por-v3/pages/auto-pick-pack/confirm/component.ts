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

import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastService } from '../../../../shared/toast.service';

@Component({
  selector: 'app-po-receive-confirm',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class ConfirmCreatePicklistComponent implements OnInit {
  @ViewChild('zone', { static: false }) zone: ElementRef;
  @ViewChild('pickupMethod', { static: false }) pickupMethod: ElementRef;
  @ViewChild('batchLot', { static: false }) batchLot: ElementRef;

  enablePickupMethod: boolean;
  info: any;
  zoneConfig: any;
  zoneCode: string;
  pickUpMethodCode: string;
  lotNumber: string;
  pickupMethodConfig: any;
  batchLotConfig: any;

  constructor(public dialogRef: MatDialogRef<ConfirmCreatePicklistComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,  private toast: ToastService) {
    this.info = this.data;
  }

  ngOnInit() {
    this.zoneCode = "";
    this.pickUpMethodCode = "";
    this.lotNumber = "";
    this.enablePickupMethod = window.loadSettings("EnablePickupMethod");
    this.initCombo();
  }

  ngAfterViewInit() {
    this.initEvent();
  }

  initCombo() {
    this.zoneConfig = {
      selectedFirst: true,
      isSelectedAll: false,
      isSorting: false,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return `${option['Name']}`;
      },
      type: 'autocomplete',
      filter_key: 'Name',
      URL_CODE: 'SFT.warehouseZone'
    }

    this.pickupMethodConfig = {
      selectedFirst: true,
      isSelectedAll: false,
      isSelectedAllValueIsEmpty: true,
      filters: {
        Collection: 'INV.PickList',
        Column: 'Type'
      },
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Description'];
      },
      type: 'autocomplete',
      filter_key: 'Description',
      URL_CODE: 'SFT.enum'
    }

    this.batchLotConfig = {
      selectedFirst: false,
      isSelectedAll: false,
      isSorting: false,
      isSelectedAllValueIsEmpty: true,
      filters: {
        ClientCode: this.info["ClientCode"]
      },
      val: (option: any) => {
        return option['LotNumber'];
      },
      render: (option: any) => {
        return `${option['LotNumber']}`;
      },
      type: 'autocomplete',
      filter_key: 'Name',
      URL_CODE: 'SFT.batchLots'
    }
  }
  initEvent() {
    this.zone['change'].subscribe({
      next: (value: any) => {
        this.zoneCode = value ? value['Code'] : ""
      }
    });

    if(this.enablePickupMethod) {
      this.pickupMethod['change'].subscribe({
        next: (value: any) => {
          this.pickUpMethodCode = value ? value['Code'] : ""
        }
      });
      this.batchLot['change'].subscribe({
        next: (value: any) => {
          this.lotNumber = value ? value.join(",") : ""
        }
      });
    }
  }
  validate() {
    if(this.enablePickupMethod) {
      if(!this.zoneCode) {
        this.toast.error("Chưa chọn khu vực lấy hàng.", 'error_title');
        return false;
      }
      if(!this.pickUpMethodCode) {
        this.toast.error("Chưa chọn phương thức lấy hàng.", 'error_title');
        return false;
      }
    }
    return true;
  }
  onCancelClick() {
    this.dialogRef.close(false);
  }
  onOkClick() {
    if(this.validate()) {
      this.dialogRef.close({ZoneCode: this.zoneCode, PickupMethod: this.pickUpMethodCode, LotNumber: this.lotNumber});
    }
  }
}
