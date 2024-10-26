/*
 * @copyright
 * Copyright (c) 2023 OVTeam
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

import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-po-pallet',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class POPalletComponent implements OnInit, AfterViewInit {
  @ViewChild('labels', { static: false }) labels: any;

  specification: string;
  specificationConfig: any;

  constructor(public dialogRef: MatDialogRef<POPalletComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (this.data && this.data['Data']) {
      this.specification = this.data['Data']["Specification"] || "";
    }
  }

  ngOnInit() {
    this.initData();
  }

  ngAfterViewInit() {
    this.initEvent();
  }

  initData() {
    this.specificationConfig = {
      selectedFirst: true,
      isSelectedAll: false,
      filters: {
        Collection: 'SFT.Specification',
        Column: 'Type',
        Version: "SFT1"
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
    };
  }

  initEvent() {
    this.labels['change'].subscribe({
      next: (value: any) => {
        this.specification = value && value["Code"] ? value["Code"] : "";
      }
    });
  }

  onCancelClick() {
    this.dialogRef.close(false);
  }

  onOkClick() {
    if (this.specification) {
      this.dialogRef.close(this.specification.toLocaleUpperCase());
    }
  }
  onEnter() {
    this.onOkClick()
  }
  onChange() { }
}