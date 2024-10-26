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
import { Service } from '../../service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../shared/toast.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmExportComponent } from '../../confirm/component';
import { PrintService } from '../../../shared/printService';
import * as moment from 'moment-timezone';
import { SO_STATUS, DOCUMENT_OBJECTTYPE, DOCUMENT_TYPE, NUMBERIC } from '../../../shared/constant';
import { ConfirmPrintLabelComponent } from './confirm-print/component';
import { Utils } from '../../../shared/utils';
import * as CryptoJS from 'crypto-js';
import * as fs from 'file-saver';
const _ = require('lodash');

const timezone = "Asia/Ho_Chi_Minh";
interface TableAction {
  icon: string;
  class?: string;
  name?: String;
  toolTip?: any;
  actionName?: any;
  disabledCondition?: any;
}

@Component({
  selector: 'app-so-details',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})


export class SoDetailsComponent implements OnInit, AfterViewInit {
  SOCode: string;
  tableConfig: any;
  statusConfig: Object;
  receiveConfig: Object;
  receiveSKUConfig: Object;
  statusTrackingConfig: Object;
  documentConfig: Object;
  statusSAPTrackingConfig: Object;
  productsDataSource: any;
  checkFileExtention: boolean;
  checkFileExtentionError: false;
  fileUpload: any;
  nameFileUpload: string;
  receiveRowUpload: any;
  statusTrackingData: any[];
  statusSAPTrackingData: any[];
  GIStyle: any;
  data: any = {
    SOCode: '',
    SiteId: '',
    ExternalCode: '',
    StoreName: '',
    ExternalCode2: '',
    Address: '',
    ExternalCode3: '',
    Contact: '',
    WarehouseName: '',
    ContactName: '',
    ConditionType: '',
    SOType:'',
    SOTypeClass: '',
    PromotionCode: '',
    Type: '',
    Status: '',
    StatusCode: '',
    CreatedDate: '',
    CreatedBy: '',
    CanceledBy: '',
    CanceledNote: '',
    CanceledReason: '',
    Note: '',
    ReceiveSessions: [],
    Details: [],
    WarehouseAddress: ''
  };
  listPackage: any[];

  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('receiveSessionTable', { static: false }) receiveSessionTable: ElementRef;
  @ViewChild('receiveSessionSKUTable', { static: false }) receiveSessionSKUTable: ElementRef;
  @ViewChild('documentTable', { static: false }) documentTable: ElementRef;
  @ViewChild('inputFile', { static: false }) inputFile: ElementRef;
  @ViewChild('statusTrackingTable', { static: false }) statusTrackingTable: ElementRef;
  @ViewChild('statusSAPTrackingTable', { static: false }) statusSAPTrackingTable: ElementRef;
  
  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private toast: ToastService,
    private service: Service,
    public dialog: MatDialog,
    private printService: PrintService,
    private router: Router) {
    this.SOCode = this.route.snapshot.params.SOCode;
  }

  ngOnInit() {
    this.GIStyle = {}
    this.statusTrackingData = [];
    this.statusSAPTrackingData = [];
    this.initTable();
    this.loadData(this.SOCode);
    this.getPackageNo();
  }
  ngAfterViewInit() {
    this.initEvent();
  }
  initTable() {

    this.tableConfig = {
      style: {
        'overflow-x': 'hidden'
      },
      columns: {
        actionTitle: 'action',
        isContextMenu: false,
        displayedColumns: [
          'index',
          'SKU',
          'ProductName',
          'PCB',
          // 'Uom',
          // 'Qty',
          'BaseQty',
          'BaseUom',
          'PackedQty',
          'PackedQtyByCase',
          'MissedQty',
          'Weight',
          'Volume'
          // 'ActualUom',
          // 'ActualQty',
          // 'Uom',
          // 'BaseActualQty'
        ],
        options: [
          {
            title: 'SODetails.SKU',
            name: 'SKU',
            style: {
              'min-width': '90px',
              'max-width': '120px'
            },
          },
          {
            title: 'SODetails.ProductName',
            name: 'ProductName',
            style: {
              'width': '220px',
              'max-width': '400px'
            }
          },
          {
            title: 'PCB',
            name: 'PCB',
            style: {
              'width': '50px',
              'max-width': '50px'
            }
          },
          {
            title: 'SODetails.BaseUnits',
            name: 'BaseUom',
            style: {
              'width': '90px',
              'max-width': '90px'
            }
          },
          {
            title: 'SODetails.BaseUom',
            name: 'BaseQty',
            style: {
              'width': '90px',
              'max-width': '90px'
            }
          },
          {
            title: 'SODetails.TotalWeight',
            name: 'Weight',
            style: {
              'min-width': '90px',
              'max-width': '90px'
            },
            render: (data: any) => {
              return Utils.formatNumberFixed(data.Weight / NUMBERIC.N1000, 4);
            }
          },
          {
            title: 'SODetails.TotalVolume',
            name: 'Volume',
            style: {
              'min-width': '90px',
              'max-width': '90px'
            },
            render: (data: any) => {
              return Utils.formatNumberFixed(data.Volume * NUMBERIC.CM3ToM3, 6);
            }
          },
          {
            title: 'SODetails.ActualQty',
            name: 'PackedQty',
            style: {
              'min-width': '90px',
              'max-width': '90px'
            }
          },
          {
            title: 'SODetails.ActualQtyByCase',
            name: 'PackedQtyByCase',
            style: {
              'min-width': '90px',
              'max-width': '90px'
            },
            render: (data: any) => {
              return Utils.formatNumber(data.PackedQtyByCase, 2);
            }
          },
          {
            title: 'SODetails.MissedQty',
            name: 'MissedQty',
            style: {
              'width': '90px',
              'max-width': '90px'
            }
          },
        ]
      },
      data: {
        rows: this.data.Details || [],
        total: this.data.Details.length
      }
    };

    this.statusTrackingConfig = {
      style: {
        'overflow-x': 'hidden'
      },
      columns: {
        actionTitle: 'action',
        isContextMenu: false,
        displayedColumns: [
          'index',
          'Status',
          'CreatedDate',
          'FullName',
          'UserName'
        ],
        options: [
          {
            title: 'SODetails.Status',
            name: 'Status',
            style: {
              'min-width': '120px',
              'max-width': '220px'
            }
          },
          {
            title: 'SODetails.LastStatusUpdatedDate',
            name: 'CreatedDate',
            style: {
              'min-width': '120px',
              'max-width': '220px'
            }
          },
          {
            title: 'SODetails.UpdatedBy',
            name: 'FullName',
            style: {
              'min-width': '120px',
              'max-width': '220px'
            }
          },
          {
            title: 'SODetails.UserUpdate',
            name: 'UserName',
            style: {
              'min-width': '120px',
              'max-width': '220px'
            }
          }
        ]
      },
      data: {
        rows: [],
        total: 0
      }
    }

    this.statusSAPTrackingConfig = {
      style: {
        'overflow-x': 'hidden'
      },
      columns: {
        actionTitle: 'action',
        isContextMenu: false,
        displayedColumns: [
          'index',
          'Name',
          'Status',
          'Message',
          'CreatedDate',
          'UpdatedDate'
        ],
        options: [
          {
            title: 'GI/GR',
            name: 'Name',
            style: {
              'min-width': '120px',
              'max-width': '120px'
            }
          },
          {
            title: 'SODetails.Status',
            name: 'Status',
            style: {
              'min-width': '120px',
              'max-width': '220px'
            }
          },
          {
            title: 'SODetails.CreatedDate',
            name: 'CreatedDate',
            style: {
              'min-width': '220px',
              'max-width': '220px'
            }
          },
          {
            title: 'SODetails.UpdatedDate',
            name: 'UpdatedDate',
            style: {
              'min-width': '220px',
              'max-width': '220px'
            }
          },
          {
            title: 'SODetails.Note',
            name: 'Message'
          }
        ]
      },
      data: {
        rows: [],
        total: 0
      }
    }

    this.receiveConfig = {
      style: {
        'overflow-x': 'hidden'
      },
      columns: {
        actionTitle: 'action',
        isContextMenu: false,
        actions: this.initTablePackageAction(),
        displayedColumns: [
          'index',
          'PackageNo',
          'Status',
          'TotalWeight',
          'NumberSKU',
          'CreatedDate',
          // 'UpdatedDate',
          "actions"
        ],
        options: [
          {
            title: 'SODetails.PackageNo',
            name: 'PackageNo',
            style: {
              'min-width': '180px',
              'max-width': '180px',
            },
          },
          {
            title: 'SODetails.Status',
            name: 'Status',
            render: (data: any) => {
              return this.translate.instant(`SOStatus.${data.Status}`);
            }
          },

          {
            title: 'SODetails.TotalWeight',
            name: 'TotalWeight'
          },
          {
            title: 'SODetails.NumberSKU',
            name: 'NumberSKU'
          },
          {
            title: 'SODetails.CreatedDate',
            name: 'CreatedDate',
            style: {
              'min-width': '90px',
              'max-width': '90px',
            }
          }
          /*,
          {
            title: 'SODetails.UpdatedDate',
            name: 'UpdatedDate',
            style: {
              'min-width': '90px',
              'max-width': '90px',
            }
          }*/
        ]
      },
      data: {
        rows: this.data.ReceiveSessions || [],
        total: this.data.ReceiveSessions.length
      }
    }

    this.receiveSKUConfig = {
      style: {
        'overflow-x': 'hidden'
      },
      columns: {
        actionTitle: 'action',
        isContextMenu: false,
        displayedColumns: [
          'index',
          'Name',
          'SKU',
          'Barcode',
          //'Serial',
          "Qty",
          "LotNumber"
        ],
        options: [
          {
            title: 'SODetails.ProductName',
            name: 'Name',
            style: {
              'min-width': '150px',
              // 'max-width': '200px',
            }
          },
          {
            title: 'SKU',
            name: 'SKU',
            style: {
              'min-width': '90px',
              // 'max-width': '90px',
            }
          },
          {
            title: 'SODetails.Barcode',
            name: 'Barcode'
          },
          {
            title: 'SODetails.Serial',
            name: 'Serial'
          },
          {
            title: 'SODetails.Qty',
            name: 'Qty'
          },
          {
            title: 'LotNumber',
            name: 'LotNumber'
          }
        ]
      },
      data: {
        rows: [],
        total: 0
      }
    };

    this.documentConfig = {
      style: {
        'overflow-x': 'hidden'
      },
      columns: {
        actionTitle: 'action',
        isContextMenu: false,
        actions: this.initDocumentAction(),
        displayedColumns: [
          'index',
          'Document',
          'actions'
        ],
        options: [

          {
            title: 'SODetails.Document',
            name: 'Document',
            style: {
              'min-width': '200px',
              'max-width': '100px',
            },
          }
        ]
      },
      data: {
        rows: [{ index: 1, Document: 'Hóa đơn' }],
        total: 0
      }
    }
  }
  initEvent() {
    this.receiveSessionTable['actionEvent'].subscribe({
      next: (event: any) => {
        if (!event) {
          return;
        }
        const action = event["action"];
        switch (action) {
          case 'view':
            this.getPackageDetail(event.data.PackageNo, event.data.IsSubPackage);
            break;
          case 'print-label':
            this.printSOLabelForPackage(event)
            break;
        }
      }
    });
    // action table document
    this.documentTable['actionEvent'].subscribe({
      next: (event: any) => {
        if (!event) {
          return;
        }
        const action = event["action"];
        switch (action) {
          case 'print-inventory':
            this.printInventoryDelivery(event, "")
            break;
          case 'print-inventory-pdf':
            this.printInventoryDelivery(event, "pdf")
            break;
            case 'print-inventory-html':
              this.printInventoryDelivery(event, "html")
              break;
        }
      }
    });
  }
  onTabClick(event: any) {
    if (event.index == 1 && !this.statusTrackingData.length) {
      this.getStatusTracking(this.SOCode);
    }
    else if (event.index == 4 && !this.statusSAPTrackingData.length) {
      this.getStatusSAPTracking(this.SOCode);
    }
  }
  initTableAction(): TableAction[] {
    return [
      {
        icon: "post_add",
        name: 'pallet-receive',
        toolTip: {
          name: "Nhận hàng pallet",
        },
        class: "ac-task",
        disabledCondition: (row: any) => {
          return (row.Status === SO_STATUS.New);
        }
      },
      {
        icon: "check_circle",
        name: 'finish-po',
        class: 'ac-finish',
        toolTip: {
          name: "Hoàn thành",
        },
        disabledCondition: (row) => {
          return (row.Status === SO_STATUS.New);
        }
      },
      {
        icon: "remove_circle",
        class: 'ac-remove',
        name: 'cancel-po',
        toolTip: {
          name: "Hủy",
        },
        disabledCondition: (row: any) => {
          return false//;([PO_STATUS.New, PO_STATUS.Draft].indexOf(row.Status) != -1);
        }
      },
      {
        icon: "upload_file",
        name: 'upload-doc',
        class: 'ac-finish',
        toolTip: {
          name: "Upload chứng từ",
        },
        disabledCondition: (row: any) => {
          return (row.Status === SO_STATUS.New);
        }
      },
      {
        icon: "print",
        name: 'print-doc',
        class: 'ac-task',
        toolTip: {
          name: "In phiếu nhập hàng",
        },
        disabledCondition: (row: any) => {
          return (row.Status === SO_STATUS.New);
        }
      }
    ];
  }
  initTablePackageAction(): TableAction[] {
    return [
      {
        icon: "view_headline",
        class: '',
        name: 'view',
        toolTip: {
          name: this.translate.instant('SODetails.PackageDetails'),
        },
        disabledCondition: (row: any) => {
          return true
        }
      },
      {
        icon: "print",
        name: 'print-label',
        class: 'ac-task',
        toolTip: {
          name: this.translate.instant(`SODetails.PrintLable`),
        },
        disabledCondition: (row: any) => {
          return row.PackageNo;
        }
      }
    ];
  }
  initDocumentAction(): TableAction[] {
    return [
      {
        icon: "receipt",
        name: 'print-inventory',
        class: 'ac-task',
        toolTip: {
          name: this.translate.instant(`SODetails.PrintShipping`),
        },
        disabledCondition: (row: any) => {

          return true;
        }
      },
      {
        icon: "picture_as_pdf",
        name: 'print-inventory-pdf',
        class: 'ac-task',
        toolTip: {
          name: this.translate.instant(`SODetails.PrintShippingPDF`),
        },
        disabledCondition: (row: any) => {

          return true;
        }
      },
      {
        icon: "open_in_browser",
        name: 'print-inventory-html',
        class: 'ac-task',
        toolTip: {
          name: this.translate.instant(`SODetails.PrintShipping`),
        },
        disabledCondition: (row: any) => {

          return true;
        }
      }
    ];
  }

  parseReceiveData(data: any) {
    let receiveData = [], receiveSKUData = [];
    let Idx = 1;
    for (let i = 0; i < data.length; i++) {
      receiveData.push({
        Idx: Idx++,
        Code: data[i].Code,
        CreatedBy: data[i].CreatedBy,
        CreatedDate: moment(data[i].CreatedDate).format('DD-MM-YYYY HH:mm'),
        FinishedDate: moment(data[i].FinishedDate).format('DD-MM-YYYY HH:mm'),
        FinishedBy: data[i].FinishedBy
      });
      if (data[i].Details) {
        let jIdx = 1;
        for (let j in data[i].Details) {
          let d = data[i].Details[j]
          receiveSKUData.push({
            Idx: jIdx++,
            ProductName: d.ProductName,
            SKU: j,
            ActualQtyUnit: d.Uom,
            ActualQty: d.Qty,
            BaseActualQty: d.BaseQty,
            BaseActualQtyUnit: d.BaseQtyUnit
          });
        }
      }
    }

    return [receiveData, receiveSKUData];
  }
  getPackageNo() {
    this.service.getPackageNo(this.SOCode)
      .subscribe((resp) => {
        if (resp.Status) {
          this.listPackage = resp.Data;
          this.receiveSessionTable['renderData'](resp.Data);
        }
      })
  }

  loadData(SOCode: string) {
    this.service.getSODetails(SOCode)
      .subscribe((resp: any) => {

        if (resp.Data) {
          this.data = {
            SOCode: resp.Data.SOCode,
            SiteId: resp.Data.SiteId,
            ExternalCode: resp.Data.ExternalCode,
            StoreName: resp.Data.StoreName,
            ExternalCode2: resp.Data.ExternalCode2,
            Address: resp.Data.Address,
            ExternalCode3: resp.Data.ExternalCode3,
            ReceivingStaffName: resp.Data.ReceivingStaffName,
            ReceivingStaffPhone: resp.Data.ReceivingStaffPhone,
            WarehouseName: resp.Data.WarehouseName,
            WarehouseSiteId: resp.Data.WarehouseSiteId,
            WarehouseSiteName: resp.Data.WarehouseSiteName,
            ContactName: resp.Data.ContactName,
            ContactPhone: resp.Data.ContactPhone,
            ConditionType: this.translate.instant(`POConditionType.${resp.Data.ConditionType}`),
            SOType: resp.Data.SOType ? this.translate.instant(`SOType.${resp.Data.SOType}`) : "",
            SOTypeClass: resp.Data.SOType || 'default',
            Type: this.translate.instant(`SODetails.${resp.Data.Type}`),
            Status: this.translate.instant(`SOStatus.${resp.Data.Status}`),
            StatusCode: resp.Data.Status,
            CreatedDate: resp.Data.CreatedDate,
            CreatedBy: resp.Data.CreatedBy,
            CanceledBy: resp.Data.CanceledBy,
            CanceledNote: resp.Data.CanceledNote,
            CanceledReason: resp.Data.CanceledReason,
            Note: resp.Data.Note,
            PromotionCode: resp.Data.PromotionCode,
            ReceiveSessions: [],
            Details: resp.Data.Details,
            TotalVolume: resp.Data.TotalVolume ? Utils.formatNumberFixed(resp.Data.TotalVolume * NUMBERIC.CM3ToM3, 6) : '',
            TotalWeight: resp.Data.TotalWeight ? Utils.formatNumberFixed(resp.Data.TotalWeight / NUMBERIC.N1000, 4) : '',
            TotalPackage: resp.Data.TotalPackage,
            TotalPackageEven: resp.Data.TotalPackageEven,
            TotalPackageOdd: resp.Data.TotalPackageOdd,
            PickedToteCode: resp.Data.PickedToteCode || "",
            EstDeliveryDate: resp.Data.EstDeliveryDate,
            PackedLocationLabel: resp.Data.PackedLocationLabel,
            TotalSKU: resp.Data.TotalSKU,
            TotalUnit: resp.Data.TotalUnit,
            GIStatus: resp.Data.GIStatus,
            IsPackingEven: resp.Data.IsPackingEven || 1,
            PackingStation: resp.Data.PackingStation || "",
            SortCode: resp.Data.SortCode || '',
            Priority: resp.Data.Priority || '',
            WarehouseAddress: resp.Data.WarehouseAddress || "",
            WarehouseInfo: resp.Data.WarehouseInfo || ""
          };
          if (this.data.GIStatus) {
            this.GIStyle = { color: this.data.GIStatus == 'ERR' ? '#f05858' : '#7bbd7b' }
          }
          //GIStyle

          this.appTable['renderData'](this.data.Details);
          let receiveData = this.parseReceiveData(this.data.ReceiveSessions);

          this.receiveSessionSKUTable['renderData'](receiveData[1]);
        }
      });
  }

  async printInventoryDelivery(data: any, type: string = "") {
    const printer = window.localStorage.getItem("_printer");
    if (!printer && type == "") {
      this.toast.error(`Vui lòng chọn máy in`, 'error_title');
      return;
    }
    this.service.getPackageDetailBySO(this.data.SOCode, 1)
      .subscribe((resp) => {
        if (resp.Status) {
          if (resp.Data.length == 0) {
            this.toast.error(`Đơn hàng chưa có kiện`, 'error_title');
            return;
          }
          this.doPrintInventoryDelivery(resp.Data, printer, type);
        }
      })
  }
   openHTML(dataPrint: any) {
    this.service.getHTML(dataPrint)
      .subscribe((resp: any) => {
        if (resp && resp.Status && resp.Data && resp.Data.html) {
          const dataHTML = resp.Data.html.replace(
            '<script type=\"text/javascript\" src=\"%pwd%/smartprint/assets/jsBarcode.all.min.js\"></script>\n',
            '<script type=\"text/javascript\" src=\"https://cdnjs.cloudflare.com/ajax/libs/jsbarcode/3.11.0/JsBarcode.all.js\"></script>\n'
            )
          var winPrint = window.open(`Phieu_Xuat_Kho_${dataPrint.keygen}`, '_blank');
          winPrint.document.write(dataHTML);
          winPrint.document.close();
          winPrint.focus();
          setTimeout(() => {
            winPrint.print();
            winPrint.close(); 
          }, 1000);
        }
      })
  }
  async doPrintInventoryDelivery(respData: any, printer: string, type: string) {
    for (let i in respData) {
      respData[i]['BaseQty'] = respData[i].Qty || "";
      respData[i]['BaseUom'] = respData[i].Uom || "";
    }
    const Details = {};
    for (let i in respData) {
      if (!Details[`${respData[i].PackageNo}`]) {
        let qty = 0;
        const packageData = {
          PackageGroup: respData[i].PackageGroup,
          PackageNo: respData[i].PackageNo,
          PackageDetail: respData.filter(sku => sku.PackageNo == respData[i].PackageNo)
        }
        for (let row of packageData.PackageDetail) {
          qty += row.Qty
        }
        packageData['Qty'] = qty;
        Details[`${respData[i].PackageNo}`] = packageData
      }
    }
    
    const _dataPrint = JSON.parse(JSON.stringify(this.data));
    _dataPrint['PointCode'] = this.data.PackedLocationLabel;
    const _details = Object.values(Details);
    _details.map(detail => {
      detail['PackageGroup'] = parseInt(detail['PackageGroup'])
    });
    const detailsSorted = _.sortBy(_details, ['PackageGroup']);
    _dataPrint['Details'] = detailsSorted;
    const dataPrint = this.printService.repairMultiInventoryDeliveryPacking([_dataPrint]);
    if (type == 'html') {
      this.openHTML(dataPrint);
      return;
    } else if (type == 'pdf') {
      const pdfFile = await this.printService.getPDF(dataPrint);
      fs.saveAs(
        pdfFile,
        `Phieu_Xuat_Kho_${this.data.SOCode}`
      );
    } else {
      const rsPrint = await this.printService.sendToSmartPrintV2(dataPrint, dataPrint.data.PointCode, printer);
      if (rsPrint) {
        this.toast.success(`In ${dataPrint.label} : ${this.data.SOCode} thành công`, 'success_title');
      } else {
        this.toast.error(`In ${dataPrint.label} ${this.data.SOCode} thất bại`, 'error_title');
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
  async requestPrintListLabelSO() {
    const printer = window.localStorage.getItem("_printer");
    if (!printer) {
      this.toast.error(`Vui lòng chọn máy in`, 'error_title');
      return false;
    }
    let totalPackage = Math.ceil(this.data.TotalPackage);
    // totalPackage = 5;
    if (totalPackage == 0) {
      this.toast.error(`Số lượng kiện bằng 0`, 'error_title');
      return;
    }
    this.toast.info(`Đang tiến hành in ${totalPackage} nhãn `, 'success_title');
    const rsPrintLabel = await this.printListLabelSO(printer);
    if (rsPrintLabel.success > 0) {
      this.toast.success(`In label: thành công !`, 'success_title');
    } else {
      this.toast.error(`In label thất bại: ${rsPrintLabel.fail} !`, 'error_title');
    }
  }
  async timer(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async printListLabelSO(printer: String) {
    let resultPrint = {
      success: 0,
      fail: 0
    }
    let listLabel = JSON.parse(JSON.stringify(this.listPackage));
    const WarehouseCode = window.localStorage.getItem('_warehouse');
    const printTotalPackage = ['StoredAfterPacked', 'StoringAfterPacked', 'CountedAndEnclosed'];
    const StrPrintDate = moment(new Date()).tz(timezone).format("DD.MM.YYYY");
    if (this.data.TotalPackage == listLabel.length) {
      for (let label of listLabel) {
        label['WarehouseCode'] = WarehouseCode || "";
        label['TotalPackage'] = printTotalPackage.includes(this.data.StatusCode) ? this.data.TotalPackage.toString() : "";
        label['DeliveryOrder'] = this.data.ExternalCode || "";
        label['GatheredPoint'] = this.data.PackedLocationLabel || "";
        label['SiteId'] = this.data.SiteId || "";
        label['StoreName'] = this.data.StoreName || "";
        label['StatusCode'] = this.data.StatusCode || "";
        label['StrPrintDate'] = StrPrintDate;
        label['QrCodeText'] = `${label.SiteId}|${label.DeliveryOrder}|${label.SOCode}|${label.PackageNo}|${label.GatheredPoint}|1/${this.data.TotalPackage}`;
      }
    } else {
      listLabel = [];
      for (let i = 1; i <= this.data.TotalPackage; i++) {
        let label = JSON.parse(JSON.stringify(this.listPackage))[0];
        label['PackageGroup'] = i;
        label['WarehouseCode'] = WarehouseCode || "";
        label['TotalPackage'] = this.data.TotalPackage.toString() || "";
        label['DeliveryOrder'] = this.data.ExternalCode || "";
        label['GatheredPoint'] = this.data.PackedLocationLabel || "";
        label['SiteId'] = this.data.SiteId || "";
        label['StoreName'] = this.data.StoreName || "";
        label['StatusCode'] = this.data.StatusCode || "";
        label['StrPrintDate'] = StrPrintDate;
        label['QrCodeText'] = `${label.SiteId }|${label.DeliveryOrder}|${label.SOCode}|${label.PackageNo}|${label.GatheredPoint}|${i}/${this.data.TotalPackage}`;
        listLabel.push(label);
      }
    }
    const dataPrint = this.printService.repairMultiDataLabel50mm_100mm(listLabel);

    let printRS = null;
    if (printer == 'InTrucTiep') {
      printRS = await this.printService.sendToSmartPrintV1(dataPrint);
    } else {
      printRS = await this.printService.sendToSmartPrintV2(dataPrint, dataPrint.keygen, printer);
    }
    printRS ? resultPrint.success++ : resultPrint.fail++
    return resultPrint;
  }
  
  async printSOLabelForPackage(event: any) {
    const printer = window.localStorage.getItem("_printer");
    if (!printer) {
      this.toast.error(`Vui lòng chọn máy in`, 'error_title');
      return false;
    }
    const listLabel = [];
    const data = JSON.parse(JSON.stringify(event.data));
    if (this.data.TotalPackage == this.listPackage.length) {
      listLabel.push(data);
      this.addDataForPrintLabel(listLabel);
      await this.doPrintListLabel(listLabel, printer);
    } else {
      data['TotalPackage'] = this.data.TotalPackage;
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
          if (result.EndPackage - result.StartPackage > 100) {
            this.toast.error(`Vui lòng không in quá 100 nhãn 1 lần`, 'error_title');
            return;
          }
          for (let i = parseInt(result.StartPackage); i <= parseInt(result.EndPackage); i++) {
            let label = JSON.parse(JSON.stringify(data));
            label['PackageGroup'] = i;
            listLabel.push(label);
          }
          this.addDataForPrintLabel(listLabel);
          this.doPrintListLabel(listLabel, printer);
        }
      });
    }

  }
  addDataForPrintLabel(listLabel: any) {
    const WarehouseCode = window.localStorage.getItem('_warehouse');
    const printTotalPackage = ['StoredAfterPacked', 'StoringAfterPacked', 'CountedAndEnclosed'];
    const StrPrintDate = moment(new Date()).tz(timezone).format("DD.MM.YYYY");
    for(let i = 0; i < listLabel.length; i++) {
      const label = listLabel[i];
      label['WarehouseCode'] = WarehouseCode || "";
      label['TotalPackage'] = printTotalPackage.includes(this.data.StatusCode) ? this.data.TotalPackage.toString() : "";
      label['DeliveryOrder'] = this.data.ExternalCode || "";
      label['GatheredPoint'] = this.data.PackedLocationLabel || "";
      label['SiteId'] = this.data.SiteId || "";
      label['StoreName'] = this.data.StoreName || "";
      label['StatusCode'] = this.data.StatusCode || "";
      label['StrPrintDate'] = StrPrintDate;
      label['QrCodeText'] = `${label.SiteId}|${label.DeliveryOrder}|${label.SOCode}|${label.PackageNo}|${label.GatheredPoint}|${i+ 1}/${this.data.TotalPackage}`;
      label['SortCode'] = this.data.SortCode;
    }
  }
  async doPrintListLabel(listLabel: any, printer: string) {
    const dataPrint = this.printService.repairMultiDataLabel50mm_100mm(listLabel);
    let resultPrint = {
      success: 0,
      fail: 0
    }
    let printRS = null;
    if (printer == 'InTrucTiep') {
      printRS = await this.printService.sendToSmartPrintV1(dataPrint);
    } else {
      printRS = await this.printService.sendToSmartPrintV2(dataPrint, dataPrint.keygen, printer);
    }
    printRS ? resultPrint.success++ : resultPrint.fail++
    if (resultPrint.success > 0) {
      this.toast.success(`In label: thành công !`, 'success_title');
    } else {
      this.toast.error(`In label thất bại: ${resultPrint.fail} !`, 'error_title');
    }
  }
  async printSOLabel(packageNumber: number, totalPackage: number, printer: String) {
    const dataPrint = this.repairDataSOLabel(this.data, packageNumber, totalPackage);
    if (!printer || printer == 'InTrucTiep') {
      return await this.printService.sendToSmartPrintV1(dataPrint);
    } else {
      return await this.printService.sendToSmartPrintV2(dataPrint, this.data.SOCode, printer);
    }
  }
  repairDataSOLabel(dataSession: any, packageNumber = 1, totalPackage = 1) {
    const dataPrint = {
      "label": "Nhãn vận chuyển",
      "printer_name": "PrinterLabel",
      "printer": 'PrinterLabel',
      "printerDefault": "ShippingLabelWinmart",
      "template": 'ShippingLabelWinmart',
      "options": { "Orientation": "portrait" },
      "data": null,
      "url": ""
    }
    const data = Object.assign({}, this.data);
    data['StrPrintDate'] = moment(new Date()).tz(timezone).format("DD.MM.YYYY");
    data['SAP'] = this.data.SiteId || "";
    data['VendorName'] = this.data.StoreName || "";
    data['StringPackage'] = `${packageNumber}/${totalPackage}` || "1/1";
    data['VehicelNumber'] = this.data.VehicelNumber || "";
    dataPrint.data = data;
    return dataPrint;
  }
  sendToSmartPrint(dataPrint: any, keyCode: String, printer: String) {
    const bodyPrint = {
      Keygen: keyCode,
      ClientId: printer,
      Data: CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(dataPrint)))
    }
    this.service.smartPrint(bodyPrint)
      .subscribe((resp: any) => {
        if (resp.Status) {
          this.toast.success(`In ${dataPrint.label} : ${keyCode} thành công`, 'success_title');
        } else {
          this.toast.error(`In ${dataPrint.label} ${keyCode} thất bại: ${resp.Data}`, 'error_title');
        }
      })
  }

  cancel() {
    this.router.navigate([`/${window.getRootPath()}/saleorder/listso`, {}]);
  }

  checkUploadFile(files: any) {
    this.checkFileExtention = false;
    this.checkFileExtentionError = false;
    this.nameFileUpload = files[0].name ? files[0].name : '';
    let ext = this.nameFileUpload.split('.').pop();

    if (['doc', 'docx', 'pdf', 'png', 'jpg', 'jpeg'].indexOf(ext) != -1) {
      const fileSize = Math.round((files[0].size / 1024));
      if (fileSize > 2048) {
        this.toast.error('POErrors.EPO110', 'error_title');
      }
      else {
        this.fileUpload = files[0];
        this.checkFileExtention = true;
      }
    } else {
      this.checkFileExtention = false;
      this.toast.error('POErrors.EPO109', 'error_title');
    }
  }
  confirmUpload() {
    const dialogRef = this.dialog.open(ConfirmExportComponent, {
      data: {
        isupload: true,
        title: 'Bạn có chắc chắn upload file chứng từ?',
        fileName: this.nameFileUpload,
        code: this.data.SOCode
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.uploadFile();
      }
      else {
        this.resetUpload();
      }
    });
  }
  resetUpload() {
    this.receiveRowUpload = null;
    this.checkFileExtention = false;
    this.checkFileExtentionError = false;
    this.inputFile = null;
    this.fileUpload = null;
  }
  async uploadFile() {
    this.checkFileExtention = false;
    let formData = new FormData();
    formData.append('file', this.fileUpload);
    formData.append('IsChecking', '1');
    formData.append('Name', this.fileUpload.name);
    formData.append('Type', DOCUMENT_TYPE.SOInvoice);
    formData.append('ObjectType', DOCUMENT_OBJECTTYPE.SO);
    formData.append('ObjectCode', this.data.SOCode);
    formData.append('WarehouseCode', window.localStorage.getItem('_warehouse') || 'CCH');

    await this.service.uploadDocument(formData)
      .subscribe((resp: any) => {
        this.loadDocByCode(this.data.SOCode);
        if (resp['Status']) {
          this.toast.success('Upload file thành công', 'success_title');
          this.resetUpload();
        } else {
          this.toast.error('Upload file không thành công', 'error_title');
          this.resetUpload();
        }
      });
  }

  loadDocByCode(code: string) {
    this.service.getDocuments({ ObjectCode: code, ObjectType: DOCUMENT_OBJECTTYPE.SO, Type: DOCUMENT_TYPE.SOInvoice })
      .subscribe((resp: any) => {
        if (resp.Data) {
          this.documentTable['renderData'](resp.Data);
        }
      });
  }
  getPackageDetail(code: string, isSubPackage: number = 0) {
    this.service.getPackageDetails(code, isSubPackage)
      .subscribe((resp) => {
        if (resp.Status) {
          this.receiveSessionSKUTable['renderData'](resp.Data);
        }
      })
  }
  getStatusTracking(code: string) {
    this.service.getStatusTracking(code)
      .subscribe((resp) => {
        if (resp.Status) {
          let results = [];
          for (let p of resp.Data) {
            results.push({
              CreatedBy: p.CreatedBy,
              CreatedDate: p.CreatedDate ? moment(p.CreatedDate).format('DD-MM-YYYY HH:mm:ss') : '',
              Note: p.Note,
              SOCode: p.SOCode,
              Status: this.translate.instant(`SOStatus.${p.Status}`),
              UpdatedBy: p.UpdatedBy,
              UpdatedDate: p.UpdatedDate ? moment(p.UpdatedDate).format('DD-MM-YYYY HH:mm:ss') : '',
              FullName: p.FullName || p.CreatedBy || '',
              UserName: p.UserName || p.UpdatedBy || ''
            })
          }
          this.statusTrackingData = results;
          this.statusTrackingTable['renderData'](results);
        }
      })
  }
  getStatusSAPTracking(code: string) {
    this.service.getStatusSAPTracking(code)
      .subscribe((resp) => {
        if (resp.Status) {
          let results = [];
          for (let p of resp.Data) {
            results.push({
              CreatedDate: p.CreatedDate ? moment(p.CreatedDate).format('DD-MM-YYYY HH:mm') : '',
              Name: this.translate.instant(`SAPName.${p.Name}`),
              Status: p.Status,
              Message: p.Message,
              UpdatedDate: p.UpdatedDate ? moment(p.UpdatedDate).format('DD-MM-YYYY HH:mm') : ''
            })
          }
          this.statusSAPTrackingData = results;
          this.statusSAPTrackingTable['renderData'](results);
        }
      })
  }

}

