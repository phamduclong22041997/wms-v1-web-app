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

import { Injectable } from '@angular/core';
import { RequestService } from '../shared/request.service';
import { configs } from '../shared/config';
import * as CryptoJS from 'crypto-js';
import { ToastService } from './toast.service';
import * as moment from 'moment-timezone';
const timezone = "Asia/Ho_Chi_Minh";
const serectkey = "Ctsnlmyddtha6$&"
import * as _ from "lodash";

@Injectable({
    providedIn: 'root'
})

export class PrintService {
    urlList: object = {
        'printFile': 'cloud-print/v1/print',
        'getPDF': 'cloud-print/v1/pdf'
    };
    constructor(private Request: RequestService, private toast: ToastService) { }

    async smartPrint(data: any) {
        const url = `${configs.OVSmartPrint}/${this.urlList['printFile']}`;
        // return this.Request.post(url, data, {}, 1);
        return await this.callRequestApi(url, data);
    }
    async callRequestApi(url: string, data: any) {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(data),
        };
        return new Promise((resolve, reject) => {
            fetch(url, requestOptions)
                .then(response => {
                    if (response.status == 200) {
                        response.blob().then(function (blob) {
                            if (blob.type == 'application/pdf') {
                                resolve(blob)
                            } else {
                                resolve(true)
                            }
                        });
                    }
                })
                .catch(error => {
                    console.log('error', error)
                    reject(false)
                });
        })
    }
    async sendToSmartPrintV1(data: any) {
        return new Promise(function (resolve, reject) {
            if (!data) {
                resolve({ Status: "FINISHED" });
            }
            var ws = new WebSocket("ws://127.0.0.1:2377/");
            ws.onerror = function () {
                // _toast.error(`In ${data.label} thất bại: ${data.data.PalletCode}`, 'error_title');
                resolve({ Status: "FINISHED" });
                ws.close();
                return false;
            }
            ws.onmessage = function (event) {
                if (event.data) {
                    const statusPrint = JSON.parse(event.data)
                    if (statusPrint.msg == 'ok') {
                        // _toast.success(`In ${data.label} ${data.data.PalletCode} thành công`, 'success_title');
                        return true;
                    }
                    else {
                        // _toast.error(`In ${data.label} thất bại: ${data.data.PalletCode}`, 'error_title');
                        return false;
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

    async sendToSmartPrintV2(dataPrint: any, keyCode: any, printer: any) {
        let _dataPrint = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(dataPrint)))
        const bodyPrint = {
            Keygen: keyCode,
            ClientId: printer,
            Data: _dataPrint
        }
        return await this.smartPrint(bodyPrint);

    }
    repairMultiInventoryDeliveryPacking(listData = [], SOType: string = "") {
        const dataPrint = {
            "label": "Phiếu xuất kho",
            "printer_name": "PrinterPaper",
            "printer": 'PrinterPaper',
            "printerDefault": "MultiInventoryDeliveryPacking",
            "template": 'MultiInventoryDeliveryPacking_V3',
            "options": { "Orientation": "portrait" },
            "data": null,
            "url": "",
            "keygen": listData.map(order => order.SOCode).join(",")
        }
        const Rows = []
        const printDate = moment(new Date()).tz(timezone);
        const warehouseInfor = JSON.parse(window.localStorage.getItem('_info'));
        for (let data of listData) {
            data.StrPrintDate = `Ngày ${printDate.format("DD")}, tháng ${printDate.format("MM")}, năm ${printDate.format("YYYY")}`;
            data['Address'] = data.Address || data.FullAddress;
            data['AccountId'] = warehouseInfor && warehouseInfor.Id ? warehouseInfor.Id : "";
            data['WarehouseName'] = warehouseInfor && warehouseInfor.SiteInfo && warehouseInfor.SiteInfo.Name || "";
            data['WarehouseContact'] = warehouseInfor && warehouseInfor.SiteInfo && warehouseInfor.SiteInfo.Contact.ContactName || "";
            data['WarehousePhone'] = warehouseInfor && warehouseInfor.SiteInfo && warehouseInfor.SiteInfo.Contact.ContactPhone || "";
            data['IsOddPack'] = data.IsPackingEven == 1 ? 0 : 1;
            if(data.WarehouseInfo) {
                data['WarehouseName'] = data.WarehouseInfo.Name || "";
                data['WarehouseAddress'] = data.WarehouseInfo.Address || "";
                data['WarehouseContact'] = data.WarehouseInfo.ContactName || "";
                data['WarehousePhone'] = data.WarehouseInfo.ContactPhone || "";
            } else {
                if(warehouseInfor && warehouseInfor.SiteInfo && warehouseInfor.SiteInfo.Contact) {
                    data.WarehouseAddress = warehouseInfor.SiteInfo.Contact.Address || warehouseInfor.SiteInfo.Contact.FullAddr
                }
            }
            Rows.push(data);
        }
        dataPrint.data = {
            Rows
        };
        return dataPrint;
    }
    repairMultiInventoryDelivery(listData = []) {
        const dataPrint = {
            "label": "Phiếu xuất kho",
            "printer_name": "PrinterPaper",
            "printer": 'PrinterPaper',
            "printerDefault": "MultiInventoryDelivery",
            "template": 'MultiInventoryDelivery',
            "options": { "Orientation": "portrait" },
            "data": null,
            "url": "",
            "keygen": listData.map(order => order.SOCode).join(",")
        }
        const Rows = []
        const printDate = moment(new Date()).tz(timezone);
        const warehouseInfor = JSON.parse(window.localStorage.getItem('_info'));
        for (let data of listData) {
            let SumQty = 0;
            let SumQtyByCase = 0;
            for (let detail of data.Details) {
                SumQty += parseInt(detail.BaseQty);
                SumQtyByCase += Math.ceil(detail.QtyByCase);
                detail.BaseQty = this.formatNumber((detail.BaseQty || detail.Qty), 1, ".", ",");
                detail.Qty = this.formatNumber(detail.Qty, 1, ".", ",");
                detail['ProductName'] = detail.ProductName || detail.SKUName;
                detail['BaseUom'] = detail.BaseUom || detail.Uom;
                detail['QtyByCase'] = Math.ceil(detail.QtyByCase);
                detail['GatheredPoint'] = detail.GatheredPoint || detail.PackedLocationLabel;
            }
            data.StrPrintDate = `Ngày ${printDate.format("DD")}, tháng ${printDate.format("MM")}, năm ${printDate.format("YYYY")}`;
            data['SumQty'] = this.formatNumber(SumQty, 1, ".", ",");
            data['SumQtyByCase'] = this.formatNumber(SumQtyByCase, 1, ".", ",");
            data['Address'] = data.Address || data.FullAddress;
            if(data.WarehouseInfo) {
                data['WarehouseName'] = data.WarehouseInfo.Name || "";
                data['WarehouseAddress'] = data.WarehouseInfo.Address || "";
                data['WarehouseContact'] = data.WarehouseInfo.ContactName || "";
                data['WarehousePhone'] = data.WarehouseInfo.ContactPhone || "";
            } else {
                data['AccountId'] = warehouseInfor && warehouseInfor.Id ? warehouseInfor.Id : "";
                data['WarehouseName'] = warehouseInfor && warehouseInfor.SiteInfo && warehouseInfor.SiteInfo.Name || "";
                data['WarehouseAddress'] = warehouseInfor && warehouseInfor.SiteInfo && warehouseInfor.SiteInfo.Contact.Address || "";
                data['WarehouseContact'] = warehouseInfor && warehouseInfor.SiteInfo && warehouseInfor.SiteInfo.Contact.ContactName || "";
                data['WarehousePhone'] = warehouseInfor && warehouseInfor.SiteInfo && warehouseInfor.SiteInfo.Contact.ContactPhone || "";
    
            }
            Rows.push(data);
        }
        dataPrint.data = {
            Rows
        };
        return dataPrint;
    }
    repairMultilPickList(listData = [], keyCode: string) {
        const dataPrint = {
            "label": "Danh sách lấy hàng",
            "printer_name": "PrinterPaper",
            "printer": 'PrinterPaper',
            "printerDefault": "MultilPickList",
            "template": 'MultilPickList',
            "options": { "Orientation": "portrait" },
            "data": null,
            "url": "",
            "keygen": keyCode
        }
        const warehouseInfor = JSON.parse(window.localStorage.getItem('_info'));

        dataPrint.data = {
            Rows: listData,
            AccountId: warehouseInfor && warehouseInfor.Id ? warehouseInfor.Id : "",
            WarehouseName:  warehouseInfor && warehouseInfor.SiteInfo && warehouseInfor.SiteInfo.Name || "",
            WarehouseAddress:  warehouseInfor && warehouseInfor.SiteInfo && warehouseInfor.SiteInfo.Contact.Address || "",
            WarehouseContact: warehouseInfor && warehouseInfor.SiteInfo && warehouseInfor.SiteInfo.Contact.ContactName || "",
            WarehousePhone: warehouseInfor && warehouseInfor.SiteInfo && warehouseInfor.SiteInfo.Contact.ContactPhone || ""
        };
        return dataPrint;
    }
    repairMultiDataLabel(listSO = []) {
        const dataPrint = {
            "label": "Nhãn vận chuyển",
            "printer_name": "PrinterLabel",
            "printer": 'PrinterLabel',
            "printerDefault": "ShippingLabelWinmart",
            "template": 'ShippingLabelWinmart',
            "options": { "Orientation": "portrait" },
            "data": null,
            "url": "",
            "keygen": listSO.map(order => order.SOCode).join(",")
        }
        const Rows = []
        for (let order of listSO) {
            let totalPackage = order.TotalPackage ? Math.ceil(order.TotalPackage) : 0;
            for (let i = 0; i < totalPackage; i++) {
                let data = {};
                data['ExternalCode'] = order.ExternalCode;
                data['SOCode'] = order.SOCode;
                data['PickedToteCode'] = order.PickedToteCode;
                data['StrPrintDate'] = moment(new Date()).tz(timezone).format("DD.MM.YYYY");
                data['SAP'] = order.SiteId || "";
                data['VendorName'] = order.StoreName || "";
                data['StringPackage'] = `${i + 1}/${Math.ceil(totalPackage)}` || "";
                data['GatheredPoint'] = order.GatheredPoint || order.PackedLocationLabel;
                Rows.push(data)
            }
        }
        dataPrint.data = {
            Rows
        };
        return dataPrint;
    }
    repairMultiDataLabel50mm_100mm(listLabel = []) {
        const dataPrint = {
            "label": "Nhãn vận chuyển",
            "printer_name": "PrinterLabel",
            "printer": 'PrinterLabel',
            "printerDefault": "ShippingLabelWinmart50mm_100mm",
            "template": 'ShippingLabelWinmart50mm_100mm_V2_BDD',
            "options": { "Orientation": "portrait" },
            "data": null,
            "url": "",
            "keygen": listLabel.length > 0 ? listLabel[0].SOCode : ""
        }
        const Rows = []
        for (let label of listLabel) {
                const sha256 = CryptoJS.HmacSHA256(JSON.stringify(label.QrCodeText), serectkey);
                label.QrCodeString = CryptoJS.enc.Base64.stringify(sha256);
                Rows.push(label)
        }
        dataPrint.data = {
            Rows
        };
        return dataPrint;
    }

    repairMultiDataPalletorTote(codes = [], type: String) {
        const warehouseCode =  window.localStorage.getItem('_warehouse');
        let template = warehouseCode && warehouseCode == "BDD" ? "PalletA5" : "PalletA4";
        let printerDefault = warehouseCode && warehouseCode == "BDD" ? "PalletA5" : "PalletA4";
        let templateTote = 'Tote_50_100mm';
        let paperTote = 'Tote50_100mm';
        const dataPrint = {
            "label": type,
            "printer_name": type == "Pallet" ? "PrinterPaper" : "PrinterLabel",
            "printer": type == "Pallet" ? "PrinterPaper" : "PrinterLabel",
            "printerDefault": type == "Pallet" ? printerDefault : paperTote,
            "template": type == "Pallet" ? template : templateTote,
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
    repairPrintCodesLabel(codes = [], type: String) {
        const dataPrint = {
            "label": type,
            "printer_name": "PrinterLabel",
            "printer": 'PrinterLabel',
            "printerDefault": 'Codes_Label_50_100mm',
            "template": 'Codes_Label_50_100mm',
            "options": { "Orientation": "portrait" },
            "data": null,
            "url": "",
            "keygen": codes.map(code => code).join(',')
        }
        let Rows = []
        for (let index in codes) {
            Rows.push({
                Code: codes[index],
                id: `id_${codes[index]}_${index}`
            })
        }
        dataPrint.data = {
            Rows
        };
        return dataPrint;
    }
    repairMultiDataBarcodeProduct(barcode: string, number: number) {
        let template = 'ProductBarcode';
        let paper = 'ProductBarcode';
        const dataPrint = {
            "label": "BarcodeProduct",
            "printer_name": "PrinterLabel",
            "printer": "PrinterLabel",
            "printerDefault": paper,
            "template": template,
            "options": { "Orientation": "portrait" },
            "data": null,
            "url": "",
            "keygen": barcode
        }
        let Rows = []
        const totalPrint = Math.ceil(number / 3);
        const _label = {
            IdCode1: `Id_${barcode}`,
            Code1: barcode,
            FormatBarcode: this.getFormatBarcode(barcode).FormatBarcode || "",
            Width: this.getFormatBarcode(barcode).Width || 1
        }
        for (let i = 0; i < totalPrint; i++) {
            Rows.push(_label)
        }
        dataPrint.data = {
            Rows
        };
        dataPrint.data['Barcode'] = barcode;
        dataPrint.data['Id'] = `Id_${barcode}`;
        return dataPrint;
    }
    getFormatBarcode(barcode) {
        if(isNaN(barcode*1)) {
            return {
                FormatBarcode: "CODE128",
                Width: 0.9
            }
        }
        switch(barcode.length) {
            case 13:
                return {
                    FormatBarcode: "EAN13",
                    Width: 1
                };
            case 8:
                return {
                    FormatBarcode: "EAN8",
                    Width: 1
                };
            default: 
                return {
                    FormatBarcode: "CODE128",
                    Width: 0.9
                }
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
    async getPDF(data: object) {
        const url = `${configs.OVSmartPrint}/${this.urlList['getPDF']}`;
        return await this.callRequestApi(url, data);
    }
    mappingSKUForPackageInventory(data: any) {
        const details = {};
        const listPackage = _.uniq(
          data.PickListDetailPackage.map((pkg) => pkg.PackageNo)
        );
        let TotalCaseQty = 0;
        data.PickListDetailPackage.map(sku => {
          TotalCaseQty += sku.CaseQty;
          if(!details[`${sku.SKU}`]) {
            details[`${sku.SKU}`] = sku
          } else {
            details[`${sku.SKU}`]['BaseQty'] += sku.BaseQty;
            details[`${sku.SKU}`]['CaseQty'] += sku.CaseQty;
          }
        })
        data['TotalCaseQty'] =  this.formatNumber(TotalCaseQty, 2, ".", ",");
        data["PointCode"] = data.GatheredPoint || data.PointCode;
        data["Details"] = Object.values(details);
        data.Details.map(sku => {
          sku.CaseQty = this.formatNumber(sku.CaseQty, 2, ".", ",");
        })
        data.IsPackingEven = listPackage.length == 1 ? 1 : 0;
      }
      repairMultiInventoryDeliveryPacking_SO_DIRECT_STT(listData = [], SOType: string = "") {
        const dataPrint = {
            "label": "Phiếu xuất kho",
            "printer_name": "PrinterPaper",
            "printer": 'PrinterPaper',
            "printerDefault": "MultiInventoryDeliveryPacking_V3",
            "template": 'MultiInventoryDeliveryPacking_SO_DIRECT_STT',
            "options": { "Orientation": "portrait" },
            "data": null,
            "url": "",
            "keygen": listData.map(order => order.SOCode).join(",")
        }
        if(window.localStorage.getItem('_warehouse') == "MCH") {
            dataPrint["template"] = "MultiInventoryDeliveryPacking_MCH";
        }
        const Rows = []
        const printDate = moment(new Date()).tz(timezone);
        const warehouseInfor = JSON.parse(window.localStorage.getItem('_info'));
        for (let data of listData) {
            data.StrPrintDate = `Ngày ${printDate.format("DD")}, tháng ${printDate.format("MM")}, năm ${printDate.format("YYYY")}`;
            data['Address'] = data.Address || data.FullAddress;
            data['AccountId'] = warehouseInfor && warehouseInfor.Id ? warehouseInfor.Id : "";
            // data['WarehouseName'] = warehouseInfor && warehouseInfor.SiteInfo && warehouseInfor.SiteInfo.Name || "";
            // data['WarehouseAddress'] = warehouseInfor && warehouseInfor.SiteInfo && warehouseInfor.SiteInfo.Contact ? warehouseInfor.SiteInfo.Contact.Address  || warehouseInfor.SiteInfo.Contact.FullAddr :  "";
            // data['WarehouseContact'] = warehouseInfor && warehouseInfor.SiteInfo && warehouseInfor.SiteInfo.Contact.ContactName || "";
            // data['WarehousePhone'] = warehouseInfor && warehouseInfor.SiteInfo && warehouseInfor.SiteInfo.Contact.ContactPhone || "";
            data['IsOddPack'] = data.IsPackingEven == 1 ? 0 : 1;
            Rows.push(data);
        }
        dataPrint.data = {
            Rows
        };
        return dataPrint;
    }
    repairMultiInventoryDeliveryPackingSOSTT(listData = [], SOType: string = "") {
        const dataPrint = {
            "label": "Phiếu xuất kho",
            "printer_name": "PrinterPaper",
            "printer": 'PrinterPaper',
            "printerDefault": "MultiInventoryDeliveryPacking_V3",
            "template": 'MultiInventoryDeliveryPacking_SO_DIRECT_STT',
            "options": { "Orientation": "portrait" },
            "data": null,
            "url": "",
            "keygen": listData.map(order => order.SOCode).join(",")
        }

        if(window.localStorage.getItem('_warehouse') == "MCH") {
            dataPrint["template"] = "MultiInventoryDeliveryPacking_MCH";
        }
    
        const Rows = []
        const printDate = moment(new Date()).tz(timezone);
        const warehouseInfor = JSON.parse(window.localStorage.getItem('_info'));
        for (let data of listData) {
            data.StrPrintDate = `Ngày ${printDate.format("DD")}, tháng ${printDate.format("MM")}, năm ${printDate.format("YYYY")}`;
            data['Address'] = data.Address || data.FullAddress;
            data['AccountId'] = warehouseInfor && warehouseInfor.Id ? warehouseInfor.Id : "";
            // data['WarehouseName'] = warehouseInfor && warehouseInfor.SiteInfo && warehouseInfor.SiteInfo.Name || "";
            // data['WarehouseAddress'] = warehouseInfor && warehouseInfor.SiteInfo && warehouseInfor.SiteInfo.Contact ? warehouseInfor.SiteInfo.Contact.Address  || warehouseInfor.SiteInfo.Contact.FullAddr :  "";
            // data['WarehouseContact'] = warehouseInfor && warehouseInfor.SiteInfo && warehouseInfor.SiteInfo.Contact.ContactName || "";
            // data['WarehousePhone'] = warehouseInfor && warehouseInfor.SiteInfo && warehouseInfor.SiteInfo.Contact.ContactPhone || "";
            data['IsOddPack'] = data.IsPackingEven == 1 ? 0 : 1;
            Rows.push(data);
        }
        dataPrint.data = {
            Rows
        };
        return dataPrint;
    }
    repairMultiDataLabel50mm_100mm_SFT2(SplitList : any) {
        const dataPrint = {
            "label": "Nhãn vận chuyển",
            "printer_name": "PrinterLabel",
            "printer": 'PrinterLabel',
            "printerDefault": "ShippingLabelWinmart50mm_100mm",
            "template": 'ShippingLabelWinmart50mm_100mm_SFT2_V3',
            "options": { "Orientation": "portrait" },
            "data": null,
            "url": "",
            "keygen": SplitList.SplitListCode || ""
        }
        dataPrint.data = SplitList;
        return dataPrint;
    }
}
