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

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../shared/toast.service';
import { Service } from '../../service';
import { Router, ActivatedRoute } from '@angular/router';
import { PointsComponent } from './../../points/component';
import { NotificationComponent } from '../../../components/notification/notification.component';

@Component({
  selector: 'app-so-auto-pickpack-details',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class SOAutoPickPackDetailsComponent implements OnInit {
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('appHistoryPickingTable', { static: false }) appHistoryPickingTable: ElementRef;
  @ViewChild('fromDate', { static: false }) fromDate: any;
  @ViewChild('toDate', { static: false }) toDate: any;

  pickListCode: string;
  allowCancelPicklist: boolean;
  data: any;
  tableConfig: any;
  tableHistoryPickingConfig: any;
  dataSourceGrid = {
    rows: <any>[],
    total: 0
  };
  tabIndexActive: string;

  constructor(
    public dialog: MatDialog,
    private service: Service,
    private activedRouter: ActivatedRoute,
    private translate: TranslateService,
    private router: Router,
    private toast: ToastService) { }

  ngOnInit() {
    this.allowCancelPicklist = false;
    this.pickListCode = this.activedRouter.snapshot.params['code'];
    this.data = {};
    this.initTable();
  }

  ngAfterViewInit() {
    this.loadDetails();
  }

  showConfirmCancel() {
    const dialogRef = this.dialog.open(NotificationComponent, {
      data: {
        message: `Bạn có chắc chắn muốn HỦY Picklist ${this.pickListCode}?`,
        type: 1
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cancelPicklist();
      }
    });
  }

  cancelPicklist() {
    this.service.cancelPicklist({
      "PickListCode": this.pickListCode
    })
      .subscribe((resp: any) => {
        if (resp.ErrorMessages && resp.ErrorMessages.length) {
          this.toast.error(resp.ErrorMessages[0], 'error_title');
        }
        else {
          this.loadDetails();
          this.toast.success(`Hủy Picklist ${this.pickListCode} thành công`, 'success_title');
        }
      })
  }

  parseData(pickListDetailData: any) {
    let data = pickListDetailData;
    data.StatusConfirm = this.translate.instant(`PickListConfirmSkip.${data.StatusConfirm}`);
    return data;
  }

  loadDetails() {
    this.service.loadPickListDetails(this.pickListCode)
      .subscribe((resp: any) => {
        let data = [];
        if (resp.Status) {
          data = this.parseData(resp.Data);
        } else {
          this.toast.error(`ERR`, 'error_title');
        }
        this.makeData(data);
      })
  }

  showPoints() {
    const dialogRef = this.dialog.open(PointsComponent, {
      data: {
        IsWholeBox: this.data['IsWholeBox'],
        SOCode: this.data['SOCode'],
        Code: this.data['PickListCode']
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDetails();
      }
    });
  }

  makeData(data: any) {
    this.allowCancelPicklist = (data['Status'] == "New" || data['Status'] == 'CompletedOnSystem');
    if (data.ConfirmPickingBy) {
      if (data.IsAllowSkipped == false) {
        data.StatusConfirm = `${this.translate.instant(`PickListConfirmSkip.ConfirmDone`)}`;
      }
      else {
        data.StatusConfirm = `${this.translate.instant(`PickListConfirmSkip.ConfirmPickAgain`)}`;
      }
    }
    this.data = data;
    this.appTable['renderData'](data.Details || []);
    this.appHistoryPickingTable['renderData'](data.HistoryPicking || []);
  }

  initTable() {
    this.tableConfig = {
      disablePagination: false,
      columns: {
        isContextMenu: false,
        displayedColumns: [
          "index", "SKU", "Qty", "Uom", "PickedQty", "BIN", "SubLocationLabel", "IsSkipped", "SkipQty"
        ],
        options: [
          {
            title: 'AutoPickPack.SKU',
            name: 'SKU'
          },
          {
            title: 'AutoPickPack.Barcode',
            name: 'Barcode'
          },
          {
            title: 'AutoPickPack.Qty',
            name: 'Qty'
          },
          {
            title: 'AutoPickPack.Uom',
            name: 'Uom'
          },
          {
            title: 'AutoPickPack.BIN',
            name: 'BIN'
          },
          {
            title: 'AutoPickPack.SubLocationLabel',
            name: 'SubLocationLabel'
          },
          {
            title: 'AutoPickPack.PickedQty',
            name: 'PickedQty'
          },
          {
            title: 'note',
            name: 'IsSkipped',
            render: (data: any) => {
              return data.IsSkipped ? 'Lấy thiếu hàng' : '';
            }
          },
          {
            title: 'AutoPicking.SkipQty',
            name: 'SkipQty',
            render: (data: any) => {
              return data.IsSkipped ? (data.Qty - data.PickedQty)  : '';
            }
          }
        ]
      },
      data: this.dataSourceGrid
    };
    this.tableHistoryPickingConfig = {
      disablePagination: false,
      columns: {
        isContextMenu: false,
        displayedColumns: [
          "index", "SKU", "ProductBarcode", "Uom", "Qty", "PickedLocationLabel", "SrcLocationLabel"],
        options: [
          {
            title: 'AutoPickPack.SKU',
            name: 'SKU'
          },
          {
            title: 'AutoPickPack.Barcode',
            name: 'ProductBarcode',
            render: (row: any) => {
              return row.Barcode || row.ProductBarcode;
            }
          },
          {
            title: 'AutoPickPack.Uom',
            name: 'Uom'
          },
          {
            title: 'AutoPickPack.PickedQty',
            name: 'Qty'
          },
          {
            title: 'AutoPickPack.BIN',
            name: 'PickedLocationLabel'
          },
          {
            title: 'AutoPickPack.SubLocationLabel',
            name: 'SrcLocationLabel'
          }
        ]
      },
      data: this.dataSourceGrid
    };
  }
  goToBack() {
    this.router.navigate([`/${window.getRootPath()}/saleorder/auto-pickpack`])
  }
  exportExcel(event: any = {}) {
    let params = { Code: this.data.PickListCode };
    return this.service.exportPicklistDetail(params);
  }
}
