import { Component, OnInit, Inject, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-so-packing-confirm',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class ConfirmTotalPrintComponent implements OnInit, AfterViewInit {
  numberOfLabel: number;
  // @ViewChild('numberOfLabel', { static: false }) noteContent: String;
  // @ViewChild('startPackage', { static: false }) startPackage: ElementRef;
  // @ViewChild('endPackage', { static: false }) endPackage: ElementRef;

  constructor(public dialogRef: MatDialogRef<ConfirmTotalPrintComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  ngOnInit() {
    this.numberOfLabel = 1;
  }
  ngAfterViewInit() {
  }


  onChangeNumberLabel(event: any) {
    let val = event.target['value'];
    if (val) {
      val = val * 1;
      this.numberOfLabel = val;
    }
  }
  onQtyEnter(event: any) {
    this.onOkClick();
  }
  onCancelClick() {
    this.dialogRef.close(false);
  }
  onOkClick() {
    this.dialogRef.close({NumberOfLabel: this.numberOfLabel});
  }
}
