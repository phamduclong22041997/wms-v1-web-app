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

import { Component, OnInit, Inject, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastService } from './../../shared/toast.service';
import { Service } from './../service';

interface TableAction {
  name: string,
  icon: string;
  class?: string;
  toolTip?: any;
  actionName?: any;
  disabledCondition?: any;
}
@Component({
  selector: 'app-dock-pallet',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class DockPalletComponent implements OnInit, AfterViewInit {
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('points', { static: false }) points: ElementRef;
  @ViewChild('content', { static: false }) content: ElementRef;

  readonlyLocation: Boolean;
  pointsConfig: any;
  locationCode: String;
  allowSave: boolean;
  type: String;
  tableConfig: any;

  constructor(
    public dialogRef: MatDialogRef<DockPalletComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: Service,
    private toast: ToastService,
  ) { }

  ngOnInit() {
    this.type = this.data['Type'] || "point";
    this.locationCode = this.data['LocationCode'] || "";
    this.readonlyLocation = this.data['LocationCode'] != undefined;
    this.init();
    this.initTable();
  }

  ngAfterViewInit() {
    this.initEvent();
  }

  init() {
    this.allowSave = false;
    this.pointsConfig = {
      selectedFirst: false,
      isSelectedAll: false,
      isSorting: false,
      readonly: this.data['LocationCode'] != undefined,
      disableAutoload: this.data['LocationCode'] != undefined,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return `${option['Code']}`;
      },
      defaultValue: this.locationCode || "",
      type: 'autocomplete',
      filter_key: 'Name',
      filters: {
        Type: "Pickable,UnPickable"
      },
      URL_CODE: this.type == "point" ? 'SFT.pointscombo' : 'SFT.binscombo'
    }
  }

  initTableAction(): TableAction[] {
    return [
      {
        icon: "clear",
        name: 'remove-item',
        class: 'ac-remove',
        toolTip: {
          name: "Loại bỏ đơn hàng xuất",
        },
        disabledCondition: (row: any) => {
          return true;
        }
      }
    ];
  }

  dockPallet() {
    if (!this.locationCode) {
      this.toast.error('TransportDevice.ErrorLocationCode', 'error_title');
      return;
    }
    if (!this.allowSave) {
      return;
    }
    let selectedList = [];
    // if (this.soCode === "") {
    let data = this.appTable['getData']()['data'];

    for (let item of data) {
      selectedList.push(item.Code);
    }

    if (!selectedList.length) {
      this.toast.error('TransportDevice.ErrorPAList', 'error_title');
      return;
    }

    let saveData = {
      PalletList: selectedList,
      LocationLabel: this.locationCode
    }
    if (this.type == 'point') {
      this.service.dockPalletUnderPoint(saveData)
        .subscribe((resp: any) => {
          if (resp.Status === true) {
            this.toast.success('Định vị pallet thành công.', 'success_title');
            this.onOkClick();
          } else if (resp.ErrorMessages && resp.ErrorMessages.length) {
            this.toast.error(resp.ErrorMessages[0], 'error_title');
          }
        })
    } else {
      this.service.dockPalletUnderBin(saveData)
        .subscribe((resp: any) => {
          if (resp.Status === true) {
            this.toast.success('Định vị pallet thành công.', 'success_title');
            this.onOkClick();
          } else if (resp.ErrorMessages && resp.ErrorMessages.length) {
            this.toast.error(resp.ErrorMessages[0], 'error_title');
          }
        })
    }
  }

  search(event: any) {
    let val = event.target.value;
    if (val) {
      let filters = {
        Type: "Pallet",
        Status: "Empty",
        TransportCode: val.trim()
      }
      this.appTable['search'](filters);
    }
    event.target.value = "";
  }

  initTable() {
    this.tableConfig = {
      enableFirstLoad: false,
      disablePagination: false,
      enableCollapse: false,
      rowSelected: false,
      style: {},
      pageSize: 5,
      columns: {
        actionTitle: "Thao tác",
        actions: this.initTableAction(),
        isContextMenu: false,
        displayedColumns: [
          'index', 'Code', 'CreatedDate', 'actions'
        ],
        options: [
          {
            title: 'TransportDevice.PalletCode',
            name: 'Code'
          },
          {
            title: 'TransportDevice.CreatedDate',
            name: 'CreatedDate'
          }
        ]
      },
      remote: {
        url: this.service.getAPI('palletList'),
        params: {
          filter: JSON.stringify({ Type: 'Pallet', Status: 'Empty' })
        }
      }
    };
  }

  removeRow(data: any) {
    this.appTable['removeRow'](data.index - 1);
    this.allowSave = this.appTable['getData']()['total'] > 0;
  }

  initEvent() {
    this.appTable['actionEvent'].subscribe({
      next: (event: any) => {
        if (event) {
          switch (event['action']) {
            case 'remove-item':
              this.removeRow(event['data']);
              break
            case 'loaded_data':
              this.checkAllowSave();
              break;
          }
        }
      }
    });

    this.points['change'].subscribe({
      next: (value: any) => {
        if (!this.data['LocationCode']) {
          this.locationCode = value ? value.Code : '';
          this.checkAllowSave();
        }
      }
    });
  }

  checkAllowSave() {
    let data = this.appTable['getData']();
    this.allowSave = data.total > 0 && this.locationCode != "";
  }

  onCancelClick() {
    this.dialogRef.close(false);
  }
  onOkClick() {
    this.dialogRef.close(true);
  }
}
