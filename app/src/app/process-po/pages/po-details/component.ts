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
import { NotificationComponent } from '../../../components/notification/notification.component';
import { ConfirmComponent } from '../../confirm/component';
import * as moment from 'moment';
import { DOCUMENT_OBJECTTYPE, DOCUMENT_TYPE, RECEIVING_STATUS, STATUS_BORDER_STO_FINISH  } from '../../../shared/constant';
import * as CryptoJS from 'crypto-js';
import { PrintService } from '../../../shared/printService';
import { confirmFinishPOSession } from './confirm/component';
import { confirmPrint } from './confirmprint/component';
import * as fs from 'file-saver';
import { PopupAddSKUComponent } from '../popups/popup-add-sku/component';
import { TableAction } from '../../../interfaces/tableAction';
import { Utils } from '../../../shared/utils';

@Component({
  selector: 'app-po-details',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class PoDetailsComponent implements OnInit, AfterViewInit {
  POCode: string;
  tableConfig: any;
  palletTableConfig: any;
  statusConfig: Object;
  receiveConfig: any;
  receiveDocConfig: Object;
  receiveSKUConfig: Object;
  documentConfig: Object;
  productsDataSource: any;
  checkFileExtention: boolean;
  checkFileExtentionError: false;
  fileUpload: any;
  nameFileUpload: string;
  receiveRowUpload: any;
  currentDocDetailSession: string;
  tabIndexActive: string;
  GRStyle: any;
  data: any = {
    POCode: null,
    PODate: '',
    Status: '',
    CreatedDate: "",
    CreatedBy: "",
    LastModified: "",
    ContactName: "",
    ContactPhone: "",
    ExternalCode: "",
    ExternalCode2: "",
    ExternalCode3: "",
    WarehouseName: "",
    DocumentNumber: "",
    VendorId: "",
    POType: "",
    ConditionType: "",
    Subvendor: "",
    VendorName: "",
    VendorAddress: "",
    VendorContact: "",
    CanceledBy: "",
    CanceledNote: "",
    CanceledReason: "",
    Note: "",
    Details: [],
    FinishedBy: "",
    FinishedDate: "",
    ReceiveSessions: [],
    WarehouseSiteName: "",
    WarehouseSiteId: ""
  };
  isShowAddSKU = false;
  ReceivedList: any;
  rootPath = `${window.getRootPath()}`;
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('receiveSessionTable', { static: false }) receiveSessionTable: ElementRef;
  @ViewChild('receiveSessionDocTable', { static: false }) receiveSessionDocTable: ElementRef;
  @ViewChild('receiveSessionSKUTable', { static: false }) receiveSessionSKUTable: ElementRef;
  @ViewChild('palletTable', { static: false }) palletTable: ElementRef;
  @ViewChild('documentTable', { static: false }) documentTable: ElementRef;
  @ViewChild('inputFile', { static: false }) inputFile: ElementRef;

  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private toast: ToastService,
    private service: Service,
    public dialog: MatDialog,
    private printService: PrintService,
    private router: Router) {
    this.POCode = this.route.snapshot.params.POCode;

    const fragment: string = route.snapshot.fragment;
    switch (fragment) {
      case "document":
        this.tabIndexActive = "2";
        break;
      case "receive":
        this.tabIndexActive = "1";
        break;
      default:
        this.tabIndexActive = "0";
        break;
    }
  }

  ngOnInit() {
    this.GRStyle = {}
    this.checkFileExtention = false;
    this.nameFileUpload = 'Chọn File Upload';

    this.initTable();
  }

  ngAfterViewInit() {
    this.initEvent();
    this.loadData(this.POCode);
    this.loadReceiveList();
    // this.loadReceiveDetails();
    // this.loadPOPallets();
  }

  initTableAction(): TableAction[] {
    return [
      {
        icon: "view_list",
        name: 'view-doc',
        class: 'ac-task',
        toolTip: {
          name: "Xem chứng từ theo phiên",
        },
        disabledCondition: (row: any) => {
          return (row.FinishedDate && row.UpdatedBy);
        }
      },
      {
        icon: "file_upload",
        name: 'upload-doc',
        class: 'ac-finish',
        toolTip: {
          name: "Upload chứng từ",
        },
        disabledCondition: (row: any) => {
          return (row.ProcessingDate && row.UpdatedBy);
        }
      }
    ];
  }

  initReceiveTableAction(): TableAction[] {
    return [
      {
        icon: "view_list",
        name: 'view-doc',
        class: 'ac-task',
        toolTip: {
          name: "Xem chi tiết phiên nhận hàng",
        },
        disabledCondition: (row: any) => {
          return (row.FinishedDate && row.UpdatedBy) || row.Status == RECEIVING_STATUS.Processing;
        }
      },
      {
        icon: "local_shipping",
        name: 'finish-receiving',
        class: 'ac-finish-second',
        toolTip: {
          name: this.translate.instant('POPallet.BtnFinishReceive')
        },
        disabledCondition: (row: any) => {
          return (!row.FinishedDate);
        }
      },
      {
        icon: "print",
        name: 'print-doc',
        class: 'ac-task',
        toolTip: {
          name: "In chứng từ phiên nhận hàng",
        },
        disabledCondition: (row: any) => {
          return (row.FinishedDate && row.UpdatedBy);
        }
      },
      {
        icon: "picture_as_pdf",
        name: 'print-doc-pdf',
        class: 'ac-task',
        toolTip: {
          name: "Xuất file PDF chứng từ phiên nhận hàng",
        },
        disabledCondition: (row: any) => {
          return (row.FinishedDate && row.UpdatedBy);
        }
      }
    ];
  }

  initDocTableAction(): TableAction[] {
    return [
      {
        icon: "download",
        name: 'download-doc',
        class: 'ac-task',
        toolTip: {
          name: "Tải chứng từ",
        },
        disabledCondition: (row: any) => {
          return (true);
        }
      },
      {
        icon: "clear",
        name: 'remove-doc',
        class: 'ac-remove',
        toolTip: {
          name: "Huỷ chứng từ",
        },
        disabledCondition: (row: any) => {
          return (true);
        }
      }
    ];
  }

  initSessionTableAction(): TableAction[] {
    return [
      {
        icon: "print",
        name: 'print-pa',
        class: 'ac-task',
        toolTip: {
          name: "In Pallet",
        },
        disabledCondition: (row) => {
          return (true);
        }
      }
    ];
  }
  
  initTable() {
    this.tableConfig = {
      style: {
        'overflow-x': 'hidden'
      },
      columns: {
        actionTitle: 'action',
        actions: this.initTableDetailAction(),
        isContextMenu: false,
        displayedColumns: [
          'index',
          'SKU',
          'SKUName',
          'BaseQty',
          'ReceiveQty',
          'BaseUom',
          'PCB',
          'MHU',
          'LineItem',
          'ManufactureBarcode',
          'Status',
          // 'ScheduleDate',
          // ReceiveDate,
          "actions"
        ],
        options: [
          {
            title: 'FinishPo.SKU',
            name: 'SKU',
            style: {
              'min-width': '100px',
              'max-width': '120px',
            },
            link: true,
            newpage: true,
            onClick: (row: any) => {
              return `/${window.getRootPath()}/product/${this.data.ClientCode}/${this.data.WarehouseSiteId}/${row.SKU}`;
            }
          },
          {
            title: 'FinishPo.ProductName',
            name: 'SKUName',
            style: {
              'min-width': '300px',
              'max-width': '450px',
            },
            showPrefix: 1
          },
          {
            title: 'FinishPo.Qty',
            name: 'BaseQty'
          },
          {
            title: 'PCB',
            name: 'PCB'
          },
          {
            title: 'LineItem',
            name: 'LineItem',
            render: (row: any) => {
              return row.LineReceivingNumber ? Utils.formatTextNumber(row.LineReceivingNumber) : '';
            }
          },
          {
            title: 'MHU',
            name: 'MHU'
          },
          {
            title: 'ManufactureBarcode',
            name: 'ManufactureBarcode',
            style: {
              'min-width': '140px',
              'max-width': '140px',
            }
          },
          {
            title: 'FinishPo.ActualQty',
            name: 'ReceiveQty'
          }, {
            title: 'FinishPo.Uom',
            name: 'BaseUom'
          }, {
            title: 'FinishPo.ScheduleDate',
            name: 'ScheduleDate',
            borderStyle: (row: any) => {
              if (row.GRStatus) {
                return {
                  color: row.GRStatus == 'ERR' ? '#f05858' : '#7bbd7b'
                }
              }
              return ""
            }
          },
          {
            title: 'FinishPo.ReceiveDate',
            name: 'ReceiveDate',
            borderStyle: (row: any) => {
              if (row.GRStatus) {
                return {
                  color: row.GRStatus == 'ERR' ? '#f05858' : '#7bbd7b'
                }
              }
              return ""
            }
          },
          {
            title: 'FinishPo.Status',
            name: 'Status',
            render: (row: any) => {
              let status = row["Status"] || "Normal";
              return this.translate.instant(`POStatus.${status}`)
            },
            borderStyle: (data: any) => {
              return this.borderColorByStatus(data.Status || "Normal");
            },
            style: {
              'min-width': '150px'
            }
          },
        ]
      },
      data: {
        rows: this.data.Details || [],
        total: this.data.Details.length
      }
    }

    this.receiveConfig = {
      style: {
        'overflow-x': 'hidden'
      },
      rowSelected: true,
      enableSelectRow: true,
      selectedFirstRow: true,
      columns: {
        isContextMenu: false,
        actions: this.initReceiveTableAction(),
        displayedColumns: [
          'index',
          'SessionCode',
          'StartDate',
          'CreatedBy',
          'FinishedDate',
          'FinishedBy',
          'actions'
        ],
        options: [
          {
            title: 'FinishPo.SessionCode',
            name: 'SessionCode',
            style: {
              'min-width': '110px'
              // 'max-width': '100px',
            },
          },
          {
            title: 'FinishPo.StartDate',
            name: 'StartDate',
            style: {
              'min-width': '80px',
            }
          },
          {
            title: 'FinishPo.CreatedBy',
            name: 'CreatedBy',
            style: {
              'min-width': '80px',
            }
          },
          {
            title: 'FinishPo.EstReceiveDate',
            name: 'ScheduleDate'
          },
          {
            title: 'FinishPo.FinishedDate',
            name: 'FinishedDate',
            style: {
              'min-width': '80px',
            }
          },
          {
            title: 'FinishPo.FinishedBy',
            name: 'FinishedBy',
            style: {
              'min-width': '80px',
            },
            render: (data: any) => {
              if (data.FinishedDate) return data.UpdatedBy;
              return ""
            }
          }
        ]
      },
      data: {
        rows: [],
        total: 0
      }
    }

    this.receiveSKUConfig = {
      style: {
        'overflow-x': 'hidden'
      },
      columns: {
        actionTitle: 'action',
        actions: this.initSessionTableAction(),
        isContextMenu: false,
        displayedColumns: [
          'index',
          'SKUName',
          // 'SKU',
          'JobType',
          'BaseQty',
          'BaseUom',
          'TransportDeviceCode',
          'actions'
        ],
        options: [
          {
            title: 'FinishPo.SKUName',
            name: 'SKUName',
            style: {
              'min-width': '170px'
              // 'max-width': '170px',
            },
            render(row: any) {
              return `${row["SKU"]} - ${row["SKUName"]}`
            }
          },
          {
            title: 'FinishPo.SKU',
            name: 'SKU',
            align: "center",
            style: {
              'min-width': '100px',
              'max-width': '120px',
            },
          },
          {
            title: 'FinishPo.JobType',
            name: 'JobType',
            align: "center",
            style: {
              'min-width': '80px',
              'max-width': '80px',
            },
            render: (data: any) => {
              return data.JobType ? this.translate.instant(`FinishPo.${data.JobType}`) : "";
            }
          },
          {
            title: 'FinishPo.Qty',
            name: 'BaseQty',
            align: "center",
            style: {
              'min-width': '70px'
            }
          },
          {
            title: 'FinishPo.Unit',
            name: 'BaseUom',
            align: "center",
            style: {
              'min-width': '45px'
            }
          },
          {
            title: 'FinishPo.PalletCode',
            name: 'TransportDeviceCode',
            style: {
              'min-width': '95px'
              // 'max-width': '90px',
            }
          }
        ]
      },
      data: {
        rows: [],
        total: 0
      }
    }
    this.receiveDocConfig = {
      style: {
        'overflow-x': 'hidden'
      },
      rowSelected: true,
      enableSelectRow: true,
      selectedFirstRow: true,
      columns: {
        actionTitle: this.translate.instant('FinishPo.Action'),
        actions: this.initTableAction(),
        isContextMenu: false,
        onClickCell: (data: any) => {
          if (data.FinishedDate && data.FinishedBy) {
            this.loadDocBySession(data.Code);
          }
        },
        displayedColumns: [
          'index',
          'SessionCode',
          'StartDate',
          'CreatedBy',
          'FinishedDate',
          'FinishedBy',
          'actions'
        ],
        options: [
          {
            title: 'FinishPo.Code',
            name: 'SessionCode',
            style: {
              'min-width': '120px',
              'max-width': '120px',
            },
            onClick: (data: any) => {
              if (data.FinishedDate && data.FinishedBy) {
                this.loadDocBySession(data.Code);
              }
            }
          },
          {
            title: 'FinishPo.StartDate',
            name: 'StartDate'
          },
          {
            title: 'FinishPo.Status',
            name: ' Status',
            render: (data: any) => {
              return data.Status ? this.translate.instant(`POStatus.${data.Status}`) : "";
            }
          },
          {
            title: 'FinishPo.CreatedBy',
            name: 'CreatedBy'
          },
          {
            title: 'FinishPo.FinishedDate',
            name: 'FinishedDate'
          },
          {
            title: 'FinishPo.FinishedBy',
            name: 'FinishedBy',
            render: (data: any) => {
              if (data.FinishedDate) return data.UpdatedBy;
              return ""
            }
          }
        ]
      },
      data: {
        rows: [],
        total: 0
      }
    }

    this.documentConfig = {
      style: {
        'overflow-x': 'hidden'
      },
      columns: {
        isContextMenu: false,
        actionTitle: this.translate.instant('FinishPo.Action'),
        actions: this.initDocTableAction(),
        displayedColumns: [
          'index',
          'Name',
          'CreatedDate',
          'actions'
        ],
        options: [
          {
            title: 'FinishPo.FileName',
            name: 'Name',
            style: {
              'min-width': '200px',
              'max-width': '300px',
            },
          },
          {
            title: 'FinishPo.CreatedDate',
            name: 'CreatedDate',
          }
        ]
      },
      data: {
        rows: this.data.Details || [],
        total: this.data.Details.length
      }
    }

    this.palletTableConfig = {
      style: {
        'overflow-x': 'hidden'
      },
      columns: {
        isContextMenu: false,
        actionTitle: this.translate.instant('FinishPo.Action'),
        actions: this.initDocTableAction(),
        displayedColumns: [
          'index',
          'TransportDeviceCode',
          'Specification',
          'LotNumber',
          'SKU',
          'Qty',
          'Uom',
          'Employee',
          'StartTime',
          'EndTime'
        ],
        options: [
          {
            title: 'FinishPo.TransportDeviceCode',
            name: 'TransportDeviceCode',
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${this.rootPath}/transport-device/${data.TransportDeviceCode}`;
            }
          },
          {
            title: 'specification',
            name: 'Specification'
          },
          {
            title: 'FinishPo.LotNumber',
            name: 'LotNumber',
            render: (row: any) => {
              return row['LotNumber'] || "N/A"
            }
          },
          {
            title: 'FinishPo.SKU',
            name: 'SKU',
            showPrefix: true,
            style: {
              'min-width': '100px',
              'max-width': '120px',
            }
          },
          {
            title: 'FinishPo.Qty',
            name: 'Qty',
          },
          {
            title: 'FinishPo.Uom',
            name: 'Uom',
          },
          {
            title: 'FinishPo.Employee',
            name: 'Employee',
            style: {
              'min-width': '200px',
              'max-width': '200px',
            }
          },
          {
            title: 'FinishPo.StartTime',
            name: 'StartTime',
          },
          {
            title: 'FinishPo.EndTime',
            name: 'EndTime',
          }
        ]
      },
      data: {
        rows: [],
        total: 0
      }
    }
  }

  borderColorByStatus(status: string) {
    if (status != "") {
      return {
        'color': STATUS_BORDER_STO_FINISH[status],
        'border': `2px solid ${STATUS_BORDER_STO_FINISH[status]}`,
        'border-radius': '2px',
        'padding': '5px 10px',
        'font-weight': '500'
      };
    }
    return "";
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
        FinishedDate: data[i].FinishedDate ? moment(data[i].FinishedDate).format('DD-MM-YYYY HH:mm') : '',
        FinishedBy: data[i].FinishedBy
      });

      if (data[i].Details) {
        let jIdx = 1;
        for (let j in data[i].Details) {
          let d = data[i].Details[j]
          receiveSKUData.push({
            Idx: jIdx++,
            SKUName: d.SKUName,
            SKU: d.SKU,
            Uom: d.Uom,
            Qty: d.Qty,
            CaseQty: d.CaseQty
          });
        }
      }
    }
    return [receiveData, receiveSKUData];
  }

  loadData(poCode: string) {
    this.service.getPODetails(poCode)
      .subscribe((resp: any) => {
        if (resp.Data) {
          this.data = {
            POCode: resp.Data.POCode,
            PODate: resp.Data.PODate,
            SessionCode: resp.Data.SessionCode,
            Status: this.translate.instant(`POStatus.${resp.Data.Status}`),
            ReceivingDate: resp.Data.ReceivingDate,
            ReceivedDate: resp.Data.ReceivedDate,
            CreatedDate: resp.Data.CreatedDate,
            EstReceiveDate: resp.Data.EstReceiveDate,
            LastModified: resp.Data.LastModified,
            ContactName: resp.Data.ContactName,
            ContactPhone: resp.Data.ContactPhone,
            ExternalCode: resp.Data.ExternalCode,
            ExternalCode2: resp.Data.ExternalCode2,
            ExternalCode3: resp.Data.ExternalCode3,
            WarehouseName: resp.Data.WarehouseName,
            DocumentNumber: resp.Data.DocumentNumber,
            ConditionType: this.translate.instant(`POConditionType.${resp.Data.ConditionType}`),
            Details: resp.Data.Details,
            FinishedPO: this.translate.instant(`FinishPo.${resp.Data.FinishedPO}`),
            FinishedDate: resp.Data.FinishedDate,
            FinishedBy: resp.Data.FinishedBy,
            Note: resp.Data.Note,
            CanceledBy: resp.Data.CanceledBy,
            CanceledDate: resp.Data.CanceledDate,
            CreatedBy: resp.Data.CreatedBy,
            ClientCode: resp.Data.ClientCode,
            CanceledReason: resp.Data.CanceledReason,
            CanceledNote: resp.Data.CanceledNote,
            Source: resp.Data.Source  ? this.translate.instant(`FinishPo.SourceType.${resp.Data.Source}`) : '',
            VendorId: resp.Data.VendorId,
            VendorContact: resp.Data.VendorContact,
            VendorName: resp.Data.VendorName,
            Subvendor: resp.Data.Subvendor,
            Promotion: resp.Data.Promotion,
            PromotionNote: resp.Data.PromotionNote,
            PromotionCode: resp.Data.PromotionCode,
            ReceiveSessions: resp.Data.ReceiveSessions,
            WarehouseSiteName: resp.Data.WarehouseSiteName,
            POType: this.translate.instant(`POType.${resp.Data.POType}`),
            GRStatus: resp.Data.GRStatus,
            IsPromotion: resp.Data.IsPromotion || false,
            Options: resp.Data.Options || null,
            WarehouseSiteId: resp.Data.WarehouseSiteId
          }
          //show button add SKU free good by NCC. SKU listing SAP not yet
          if (resp.Data.RequestType == 'SYNC_PO' && resp.Data.Status == 'Processing' && !resp.Data.ReceivedDate) {
            this.isShowAddSKU = true;
          }
          if (this.data.GRStatus) {
            this.GRStyle = { color: this.data.GRStatus == 'ERR' ? '#f05858' : '#7bbd7b' }
          }

          if (this.data.Details.length && this.data.Details[0].ScheduleDate) {
            this.tableConfig.columns.displayedColumns.splice(1, 0, "ScheduleDate", "ReceiveDate");
            this.appTable['setConfig']();
          }
          this.appTable['renderData'](this.data.Details);

          this.service.getClient({ Code: this.data.ClientCode })
            .subscribe((resp: any) => {
              if (resp && resp.Data && resp.Data.Code) {
                this.data.ClientFullAddress = resp.Data.FullAddress;
                this.data.ClientFullName = resp.Data.FullName;
                this.data.ClientName = resp.Data.Name;
              }
            });

          // let receiveData = this.parseReceiveData(this.data.ReceiveSessions);
          // this.receiveSessionTable['renderData'](receiveData[0]);
          // this.receiveSessionSKUTable['renderData'](receiveData[1]);
          // this.receiveSessionDocTable['renderData'](receiveData[0]);

          //call get pallet receive
          this.loadPOPallets();
        }
      });
  }

  loadReceiveList() {
    this.service.getPOReceiveList(this.POCode)
      .subscribe((resp: any) => {
        let data = [];
        let selectedIdx = -1;
        if (resp.Status) {
          data = resp.Data;
          for (let idx in data) {
            if (data[idx].Status == RECEIVING_STATUS.Processing) {
              // selectedRow = row;
              selectedIdx = parseInt(idx);
              break;
            }
          }
          this.ReceivedList = data;
        }
        if (data.length && data[0].ScheduleDate) {
          this.receiveConfig.columns.displayedColumns.splice(4, 0, "ScheduleDate");
          this.receiveSessionTable['setConfig']();
        }
        this.receiveSessionTable['renderData'](data, selectedIdx);
        this.receiveSessionDocTable['renderData'](data);

        if (data.length) {
          this.loadReceiveDetails(data[selectedIdx > 0 ? selectedIdx : 0].SessionCode);
          this.loadDocBySession(data[0].SessionCode);
        }
      })
  }

  loadReceiveDetails(sessionCode: string = "") {
    this.service.getPOReceiveDetails(this.POCode, sessionCode)
      .subscribe((resp: any) => {
        let data = [];
        if (resp.Status) {
          data = resp.Data;
        }
        this.receiveSessionSKUTable['renderData'](data);
      })
  }

  loadPOPallets() {
    let details = {};
    for (let item of this.data.Details) {
      let key = `${item.SKU}_${item.PromotionRef || ''}`
      details[key] = item;
    }
    this.service.getPOPallet(this.POCode)
      .subscribe((resp: any) => {
        let data = [];
        if (resp.Status) {
          data = resp.Data;
        }
        let tmp = {}
        for (let item of data) {
          let key = `${item.TransportDeviceCode}_${item.SKU}`;
          if (!tmp[key]) {
            tmp[key] = [];
          }
          if (details[`${item.SKU}_${item.PromotionRef || ''}`]) {
            item.Prefix = details[`${item.SKU}_${item.PromotionRef || ''}`]['Prefix'];
          }
          else if (item.PromotionRef) {
            item.Prefix = "KM";
          }

          tmp[key].push(item);
        }
        data = []
        for (let idx in tmp) {
          let item = tmp[idx].sort(function (a: any, b: any) {
            if (a.PromotionRef < b.PromotionRef) return -1
            return 1
          })
          data = data.concat(item)
        }
        this.palletTable['renderData'](data);
      })
  }

  isEnableFinish() {
    return this.data.ReceivedDate && this.data.Status === this.translate.instant('POStatus.Processing');
  }
  isEnableFinishReceive() {
    return !this.data.ReceivedDate && this.data.ReceivingDate;
  }
  showConfirmFinish(msg: string = "") {
    const dialogRef = this.dialog.open(NotificationComponent, {
      data: {
        message: msg,
        note: `Bạn có chắc chắn muốn Hoàn thành PO ${this.data.POCode}?`,
        type: 1
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.finishPO(true);
      }
    });
  }
  confirmFinishReceive(code: string) {
    const dialogRef = this.dialog.open(NotificationComponent, {
      data: {
        message: `Bạn có chắc chắn muốn kết thúc Phiên nhận hàng: ${code}?`,
        type: 1
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.finishReceive({
          Code: code,
          Details: []
        });
      }
    });
  }

  finishPO(isConfirmed: boolean = false) {
    if (!this.data.POCode) {
      return;
    }
    this.service.finishPO({
      "POCode": this.data.POCode,
      "IsConfirmed": isConfirmed
    })
      .subscribe((resp: any) => {
        if (resp.ErrorMessages && resp.ErrorMessages.length) {
          this.toast.error(`POPallet.Error.${resp.ErrorMessages[0]}`, 'error_title');
        }
        else {
          let isConfirmed = resp.Data['IsConfirmed'];
          if (isConfirmed === false) {
            let msg = "";
            if (resp.Data && resp.Data['ScheduleDateGroups']) {
              let errorMsg = '', schedules = [];
              for (let i of resp.Data['ScheduleDateGroups']) {
                if (i.Status == 'Receiving') {
                  errorMsg = `Phiên nhận hàng ${i.Schedule} của PO đang thực hiện nhận hàng. Vui lòng kiểm tra lại`;
                  break;
                }
                else if (i.Status == 'New') {
                  schedules.push(i.Schedule);
                }
              }
              if (errorMsg) {
                this.toast.error(errorMsg, 'error_title');
                return;
              }
              if (schedules.length) {
                msg = `Phiên nhận hàng [${schedules.join(',')}] của PO chưa nhận hàng. Khi PO Hoàn thành, hệ thống sẽ tự động Đóng Phiên nhận hàng này!`;
              }
            }
            if (!msg) {
              if (resp.Data['TotalReceiveQty'] < resp.Data['TotalQty']) {
                msg = `PO nhận hàng thiếu ${resp.Data['TotalReceiveQty']}/${resp.Data['TotalQty']} units.`;
              }
            }
            this.showConfirmFinish(msg);
          } else {
            this.data.Status = this.translate.instant('POStatus.Finished');
            this.toast.success(`Hoàn thành PO ${this.data.POCode} thành công`, 'success_title');
            setTimeout(function () {
              window.location.reload();
            }, 5000);
          }
        }
      })
  }

  finishReceive(data: any) {
    this.service.finishReceivePO({
      "POCode": this.data['POCode'],
      "DirectPO": 0,
      SessionCode: data.Code,
      Details: data.Details || []
    })
      .subscribe((resp: any) => {
        if (resp.Status === true) {
          let tmp = this.receiveSessionTable['data']['rows'];
          let index = -1;
          for (let i = 0; i < tmp.length; i++) {
            if (tmp[i].SessionCode == data.Code) {
              index = i;
              break;
            }
          }
          if (index != -1) {
            this.receiveSessionTable['data']['rows'][index].Status = 'Finished';
            this.receiveSessionTable['updateRow'](index);
          }

          this.toast.success("POPallet.FinishPOSuccess", "success_title");
          setTimeout(() => {
            window.location.reload();
          }, 1000)
        } else {
          if (resp.ErrorMessages && resp.ErrorMessages.length) {
            this.toast.error(`POPallet.Error.${resp.ErrorMessages[0]}`, 'error_title');
          }
        }
      })
  }
  confirmPromotionfinishReceive(code: string) {
    if (this.data.IsPromotion) {
      const dialogRef = this.dialog.open(confirmFinishPOSession, {
        disableClose: true,
        data: {
          POCode: this.POCode,
          POSessionCode: code
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.finishReceive({
            Code: code,
            Details: result
          });
        }
      });
    }
  }

  cancel() {
    this.router.navigate([`/${window.getRootPath(true)}/purchaseorder/list`]);
  }

  initEvent() {
    this.receiveSessionDocTable['actionEvent'].subscribe({
      next: (event: any) => {
        if (!event) {
          return;
        }
        const action = event["action"];
        switch (action) {
          case 'upload-doc':
            this.resetUpload();
            this.receiveRowUpload = event.data;
            document.getElementById('inputFile').click();
            break;
          case 'view-doc':
            this.loadDocBySession(event.data.SessionCode);
            break;
        }
      }
    });
    this.documentTable['actionEvent'].subscribe({
      next: (event: any) => {
        if (!event) {
          return;
        }
        const action = event["action"];
        switch (action) {
          case 'remove-doc':
            this.confirmRemoveDoc(event.data);
            break;
          case 'download-doc':
            this.service.downloadDocument({ FileId: event.data['Id'] });
            // window.open(event.data.FilePath);
            break;
        }
      }
    });
    this.receiveSessionTable['actionEvent'].subscribe({
      next: (event: any) => {
        if (!event) {
          return;
        }
        const action = event["action"];
        switch (action) {
          case 'view-doc':
            this.loadReceiveDetails(event.data.SessionCode);
            break;
          case 'print-doc':
            this.createPOPrint(event.data, '');
            break;
          case 'print-doc-pdf':
            this.createPOPrint(event.data, 'pdf');
            break;
          case 'finish-receiving':
            // if (this.data.IsPromotion) { 
            // this.confirmPromotionfinishReceive(event.data.SessionCode);
            // } else {
            this.confirmFinishReceive(event.data.SessionCode);
            // }
            break;
        }
      }
    });
    this.receiveSessionSKUTable['actionEvent'].subscribe({
      next: (event: any) => {
        if (!event) {
          return;
        }
        const action = event["action"];
        switch (action) {
          case 'print-pa':
            this.printPalletCode(event.data.TransportDeviceCode);
            // alert('IN PALLET::' + event.data.TransportDeviceCode)
            break;
        }
      }
    });
    this.appTable['actionEvent'].subscribe({
      next: (event: any) => {
        if (!event) {
          return;
        }
        const action = event["action"];
        switch (action) {
          case 'del-sku':
            this.confirmDelSKU(event.data);
            break;
        }
      }
    });
  }
  async printPalletCode(keyCode: String) {
    const printer = window.localStorage.getItem("_printer");
    if (!printer) {
      this.toast.error(`Vui lòng chọn máy in`, 'error_title');
      return;
    }
    const dataPrint = this.printService.repairMultiDataPalletorTote([keyCode], "Pallet");
    const rsPrint = await this.printService.sendToSmartPrintV2(dataPrint, keyCode, printer);
    if (rsPrint) this.toast.success(`In thành công cho Pallet: ${keyCode} thiết bị `, 'success_title');
  }
  printPODetail(event: any, type: string) {
    // call print Phieu nhap kho - Chua start receive
    let schedules = {};
    for (let s of this.data.Details) {
      if (s.ScheduleDate && !schedules[s.ScheduleDate]) {
        schedules[s.ScheduleDate] = {
          ScheduleDate: s.ScheduleDate,
          SessionCode: s.SessionCode,
          Text: s.SessionCode ? s.SessionCode : 'Chưa nhận hàng'
        }
      }
    }
    if (Object.keys(schedules).length) {
      const dialogRef = this.dialog.open(confirmPrint, {
        disableClose: true,
        data: Object.values(schedules)
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (result && result.SessionCode && (result.SessionCode != "NONE")) {
            const session = this.ReceivedList.find(x => x.SessionCode == result.SessionCode);
            this.createPOPrint(session, type);
          }
          else {
            this.createPOPrint({
              ScheduleDate: result.ScheduleDate,
              SessionCode: '',
              FinishedDate: '',
              ReceivingDate: ''
            }, type);
          }
        }
      });
    }
    else {
      this.createPOPrint(null, type);
    }
  }
  createPOPrint(dataSession: any, type: string = "") {
    const printer = window.localStorage.getItem("_printer");
    if (!printer && type == "") {
      this.toast.error(`Vui lòng chọn máy in`, 'error_title');
      return;
    }
    if (dataSession && dataSession.SessionCode) {
      const $this = this;
      $this.service.getPOReceiveDetails($this.POCode, dataSession.SessionCode)
        .subscribe((resp: any) => {
          let data = [];
          if (resp.Status) {
            data = resp.Data;
          }
          const dataPrint = $this.repairDataPO(dataSession, data);
          if (type == 'pdf') {
            $this.createPDF(dataPrint, `Phieu_Nhap_Kho_${$this.POCode}`)
          } else {
            $this.sendToSmartPrintV2(dataPrint, dataPrint.data.POCode, printer)
          }
        });
    }
    else {
      const dataPrint = this.repairDataPO(dataSession);
      if (type == 'pdf') {
        this.createPDF(dataPrint, `Phieu_Nhap_Kho_${this.POCode}`)
      } else {
        this.sendToSmartPrintV2(dataPrint, dataPrint.data.POCode, printer)
      }
    }
  }
  async createPDF(dataPrint: any, fileName: string) {
    const pdfFile = await this.printService.getPDF(dataPrint);
    fs.saveAs(
      pdfFile,
      fileName
    );
  }
  sendToSmartPrintV1(data: any) {
    const _toast = this.toast
    new Promise(function (resolve, reject) {
      if (!data) {
        resolve({ Status: "FINISHED" });
      }
      var ws = new WebSocket("ws://127.0.0.1:2377/");
      ws.onerror = function () {
        _toast.error(`In ${data.label} thất bại: ${data.data.POCode}`, 'error_title');
        resolve({ Status: "FINISHED" });
        ws.close();
      }
      ws.onmessage = function (event) {
        if (event.data) {
          const statusPrint = JSON.parse(event.data)
          if (statusPrint.msg == 'ok') {
            _toast.success(`In ${data.label} ${data.data.POCode} thành công`, 'success_title');
          }
          else {
            _toast.error(`In ${data.label} thất bại: ${data.data.POCode}`, 'error_title');
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
  repairDataPO(dataSession: any, receiveSession: any = []) {
    const dataPrint = {
      "label": "Phiếu Nhập Kho",
      "printer_name": "PrinterPaper",
      "printer": 'PrinterPaper',
      "printerDefault": "PrinterPurchase_Landscape",
      "template": 'PrinterPurchase_Landscape_V3',
      "options": { "Orientation": "portrait" },
      "data": null,
      "url": ""
    }
    let dataPO = JSON.parse(JSON.stringify(this.data));

    dataPO.ClientFullAddress = this.data.ClientFullAddress;
    dataPO.ClientFullName = this.data.ClientFullName;
    dataPO.ClientName = this.data.ClientName;

    dataPO['TotalReceice'] = 0;
    dataPO['TotalRequest'] = 0;
    dataPO['TotalCase'] = 0;
    dataPO['TotalPOQtyByCase'] = 0;
    let details = [];

    if (dataSession && dataSession.SessionCode) {
      dataPO['SessionCode'] = dataSession.SessionCode;
      dataPO['SessionScheduleDate'] = dataSession.ScheduleDate;
      dataPO['SessionReceivedDate'] = dataSession.FinishedDate;
      dataPO['SessionReceivingDate'] = dataSession.ReceivingDate;
    }

    if (receiveSession && receiveSession.length) {
      let sku = {};
      for (let item of receiveSession) {
        let qty = item.BaseQty;
        if (!sku[item.SKU]) {
          sku[item.SKU] = {
            SKU: item.SKU,
            LotNumber: item.LotNumber,
            SessionCode: item.SessionCode,
            ReceiptQty: 0
          };
        }
        dataPO['TotalReceice'] += qty;
        sku[item.SKU]['ReceiptQty'] += qty;
        sku[item.SKU]['ProductName'] = item.SKUName;
        sku[item.SKU]['UnitName'] = item.BaseUom;
        sku[item.SKU]['ExpiredDate'] = item.ExpiredDate || "";
      }
      const receiveSessionCodes = receiveSession.map(session => session.SessionCode);
      if (Object.keys(sku).length) {
        for (let item in sku) {
          let podetails = dataPO.Details.filter(x => x.SKU == item && receiveSessionCodes.includes(x.SessionCode));
          if (podetails.length) {
            if (dataPO.Options && dataPO.Options.AllowReceivingPartial == true && !podetails.find(x => x.SessionCode == dataSession.SessionCode)) {
              continue;
            }
            let detail = podetails[0];
            if (detail && detail.SKU) {
              dataPO['TotalRequest'] += (typeof (detail.BaseQty) === "number" && parseInt(detail.BaseQty) > 0) ? parseInt(detail.BaseQty) : 0;
              dataPO['TotalCase'] += (typeof (detail.QtyByCase) === "number" && parseFloat(detail.QtyByCase) > 0) ? parseFloat(detail.QtyByCase) : 0;
              dataPO['TotalPOQtyByCase'] += (typeof (detail.POQtyByCase) === "number" && parseFloat(detail.POQtyByCase) > 0) ? parseFloat(detail.POQtyByCase) : 0;
              sku[item]['RequestQty'] = (typeof (detail.BaseQty) === "number" && parseInt(detail.BaseQty) > 0) ? this.formatNumber(detail.BaseQty, 0, ".", ",") : null;
              sku[item]['QtyByCase'] = (typeof (detail.QtyByCase) === "number" && parseFloat(detail.QtyByCase) > 0) ? this.formatNumber(detail.QtyByCase, 0, ".", ",") : null;
              sku[item]['POQtyByCase'] = detail.POQtyByCase || null;

              sku[item] = Object.assign(detail, sku[item]);
            }
          }
        }
        details = Object.values(sku);
      }
    }
    else {
      for (let sku of dataPO.Details) {
        if (dataSession && dataSession.ScheduleDate && sku.ScheduleDate && sku.ScheduleDate != dataSession.ScheduleDate) {
          continue;
        }
        dataPO['TotalReceice'] += (typeof (sku.ReceiveQty) === "number" && parseInt(sku.ReceiveQty) > 0) ? parseInt(sku.ReceiveQty) : 0;
        dataPO['TotalRequest'] += (typeof (sku.BaseQty) === "number" && parseInt(sku.BaseQty) > 0) ? parseInt(sku.BaseQty) : 0;
        dataPO['TotalCase'] += (typeof (sku.QtyByCase) === "number" && parseFloat(sku.QtyByCase) > 0) ? parseFloat(sku.QtyByCase) : 0;
        dataPO['TotalPOQtyByCase'] += (typeof (sku.POQtyByCase) === "number" && parseFloat(sku.POQtyByCase) > 0) ? parseFloat(sku.POQtyByCase) : 0;
        sku['ProductName'] = sku.SKUName;
        sku['UnitName'] = sku.CaseUom;
        sku['ExpiredDate'] = sku.ExpiredDate || "";
        sku['ReceiptQty'] = (typeof (sku.ReceiveQty) === "number" && parseInt(sku.ReceiveQty) > 0) ? this.formatNumber(sku.ReceiveQty, 0, ".", ",") : null;
        sku['RequestQty'] = (typeof (sku.BaseQty) === "number" && parseInt(sku.BaseQty) > 0) ? this.formatNumber(sku.BaseQty, 0, ".", ",") : null;
        sku['QtyByCase'] = (typeof (sku.QtyByCase) === "number" && parseFloat(sku.QtyByCase) > 0) ? this.formatNumber(sku.QtyByCase, 0, ".", ",") : null;
        sku['POQtyByCase'] = sku.POQtyByCase || null;
        details.push(sku);
      }
    }
    dataPO.Details = details;

    dataPO['TotalReceice'] = dataPO['TotalReceice'] > 0 ? this.formatNumber(dataPO['TotalReceice'], 0, ".", ",") : null;
    dataPO['TotalRequest'] = dataPO['TotalRequest'] > 0 ? this.formatNumber(dataPO['TotalRequest'], 0, ".", ",") : null;
    dataPO['TotalCase'] = dataPO['TotalCase'] > 0 ? this.formatNumber(dataPO['TotalCase'], 0, ".", ",") : null;
    dataPO['TotalPOQtyByCase'] = dataPO['TotalPOQtyByCase'] > 0 ? dataPO['TotalPOQtyByCase'] : null;
    const warehouseInfor = JSON.parse(window.localStorage.getItem('_info'));
    dataPO['AccountId'] = warehouseInfor && warehouseInfor.Id ? warehouseInfor.Id : "";
    dataPO['WarehouseName'] = warehouseInfor && warehouseInfor.SiteInfo && warehouseInfor.SiteInfo.Name || "";
    dataPO['WarehouseAddress'] = warehouseInfor && warehouseInfor.SiteInfo && warehouseInfor.SiteInfo.Contact.Address || "";
    dataPO['WarehouseContact'] = warehouseInfor && warehouseInfor.SiteInfo && warehouseInfor.SiteInfo.Contact.ContactName || "";
    dataPO['WarehousePhone'] = warehouseInfor && warehouseInfor.SiteInfo && warehouseInfor.SiteInfo.Contact.ContactPhone || "";
    dataPrint.data = dataPO;
    return dataPrint;
  }
  sendToSmartPrintV2(dataPrint: any, keyCode: String, printer: string) {
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
    formData.append('Type', DOCUMENT_TYPE.POReceipt);
    formData.append('ObjectType', DOCUMENT_OBJECTTYPE.PO);
    formData.append('ObjectCode', this.data.POCode);
    formData.append('SubObjectCode', this.receiveRowUpload.SessionCode);
    formData.append('WarehouseCode', window.localStorage.getItem('_warehouse') || 'CCH');

    this.service.uploadDocument(formData)
      .subscribe((resp: any) => {
        this.saveSession(this.receiveRowUpload.SessionCode, resp);
        if (resp['Status']) {
          this.toast.success('Upload file thành công', 'success_title');
          if (this.receiveRowUpload) {
            this.loadDocBySession(this.receiveRowUpload.SessionCode);
          }
          this.resetUpload();
        } else {
          this.toast.error('Upload file không thành công', 'error_title');
          this.resetUpload();
        }
      });
  }
  saveSession(code: any, resp: any) {
    this.loadDocBySession(code);
  }

  loadDocBySession(code: string) {
    if (!this.currentDocDetailSession || this.currentDocDetailSession !== code) {
      this.service.getDocuments({ SubObjectCode: code, ObjectType: DOCUMENT_OBJECTTYPE.PO, Type: DOCUMENT_TYPE.POReceipt })
        .subscribe((resp: any) => {
          if (resp.Data) {
            this.currentDocDetailSession = code;
            this.documentTable['renderData'](resp.Data);
          }
        });
    }
  }

  checkUploadFile(files: any) {
    this.checkFileExtention = false;
    this.checkFileExtentionError = false;
    this.nameFileUpload = files[0].name ? files[0].name : '';
    let ext = this.nameFileUpload.split('.').pop();

    if (['doc', 'docx', 'pdf', 'png', 'jpg', 'jpeg'].indexOf(ext) != -1) {
      const fileSize = Math.round((files[0].size / 1024));
      if (fileSize > 10240) {
        this.toast.error('POErrors.EPO110', 'error_title');
      }
      else {
        this.fileUpload = files[0];
        const dialogRef = this.dialog.open(ConfirmComponent, {
          data: {
            isupload: true,
            title: 'Bạn có chắc chắn upload file chứng từ?',
            fileName: this.nameFileUpload,
            code: this.receiveRowUpload.SessionCode
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
    } else {
      this.checkFileExtention = false;
      this.toast.error('POErrors.EPO109', 'error_title');
    }
  }
  confirmRemoveDoc(obj: any) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: {
        isupload: true,
        title: 'Bạn có chắc chắn Huỷ chứng từ?',
        fileName: obj.Name,
        code: this.data.SessionCode
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.removeDoc(obj);
      }
    });
  }
  removeDoc(data: any) {
    let tmp = this.documentTable['data']['rows'];
    let index = -1;
    for (let i = 0; i < tmp.data.length; i++) {
      if (tmp.data[i].Id == data.Id) {
        index = i;
        break;
      }
    }

    this.service.removeDocument({ FileId: data.Id })
      .subscribe((resp: any) => {
        if (resp['Status']) {
          this.toast.success('Huỷ chứng từ thành công', 'success_title');
          if (index != -1) {
            this.documentTable['removeRow'](index);
          }
        } else {
          this.toast.error('Huỷ chứng từ không thành công', 'error_title');
        }
      });
  }
  showPopupAddSKU() {
    const dialogRef = this.dialog.open(PopupAddSKUComponent, {
      data: {
        POCode: this.POCode,
        ExternalCode: this.data['ExternalCode'],
        WarehouseSiteId: this.data["WarehouseSiteId"],
        ClientCode: this.data["ClientCode"]
      },
      "width": "600px",
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData(this.POCode);
      }
    });
  }
  initTableDetailAction(): TableAction[] {
    return [
      {
        icon: "delete",
        name: 'del-sku',
        class: 'ac-remove',
        toolTip: {
          name: "Xóa sản phẩm",
        },
        disabledCondition: (row: any) => {
          return (this.isShowAddSKU && row.Source && row.Source === "SUPRA" && row.ReceiveQty === 0);
        }
      }
    ];
  }
  private confirmDelSKU(data: any) {
    const dialogRef = this.dialog.open(NotificationComponent, {
      data: {
        message: `Bạn có chắc chắn muốn xóa sản phẩm [${data.SKU} - ${data.SKUName}] ra khỏi PO: ${this.POCode}?`,
        type: 1
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.removeSKUFromPO(data);
      }
    });
  }
  private removeSKUFromPO(data: any) {
    this.service.removeSKUFromPO({
      SKU: data.SKU,
      POCode: this.POCode,
    }).subscribe(resp => {
      if (resp.Status && resp.Data) {
        this.toast.success("Cập nhập dữ liệu thành công!", "success_title");
        this.loadData(this.POCode);
      } else {
        const msg = resp.ErrorMessages && resp.ErrorMessages.length ? resp.ErrorMessages.join(",") : "Có lỗi xảy ra. Vui lòng kiểm tra lại!";
        this.toast.error(msg, 'error_title');
      }
    })
  }
}
