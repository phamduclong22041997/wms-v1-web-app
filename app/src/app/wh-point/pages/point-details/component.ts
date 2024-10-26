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

import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Service } from '../../service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../shared/toast.service';
import { PrintService } from '../../../shared/printService';

@Component({
  selector: 'app-po-receive-pallet',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class PointDetailComponent implements OnInit, AfterViewInit {
  @ViewChild('appTable', { static: false }) appTable: ElementRef;

  tableConfig: any;
  code: string;
  type: string;
  data: any = {}

  dataSourceGrid = {
    rows: <any>[],
    total: 0
  };
  dataChecked: [];
  enablePrint: boolean = false;

  constructor(
    public dialog: MatDialog,
    private service: Service,
    private router: Router,
    private toast: ToastService,
    private printService: PrintService,
    private route: ActivatedRoute) {
    this.code = this.route.snapshot.params.code;
  }

  ngOnInit() {
    // this.initTable();
    this.loadDetails();
  }

  ngAfterViewInit() { }

  resetPage() {
    if (!this.code) {
      window.location.reload();
    } else {
      this.router.navigate([`/${window.getRootPath()}/purchaseorder/receive-pallet`]);
    }
  }
  loadDetails() {
    this.service.getDetails(this.code)
      .subscribe((resp: any) => {
        let data = {};
        if (resp.Status) {
          data = resp.Data;
        }
        this.type = data['Type'];
        this.data = data;
        this.initTable();
        setTimeout(() => {
          if (this.appTable) {
            this.appTable['renderData'](data['Details'] || []);
          }
        }, 500)
      })
  }
  initTable() {
    let columns: any = {}
    if (this.data['Type'] === 'PackagingStorage') {
      columns = {
        isContextMenu: false,
        displayedColumns: [
          'index', 'PickListCode', 'SOCode', 'PackageNo', 'SKUName', 'SKU', 'Barcode', 'Qty', 'Uom', 'PackedBy', 'PackedDate'],
        options: [
          {
            title: 'Point.PickListCode',
            name: 'PickListCode',
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/saleorder/auto-pickpack/${data.PickListCode}`;
            }
          },
          {
            title: 'Point.SOCode',
            name: 'SOCode',
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/saleorder/details/${data.SOCode}`;
            }
          },
          {
            title: 'Point.PackageNo',
            name: 'PackageNo',
            style: {
              'min-width': '130px',
              'max-width': '130px'
            }
          },
          {
            title: 'Point.SKU',
            name: 'SKU',
            style: {
              'min-width': '100px',
              'max-width': '100px'
            }
          },
          {
            title: 'Point.SKUName',
            name: 'SKUName',
            style: {
              'min-width': '200px'
            }
          },
          {
            title: 'Point.Barcode',
            name: 'Barcode'
          },
          {
            title: 'Point.Qty',
            name: 'Qty'
          },
          {
            title: 'Point.Uom',
            name: 'Uom'
          },
          {
            title: 'Point.PackedBy',
            name: 'PackedBy'
          },
          {
            title: 'Point.PackedDate',
            name: 'PackedDate'
          }
        ]
      }
    } else {
      columns = {
        isContextMenu: false,
        displayedColumns: [
          'index', 'SKU', 'SKUName', 'Barcode', 'Availabel', 'Stock', 'PendingOutQty', 'Uom', 'ExpiredDate', 'SubLocationLabel', 'LotNumber'],
        options: [
          {
            title: 'Point.SKU',
            name: 'SKU',
            style: {
              'min-width': '100px',
              'max-width': '100px'
            }
          },
          {
            title: 'Point.SKUName',
            name: 'SKUName',
            style: {
              'min-width': '200px'
            }
          },
          {
            title: 'Point.Barcode',
            name: 'Barcode',
            style: {
              'min-width': '150px',
              'max-width': '150px'
            }
          },
          {
            title: 'Point.Stock',
            name: 'Stock'
          },
          {
            title: 'Point.PendingOutQty',
            name: 'PendingOutQty'
          },
          {
            title: 'Point.Availabel',
            name: 'Availabel'
          },
          {
            title: 'Point.Uom',
            name: 'Uom'
          },
          {
            title: 'Point.ExpiredDate',
            name: 'ExpiredDate',
            render: (row: any) => {
              return row['ExpiredDate'] != 'Invalid date' ? row['ExpiredDate']: "";
            },
            style:{
              'min-width': '90px',
              'max-width': '90px'
            }
          },
          {
            title: 'Point.Pallet',
            name: 'SubLocationLabel'
          },
          {
            title: 'LotNumber',
            name: 'LotNumber',
            render: (row: any) => {
              return row['LotNumber'] || "N/A"
            }
          }
        ]
      }
    }


    this.tableConfig = {
      style: {
        'overflow-x': 'hidden'
      },
      // disablePagination: true,
      hoverContentText: "Vị trí lưu trữ rỗng",
      columns: columns,
      data: this.dataSourceGrid
    };

  }
  async timer(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async doPrintListLabel(data: any, printer: String) {
    const rsPrintLabel = {
      success: 0,
      fail: 0
    }
    const dataPrint = this.printService.repairMultiDataLabel(data);
    let printRS = null;
      if (printer == 'InTrucTiep') {
        printRS = await this.printService.sendToSmartPrintV1(dataPrint);
      } else {
        printRS = await this.printService.sendToSmartPrintV2(dataPrint, dataPrint.keygen, printer);
      }
      printRS ? rsPrintLabel.success++ : rsPrintLabel.fail++
    return rsPrintLabel;
  }

  async downloadPointDetails(event: any) {
    return this.service.exportPointDetail({
      Code: this.data.Code
    });
  }

  async printPointDetails(event: any) {
    this.service.getPointDetails(this.code)
      .subscribe((resp: any) => {
        if (resp.Status) {
          this.dataChecked = resp.Data;
          this.enablePrint = true;
          this.toast.success(`Đã kiểm hàng và cập nhật số thùng thành công cho ${resp.Data.length} đơn hàng.`, 'success_title');
          // this.handlePrintPointDetailsAndLabel(data, true);
        }
        else {
          this.toast.error("Danh sách SO trong điểm tập kết đã xử lý dán nhãn.", "error_title");
        }
      })
  }
  async handlePrintPointDetailsAndLabel(data: any, label = true) {
    const printer = window.localStorage.getItem("_printer");
    if (!printer) {
      this.toast.error(`Vui lòng chọn máy in`, 'error_title');
      return;
    }
    await this.doPrintPointDetails(data, printer);
    await this.doPrintAllLabel(data, printer);
  }
  async doPrintAllLabel(_data: any, printer = "") {
    const data = _data ? _data : this.dataChecked;
    if (!data || data.length === 0) {
      this.toast.error(`Không có đơn hàng kiểm`, 'error_title');
      return;
    }
    if (!printer || printer.length == 0) {
      printer = window.localStorage.getItem("_printer");
      if (!printer) {
        this.toast.error(`Vui lòng chọn máy in`, 'error_title');
        return;
      }
    }
    let totalLabel = 0;
    for (const _so of data) {
      totalLabel += _so.TotalPackage;
    }
    if (totalLabel == 0) {
      this.toast.info(`Tổng số kiện hàng bằng 0, vui lòng cập nhật kiện hàng`, 'error_title');
      return;
    }
    this.toast.info(`Đang tiến hành in nhãn cho ${data.length} đơn hàng`, 'success_title');
    const rsPrintLabel = await this.doPrintListLabel(data, printer);
    if (rsPrintLabel.success > 0) {
      this.toast.success(`In label: thành công: ${data.length} đơn hàng`, 'success_title');
    } else {
      this.toast.error(`In label thất bại: ${data.length} đơn hàng`, 'error_title');
    }
  }
  async doPrintPointDetails(_data: any, printer = "") {
    const data = _data ? _data : this.dataChecked;
    if (!data || data.length === 0) {
      this.toast.error(`Không có đơn hàng kiểm`, 'error_title');
      return;
    }
    if (!printer || printer.length == 0) {
      printer = window.localStorage.getItem("_printer");
      if (!printer) {
        this.toast.error(`Vui lòng chọn máy in`, 'error_title');
        return;
      }
    }
    const dataPrint = this.repairdata(data);
    let rsPrint = null;
    if (printer == 'InTrucTiep') {
      rsPrint = await this.printService.sendToSmartPrintV1(dataPrint);
    } else {
      rsPrint = await this.printService.sendToSmartPrintV2(dataPrint, dataPrint.data.PointCode, printer);
    }
    if (rsPrint) {
      this.toast.success(`In ${dataPrint.label} : ${dataPrint.data.PointCode} thành công`, 'success_title');
    } else {
      this.toast.error(`In ${dataPrint.label} ${dataPrint.data.PointCode} thất bại`, 'error_title');
    }
  }

  repairdata(data: any) {
    const dataPrint = {
      "label": "danh sách đơn hàng kiểm tại vị trí lưu trữ",
      "printer_name": "PrinterPaper",
      "printer": 'PrinterPaper',
      "printerDefault": "PrinterPointSummary",
      "template": 'PointSummary_V2',
      "options": { "Orientation": "portrait" },
      "data": null,
      "url": ""
    }
    const _dataPrint = {}
    _dataPrint['PointCode'] = data[0]['GatheredPoint'] || "";
    for (let saleorder of data) {
      saleorder['SumQty'] = 0;
      saleorder['SumQtyByCase'] = 0;
      for (let detail of saleorder.Details) {
        saleorder['SumQty'] += (parseInt(detail.Qty) > 0) ? parseInt(detail.Qty) : 0;
        saleorder['SumQtyByCase'] += detail.QtyByCase > 0 ? Math.ceil(detail.QtyByCase) : 0;
        detail.Qty = this.printService.formatNumber(detail.Qty, 1, ".", ",");
        detail.QtyByCase = this.printService.formatNumber(Math.ceil(detail.QtyByCase), 1, ".", ",");
      }
      saleorder['SumQty'] = saleorder['SumQty'] > 0 ? this.printService.formatNumber(saleorder['SumQty'], 1, ".", ",") : null;
      saleorder['SumQtyByCase'] = saleorder['SumQtyByCase'] > 0 ? this.printService.formatNumber(saleorder['SumQtyByCase'], 1, ".", ",") : null;
    }
    const warehouseInfor = JSON.parse(window.localStorage.getItem('_info'));
    _dataPrint['AccountId'] = warehouseInfor && warehouseInfor.Id ? warehouseInfor.Id : "";
    _dataPrint['WarehouseName'] = warehouseInfor && warehouseInfor.SiteInfo && warehouseInfor.SiteInfo.Name || "";
    _dataPrint['WarehouseAddress'] = warehouseInfor && warehouseInfor.SiteInfo && warehouseInfor.SiteInfo.Contact.Address || "";
    _dataPrint['WarehouseContact'] = warehouseInfor && warehouseInfor.SiteInfo && warehouseInfor.SiteInfo.Contact.ContactName || "";
    _dataPrint['WarehousePhone'] = warehouseInfor && warehouseInfor.SiteInfo && warehouseInfor.SiteInfo.Contact.ContactPhone || "";
    _dataPrint['ListSO'] = data;
    dataPrint.data = _dataPrint;
    return dataPrint;
  }
  goToBackList(event: any = null) {
    this.router.navigate([`/${window.getRootPath()}/points`]);
  }
}
