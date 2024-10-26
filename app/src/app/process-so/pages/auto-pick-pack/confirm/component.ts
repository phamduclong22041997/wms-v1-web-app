import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-po-receive-confirm',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class ConfirmCreatePicklistComponent implements OnInit {
  @ViewChild('zone', { static: false }) zone: ElementRef;

  info: any;
  zoneConfig: any;
  zoneCode: string;

  constructor(public dialogRef: MatDialogRef<ConfirmCreatePicklistComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.info = this.data['Data'];
  }

  ngOnInit() {
    this.zoneCode = "";
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
  }
  initEvent() {
    this.zone['change'].subscribe({
      next: (value: any) => {
        this.zoneCode = value ? value['Code'] : ""
      }
    });
  }
  onCancelClick() {
    this.dialogRef.close(false);
  }
  onOkClick() {
    this.dialogRef.close({ZoneCode: this.zoneCode});
  }
}
