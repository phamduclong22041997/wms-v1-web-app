import { Component, OnInit, Inject, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-so-packing-confirm',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class ConfirmPackingPrintLabelComponent implements OnInit, AfterViewInit {
  render: any;
  endValue: number;
  startValue: number;
  info: any;
  @ViewChild('noteContent', { static: false }) noteContent: String;
  // @ViewChild('startPackage', { static: false }) startPackage: ElementRef;
  // @ViewChild('endPackage', { static: false }) endPackage: ElementRef;

  constructor(public dialogRef: MatDialogRef<ConfirmPackingPrintLabelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  ngOnInit() {
    this.info = {
      SOCode: this.data.info.SOCode,
      StartPackage: 1,
      EndPackage: this.data.info.TotalPackage,
    };
    this.startValue = 1;
    this.endValue = this.data.info.TotalPackage;
  }
  ngAfterViewInit() {
  }
  onChangeStart(event: any) {
    let val = event.target['value'];
    if (val < 0) {
      val = val.replace('-', '');
    }
    if (val > this.endValue) {
      val = this.endValue;
    }
    if (val) {
      val = val * 1;
      this.startValue = val;
    }
  }
  onChangeEnd(event: any) {
    let val = event.target['value'];
    if (val < 0) {
      val = val.replace('-', '');
    }
    if(val < this.startValue) {
      val = this.startValue;
    }
    if (val > this.data.info.TotalPackage) {
      val = this.data.info.TotalPackage;
    }
    if (val) {
      val = val * 1;
      this.endValue = val;
    }
  }
  onQtyEnter(event: any) {
    this.onOkClick();
  }
  onCancelClick() {
    this.dialogRef.close(false);
  }
  onOkClick() {
    this.dialogRef.close(this.data.type === 1 ? { StartPackage: this.startValue, EndPackage: this.endValue } : true);
  }
}
