import { Component, OnInit, Inject, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastService } from '../../../../shared/toast.service';
import * as moment from 'moment';

@Component({
  selector: 'app-so-packing-confirm',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class ConfirmPOAdjustComponent implements OnInit, AfterViewInit {
  info: any;
  expiredDateConfig: any;
  manufactureDateConfig: any;
  effectiveDateConfig: any;
  expiredPercents: number;
  barcode: string;
  qty: string;
  @ViewChild('expiredDate', { static: false }) expiredDate: any;
  @ViewChild('manufactureDate', { static: false }) manufactureDate: any;
  @ViewChild('effectiveDate', { static: false }) effectiveDate: any;
  @ViewChild('barcodeqty', { static: false }) barcodeqty: ElementRef;

  constructor(public dialogRef: MatDialogRef<ConfirmPOAdjustComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toast: ToastService) {
    this.info = this.data['Data'];
  }

  ngOnInit() {
    if (this.data['isReceivePallet']) {
      this.init();
    }
    if (this.data['isConfirmQty']) {
      this.data['ProductUnitName'] = this.data.productUnit ? `${this.data.productUnit.Numerator} ${this.data.barcode.UomName}/ ${this.data.productUnit.UomName}` : '';
      this.initQty();
      setTimeout(() => {
        if (this.barcodeqty) {
          this.barcodeqty.nativeElement.focus()
        }
      }, 200)
    }
  }
  ngAfterViewInit() {
    if (this.data['isReceivePallet']) {
      this.initEvent();
      this.setDefaultDate();
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
      }, 500)
    }
  }

  initQty() {
    this.barcode = this.data.code;
    if (this.data.qty) {
      this.qty = this.data.qty;
    }
    else {
      this.qty = '';
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
  onChange(event: any) {
    let val = event.target['value'];
    if (val < 0) {
      val = val.replace('-', '');
    }
    if (val) {
      val = val * 1;
      this.qty = val;
    }
    else {
      this.barcodeqty.nativeElement.focus()
    }
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
  onQtyEnter(event: any) {
    this.onQtyOkClick();
  }
  getData() {
    const expiredVal = this.expiredDate.getValue();
    const manufactureVal = this.manufactureDate.getValue();
    const effectiveVal = this.effectiveDate.getValue();
    if (!expiredVal) {
      this.toast.error('POPallet.Error.EmptyExpiredDate', 'error_title');
      return;
    }
    if (!manufactureVal) {
      this.toast.error('POPallet.Error.EmptyManufactureDate', 'error_title');
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
        EffectiveDate: effectiveDate ? effectiveDate.format("YYYY-MM-DD") : ""
      }
    }
    return null;
  }
  getQtyData() {
    return `${this.barcode}|${this.qty}`;
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
