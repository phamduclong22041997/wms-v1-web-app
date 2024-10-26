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

import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Service } from '../../service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../shared/toast.service';
import { PrintService } from '../../../shared/printService';
import { Utils } from '../../../shared/utils';
import { NUMBERIC } from '../../../shared/constant';
import * as moment from 'moment-timezone';
import { ConfirmUpdateComponent } from './confirm/component';
import { ConfirmPrintLabelComponent } from './confirm-print/component';
import { NotificationComponent } from '../../../components/notification/notification.component';
const timezone = "Asia/Ho_Chi_Minh";
const _ = require('lodash');
import * as fs from 'file-saver';
interface TableAction {
  icon: string;
  class?: string;
  name?: String;
  toolTip?: any;
  actionName?: any;
  disabledCondition?: any;
}

@Component({
  selector: 'app-so-handover',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})

export class PrintSOHandoverComponent implements OnInit, AfterViewInit {
  tableConfig: any;
  filters: Object;
  data: any[];
  isShowPrint: boolean;
  isShowSort: boolean;
  typeConfig: Object;
  filterSort: Object;


  @ViewChild('inputNumber', { static: false }) inputNumber: ElementRef;
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('typeSort', { static: false }) typeSort: ElementRef;

  constructor(
    private translate: TranslateService,
    private service: Service, private toast: ToastService,
    private printService: PrintService,
    private route: ActivatedRoute,
    public dialog: MatDialog,) {
  }

