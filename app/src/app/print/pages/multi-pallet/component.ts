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

import { DEVICE_TYPE } from '../../../shared/constant';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Service } from '../../service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmExportComponent } from '../../confirm/component';
import { ToastService } from '../../../shared/toast.service';
import { PrintService } from '../../../shared/printService';
import { Workbook } from 'exceljs';
import * as moment from 'moment';
import * as fs from 'file-saver';
import { Utils } from "../../../shared/utils";

@Component({
  selector: 'app-transport-devices',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})

export class PrintMultiDeviceComponent implements OnInit, AfterViewInit {
  tableConfig: any;
  warehouseConfig: Object;
  typeConfig: Object;
  setConfig: Object;
  filters: Object;
  isShowPrint: boolean;
  data: any[];
  loadCodes: string;
  loadTypeCode: string;
  isShowLoadPrint: boolean;
  tabIndexActive: string;

  @ViewChild('inputNumber', { static: false }) inputNumber: ElementRef;
  @ViewChild('loadInputCode', { static: false }) loadInputCode: ElementRef;
  @ViewChild('WarehouseCode', { static: false }) WarehouseCode: any;
  @ViewChild('type', { static: false }) type: any;
  @ViewChild('loadtype', { static: false }) loadtype: any;
  @ViewChild('set', { static: false }) set: any;
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('appPrintTable', { static: false }) appPrintTable: ElementRef;

  constructor(
    private translate: TranslateService,
    private service: Service, private toast: ToastService,
    private printService: PrintService,
    private route: ActivatedRoute,
    public dialog: MatDialog,) {
    const fragment: string = route.snapshot.fragment;
    switch (fragment) {
      case "print":
        this.tabIndexActive = "1";
        break;
      default:
        this.tabIndexActive = "0";
        break;
    }
  }

  ngOnInit() {
    this.isShowPrint = false;
    this.isShowLoadPrint = false;
    this.loadCodes = ""
    this.loadTypeCode = "";
    this.data = [];
    this.filters = {
      inputNumber: '',
      WarehouseCode: window.localStorage.getItem('_warehouse') || '',
      Type: '',
      Keygen: ''
    };
    this.initTable();
    this.initData();
  }

