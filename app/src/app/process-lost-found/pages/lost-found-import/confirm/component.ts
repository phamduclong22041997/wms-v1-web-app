import { Component, OnInit, Inject, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastService } from '../../../../shared/toast.service';
import * as moment from 'moment';

@Component({
  selector: 'app-so-packing-confirm',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class ConfirmItemFoundComponent implements OnInit, AfterViewInit {
  expiredDateConfig: any;
  manufactureDateConfig: any;
  effectiveDateConfig: any;
  expiredPercents: number;
  barcode: string;
  qty: number;
  isUpdateDate: boolean;
  isGotExpiredDate: boolean = true;
  @ViewChild('expiredDate', { static: false }) expiredDate: any;
  @ViewChild('manufactureDate', { static: false }) manufactureDate: any;
  @ViewChild('effectiveDate', { static: false }) effectiveDate: any;
  @ViewChild('barcodeqty', { static: false }) barcodeqty: ElementRef;

  constructor(public dialogRef: MatDialogRef<ConfirmItemFoundComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toast: ToastService) {
      
  }

  ngOnInit() {
    this.init();
    this.isUpdateDate = false;
    this.isGotExpiredDate = true;
  }
  ngAfterViewInit() {
    this.initEvent();
    this.setDefaultDate();
    if (this.data['ExpiredDate'] && this.data['ManufactureDate'])
    {
      this.isUpdateDate = true;
    }
    else {
      this.isUpdateDate = false;
    }
    if (this.data['ExpirationType'] === "None") {
      this.isGotExpiredDate = false;
    }
  }

  init() {
    this.expiredPercents = 0;
    this.expiredDateConfig = {
      setDefaultDate: false,
      setMaxDate: true,
      setMinDate: true
    };
    this.manufactureDateConfig = {
      setDefaultDate: false,
      setMaxDate: false
    }
    this.barcode = this.data.Barcode;
    if (this.data.Qty) {
      this.qty = this.data.Qty;
    }
    else {
      this.qty = 0;
    }
  }

  setDefaultDate() {
    setTimeout(() => {
      console.log(this.data['ExpiredDate']);
      
      if (this.data['ExpiredDate']) {
        this.expiredDate.setValue(moment(this.data['ExpiredDate'], "YYYY-MM-DD").toDate())
      }
      if (this.data['ManufactureDate']) {
        this.manufactureDate.setValue(moment(this.data['ManufactureDate'], "YYYY-MM-DD").toDate())
      }
    }, 500)
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
    this.data.Qty = this.qty;
    this.data.BaseQty = this.qty * this.data.Numerator;
  }

  onCancelClick() {
    this.dialogRef.close(false);
  }
  onOkClick() {
    let data = this.getData();
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
  getData() {
    const expiredVal = this.expiredDate.getValue();
    const manufactureVal = this.manufactureDate.getValue();
    // const effectiveVal = this.effectiveDate.getValue();
    if (!expiredVal && this.isGotExpiredDate) {
      this.toast.error('LostFound.Error.EmptyExpiredDate', 'error_title');
      return;
    }
    if (!manufactureVal && this.isGotExpiredDate) {
      this.toast.error('LostFound.Error.EmptyManufactureDate', 'error_title');
      return;
    }

    if (expiredVal && manufactureVal) {
      const expiredDate = moment(expiredVal);
      const manufactureDate = moment(manufactureVal)
      const totalDays = expiredDate.diff(manufactureDate, 'days');
      if (totalDays <= 0) {
        this.toast.error('LostFound.Error.ExpiredDate', 'error_title');
        return;
      }
      let result = {...this.data, 
        ExpiredDate: expiredDate.format("YYYY-MM-DD"),
        ManufactureDate: manufactureDate.format("YYYY-MM-DD")
      }
      return result;
    }
    this.qty = parseInt(this.barcodeqty.nativeElement.value);
    if (!this.qty)
    {
      this.toast.error('LostFound.Error.FoundQty', 'error_title');
      return;
    }
    return this.isGotExpiredDate ? null :  this.data;
  }

  calcPercent() {
    const expiredVal = this.expiredDate.getValue();
    const manufactureVal = this.manufactureDate.getValue();

    if (expiredVal && manufactureVal) {
      const expiredDate = moment(expiredVal);
      const manufactureDate = moment(manufactureVal)
      const totalDays = expiredDate.diff(manufactureDate, 'days');
      const remainTotalDays = expiredDate.diff(moment(), 'days');
      
      if (remainTotalDays > 0) {
        this.expiredPercents = parseFloat(((remainTotalDays / totalDays) * 100).toFixed(2));
      }
      else
      {
        this.expiredPercents = 0;
      }
    }
  }
}
