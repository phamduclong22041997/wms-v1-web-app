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
  selector: 'app-select-product',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class SelectProductComponent implements OnInit, AfterViewInit {
  @ViewChild('product', { static: false }) product: any;

  productConfig: any;
  products: any;
  selectedSKU: string;

  constructor(public dialogRef: MatDialogRef<SelectProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.products = [];
    if (this.data && this.data['Data']) {
      this.products = this.data['Data'].Products;
    }
  }

  ngOnInit() {
    this.initData();
  }

  ngAfterViewInit() {
    this.initEvent();
  }

  initData() {
    this.productConfig = {
      selectedFirst: true,
      isSelectedAll: false,
      val: (option: any) => {
        return option['SKU'];
      },
      render: (option: any) => {
        return `${option['SKU']} - ${option['Name']}`;
      },
      type: 'autocomplete',
      filter_key: 'SKU',
      data: this.products
    };
  }

  initEvent() {
    this.product['change'].subscribe({
      next: (value: any) => {
        this.selectedSKU = value && value["SKU"] ? value["SKU"] : "";
      }
    });
  }

  onCancelClick() {
    this.dialogRef.close(false);
  }

  onOkClick() {
    if (this.selectedSKU) {
      this.dialogRef.close(this.selectedSKU);
    }
  }
  onEnter() {
    this.onOkClick()
  }
  onChange() { }
}