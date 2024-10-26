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
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../../shared/toast.service';
import { Service } from '../../service';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmPOReceiveComponent } from './confirm/component';
import { NotificationComponent } from '../../../components/notification/notification.component';
import { ScheduleComponent } from './schedule/component';
import * as CryptoJS from 'crypto-js';
import { confirmFinishPOSession } from '../po-details/confirm/component';
import { POPalletComponent } from './pallet/component';
import { SelectProductComponent } from './select-product/component';

interface TableAction {
  icon: string;
  class?: string;
  name?: String;
  toolTip?: any;
  actionName?: any;
  disabledCondition?: any;
}

@Component({
  selector: 'app-po-receive-pallet',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class POReceiptPalletComponent implements OnInit, AfterViewInit {
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('code', { static: false }) inputScan: ElementRef;

  isOnlyDC: boolean;

  code: string;
  fileUpload: any;
  nameFileUpload: string;
  tableConfig: any;
  checkFileExcel: boolean;
  type: string;
  inputPlaceholder: string = 'POPallet.ContentHolder';
  client = '';
  showScan: boolean;
  enableCreatePallet: boolean;
  IsFinishReceive: boolean;
  scanStep: string;
  rootPath = `${window.getRootPath()}`;
  data: any = {
    POCode: "",
    DOID: "",
    Status: "",
    Qty: 0,
    ScanQty: 0,
    ScanPalletQty: 0,
    VendorName: "",
    CreateDate: "",
    TransportDeviceCode: "",
    SessionCode: "",
    Details: [],
    Keygen: "",
    EffectiveDate: "",
    ExpiredDate: "",
    ManufactureDate: "",
    LotNumber: "",
    Specification: "",
    SpecificationText: "",
    LastExpiredDate: "",
    LastBestBeforeDate: "",
    LastManufactureDate: "",
    LastLotNumber: "",
    Barcodes: [],
    Products: [],
    ProductUnits: []
  }
  selectedProduct: any;

  dataSourceGrid = {
    rows: <any>[],
    total: 0
  };

  constructor(
    public dialog: MatDialog,
    private service: Service,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private toast: ToastService) {
    this.code = this.route.snapshot.params.code;
  }

  ngOnInit() {
    this.isOnlyDC = false;
    this.showScan = true;
    this.checkFileExcel = false;
    this.nameFileUpload = 'Chọn File Upload';
    this.IsFinishReceive = false;
    this.enableCreatePallet = false;
    this.scanStep = 'start';
    this.initTable();
    let poCode = this.code;
    if (poCode) {
      this.scanPO(poCode);
    }
  }

  ngAfterViewInit() {
    this.initEvent();
  }

  confirmSchedule(data: any) {
    for (let idx in data['ScheduleDateGroups']) {
      data['ScheduleDateGroups'][idx].StatusText = ` - ${this.translate.instant(`ScheduleStatus.${data['ScheduleDateGroups'][idx].Status}`)}`;
      if (data['ScheduleDateGroups'][idx].LineItems) {
        for (let idx2 in data['ScheduleDateGroups'][idx].LineItems) {
          data['ScheduleDateGroups'][idx].LineItems[idx2].StatusText = ` - ${this.translate.instant(`ScheduleStatus.${data['ScheduleDateGroups'][idx].LineItems[idx2].Status}`)}`;
        }
      }
    }

    data['ScheduleDateGroups'] = data['ScheduleDateGroups'].sort((a: any, b: any) => {
      let f1 = a.Schedule.replace(/([\/])|([-])/ig, "_").split("_");
      let f2 = b.Schedule.replace(/([\/])|([-])/ig, "_").split("_");
      f1 = `${f1[2]}${f1[1]}${f1[0]}`;
      f2 = `${f2[2]}${f2[1]}${f2[0]}`;
      return f1.localeCompare(f2);
    })

    const dialogRef = this.dialog.open(ScheduleComponent, {
      disableClose: true,
      data: {
        title: 'POPallet.ScheduleTitle',
        Data: data
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.scanPO(data.POCode, result.Schedule, result.LineItem);
      }
    });
  }

  confirmFinishPallet() {
    const dialogRef = this.dialog.open(ConfirmPOReceiveComponent, {
      data: {
        title: 'POPallet.FinishPalletTitle',
        Data: {
          Name: "FinishPallet",
          POCode: this.data['POCode'],
          TransportDeviceCode: this.data['TransportDeviceCode'],
          ScanPalletQty: this.data['ScanPalletQty'],
          LastExpiredDate: this.data['LastExpiredDate'],
          LastBestBeforeDate: this.data['LastBestBeforeDate'],
          LastManufactureDate: this.data['LastManufactureDate'],
          LastLotNumber: this.data['LastLotNumber']
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.finishPallet();
      }
    });
  }

  confirmFinsihReceive(includeFinishPallet: boolean = false) {
    const dialogRef = this.dialog.open(ConfirmPOReceiveComponent, {
      data: {
        title: includeFinishPallet ? 'POPallet.FinishReceiveAutoTitle' : 'POPallet.FinishReceiveTitle',
        Data: {
          Name: "FinishReceive",
          POCode: this.data['POCode'],
          ScanQty: this.data['ScanQty'],
          Qty: this.data['Qty']
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.finishReceivePO(includeFinishPallet);
        // this.confirmPromotion(includeFinishPallet);
      }
    });
  }

  onEnter(event: any) {
    let code = event.target['value'];
    code = code.trim();
    if (!this.data['POCode']) {
      this.scanPO(code);
    } else {
      if (!this.data['TransportDeviceCode']) {
        this.showScanPallet(code);
        // this.scanPallet({ Code: code, POCode: this.data['POCode'], SessionCode: this.data.SessionCode });
      } else {
        if (this.data.ScanQty > 0 && this.data.ScanQty === this.data.Qty && code === this.data['TransportDeviceCode']) {
          this.finishPallet();
        }
        else {
          this.selectedProduct = null;
          let next = this.showSelectProduct(code);
          if(next) {
            this.confirmBarcodeQty(code);
          }
        }
      }
    }
  }

  confirmBarcodeQty(code: any) {
    let arr = code.split('|');
    let barcode = arr[0];
    let qty = arr[1];
    let promotionQty = 0;
    if (qty) qty = Math.abs(qty);
    let info = this.data['Barcodes'].find(x => x.Barcode == barcode);
    if (!info || !info.Barcode) {
      let suff = this.data['ScheduleDate'] ? `nhận hàng ngày [${this.data['ScheduleDate']}]` : 'nhận hàng';
      this.toast.error(`Barcode [${code}] không tìm thấy trong phiên ${suff}`, 'error_title');
      return;
    }

    let isPromotion = this.data['PromotionSKUs'].indexOf(info.SKU) != -1;
    let product = this.selectedProduct || this.data['Products'].find(x => x.SKU == info.SKU  && (x.BaseQty > 0 || x.PromotionQty > 0));
    if(product && product.PromotionRef) {
      isPromotion = true;
    } else {
      isPromotion = false;
    }

    if(isPromotion) {
      let _product = this.selectedProduct || this.data['Products'].find(x => x.SKU == info.SKU && x.PromotionRef && (x.BaseQty > 0 || x.PromotionQty > 0));
      if(_product) {
        let _qty = _product.PromotionQty || _product.BaseQty;
        if(_qty < _product.OriginalQty) {
          _product = this.data['Products'].find(x => x.SKU == info.SKU && !x.PromotionRef);
          if(_product) {
            isPromotion = false;
            product = _product;
          }
        }
      }
    }

    let productUnit = (this.data['ProductUnits']).find(x => x.Uom == 'T' && x.SKU == info.SKU);
    let warningProductUnit = this.translate.instant(`Product.ProductUnitWarning`).replace('{{SKU}}', info.SKU);

    if (isPromotion && arr[2]) {
      promotionQty = Math.abs(arr[2])
    }
    if (!info || !info.Barcode) {
      let suff = this.data['ScheduleDate'] ? `nhận hàng ngày [${this.data['ScheduleDate']}]` : 'nhận hàng';
      this.toast.error(`Barcode [${code}] không tìm thấy trong phiên ${suff}`, 'error_title');
    }
    else {
      let checkBarcode = this.data['Barcodes'].find(x => x.SKU == info.SKU && x.Uom == "T");
      let warningBarcode = '';
      let linktoSKU = '#';
      if (!checkBarcode || !checkBarcode.SKU) {
        warningBarcode = this.translate.instant(`Product.ProductCaseWarning`).replace('{{SKU}}', info.SKU);
        linktoSKU = `/${this.rootPath}/product/${info.ClientCode}/${info.WarehouseSiteId}/${info.SKU}`;
      }

      const dialogRef = this.dialog.open(ConfirmPOReceiveComponent, {
        disableClose: true,
        width: "600px",
        data: {
          isConfirmQty: true, 
          title: this.translate.instant('POPallet.BarcodeQtyTitle'),
          barcode: info,
          code: barcode,
          qty: qty,
          promotionQty: promotionQty,
          product: product,
          productUnit: productUnit,
          warningBarcode: warningBarcode,
          warningProductUnit: warningProductUnit,
          linktoSKU: linktoSKU,
          isPromotion: isPromotion
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.receiveItem({
            Code: result,
            PromotionRef: product["PromotionRef"] || (product.PromotionQty > 0 ? product.SKU: ""),
            ExpiredDate: product['ExpiredDate'] ? product['ExpiredDate'] : this.data['ExpiredDate'],
            BestBeforeDate: this.data['BestBeforeDate'],
            ManufactureDate: this.data['ManufactureDate'],
            LotNumber: product.StorageType === 'LotBatch' ? product['LotNumber'] : '',
            POCode: this.data['POCode'],
            TransportDeviceCode: this.data['TransportDeviceCode'],
            JobCode: this.data['JobCode'],
            StorageType: product.StorageType,
            Specification: this.data["Specification"]
          });
        }
      });
    }
  }

  showSelectProduct(code: string) {
    let arr = code.split('|');
    let barcode = arr[0];
    let info = this.data['Barcodes'].find(x => x.Barcode == barcode);
    if (!info || !info.Barcode) {
      let suff = this.data['ScheduleDate'] ? `nhận hàng ngày [${this.data['ScheduleDate']}]` : 'nhận hàng';
      this.toast.error(`Barcode [${code}] không tìm thấy trong phiên ${suff}`, 'error_title');
      return;
    }
    let sku = info.SKU;

    let products = [];
    let skus = []
    // Get list parent sku
    for(let doc of this.data['Products']) {
      if(doc.SKU == sku) {
        if(!doc.PromotionRef) {
            continue;
        }
        if(doc.PromotionRef && doc.BaseQty > 0) {
          if(skus.indexOf(doc.PromotionRef) == -1) {
            skus.push(doc.PromotionRef);
          }
        }
      }
    }

    if(skus.length) {
      for(let doc of this.data['Products']) {
        if(skus.indexOf(doc.SKU) != -1) {
          products.push({
            SKU: doc.SKU,
            Name: doc.Name
          });
        }
      }
    }

    if(products.length) {
      let product = this.data['Products'].find(x => x.SKU == sku && x.BaseQty > 0);
      if (product && !product.PromotionRef) {
        return true;
      }
    }

    if(products.length == 0) {
      return true;
    }

    const dialogRef = this.dialog.open(SelectProductComponent, {
      disableClose: true,
      minWidth: 400,
      data: {
        title: '',
        Data: {
          Products: products
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        for(let doc of this.data['Products']) {
          if(doc.SKU == sku && doc.PromotionRef == result) {
            this.selectedProduct = {...doc};
            break;
          }
        }

        if(this.selectedProduct) {
          this.selectedProduct.PromotionQty = this.selectedProduct.BaseQty + 0;
          this.selectedProduct.BaseQty = 0;
          this.confirmBarcodeQty(code);
        }
      }
    });
    return false;
  }

  resetPage() {
    if (!this.code) {
      window.location.reload();
    } else {
      this.router.navigate([`/${window.getRootPath(true)}/purchaseorder/receive-pallet`]);
    }
  }

  clearInput() {
    if (this.inputScan) {
      this.inputScan.nativeElement.value = "";
    }
  }

  resetData() {
    this.data = {
      POCode: "",
      DOID: "",
      Status: "",
      Qty: 0,
      ScanQty: 0,
      VendorName: "",
      CreateDate: "",
      JobCode: "",
      TransportDeviceCode: "",
      SessionCode: "",
      Details: [],
      Keygen: "",
      ExpiredDate: "",
      EffectiveDate: "",
      ManufactureDate: "",
      LotNumber: ""
    }
    this.appTable['renderData']([]);
    this.clearInput();
  }
  makeData(data: any) {
    if (data.ScheduleDateGroups) {
      this.confirmSchedule(data);
      return;
    }

    let _data = {
      POCode: data.POCode,
      DOID: data.ExternalCode || "",
      Status: this.translate.instant(`POStatus.${data.Status}`),
      ScanQty: data.ScanQty || 0,
      ScanPalletQty: data.ScanPalletQty || 0,
      Qty: data.Qty || 0,
      VendorName: data.VendorName || "",
      ScheduleDate: data.ScheduleDate || "",
      LineItem: data.LineItem || "",
      ReceivingDate: data.ReceivingDate || "",
      CreateDate: data.PODate || "",
      Details: data.Details || [],
      JobCode: data.JobCode || "",
      SessionCode: data.SessionCode || "",
      TransportDeviceCode: data.TransportDeviceCode || "",
      Keygen: data.Keygen,
      ExpiredDate: data.ExpiredDate || "",
      BestBeforeDate: data.BestBeforeDate || "",
      ManufactureDate: data.ManufactureDate || "",
      LotNumber: data.LotNumber || data.LastLotNumber,
      Specification: data.Specification,
      SpecificationText:  data.Specification ? this.translate.instant(`Specification.${data.Specification}`) : "",
      LastExpiredDate: data.LastExpiredDate || "",
      LastBestBeforeDate: data.LastBestBeforeDate || "",
      LastManufactureDate: data.LastManufactureDate || "",
      LastLotNumber: data.LastLotNumber || "",
      Barcodes: data.Barcodes || [],
      Products: data.Products || [],
      ProductUnits: data.ProductUnits || [],
      StorageType: data.StorageType || "",
      PromotionSKUs: data.PromotionSKUs || []
    }
    this.data = _data;
    this.appTable['renderData'](_data.Details);
    if (_data.ScanQty > 0 && _data.ScanQty === _data.Qty) {
      this.inputPlaceholder = 'POPallet.ScanFinishContentHolder';
      this.scanStep = 'finish';
    } else {
      // if (!data.TransportDeviceCode) {
      //   this.showScan = false;
      //   this.inputPlaceholder = 'POPallet.CreatePalletContentHolder';
      // } else 
      {
        this.showScan = true;
        if (!data.TransportDeviceCode) {
          this.inputPlaceholder = 'POPallet.CreatePalletContentHolder';
          this.enableCreatePallet = true;
          this.scanStep = 'pallet';
        }
        else {
          if (_data.ScanQty > 0 && _data.ScanQty === _data.Qty) {
            this.inputPlaceholder = 'POPallet.ScanFinishContentHolder';
            this.scanStep = 'finish';
          } else {
            this.inputPlaceholder = 'POPallet.ScanBarcodeContentHolder';
            this.scanStep = 'barcode';
          }
        }
      }
    }
    this.clearInput();
    if (_data.ScanQty > 0 && _data.ScanQty === _data.Qty) {
      this.IsFinishReceive = true;
      this.confirmFinsihReceive(data.TransportDeviceCode ? true : false);
    }
  }

  scanPO(code: string, scheduleDate: string = "", lineItem: string = "") {
    this.service.scanPO(code, scheduleDate, lineItem)
      .subscribe((resp: any) => {
        if (resp.Status === true) {
          this.makeData(resp.Data);
        } else {
          if (resp.ErrorMessages && resp.ErrorMessages.length) {
            this.toast.error(`POPallet.Error.${resp.ErrorMessages[0]}`, 'error_title');
          }
          this.clearInput();
        }
      })
  }

  scanPallet(data: any) {
    data['Keygen'] = this.data['keygen'];
    this.service.scanPallet(data)
      .subscribe((resp: any) => {
        if (resp.Status === true) {
          this.data['JobCode'] = resp.Data['JobCode'];
          this.data['TransportDeviceCode'] = resp.Data['TransportDeviceCode'];
          if(!this.data["Specification"]) {
            this.data["Specification"] = resp.Data['Specification'];
            this.data["SpecificationText"] = this.translate.instant(`Specification.${resp.Data['Specification']}`)
          }
          this.inputPlaceholder = 'POPallet.ScanBarcodeContentHolder';
        } else {
          if (resp.ErrorMessages && resp.ErrorMessages.length) {
            this.toast.error(`POPallet.Error.${resp.ErrorMessages[0]}`, 'error_title');
          }
        }
        this.clearInput();
      })
  }

  showScanPallet(code: String) {
    if(this.data["Specification"]) {
      this.scanPallet({ 
        Code: code, 
        POCode: this.data['POCode'], 
        SessionCode: this.data.SessionCode,
        Specification: this.data["Specification"]
      });
      return;
    }
    if(this.isOnlyDC) {
      this.scanPallet({ 
        Code: code, 
        POCode: this.data['POCode'], 
        SessionCode: this.data.SessionCode,
        Specification: "NORMAL"
      });
      return;
    }
    const dialogRef = this.dialog.open(POPalletComponent, {
      disableClose: true,
      minWidth: 300,
      data: {
        title: '',
        Data: {
          Name: "FinishPallet",
          POCode: this.data["POCode"],
          Specification: this.data["Specification"]
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.scanPallet({ 
          Code: code, 
          POCode: this.data['POCode'], 
          SessionCode: this.data.SessionCode,
          Specification: result
        });
      }
    });
  }

  showCreatePallet(event: any) {
    if(this.data["Specification"]) {
      this.createPallet(this.data["Specification"]);
      return;
    }
    if(this.isOnlyDC) {
      this.createPallet("NORMAL");
      return;
    }
    const dialogRef = this.dialog.open(POPalletComponent, { 
      disableClose: true,
      minWidth: 300,
      data: {
        title: '',
        Data: {
          Name: "FinishPallet",
          POCode: this.data["POCode"],
          Specification: this.data["Specification"]
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createPallet(result)
      }
    });
  }

  createPallet(specification: any) {
    if (!this.data['SessionCode'] || !this.data['POCode'])
      return;
    this.data['ExpiredDate'] = "";
    this.data['BestBeforeDate'] = "";
    this.data['ManufactureDate'] = "";
    this.data['LotNumber'] = "";

    this.service.createPallet({
      "SessionCode": this.data['SessionCode'],
      "POCode": this.data['POCode'],
      "Specification": specification,
      "Keygen": this.data['Keygen']
    })
      .subscribe((resp: any) => {
        if (resp.Status === true) {
          this.data['JobCode'] = resp.Data['JobCode'];
          this.data['TransportDeviceCode'] = resp.Data['TransportDeviceCode'];
          this.data['Specification'] = resp.Data['Specification'] || "";
          this.showScan = true;
          this.inputPlaceholder = 'POPallet.ScanBarcodeContentHolder';
        } else {
          if (resp.ErrorMessages && resp.ErrorMessages.length) {
            this.toast.error(`POPallet.Error.${resp.ErrorMessages[0]}`, 'error_title');

            if (resp.ErrorMessages.indexOf("EPO005") != -1) {
              setTimeout(() => {
                this.resetPage();
              }, 5000);
            }
          }
        }
        // this.printPalletCode(resp.Data['TransportDeviceCode']);
        this.clearInput();
      })
  }
  repairDataPallet(keyCode: any) {
    const dataPrint = {
      "label": "Pallet",
      "printer_name": "PrinterLabel",
      "printer": 'PrinterLabel',
      "printerDefault": "Pallet",
      "template": 'Pallet',
      "options": { "Orientation": "portrait" },
      "data": null,
      "url": ""
    }
    dataPrint.data = {
      PalletCode: keyCode
    }
    return dataPrint;
  }
  sendToSmartPrintV1(data: any) {
    const _toast = this.toast
    new Promise(function (resolve, reject) {
      if (!data) {
        resolve({ Status: "FINISHED" });
      }
      var ws = new WebSocket("ws://127.0.0.1:2377/");
      ws.onerror = function () {
        _toast.error(`In ${data.label} thất bại: ${data.data.PalletCode}`, 'error_title');
        resolve({ Status: "FINISHED" });
        ws.close();
      }
      ws.onmessage = function (event) {
        if (event.data) {
          const statusPrint = JSON.parse(event.data)
          if (statusPrint.msg == 'ok') {
            _toast.success(`In ${data.label} ${data.data.PalletCode} thành công`, 'success_title');
          }
          else {
            _toast.error(`In ${data.label} thất bại: ${data.data.PalletCode}`, 'error_title');
          }
          ws.close();
        }
      };
      ws.onclose = function () {
        resolve({ Status: "FINISHED" });
      }
      ws.onopen = function () {
        ws.send(
          CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(data)))
        );
      }
    })

  }
  printPalletCode(keyCode: String) {
    const printer = window.localStorage.getItem("_printer");
    if (!printer) {
      this.toast.error(`Vui lòng chọn máy in`, 'error_title');
      return;
    }
    const dataPrint = this.repairDataPallet(keyCode);
    if (!printer || printer == 'InTrucTiep') {
      this.sendToSmartPrintV1(dataPrint);
    } else {
      this.sendToSmartPrintV2(dataPrint, keyCode, printer)
    }
  }
  sendToSmartPrintV2(dataPrint: any, keyCode: any, printer: any) {
    const bodyPrint = {
      Keygen: keyCode,
      ClientId: printer,
      Data: CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(dataPrint)))
    }
    this.service.smartPrint(bodyPrint)
      .subscribe((resp: any) => {
        if (resp.Status) {
          this.toast.success(`In ${dataPrint.label} ${keyCode} thành công`, 'success_title');
        } else {
          this.toast.error(`In ${dataPrint.label} ${keyCode} thất bại: ${resp.Data}`, 'error_title');
        }
      })
  }

  receiveItem(data: any) {
    this.service.receiveItem(data)
      .subscribe((resp: any) => {
        if (resp.Status === true) {
          this.makeData(resp.Data);
        } else {
          if (resp.Message === 'INPUT_EXPIREDDATE') {
            this.confirmExpirationDate(resp.Data, data);
          }
          else {
            if (resp.ErrorMessages && resp.ErrorMessages.length) {
              let _msg = `POPallet.Error.${resp.ErrorMessages[0]}`;
              if (/\s/.test(resp.ErrorMessages[0])) _msg = resp.ErrorMessages[0];
              this.toast.error(_msg, 'error_title');
            }
          }
        }
        this.clearInput();
      })
  }
  confirmExpirationDate(obj: any, data: any) {
    const dialogRef = this.dialog.open(ConfirmPOReceiveComponent, {
      disableClose: true,
      width: "500px",
      data: {
        isReceivePallet: true,
        title: this.translate.instant('POPallet.ExpiredTitle'),
        expireddate: '',
        manufactureDate: '',
        bestBeforeDate: '',
        lotNumber: data['LotNumber'] || '',
        product: obj,
        storageType: data.StorageType || 'None'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        data['ExpiredDate'] = result['ExpiredDate'];
        data['ManufactureDate'] = result['ManufactureDate'];
        data['BestBeforeDate'] = result['EffectiveDate'];
        data['LotNumber'] = result['LotNumber'];
        data["Specification"] = this.data["Specification"];
        data['Flag'] = 1;
        this.receiveItem(data);
      }
    });
  }
  callDates(date: any) {
    var current = new Date();
    // To calculate the time difference of two dates
    var diffTime = date.getTime() - current.getTime();

    // To calculate the no. of days between two dates
    return diffTime / (1000 * 3600 * 24);
  }
  finishPallet() {
    if (!this.data['TransportDeviceCode']) {
      return;
    }

    this.service.finishPallet({
      "SessionCode": this.data['SessionCode'],
      "TransportDeviceCode": this.data['TransportDeviceCode'],
      "POCode": this.data['POCode'],
      "JobCode": this.data['JobCode']
    })
      .subscribe((resp: any) => {
        if (resp.Status === true) {
          this.makeData(resp.Data);
        } else {
          if (resp.ErrorMessages && resp.ErrorMessages.length) {
            this.toast.error(`POPallet.Error.${resp.ErrorMessages[0]}`, 'error_title');
          }
        }
        this.clearInput();
      })
  }

  finishReceivePO(includeFinishPallet: boolean = false, details: any = null) {
    this.service.finishReceivePO({
      "POCode": this.data['POCode'],
      "TransportDeviceCode": this.data['TransportDeviceCode'],
      "SessionCode": this.data['SessionCode'],
      "JobCode": this.data['JobCode'],
      "IncludeFinishReceivePallet": includeFinishPallet,
      Details: details || []
    })
      .subscribe((resp: any) => {
        if (resp.Status === true) {
          this.toast.success("POPallet.FinishPOSuccess", "success_title");
          setTimeout(() => {
            this.resetPage();
          }, 500)
        } else {
          if (resp.ErrorMessages && resp.ErrorMessages.length) {
            this.toast.error(`POPallet.Error.${resp.ErrorMessages[0]}`, 'error_title');
          }
        }
        this.clearInput();
      })
  }
  confirmPromotion(includeFinishPallet: boolean = false) {
    if (this.data.PromotionSKUs && this.data.PromotionSKUs.length > 0) {
      const dialogRef = this.dialog.open(confirmFinishPOSession, {
        disableClose: true,
        width: "500px",
        data: {
          POCode: this.data.POCode,
          POSessionCode: this.data.SessionCode
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.finishReceivePO(includeFinishPallet, result);
        }
      });
    }
    else {
      this.finishReceivePO(includeFinishPallet);
    }
  }
  initTableAction(): TableAction[] {
    return [
      {
        icon: "remove_circle",
        class: 'ac-remove',
        name: 'remove-item',
        toolTip: {
          name: "Xoá",
        },
        disabledCondition: (row: any) => {
          return (row.IsCancel);
        }
      }
    ];
  }
  initTable() {
    this.tableConfig = {
      hoverContentText: "Chưa có sản phẩm nào đã quét",
      disablePagination: true,
      columns: {
        isContextMenu: false,
        actionTitle: this.translate.instant('FinishPo.Action'),
        actions: this.initTableAction(),
        displayedColumns: [
          'index', 'TransportDeviceCode', 'LotNumber', 'SKUName', 'SKU', 'Barcode', 'ExpiredDate', 'Qty', 'RequestUom', 'actions'],
        options: [
          {
            title: 'POPallet.PalletCode',
            name: 'TransportDeviceCode',
            style: {
              'min-width': '100px'
            },
          },
          {
            title: 'POPallet.SKUName',
            name: 'SKUName',
            showPrefix: true,
            style: {
              'min-width': '250px',
              'max-width': '360px'
            }
          },
          {
            title: 'SKU',
            name: 'SKU',
            style: {
              'min-width': '50px',
              'max-width': '90px'
            }
          },
          {
            title: 'Barcode',
            name: 'Barcode',
            style: {
              'min-width': '160px',
              'max-width': '160px'
            }
          },
          {
            title: 'LotNumber',
            name: 'LotNumber',
            style: {
              'min-width': '50px',
              'max-width': '90px'
            },
            render(row: any) {
              return row["LotNumber"] || "N/A";
            }
          },
          {
            title: 'POPallet.ExpiredDate',
            name: 'ExpiredDate',
            style: {
              'min-width': '50px',
              'max-width': '100px'
            }
          },
          {
            title: 'POPallet.Qty',
            name: 'Qty',
            style: {
              'max-width': '80px',
            }
          },
          {
            title: 'POPallet.Uom',
            name: 'RequestUom',
            style: {
              'min-width': '80px',
              'max-width': '80px',
            }
          }
        ]
      },
      data: this.dataSourceGrid
    };

  }
  initEvent() {
    this.appTable['actionEvent'].subscribe({
      next: (event: any) => {
        if (!event) {
          return;
        }
        const action = event["action"];
        switch (action) {
          case 'remove-item':
            this.confirmRemoveItem(event.data)
            break;
        }
      }
    });
  }
  confirmRemoveItem(row: any) {
    const dialogRef = this.dialog.open(ConfirmPOReceiveComponent, {
      data: {
        isRemoveReceiveItem: true,
        title: 'Bạn có chắc chắn muốn xoá SKU đang nhận hàng?',
        Data: row
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.removeItem(row);
      }
    });
  }
  removeItem(data: any) {
    let tmp = this.appTable['data']['rows'];
    let index = -1;
    for (let i = 0; i < tmp.data.length; i++) {
      if (tmp.data[i].Barcode == data.Barcode && tmp.data[i].SKU == data.SKU && tmp.data[i].TransportDeviceCode == data.TransportDeviceCode) {
        index = i;
        break;
      }
    }
    // append po, session
    data.SessionCode = this.data.SessionCode;
    data.POCode = this.data.POCode;
    data.JobCode = this.data.JobCode;

    this.service.removeItem(data)
      .subscribe((resp: any) => {
        if (resp.Status === true) {
          this.toast.success('Xoá SKU đang nhận hàng thành công', 'success_title');
          this.makeData(resp.Data);
          // if (index != -1) {
          //   this.appTable['removeRow'](index);
          // }
        } else if (resp.ErrorMessages && resp.ErrorMessages.length) {
          let _msg = `POPallet.Error.${resp.ErrorMessages[0]}`;
          if (/\s/.test(resp.ErrorMessages[0])) _msg = resp.ErrorMessages[0];
          this.toast.error(_msg, 'error_title');
        }
        else {
          this.toast.error('Xoá SKU đang nhận hàng không thành công', 'error_title');
        }
      })
  }
  confirmExitPallet() {
    if (this.data.POCode) {
      const dialogRef = this.dialog.open(NotificationComponent, {
        data: {
          message: `Bạn có muốn thoát màn hình nhận hàng?`,
          type: 1
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.router.navigate([`/${window.getRootPath(true)}/purchaseorder/list`]);
        }
      });
    } else {
      this.router.navigate([`/${window.getRootPath(true)}/purchaseorder/list`]); 
    }
  }

  downloadTemplate() {
    // this.service.downloadTemplate("PUSHSALESKY24_VMT_STO_211224.xlsx");
  }

  goToBackList(event: any = null) {
    // this.router.navigate([`/${window.getRootPath()}/rocket/planning-sto-list`]);
  }
}
