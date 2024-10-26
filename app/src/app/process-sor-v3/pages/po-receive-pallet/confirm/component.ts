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
import * as moment from 'moment';

@Component({
  selector: 'app-po-receive-confirm',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class ConfirmPOReceiveComponent implements OnInit, AfterViewInit {
  info: any;
  expiredDateConfig: any;
  manufactureDateConfig: any;
  effectiveDateConfig: any;
  expiredPercents: number;
  barcode: string;
  qty: number;
  qtyNumerator: number;
  promotionQty: number;
  isDisableConfirm = false;
  isShowLotNumber = false;
  isShowPromotion = false;
  MaxReceiveQtyLabel: string;
  disableQty: boolean = false;
  allowSave: boolean = false;
  @ViewChild('expiredDate', { static: false }) expiredDate: any;
  @ViewChild('manufactureDate', { static: false }) manufactureDate: any;
  @ViewChild('effectiveDate', { static: false }) effectiveDate: any;
  @ViewChild('barcodeqty', { static: false }) barcodeqty: ElementRef;
  @ViewChild('txtLotNumber', { static: false }) txtLotNumber: ElementRef;
  @ViewChild('promotionqty', { static: false }) proqty: ElementRef;

  constructor(public dialogRef: MatDialogRef<ConfirmPOReceiveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toast: ToastService) {
    this.info = this.data['Data'];
  }

  ngOnInit() {
    if (this.data['isReceivePallet']) {
      this.init();
      this.isShowLotNumber = this.data['storageType'] === "LotBatch";
    }
    if (this.data['isConfirmQty']) {
      this.data['ProductUnitLabel'] = this.data.productUnit ? `${this.data.productUnit.Numerator} ${this.data.product.Uom}` : '';
      this.isShowPromotion = this.data['product']['PromotionQty'] > 0;
      this.initQty();
      setTimeout(() => {
        if (this.barcodeqty) {
          this.barcodeqty.nativeElement.focus();
        }
      }, 200)
    }
  }
  ngAfterViewInit() {
    if (this.data['isReceivePallet']) {
      this.initEvent();
      this.setDefaultDate();
      setTimeout(() => {
        if (this.isShowLotNumber) {
          this.txtLotNumber.nativeElement.focus();
        } else {
          this.expiredDate.ref.nativeElement.focus();
        }
      }, 200);
    }
  }

  init() {
    this.expiredPercents = 0;
    this.expiredDateConfig = {
      // setDefaultDate: false,
      setDefaultDate: false,
      setMaxDate: true,
      setMinDate: true,
      minDate: new Date()
    };
    this.manufactureDateConfig = {
      setDefaultDate: false,
      setMaxDate: false
    }
    this.effectiveDateConfig = {
      setDefaultDate: false,
      setMaxDate: true,
      setMinDate: true,
      minDate: new Date()
    }
  }

  setDefaultDate() {
    if (this.data['product'] && this.data['product']['LastExpiredDate']) {
      setTimeout(() => {
        if (this.data['product']['LastExpiredDate']) {
          this.expiredDate.setValue(moment(this.data['product']['LastExpiredDate'], "YYYY-MM-DD").toDate())
        }
        if (this.data['product']['LastManufactureDate']) {
          this.manufactureDate.setValue(moment(this.data['product']['LastManufactureDate'], "YYYY-MM-DD").toDate())
        }
        if (this.data['product']['LastBestBeforeDate']) {
          this.effectiveDate.setValue(moment(this.data['product']['LastBestBeforeDate'], "YYYY-MM-DD").toDate())
        }

        if (this.data['product']['LastLotNumber']) {
          this.txtLotNumber.nativeElement.value = this.data['product']['LastLotNumber'];
        }

      }, 500)
    }
  }

  initQty() {
    this.barcode = this.data.code;
    this.qty = this.data.qty ? this.data.qty : (this.isShowPromotion?"":1);
    this.qtyNumerator = this.data.barcode ? this.qty * this.data.barcode.Numerator : this.qty;
    this.promotionQty = this.data.promotionQty || "";
    this.disableQty = this.data && this.data.product && this.data.product.BaseQty > 0 ? false : true;

    if(this.disableQty && this.qty > 0 && this.isShowPromotion) {
      this.qty = 0;
    }

    if(this.qty > 0 || this.promotionQty > 0) {
      setTimeout(() => {
        this.onChange(null);
      }, 200)
      // this.calcBaseUnit(this.qty, 0)
    }
  }

  initEvent() {
    this.expiredDate['change'].subscribe({
      next: (value: any) => {
        setTimeout(() => {
          this.calcPercent();
        }, 500)
      }
    });
    this.manufactureDate['change'].subscribe({
      next: (value: any) => {
        setTimeout(() => {
          this.calcPercent();
        }, 500)
      }
    });
  }

  validateMaxQty(value: number) {
    if (value > 999999) {
      this.toast.error('POPallet.OverMaxNumber', 'error_title');
      this.barcodeqty.nativeElement.focus();
      this.isDisableConfirm = true;
      return false;
    }
    this.isDisableConfirm = false;
    return true;
  }
  onPromotionChange(event: any) {
    let val = this.barcodeqty.nativeElement.value;
  }
  onChange(event: any) {
    let validate = this.validateInputQty();
    if(!validate.Status){
      return;
    }

    this.isDisableConfirm = false;
    this.calcBaseUnit(validate.val, validate._val);
  }

  calcBaseUnit(val: any, _val:any) {
    if (val < 0) {
      val = val.replace('-', '');
    }
    if (_val < 0) {
      _val = _val.replace('-', '');
    }
    if (!this.validateMaxQty(val)) return;

    if (val || _val) {
      val = val * 1;
      this.qty = val;
      this.qtyNumerator = (this.data.barcode ? this.qty * this.data.barcode.Numerator : this.qty) + (_val*1 || 0);
    }

    this.isDisableConfirm = this.qtyNumerator <= 0;
  }

  onCancelClick() {
    this.dialogRef.close(false);
  }
  onOkClick() {
    this.dialogRef.close(true);
  }
  onReceiveOkClick() {
    let data = this.getData();
    if (data) {
      this.dialogRef.close(data);
    }
  }
  onQtyOkClick() {
    let data = this.getQtyData();
    if (data) {
      this.dialogRef.close(data);
    }
  }
  onEnter(event: any) {
    let name = event.target.name;
    if (name == "expiredDate") {
      let val = this.expiredDate.getValue();
      if (val) {
        if (this.manufactureDate.ref && this.manufactureDate.ref.nativeElement) {
          this.manufactureDate.ref.nativeElement.focus();
        }
      }
    }
    if (name == "manufactureDate") {
      let val = this.manufactureDate.getValue();
      if (val) {
        if (this.effectiveDate.ref && this.effectiveDate.ref.nativeElement) {
          this.effectiveDate.ref.nativeElement.focus();
        }
      }
    }
    if (name == "effectiveDate") {
      let val = this.expiredDate.getValue();
      if (!val) {
        if (this.expiredDate.ref && this.expiredDate.ref.nativeElement) {
          this.expiredDate.ref.nativeElement.focus();
        }
      } else {
        let val = this.manufactureDate.getValue();
        if (!val) {
          if (this.manufactureDate.ref && this.manufactureDate.ref.nativeElement) {
            this.manufactureDate.ref.nativeElement.focus();
          }
        }
      }
    }
  }
  private validateInputQty(){
    let val = this.barcodeqty.nativeElement.value;
    let maxQty = this.data.product.BaseQty/this.data.barcode.Numerator;
    if(val > maxQty) {
      this.toast.error(`SKU [${this.info["SKU"]}] có số lượng nhập: ${val} lớn hơn số lượng có thể nhận: ${maxQty}.`, 'error_title');
      this.barcodeqty.nativeElement.value = 0;
      this.isDisableConfirm = true;
      return {
        Status: false
      };
    }
    let _val = 0;
    if(this.isShowPromotion) {
      _val = this.proqty.nativeElement.value;
      if(_val > this.data.product.PromotionQty) {
        this.toast.error(`SKU [${this.info["SKU"]}] có số lượng khuyến mãi lớn hơn ${this.data.product.PromotionQty}.`, 'error_title');
        this.proqty.nativeElement.value = 0;
        this.isDisableConfirm = true;
        return {
          Status: false
        };
      }
    }
    return {
      Status: true,
      val: val,
      _val: _val
    };
  }
  onQtyEnter(event: any) {
    if(!this.validateInputQty().Status){
      return;
    }
    this.onQtyOkClick();
  }
  getData() {
    const expiredVal = this.expiredDate.getValue();
    const manufactureVal = this.manufactureDate.getValue();
    const effectiveVal = this.effectiveDate.getValue();
    const lotNumber = this.isShowLotNumber ? this.txtLotNumber.nativeElement.value : "";

    if (this.isShowLotNumber && !lotNumber) {
      this.toast.error('POPallet.Error.EmptyLotNumber', 'error_title');
      this.txtLotNumber.nativeElement.focus();
      return;
    }
    if (!expiredVal) {
      this.toast.error('POPallet.Error.EmptyExpiredDate', 'error_title');
      this.expiredDate.ref.nativeElement.focus();
      return;
    }
    if (!manufactureVal) {
      this.toast.error('POPallet.Error.EmptyManufactureDate', 'error_title');
      this.manufactureDate.ref.nativeElement.focus();
      return;
    }
    // if(!effectiveVal) {
    //   this.toast.error('POPallet.Error.EmptyEffectiveDate', 'error_title');
    //   return;
    // }

    if (expiredVal && manufactureVal) {
      const expiredDate = moment(expiredVal);
      const manufactureDate = moment(manufactureVal)
      const effectiveDate = effectiveVal ? moment(effectiveVal) : ""
      const totalDays = expiredDate.diff(manufactureDate, 'days');
      const totaleffective = expiredDate.diff(effectiveDate, 'days');
      if (totalDays <= 0) {
        this.toast.error('POPallet.Error.ExpiredDate', 'error_title');
        return;
      }
      if (totaleffective < 0) {
        this.toast.error('POPallet.Error.EffectiveDate', 'error_title');
        return;
      }

      return {
        ExpiredDate: expiredDate.format("YYYY-MM-DD"),
        ManufactureDate: manufactureDate.format("YYYY-MM-DD"),
        EffectiveDate: effectiveDate ? effectiveDate.format("YYYY-MM-DD") : "",
        LotNumber: lotNumber || null
      };
    }
    return null;
  }
  getQtyData() {
    let val = `${this.barcode}|${this.qty||0}`;
    if(this.isShowPromotion) {
      let _val = this.proqty.nativeElement.value;
      _val = _val * 1;
      if(_val > 0) {
        val += `|${_val}`;
      }
    }
    return val;
  }

  calcPercent() {
    const expiredVal = this.expiredDate.getValue();
    const manufactureVal = this.manufactureDate.getValue();

    if (expiredVal && manufactureVal) {
      const expiredDate = moment(expiredVal);
      const manufactureDate = moment(manufactureVal)
      const totalDays = expiredDate.diff(manufactureDate, 'days');
      const remainTotalDays = expiredDate.diff(moment(), 'days');
      this.expiredPercents = parseFloat(((remainTotalDays / totalDays) * 100).toFixed(2));
    }
  }

}
