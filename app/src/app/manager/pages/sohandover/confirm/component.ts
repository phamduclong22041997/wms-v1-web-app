import { Component, OnInit, Inject, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-update',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class ConfirmUpdateComponent implements OnInit, AfterViewInit {
  render: any;
  qtyEven: string;
  qtyOdd: string;
  info: any;
  @ViewChild('noteContent', { static: false }) noteContent: String;
  @ViewChild('totalPackageOdd', { static: false }) totalPackageOdd: ElementRef;
  @ViewChild('totalPackageEven', { static: false }) totalPackageEven: ElementRef;
  
  constructor(public dialogRef: MatDialogRef<ConfirmUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  ngOnInit() {
      this.info = {
        SOCode: this.data.info.SOCode,
        SiteId: this.data.info.SiteId,
        TotalPackage: this.data.info.TotalPackage,
        TotalPackageOdd: this.data.info.TotalPackageOdd,
        TotalPackageEven: this.data.info.TotalPackageEven
      };
      this.qtyOdd = this.info.TotalPackageOdd;
      this.qtyEven = this.info.TotalPackageEven;
  }
  ngAfterViewInit() {
    const el = this.totalPackageEven;
    setTimeout(function(){
        el.nativeElement.focus();
    }, 500)
  }
  onChangeOdd(event: any) {
    let val = event.target['value'];
    if (val < 0) {
      val = val.replace('-', '');
    }
    if (val) {
      val = val * 1;
      this.qtyOdd = val;
      this.info.TotalPackage = this.qtyEven + this.qtyOdd;
    }
    else {
      this.totalPackageOdd.nativeElement.focus()
    }
  }
  onChangeEven(event: any) {
    let val = event.target['value'];
    if (val < 0) {
      val = val.replace('-', '');
    }
    if (val) {
      val = val * 1;
      this.qtyEven = val;
      this.info.TotalPackage = this.qtyEven + this.qtyOdd;
    }
    else {
      this.totalPackageOdd.nativeElement.focus()
    }
  }
  onQtyEnter(event: any) {
    this.onOkClick();
  }
  onCancelClick() {
    this.dialogRef.close(false);
  }
  onOkClick() {
    this.info.TotalPackageOdd = this.qtyOdd;
    this.info.totalPackageEven = this.qtyEven;
    this.info.TotalPackage = this.info.TotalPackageOdd + this.info.TotalPackageEven;
    this.dialogRef.close(this.data.type === 1 ? this.info : true);
  }
}