  ngOnInit() {
    this.isShowPrint = false;
    this.isShowSort = false;
    this.data = [];
    this.filters = {
      Code: '',
      WarehouseCode: window.localStorage.getItem('_warehouse') || ''
    };
    this.filterSort = {};
    this.initTable();
    this.initData();
    this.initCombobox();
  }
  initCombobox() {
    let deviceType = [
      { Code: 'SOCode', Name: 'Mã SO' },
      { Code: 'ExternalCode', Name: 'Mã tham khảo' },
      { Code: 'SiteId', Name: 'Cửa hàng' },
      { Code: 'GatheredPoint', Name: 'Mã vị trí' },
      { Code: 'PickedToteCode', Name: 'Mã tote' },
    ];
    this.typeConfig = {
      selectedFirst: false,
      isSelectedAll: false,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Name'];
      },
      type: 'autocomplete',
      filter_key: 'Name',
      data: deviceType
    };
  }
  initData() {

  }
  initTableAction(): TableAction[] {
    return [
      // {
      //   icon: "grid_view",
      //   name: 'print-inventory',
      //   toolTip: {
      //     name: "Kiểm đếm số thùng",
      //   },
      //   class: "ac-task",
      //   disabledCondition: (row: any) => {
      //     return [
      //       "PickedAfterPacked",
      //       "StoredAfterPacked",
      //       "ReadyToShip"
      //     ].indexOf(row.Status) != -1 && row.TotalPackage <= 0;
      //   }
      // },
      {
        icon: "receipt",
        name: 'print-inventoryDelivery',
        toolTip: {
          name: "In Phiếu Xuất Kho",
        },
        class: "ac-task",
        disabledCondition: (row: any) => {
          return row.TotalPackage && [
            "DefinedStorageLocation",
            "PickingAfterPacked",
            "PickedAfterPacked",
            "StoredAfterPacked",
            "ReadyToShip",
            "CountedAndEnclosed"
          ].indexOf(row.Status) != -1;
        }
      },
      // {
      //   icon: "print",
      //   name: 'print-label',
      //   class: 'ac-finish-second',
      //   toolTip: {
      //     name: 'In Nhãn'
      //   },
      //   disabledCondition: (row: any) => {
      //     return row.TotalPackage && [
      //       "DefinedStorageLocation",
      //       "PickingAfterPacked",
      //       "PickedAfterPacked",
      //       "StoredAfterPacked",
      //       "ReadyToShip"
      //     ].indexOf(row.Status) != -1
      //   }
      // }
    ];
  }

  initTable() {
    this.tableConfig = {
      disablePagination: true,
      style: {
        'overflow-x': 'hidden'
      },
      columns: {
        isContextMenu: false,
        actions: this.initTableAction(),
        actionTitle: this.translate.instant('FinishPo.Action'),
        displayedColumns: [
          'index',
          'SOCode',
          'ExternalCode',
          'SiteId',
          'StoreName',
          'GatheredPoint',
          'PickedToteCode',
          'PackageNo',
          'TotalPackage',
          'TotalPackageEven',
          'TotalPackageOdd',
          'actions'
        ],
        options: [
          {
            title: 'Print.SOCode',
            name: 'SOCode',
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/saleorder/details/${data.SOCode}`;
            },
            style: {
              'min-width': '150px',
              'max-width': '150px'
            }
          },
          {
            title: 'Print.ExternalCode',
            name: 'ExternalCode',
            style: {
              'min-width': '120px',
              'max-width': '120px'
            }
          },
          {
            title: 'Print.SiteId',
            name: 'SiteId',
            style: {
              'min-width': '70px',
              'max-width': '70px'
            }
          },
          {
            title: 'Print.SiteName',
            name: 'StoreName'
          },
          {
            title: 'Print.GatheredPoint',
            name: 'GatheredPoint',
            style: {
              'min-width': '120px',
              'max-width': '120px'
            }
          },
          {
            title: 'Print.PickedToteCode',
            name: 'PickedToteCode',
            style: {
              'min-width': '120px',
              'max-width': '120px'
            }
          },
          {
            title: 'Print.PackageNo',
            name: 'PackageNo',
            style: {
              'min-width': '120px',
              'max-width': '120px'
            }
          },
          {
            title: 'Print.TotalPackage',
            name: 'TotalPackage',
            style: {
              'min-width': '60px',
              'max-width': '60px'
            },
            render(data: any) {
              return Math.ceil(data.TotalPackage)
            }
          },
          {
            title: 'Print.TotalPackageEven',
            name: 'TotalPackageEven',
            style: {
              'min-width': '60px',
              'max-width': '60px'
            },
            render(data: any) {
              return Math.ceil(data.TotalPackageEven)
            }
          },
          {
            title: 'Print.TotalPackageOdd',
            name: 'TotalPackageOdd',
            style: {
              'min-width': '50px',
              'max-width': '50px'
            }
          },
          {
            title: 'STO.SOStatus',
            name: 'Status',
            style: {
              'min-width': '50px',
              'max-width': '50px'
            }
          },
        ]
      },
      data: {
        rows: <any>[],
        total: 0
      }
    };
  }

  ngAfterViewInit() {
    this.initEvent();

    setTimeout(() => {
      if (this.inputNumber) this.inputNumber.nativeElement.focus();
    }, 200);

  }

  initEvent() {
    this.appTable['actionEvent'].subscribe({
      next: (event: any) => {
        if (!event) {
          return;
        }
        const action = event["action"];
        switch (action) {
          case 'print-inventoryDelivery':
            this.printInventoryDelivery(event.data);
            break;
          case 'print-label':
            this.printLabel(event.data);
            break;
          case 'print-inventory':
            this.updateTotalPackage(event.data);
            break;
        }
      }
    });
    this.typeSort['change'].subscribe({
      next: (value: any) => {
        if (value) {
          this.isShowSort = true;
          this.filterSort = value;
        } else {
          this.isShowSort = false;
          this.filterSort = {};
        }
      }
    });
  }
  onEnter(event: any) {
    let code = event.target['value'];
    this.filters['Code'] = code;
    this.search(null);
  }
  doSortListSO(event: any) {
    let code = this.filterSort['Code'].trim();
    if (code.length === 0) {
      this.toast.error(`Print.ERR01`, 'error_title');
      return;
    }
    let dataSort = this.data.sort(function (a, b) {
      const nameA = a[`${code}`].toUpperCase(); // ignore upper and lowercase
      const nameB = b[`${code}`].toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    this.appTable['renderData'](dataSort);
  }
  updateTotalPackage(data) {
    const dialogRef = this.dialog.open(ConfirmUpdateComponent, {
      disableClose: true,
      data: {
        title: this.translate.instant('Print.UpdateTotalPackage'),
        info: data,
        type: 1
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.confirmUpdateTotalPackage(result);
      }
    });
  }

  confirmUpdateTotalPackage(data) {
    if (data.TotalPackageOdd + data.TotalPackageEven > 0) {
      const dialogRef = this.dialog.open(NotificationComponent, {
        data: {
          message: `Bạn chắc chắn muốn cập nhật số Thùng của SO [${data.SOCode}]: ${data.TotalPackageEven + data.TotalPackageOdd} THÙNG. Bao gồm: ${data.TotalPackageEven} THÙNG CHẲN VÀ ${data.TotalPackageOdd} THÙNG LẺ?`,
          type: 1
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.service.updateTotalPackage(data).subscribe(res => {
            if (res.Status) {
              this.toast.success(this.translate.instant('Print.UpdateTotalPackageSuccess'), "success_title");
              this.search(null);
            }
          });
        }
      });
    }
    else {
      this.toast.error(this.translate.instant('Print.TotalPackageOddAndTotalPackageEvenNotZero'), 'error_title');
      return;
    }
  }

  async printPointSummary(event: any) {
    const printer = window.localStorage.getItem("_printer");
    if (!printer) {
      this.toast.error(`Vui lòng chọn máy in`, 'error_title');
      return;
    }
    const data = JSON.parse(JSON.stringify(this.data));
    await this.doPrintPointSummary(data, printer);
  }
  async printAllLabel(event: any) {
    const printer = window.localStorage.getItem("_printer");
    if (!printer) {
      this.toast.error(`Vui lòng chọn máy in`, 'error_title');
      return;
    }
    const data = JSON.parse(JSON.stringify(this.data));
    await this.doPrintAllLabel(data, printer);
  }
  async printSummaryInventoryDelivery(event: any) {
    const printer = window.localStorage.getItem("_printer");
    if (!printer) {
      this.toast.error(`Vui lòng chọn máy in`, 'error_title');
      return;
    }
    const data = JSON.parse(JSON.stringify(this.data));
    await this.doPrintSummaryInventoryDelivery(data, printer);
  }
  async doPrintSummaryInventoryDelivery(data: any, printer) {
    const dataPrint = this.repaireDataSumDelivery(data, printer);
    const rsPrint = await this.printService.sendToSmartPrintV2(dataPrint, dataPrint.data.PointCode, printer);
    if (rsPrint) {
      this.toast.success(`In ${dataPrint.label} : ${dataPrint.data.PointCode} thành công`, 'success_title');
    } else {
      this.toast.error(`In ${dataPrint.label} ${dataPrint.data.PointCode} thất bại`, 'error_title');
    }

  }
  repaireDataSumDelivery(data: any, printer: any) {
    const dataPrint = {
      "label": "Phiếu Kiểm Xuất Hàng",
      "printer_name": "PrinterPaper",
      "printer": 'PrinterPaper',
      "printerDefault": "SummaryInventoryDelivery",
      "template": 'SummaryInventoryDelivery',
      "options": { "Orientation": "portrait" },
      "data": null,
      "url": ""
    }
    const _dataPrint = {}
    _dataPrint['PointCode'] = data[0]['GatheredPoint'] || "";
    for (let saleorder of data) {
      saleorder['Details'] = saleorder.PickListDetailPacking;
      saleorder['SumQty'] = 0;
      saleorder['SumQtyByCase'] = 0;
      for (let detail of saleorder.Details) {
        detail.Qty = detail.PackedQty || 0;
        saleorder['SumQty'] += (parseInt(detail.Qty) > 0) ? parseInt(detail.Qty) : 0;
        saleorder['SumQtyByCase'] += detail.QtyByCase > 0 ? Math.ceil(detail.QtyByCase) : 0;
        detail.Qty = this.printService.formatNumber(detail.Qty, 1, ".", ",");
        detail.QtyByCase = this.printService.formatNumber(Math.ceil(detail.QtyByCase), 1, ".", ",");
      }
      saleorder['SumQty'] = saleorder['SumQty'] > 0 ? this.printService.formatNumber(saleorder['SumQty'], 1, ".", ",") : null;
      saleorder['SumQtyByCase'] = saleorder['SumQtyByCase'] > 0 ? this.printService.formatNumber(saleorder['SumQtyByCase'], 1, ".", ",") : null;
    }
    _dataPrint['ListSO'] = data;
    dataPrint.data = _dataPrint;
    return dataPrint;
  }
  mappingSKUForPackage(data: any) {
    const details = [];
    const listPackage = _.uniq(data.PickListDetailPackage.map(pkg => pkg.PackageNo));
    for (const pkg of listPackage) {
      let Packages = {}
      const fistSKU = data.PickListDetailPackage.find(sku => sku.PackageNo == pkg);
      Packages['PackageNo'] = pkg;
      Packages['PackageGroup'] = fistSKU ? fistSKU.PackageGroup : "";
      Packages['PackageDetail'] = data.PickListDetailPackage.filter(sku => sku.PackageNo == pkg);
      let _qty = 0;
      if (Packages['PackageDetail'].length) {
        for (let i in Packages['PackageDetail']) {
          _qty += Packages['PackageDetail'][i].BaseQty;
          Packages['PackageDetail'][i].BaseQty = this.printService.formatNumber((Packages['PackageDetail'][i].BaseQty), 1, ".", ",");
          // if(Packages['PackageDetail'][i].ScanUom !== Packages['PackageDetail'][i].BaseUom && Packages['PackageDetail'][i].ScanQty){
          //   Packages['PackageDetail'][i].BaseUom = Packages['PackageDetail'][i].ScanUom;
          // }
        }
      }
      Packages['Qty'] = this.printService.formatNumber(_qty, 1, ".", ",");
      details.push(Packages);
    }
    data['Details'] = details;
    data['PointCode'] = data.GatheredPoint || data.PointCode;
    data.IsPackingEven = listPackage.length == 1 ? 1 : 0
  }
  async printMultiInventoryDelivery(SOCode = "", type = '') {
    const printer = window.localStorage.getItem("_printer");
    if (!printer) {
      this.toast.error(`Vui lòng chọn máy in`, 'error_title');
      return;
    }
    if (!Array.isArray(this.data) || this.data.length === 0) {
      this.toast.error(`Lỗi dữ liệu, vui lòng tìm kiếm lại`, 'error_title');
      return;
    }
    const checked = this.checkDataBeforePrint(this.data);
    if (!checked.Status) {
      this.toast.error(`${checked.Message}`, 'error_title');
      return;
    }
    let dataPrint = null;
    let listSO = JSON.parse(JSON.stringify(this.data));
    if (SOCode && SOCode.length > 0) {
      listSO = listSO.filter(order => order.SOCode == SOCode)
    }
    for (let i in listSO) {
      this.mappingSKUForPackage(listSO[i])
    }
    const resultPrintAll = await Promise.all(_.chunk(listSO, 10).map(
      async (groupSO: []) => {
        dataPrint = this.printService.repairMultiInventoryDeliveryPacking(groupSO);
        let printRS = null;
        if(type =='pdf') {
          const pdfFile = await this.printService.getPDF(dataPrint);
          fs.saveAs(
            pdfFile,
            `Phieu_Xuat_Kho_${dataPrint.keygen}`
          );
        } else {
          if (printer == 'InTrucTiep') {
            printRS = await this.printService.sendToSmartPrintV1(dataPrint);
          } else {
            printRS = await this.printService.sendToSmartPrintV2(dataPrint, dataPrint.keygen, printer);
          }
        }
        await this.timer(1000);
        return printRS;
      }
    ))
    if (resultPrintAll.length > 0) {
      this.toast.success(`In ${dataPrint.label} cho ${listSO.length} đơn hàng thành công`, 'success_title');
    } else {
      this.toast.error(`In ${dataPrint.label} thất bại`, 'error_title');
    }
  }
  async printInventoryDelivery(data: any) {
    if (data.SOCode) {
      await this.printMultiInventoryDelivery(data.SOCode);
    }
  }
  async doPrintInventoryDelivery(listData = []) {
    const printer = window.localStorage.getItem("_printer");
    if (!printer) {
      this.toast.error(`Vui lòng chọn máy in`, 'error_title');
      return;
    }
    if (!Array.isArray(listData) || listData.length === 0) {
      this.toast.error(`Lỗi dữ liệu, vui lòng tìm kiếm lại`, 'error_title');
      return;
    }
    const dataPrint = this.printService.repairMultiInventoryDelivery(listData);
    const rsPrint = await this.printService.sendToSmartPrintV2(dataPrint, dataPrint.keygen, printer);
    if (rsPrint) {
      this.toast.success(`In ${dataPrint.label} cho ${listData.length} đơn hàng thành công`, 'success_title');
    } else {
      this.toast.error(`In ${dataPrint.label} thất bại`, 'error_title');
    }
  }
  formatNumber(val: number, fixed: any, thousand: any, percent: any) {
    if (val) {
      thousand = thousand || '.';
      percent = percent || ','
      let ret = (Math.round(val * 100) / 100).toFixed(fixed || 0);
      let r = parseFloat(ret);
      if (fixed) {
        return r.toString().replace(thousand, percent).replace(/\B(?=(\d{3})+(?!\d))/g, thousand);
      }
      return r.toString().replace(/\B(?=(\d{3})+(?!\d))/g, thousand);
    }
    return val;
  }
  async printLabel(_data: any) {
    const data = JSON.parse(JSON.stringify(_data))
    const printer = window.localStorage.getItem("_printer");
    if (!printer) {
      this.toast.error(`Vui lòng chọn máy in`, 'error_title');
      return;
    }
    let totalPackage = Math.ceil(data.TotalPackage);
    if (totalPackage == 0) {
      this.toast.error(`Số lượng kiện bằng 0`, 'error_title');
      return;
    }
    const dialogRef = this.dialog.open(ConfirmPrintLabelComponent, {
      disableClose: true,
      data: {
        title: this.translate.instant('Print.PrintLabelOption'),
        info: data,
        type: 1
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.doPrintListInputLabel(result, data, printer);
      }
    });

  }
  async doPrintListInputLabel(result: any, data: any, printer: string) {
    if ((result.EndPackage < result.StartPackage) || (result.EndPackage < 1) || (result.StartPackage < 1) || (result.EndPackage > data.TotalPackage) || (result.StartPackage > data.TotalPackage)) {
      this.toast.error(`Dữ liệu nhập vào chưa đúng`, 'error_title');
      return;
    }
    this.toast.info(`Đang tiến hành in ${(result.EndPackage - result.StartPackage + 1)} nhãn `, 'success_title');
    const dataPrint = this.repaireDataPrintListInputLabel(result, data);
    let rsPrintLabel = null;
    if (printer == 'InTrucTiep') {
      rsPrintLabel = await this.printService.sendToSmartPrintV1(dataPrint);
    } else {
      rsPrintLabel = await this.printService.sendToSmartPrintV2(dataPrint, dataPrint.keygen, printer);
    }
    if (rsPrintLabel > 0) {
      this.toast.success(`In ${dataPrint.label} : ${dataPrint.keygen} thành công`, 'success_title');
    } else {
      this.toast.error(`In ${dataPrint.label} thất bại: ${dataPrint.keygen}`, 'error_title');
    }
  }
  repaireDataPrintListInputLabel(result: any, order: any) {
    const dataPrint = {
      "label": "Nhãn vận chuyển",
      "printer_name": "PrinterLabel",
      "printer": 'PrinterLabel',
      "printerDefault": "ShippingLabelWinmart",
      "template": 'ShippingLabelWinmart',
      "options": { "Orientation": "portrait" },
      "data": null,
      "url": "",
      "keygen": order.SOCode
    }
    const Rows = []
    for (let i = result.StartPackage; i <= result.EndPackage; i++) {
      let data = {};
      data['ExternalCode'] = order.ExternalCode;
      data['SOCode'] = order.SOCode;
      data['PickedToteCode'] = order.PickedToteCode;
      data['StrPrintDate'] = moment(new Date()).tz(timezone).format("DD.MM.YYYY");
      data['SAP'] = order.SiteId || "";
      data['VendorName'] = order.StoreName || "";
      data['StringPackage'] = `${i}/${Math.ceil(order.TotalPackage)}` || "";
      data['GatheredPoint'] = order.GatheredPoint || order.PackedLocationLabel;
      Rows.push(data)
    }
    dataPrint.data = {
      Rows
    };
    return dataPrint;
  }
  search(event: any) {
    let codes = this.filters['Code'].trim();
    if (codes.length < 6) {
      this.toast.error(`Print.ERR01`, 'error_title');
    }
    else {
      console.log(codes);

      this.filters['Code'] = this.filters['Code'].trim().toUpperCase();
      this.loadData();
    }
  }
  loadData() {
    this.service.getSOForHandoverPrint(this.filters)
      .subscribe(res => {
        if (res.Status) {
          if (res.Data && res.Data.length > 0) {
            this.isShowPrint = true;
          } else {
            this.isShowPrint = false;
          }
          this.data = res.Data;
          this.appTable['renderData'](res.Data);
        } else {
          this.toast.error(res.ErrorMessages, 'error_title');
        }
      });
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
  async doPrintAllLabel(_data: any, printer: String) {
    const data = JSON.parse(JSON.stringify(_data));
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
      this.toast.error(`In label thất bại: ${data.length}`, 'error_title');
    }
  }
  checkDataBeforePrint(data = []) {
    const checked = {
      Status: true,
      Message: ""
    }
    // const listPoint = _.uniq(data.map(saleOrder => saleOrder.GatheredPoint));
    // if (listPoint.length != 1) {
    //   checked.Status = false;
    //   checked.Message = "Danh sách đơn hàng không cùng mã vị trí";
    //   return checked;
    // }
    const findZeroTotalPackage = data.filter(saleOrder => saleOrder.TotalPackage == 0)
    if (findZeroTotalPackage && findZeroTotalPackage.length > 0) {
      checked.Status = false;
      checked.Message = "Có đơn hàng chưa cập nhật số thùng/kiện"
    }
    return checked;
  }
  checkIsSamePoint(data: any[]) {
    const checked = {
      Status: true,
      Message: ""
    }
    const listPoint = _.uniq(data.map(saleOrder => saleOrder.GatheredPoint));
    if (listPoint.length != 1) {
      checked.Status = false;
      checked.Message = "Danh sách đơn hàng không cùng mã vị trí";
    }
    return checked;
  }
  async doPrintPointSummary(data: any, printer: String) {
    const checked = this.checkDataBeforePrint(data);
    if (!checked.Status) {
      this.toast.error(`${checked.Message}`, 'error_title');
      return;
    }
    const dataPrint = this.repairdataPointSummary(data);
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

  repairdataPointSummary(data: any) {
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
    let warehouse = null;
    for (let saleorder of data) {
      saleorder['SumQty'] = 0;
      saleorder['SumQtyByCase'] = 0;
      for (let detail of saleorder.Details) {
        saleorder['SumQty'] += (parseInt(detail.Qty) > 0) ? parseInt(detail.Qty) : 0;
        saleorder['SumQtyByCase'] += detail.QtyByCase > 0 ? Math.round(detail.QtyByCase * 100) / 100 : 0;
        detail.Qty = this.printService.formatNumber(detail.Qty, 1, ".", ",");
        detail.QtyByCase = detail.QtyByCase > 0 ? Math.round(detail.QtyByCase * 100) / 100 : 0;
      }
      saleorder['SumQty'] = saleorder['SumQty'] > 0 ? this.printService.formatNumber(saleorder['SumQty'], 1, ".", ",") : null;
      saleorder['SumQtyByCase'] = saleorder['SumQtyByCase'] > 0 ? this.printService.formatNumber(saleorder['SumQtyByCase'], 1, ".", ",") : null;
      if (!warehouse && saleorder.WarehouseInfo) {
        warehouse = saleorder.WarehouseInfo;
      }
    }
    const _info = JSON.parse(window.localStorage.getItem('_info'));
    _dataPrint['AccountId'] = _info && _info.Id ? _info.Id : "";
    if (warehouse) {
      _dataPrint['WarehouseName'] = warehouse.Name || "";
      _dataPrint['WarehouseAddress'] = warehouse.Address || "";
      _dataPrint['WarehouseContact'] = warehouse.ContactName || "";
      _dataPrint['WarehousePhone'] = warehouse.ContactPhone || "";
    }
    else {
      _dataPrint['WarehouseName'] = _info && _info.SiteInfo && _info.SiteInfo.Name || "";
      _dataPrint['WarehouseAddress'] = _info && _info.SiteInfo && _info.SiteInfo.Contact.Address || "";
      _dataPrint['WarehouseContact'] = _info && _info.SiteInfo && _info.SiteInfo.Contact.ContactName || "";
      _dataPrint['WarehousePhone'] = _info && _info.SiteInfo && _info.SiteInfo.Contact.ContactPhone || "";
    }
    _dataPrint['ListSO'] = data;
    dataPrint.data = _dataPrint;
    return dataPrint;
  }
  exportExcel(event: any) {
    let codes = this.filters['Code'].trim();
    if (codes.length < 6) {
      this.toast.error(`Print.ERR01`, 'error_title');
    }
    else {
      return this.service.exportSOForHandoverPrint(this.filters);
    }
  }
}