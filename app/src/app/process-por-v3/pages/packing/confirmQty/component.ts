import { Component, OnInit, Inject, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastService } from '../../../../shared/toast.service';

@Component({
  selector: 'app-po-receive-confirm',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class ConfirmQtyComponent implements OnInit, AfterViewInit {
  info: any;
  barcode: string;
  qty: number;
  @ViewChild('barcodeqty', { static: false }) barcodeqty: ElementRef;

  constructor(public dialogRef: MatDialogRef<ConfirmQtyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toast: ToastService) {
    this.info = this.data;
  }

  ngOnInit() {
    this.barcode = this.data.ScanBarcode;
    this.qty = this.data.ScanQty;
    setTimeout(() => {
      if (this.barcodeqty) {
        this.barcodeqty.nativeElement.focus()
      }
    }, 200)
  }
  ngAfterViewInit() {

  }

  initQty() {

  }
  onChange(event: any) {
    let val = event.target['value'];
    if (val < 0) {
      val = val.replace('-', '');
    }
    if (val) {
      val = val * 1;
      this.qty = val;
      this.info.BaseQty = this.qty * this.data.Numerator;
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
  onQtyOkClick() {
    if (this.qty >= 1)
      {
      let data = this.getQtyData();
      if (data) {
        this.dialogRef.close(data);
      }
    }
  }
  onEnter(event: any) {
    
  }
  onQtyEnter(event: any) {
    this.onQtyOkClick();
  }
  getData() {

  }
  getQtyData() {
    return `${this.barcode}|${this.qty}`;
  }
}
