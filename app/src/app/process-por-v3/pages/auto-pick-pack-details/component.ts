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
import { PrintService } from '../../../shared/printService';
import { PICKUP_METHODS } from '../../../shared/constant';


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
  warehouseInfor: any;

  constructor(
    public dialog: MatDialog,
    private service: Service,
    private activedRouter: ActivatedRoute,
    private translate: TranslateService,
    private router: Router,
    private printService: PrintService,
    private toast: ToastService) { }

  ngOnInit() {
    this.allowCancelPicklist = false;
    this.pickListCode = this.activedRouter.snapshot.params['code'];
    this.data = {};
    this.initTable();
    this.warehouseInfor = JSON.parse(window.localStorage.getItem('_info'));

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
    data.PickupMethod  = PICKUP_METHODS[data.PickupMethod || "FEFO"];
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
        data.StatusConfirm = `${this.translate.instant(`PickListConfirmSkip.ConfirmPickAgain`)} (lần ${2 - data.RemainSkip})`;
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
          "index", "SKU", "Qty", "Uom", "PickedQty", "BIN", "SubLocationLabel"],
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
          "index", "SKU", "Barcode", "Uom", "Qty", "PickedLocationLabel", "SrcLocationLabel"],
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
    this.router.navigate([`/${window.getRootPath(true)}/por/auto-pickpack`])
  }
  exportExcel(event: any = {}) {
    let params = { Code: this.data.PickListCode };
    return this.service.exportPicklistDetail(params);
  }

  printPickingList(data: any = {}) {
    const printer = window.localStorage.getItem("_printer");
    if (!printer) {
      this.toast.error(`Vui lòng chọn máy in`, 'error_title');
      return;
    }
    if (this.data && this.data.PickListCode) {
      this.service.getPickingListPrint({ 
        Codes: this.data.PickListCode,
        IsPrint: true,
        LogPrintRequest: true,
        RequestBy: this.warehouseInfor && this.warehouseInfor.DisplayName ? this.warehouseInfor.DisplayName : "",
        PrintDocument: "printPickingList"
       })
        .subscribe((resp: any) => {
          if (resp.Data) {
            this.printMultilPickList(resp.Data, printer);
          }
        });
    }
  }
  async printMultilPickList(listData: any = [], printer: string ) {
    const dataPrint = this.printService.repairMultilPickList(listData, this.data.PickListCode);
    let printRS = null;
    if (printer == 'InTrucTiep') {
      printRS = await this.printService.sendToSmartPrintV1(dataPrint);
    } else {
      printRS = await this.printService.sendToSmartPrintV2(dataPrint, dataPrint.keygen, printer);
    }
    if (printRS) {
      this.toast.success(`In ${dataPrint.label} cho ${listData.length} danh sách lấy hàng thành công`, 'success_title');
    } else {
      this.toast.error(`In ${dataPrint.label} thất bại`, 'error_title');
    }
  }
  printPickingListEven(data: any = {}) {
    const printer = window.localStorage.getItem("_printer");
    if (!printer) {
      this.toast.error(`Vui lòng chọn máy in`, 'error_title');
      return;
    }
    if (this.data && this.data.PickListCode) {
      this.service.getPickingListEvenPrint({ 
        Codes: this.data.PickListCode,
        IsPrint: true,
        LogPrintRequest: true,
        RequestBy: this.warehouseInfor && this.warehouseInfor.DisplayName ? this.warehouseInfor.DisplayName : "",
        PrintDocument: "printPickingListEven"
      })
        .subscribe((resp: any) => {
          if (resp.Data) {
            const dataPrint = this.printService.repairMultiDataLabel50mm_100mm(resp.Data);
            if (printer == 'InTrucTiep') {
              this.printService.sendToSmartPrintV1(dataPrint);
            } else {
              this.printService.sendToSmartPrintV2(dataPrint, dataPrint.keygen, printer);
            }
            this.toast.success(`In label: thành công !`, 'success_title');
          }
        });
    }
  }
  exportPickingList(data: any = {}) {
    if (this.data && this.data.PickListCode) {
      return this.service.exportPickingListPrint({ Codes: this.data.PickListCode });
    }
  };
}