  initData() {
    let deviceType = [
      { Code: DEVICE_TYPE.Pallet, Name: 'Pallet' },
      { Code: DEVICE_TYPE.Tote, Name: 'Tote' }
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

  initTable() {
    this.tableConfig = {
      style: {
        'overflow-x': 'hidden'
      },
      columns: {
        isContextMenu: false,
        displayedColumns: [
          'index',
          'Code',
          'Status',
          'PrintStatus'
        ],
        options: [
          {
            title: 'Print.TransportDevice',
            name: 'Code',
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/transport-device/${data.Code}`;
            }
          },
          {
            title: 'Point.Status',
            name: 'Status',

          },
          {
            title: 'Point.PrintStatus',
            name: 'PrintStatus',

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
    this.type['change'].subscribe({
      next: (value: any) => {
        this.filters['Type'] = value ? value.Code : '';
      }
    })

    this.loadtype['change'].subscribe({
      next: (value: any) => {
        this.loadTypeCode = value ? value.Code : '';
      }
    })
  }

  create(event: any) {
    this.service.createMultiDevice(this.filters)
      .subscribe(res => {
        if (res.Status) {
          let results = [];
          for (let p of res.Data) {
            results.push({
              Code: p.Code,
              Status: p.Status,
              Type: p.Type,
              WarehouseCode: p.WarehouseCode
            })
          }
          this.data = results;
          this.appTable['renderData'](results);
          this.isShowPrint = true;
        } else {
          this.toast.error(res.ErrorMessages, 'error_title');
        }
      });
  }
  loadPrint(event: any) {
    let codes = this.loadCodes.trim();
    this.loadCodes = Utils.formatFilterContent(codes);
    if (codes && codes.length < 10) {
      this.toast.error(`Print.ERR01`, 'error_title');
    }
    else {
      this.getTransportDevice();
    }
  }
  onShowConfirm(event: any) {
    let type = this.filters['Type'];
    let number = this.filters['inputNumber'];
    if (number > 150) {
      this.toast.error(`Print.ERR03`, 'error_title');
      return;
    }
    else if (!type) {
      this.toast.error(`Print.ERR02`, 'error_title');
    }
    else {
      const messageConfirmCreate = { message: 'Print.Msg01' };
      this.showConfirm(messageConfirmCreate);
    }
  }
  showConfirm(data: any) {
    const dialogRef = this.dialog.open(ConfirmExportComponent, {
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.create(result);
      }
    });
  }
  printCreate() {
    let codes = this.data.map(x => x.Code);
    console.log('Print create');
    this.executePrint(codes, this.filters['Type']);
  }

  printCodes() {
    if (!this.loadCodes.trim()) {
      this.toast.error(`Print.ERR01`, 'error_title');
    }
    else if (!this.loadTypeCode) {
      this.toast.error(`Print.ERR02`, 'error_title');
    }
    else {
      let codes = this.loadCodes.trim().split(',');
      console.log('Print load');
      this.executePrint(codes, this.loadTypeCode);
    }
  }

  numberOnly(event): boolean {
    if (this.filters['inputNumber'] > 150) {
      this.filters['inputNumber'] = 150;
      event.preventDefault();
      return false;
    }
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;

  }
  async executePrint(codes: any, type: String) {
    const printer = window.localStorage.getItem("_printer");
    if (!printer) {
      this.toast.error(`Vui lòng chọn máy in`, 'error_title');
      return;
    }
    this.toast.info(`Đang tiến hành in ${codes.length} thiết bị`, 'success_title');
    const rs = await this.handlePrintListCode(codes, printer, type);
    if (rs.success > 0) this.toast.success(`In thành công cho ${codes.length} thiết bị `, 'success_title');
  }
  async timer(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async handlePrintListCode(codes: any, printer: String, type: String) {
    const rs = {
      success: 0,
      fail: 0,
      data: []
    };
    const dataPrint = this.printService.repairMultiDataPalletorTote(codes, type);
    const resultPrint = await this.printPalletCode(dataPrint, dataPrint.keygen, printer);
    resultPrint ? rs.success++ : rs.fail++;
    return rs;
  }
  repairMultiDataPalletorTote(codes = [], type: String) {
    const dataPrint = {
      "label": type,
      "printer_name": type == "Pallet" ? "PrinterPaper" : "PrinterLabel",
      "printer": type == "Pallet" ? "PrinterPaper" : "PrinterLabel",
      "printerDefault": type == "Pallet" ? "HungYenPallet" : "MultiPallet",
      "template": type == "Pallet" ? "HungYenPallet" : "MultiPallet",
      "options": { "Orientation": "portrait" },
      "data": null,
      "url": "",
      "keygen": codes.map(code => code).join(',')
    }
    let Rows = []
    for (let _code of codes) {
      let code = _code;
      Rows.push({
        PalletCode: code
      })
    }
    dataPrint.data = {
      Rows
    };
    return dataPrint;
  }
  async printPalletCode(dataPrint: any, keyCode: String, printer: String) {
    if (!printer || printer === 'InTrucTiep') {
      return await this.printService.sendToSmartPrintV1(dataPrint);
    } else {
      return await this.printService.sendToSmartPrintV2(dataPrint, keyCode, printer);
    }
  }

  exportExcel() {
    if (this.data && this.data.length) {
      let workbook = new Workbook();
      let worksheet = workbook.addWorksheet("data");
      let whcode = this.data[0].WarehouseCode;
      worksheet.addRow([
        'WarehouseCode',
        'Code',
        'Type',
        'Status'
      ]);
      this.data.forEach((item: any) => {
        worksheet.addRow([
          item['WarehouseCode'] || '',
          item['Code'] || '',
          item['Type'] || '',
          item['Status'] || ''
        ]);
      });
      worksheet.getColumn(1).width = 15;
      worksheet.getColumn(2).width = 15;
      worksheet.getColumn(3).width = 10;
      worksheet.getColumn(4).width = 15;
      //
      workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        fs.saveAs(
          blob,
          `List_Transport_${whcode}_${moment(new Date()).format("YYYYMMDDHHmmss")}.xlsx`
        );
      });
    } else {
      this.toast.error("ERROR.SPE020", "error_title");
    }
    ;
  }

  getTransportDevice() {
    let filters = {
      Codes: this.loadCodes,
      Type: this.loadTypeCode
    };
    this.service.getTransportDevice(filters)
      .subscribe(res => {
        if (res.Status) {
          if (res.Data && res.Data.length > 0) {
            this.appPrintTable['renderData'](res.Data);
            this.isShowLoadPrint = true;
          }
          else {
            this.appPrintTable['renderData']([]);
            this.isShowLoadPrint = false;
          }
        }
        else {
          this.isShowLoadPrint = false;
        }
      });
  }
}