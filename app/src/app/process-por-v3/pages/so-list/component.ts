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

import { STATUS_BORDER_STO_FINISH, SO_CANCELED_STATUS } from '../../../shared/constant';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Service } from '../../service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../shared/toast.service';
import { NotificationComponent } from '../../../components/notification/notification.component';
import * as moment from 'moment';
import { Utils } from '../../../shared/utils';
import { TableAction } from '../../../interfaces/tableAction';


@Component({
  selector: 'app-list-por',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})

export class ListSOComponent implements OnInit, AfterViewInit {

  isOnlyDC = false;

  tableConfig: any;
  statusConfig: Object;
  filters: Object;
  // warehouseHandleConfig: Object;
  regionCode: string;
  configDate: any;
  wareHouseList: any = [];
  soStatusConfig: Object;
  // poTypeConfig: Object;
  // storeConfig: Object;
  vendorConfig: Object;
  // storeTypeConfig: Object;
  promotionConfig: Object;
  clientConfig: Object;
  // storePriorityConfig: Object;
  warehouseBrachConfig: any;
  rootPath = window.getRootPath();

  @ViewChild('fromDate', { static: false }) fromDate: any;
  @ViewChild('toDate', { static: false }) toDate: any;
  @ViewChild('whCode', { static: false }) whCode: any;
  @ViewChild('status', { static: false }) status: any;
  // @ViewChild('potype', { static: false }) potype: any;
  @ViewChild('vendor', { static: false }) vendor: any;
  // @ViewChild('storetype', { static: false }) storetype: any;
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('inputFile', { static: false }) inputFile: ElementRef;
  @ViewChild('client', { static: false }) client: any;
  // @ViewChild('storepriority', { static: false }) storepriority: any;
  @ViewChild('whBranchCombo', { static: false }) whBranchCombo: any;
  @ViewChild("content", { static: false }) contentEle: ElementRef;
  // @ViewChild("cbbWarehouseCode", { static: false }) cbbWarehouseCode: any;

  constructor(
    private translate: TranslateService,
    private toast: ToastService,
    private service: Service,
    public dialog: MatDialog,
    private router: Router) { }

  ngOnInit() {
    this.filters = {
      Content: '',
      WarehouseCode: window.localStorage.getItem('_warehouse') || "",
      WHBranchCode: '',
      FromDate: moment().subtract(7, 'day').format('YYYY-MM-DD'),
      ToDate: moment().format('YYYY-MM-DD'),
      RegionCode: '',
      Promotion: '',
      Vendor: '',
      Store: '',
      StoreType: '',
      ClientCode: '',
      Status: '',
      Type: '',
      RequestType: "POR"
    };

    this.initData();
  }

  initData() {
    this.isOnlyDC = window.loadSettings("EnableDCSite");
    this.initTable();

    let region = window.localStorage.getItem('region') || 'none';
    if (region != 'none') {
      this.regionCode = JSON.parse(region)['Code'];
      this.filters['RegionCode'] = this.regionCode;
    }

    this.clientConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      isSorting: false,
      isSelectedAllValueIsEmpty: true,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return this.renderValueCombo(option);
      },
      type: 'combo',
      filter_key: 'Name',
      URL_CODE: 'SFT.clientcombo'
    };

    // this.poTypeConfig = {
    //   selectedFirst: false,
    //   isSelectedAll: false,
    //   val: (option: any) => {
    //     return option['Code'];
    //   },
    //   render: (option: any) => {
    //     return option['Name'];
    //   },
    //   type: 'autocomplete',
    //   filter_key: 'Name',
    //   data: [
    //     { Code: "New", Name: "Mới" }
    //   ]
    // };

    // this.storeConfig = {
    //   selectedFirst: false,
    //   isSelectedAll: false,
    //   isSorting: false,
    //   disableAutoload: true,
    //   val: (option: any) => {
    //     return option['Code'];
    //   },
    //   render: (option: any) => {
    //     return this.renderValueCombo(option);
    //   },
    //   type: 'autocomplete',
    //   filter_key: 'Code',
    //   URL_CODE: 'SFT.storecombo'
    // };

    this.vendorConfig = {
      selectedFirst: false,
      isSelectedAll: false,
      isSorting: false,
      disableAutoload: false,
      isSelectedAllValueIsEmpty: '',
      val: (option: any) => {
        return option['VendorId'];
      },
      render: (option: any) => {
        return option['VendorId'] ? `${option['VendorId']} - ${option['Name']}` : option['Name'];
      },
      type: 'autocomplete',
      filter_key: 'Code',
      URL_CODE: 'SFT.vendorcombo'
    };

    this.soStatusConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      isSelectedAllValueIsEmpty: true,
      filters: {
        Collection: 'INV.SO',
        Column: 'Status'
      },
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Description'];
      },
      type: 'autocomplete',
      filter_key: 'Description',
      URL_CODE: 'SFT.enum'
    };
    this.warehouseBrachConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      isSorting: false,
      isFilter: true,
      disableAutoload: true,
      val: (option: any) => {
        return option["Code"];
      },
      render: (option: any) => {
        return this.renderValueCombo(option);
      },
      type: 'combo',
      filter_key: 'Name',
      filters: {
        // data: this.filters['WhCode']
      },
      URL_CODE: 'SFT.branchscombo'
    };

    // this.storeTypeConfig = {
    //   selectedFirst: true,
    //   isSelectedAll: true,
    //   filters: {
    //     Collection: 'GEO.Stores',
    //     Column: 'Type'
    //   },
    //   val: (option: any) => {
    //     return option['Code'];
    //   },
    //   render: (option: any) => {
    //     return option['Code'] ? `${option['Code']} - ${option['Description']}` : option['Description'];
    //   },
    //   type: 'autocomplete',
    //   filter_key: 'Description',
    //   URL_CODE: 'SFT.enum'
    // };
    // this.storePriorityConfig = {
    //   selectedFirst: true,
    //   isSelectedAll: true,
    //   disableAutoload: true,
    //   filters: {
    //     Collection: 'GEO.Stores',
    //     Column: 'Attributes.Priority'
    //   },
    //   val: (option: any) => {
    //     return option['Code'];
    //   },
    //   render: (option: any) => {
    //     return option['Code'] ? `${option['Code']} - ${option['Description']}` : option['Description'];
    //   },
    //   type: 'combo',
    //   filter_key: 'Description',
    //   URL_CODE: 'SFT.enum'
    // };

    // this.warehouseHandleConfig = {
    //   selectedFirst: true,
    //   isSelectedAll: true,
    //   isSorting: false,
    //   isFilter: true,
    //   disableAutoload: true,
    //   val: (option: any) => {
    //     return option['Code'];
    //   },
    //   render: (option: any) => {
    //     return this.renderValueCombo(option);
    //   },
    //   type: 'combo',
    //   filter_key: 'Name',
    //   filters: {
    //     data: this.filters['WhCode']
    //   },
    //   URL_CODE: 'SFT.branchscombo'
    // }
  }

  initTableAction(): TableAction[] {
    return [
      {
        icon: "remove_circle",
        class: 'ac-remove',
        name: 'cancel-por',
        toolTip: {
          name: this.translate.instant('POR.CancelSO'),
        },
        disabledCondition: (row) => {
          return (SO_CANCELED_STATUS.indexOf(row.Status) != -1);
        }
      },
      {
        icon: "replay",
        class: 'ac-task',
        name: 'gi-por',
        toolTip: {
          name: this.translate.instant('POR.ConfirmGI'),
        },
        disabledCondition: (row: any) => {
          return row.ExternalCode && row.Status !== "Canceled" && row.GIStatus === "ERR";
        }
      },
      // {
      //   icon: "replay",
      //   class: 'ac-task',
      //   name: 'gr-por',
      //   toolTip: {
      //     name: this.translate.instant('POR.ConfirmGR'),
      //   },
      //   disabledCondition: (row: any) => {
      //     return row.ExternalCode && row.Status !== "Canceled" && row.GIStatus === "OK" && (!row.GRStatus || row.GRStatus === "ERR");
      //   }
      // },
    ];
  }

  initTable() {
    let _displayedColumns = [
      "index", "SOCode", "ExternalCode", "Vendor",
      // "Priority", 
      "SOType",
      "Status", "CreatedDate", "CreatedBy",
      'actions',
    ]

    if(this.isOnlyDC) {
      _displayedColumns = [
        "index", "WarehouseSiteId", "SOCode", "ExternalCode", "Vendor", 
        // "Priority", 
        "SOType", "Status", "CreatedDate","CreatedBy", 'actions',
      ]
    }

    this.tableConfig = {
      style: {
        'overflow-x': 'hidden'
      },
      columns: {
        isContextMenu: false,
        actionTitle: this.translate.instant('FinishPo.Action'),
        actions: this.initTableAction(),
        displayedColumns: _displayedColumns,
        options: [
          {
            title: 'SODetails.WarehouseSiteId',
            name: 'WarehouseSiteId',
            render: (data: any) => {
              return data.WarehouseSiteName ? `${data.WarehouseSiteId} - ${data.WarehouseSiteName}` : `${data.WarehouseSiteId}`;
            }
          },
          {
            title: "POR.SOCode",
            name: "SOCode",
            link: true,
            newpage: true,
            onClick: (data: any) => {
              if (data["PickingType"]) {
                return `/${this.rootPath}/por/details/${data.SOCode}?PickType=${data["PickingType"]}`;
              }
              return `/${this.rootPath}/por/details/${data.SOCode}`;
            },
            style: {
              "min-width": "150px",
              // "max-width": "160px",
            },
          },
          {
            title: "POR.ExternalCode",
            name: "ExternalCode",
            borderStyle: (row: any) => {
              return this.renderColor(row);
            },
            style: {
              "min-width": "150px",
              // "max-width": "180px",
            },
          },
          {
            title: "POR.Vendor",
            name: "Vendor",

            style: {
              "min-width": "200px",
              // "max-width": "260px",
            },
          },
          {
            title: "Priority",
            name: "Priority",
            style: {
              "min-width": "80px",
              // "max-width": "100px",
            },
            borderStyle: (row: any) => {
              return row.Priority == "VIP" ? { color: "#7bbd7b" } : null;
            },
          },
          {
            title: "POR.SOType",
            name: "SOType",
            render: (data: any) => {
              return data.SOType
                ? this.translate.instant(`PORType.${data.SOType}`)
                : "";
            },
            borderStyle: (row: any) => {
              return this.renderSOTypeColor(row);
            },
            style: {
              "min-width": "80px",
              // "max-width": "80px",
            },
          },

          {
            title: "STO.STOStatus",
            name: "Status",
            class: "border-primary",
            render: (data: any) => {
              return this.translate.instant(`SOStatus.${data.Status}`);
            },
            style: {
              "min-width": "140px",
              // "max-width": "170px",
            },
            borderStyle: (row: any) => {
              return this.borderColorByStatus(row.Status);
            },
          },
          {
            title: "STO.SODate",
            name: "CreatedDate",
            style: {
              "min-width": "100px",
              // "max-width": "100px",
            },
          },
          {
            title: 'SODetails.UpdatedDate',
            name: 'UpdatedDate'
          },
          {
            title: "SODetails.CreatedBy",
            name: "CreatedBy",
            // style: {
            //   "min-width": "100px",
            //   "max-width": "100px",
            // },
          },
        ],
      },
      remote: {
        url: this.service.getPORList(),
        params: {
          filter: JSON.stringify(this.filters)
        },
        callback: function (rs: any) {

        }
      }
    };
  }
  private renderColor(row: any) {
    if (row.GRStatus) {
      if (row.GRStatus == 'OK') {
        return {
          color: '#ffffff',
          background: '#00DF00',
          padding: '0 2px'
        };
      } else if (row.GRStatus == 'E' || row.GRStatus == 'ERR') {
        return {
          background: '#f05858',
          padding: '0 2px'
        };
      }
    }
    else if (row.GIStatus) {
      if (row.GIStatus == 'OK') {
        return {
          color: '#00DF00'
        };
      } else if (row.GIStatus == 'ERR') {
        return {
          color: '#f05858'
        };
      }
    }
    if (row.GIStatus || row.GRStatus) {
      return { color: '#7bbd7b' };
    }
    return null;
  }
  private renderSOTypeColor(row: any) {
    if (row.SOType) {

      return {
        color: '#fff'
      }
    }
    return null;
  }
  borderColorByStatus(status: string) {
    if (status != "") {
      return {
        color: STATUS_BORDER_STO_FINISH[status],
        border: `2px solid ${STATUS_BORDER_STO_FINISH[status]}`,
        "border-radius": "2px",
        padding: "5px 10px",
        "font-weight": "500",
      };
    }
    return "";
  }

  ngAfterViewInit() {
    this.initEvent();

    const sevenDayBefore = moment().subtract(7, 'day').toDate();
    this.fromDate.setValue(sevenDayBefore);

    let region = window.localStorage.getItem('region') || 'none';
    if (region != 'none') {
      this.regionCode = JSON.parse(region)['Code'];
      this.filters['RegionCode'] = JSON.parse(region)['Code'];
    }
    this.appTable['search'](this.filters);

    setTimeout(() => {
      this.contentEle.nativeElement.focus();
    }, 200)
  }

  initEvent() {
    this.fromDate['change'].subscribe({
      next: (value: any) => {
        this.compareDate();
      }
    });

    this.toDate['change'].subscribe({
      next: (value: any) => {
        this.compareDate();
      }
    });

    this.appTable['actionEvent'].subscribe({
      next: (event: any) => {
        if (!event) {
          return;
        }
        const action = event["action"];
        switch (action) {
          case 'cancel-por':
            this.showConfirm(event.data, "canceled");
            break;
          case 'gi-por':
            this.showConfirm(event.data, "gi");
            break;
          // case 'gr-por':
          //   this.showConfirm(event.data, "gr");
          //   break;
        }
      }
    });
    this.client['change'].subscribe({
      next: (value: any) => {
        this.filters['ClientCode'] = this.renderValue(value);
        // if (this.storepriority) {
        //   if (value.Code) {
        //     this.storepriority['reload']({ Collection: 'GEO.Stores', Column: 'Attributes.Priority' });
        //   } else {
        //     this.storepriority['clear'](false, true);
        //     this.storepriority['setDefaultValue'](this.translate.instant('combo.all'));
        //   }
        // }

        this.loadDCSites(value);

        // if (this.store) {
        //   this.store['reload']({ ClientCode: this.filters['ClientCode'] });
        // }
      }
    });
    this.status['change'].subscribe({
      next: (value: any) => {
        this.filters['Status'] = value ? (Array.isArray(value) ? value : [value]) : '';
      }
    });
    this.vendor['change'].subscribe({
      next: (value: any) => {
        this.filters['Vendor'] = value? value.VendorId:"";
      }
    });
    // this.cbbWarehouseCode["change"].subscribe({
    //   next: (data: any) => {
    //     if (data && data.Items) {
    //       this.filters["WarehouseCode"] = data.Code || "";
    //       if (this.filters["WarehouseCode"] && this.whBranchCombo["reload"]) {
    //         this.whBranchCombo['setData'](data.Items);
    //         this.whBranchCombo['setValue'](data.Items[0].Code);

    //         // if (this.rocketCombo && this.rocketCombo["change"]) {
    //         //   this.rocketCombo["reload"]({
    //         //     ClientCode: this.filters["ClientCode"],
    //         //     WarehouseCode: this.filters["WarehouseCode"],
    //         //     Type: "SO_DIRECT_STT"
    //         //   });
    //         // }
    //         // this.search();
    //       }
    //     }
    //   },
    // });

    // this.store['change'].subscribe({
    //   next: (value: any) => {
    //     this.filters['Store'] = this.renderValue(value);
    //   }
    // });

    // this.storetype['change'].subscribe({
    //   next: (value: any) => {
    //     this.filters['StoreType'] = this.renderValue(value);
    //   }
    // });
    // this.storepriority['change'].subscribe({
    //   next: (value: any) => {
    //     this.filters['StorePriority'] = value && value.Code ? value.Code : '';
    //   }
    // });

    // if (this.isOnlyDC) {
      this.whBranchCombo['change'].subscribe({
        next: (data: any) => {
          if (data) {
            if (this.filters['WarehouseCode']) {
              this.filters['WhBranchCode'] = data.Code || '';
              this.search(null);
            }
          }
        }
      });
    // }
  }

  loadDCSites(value: any) {
    // if(!this.isOnlyDC) {
    //   return;
    // }
    if (this.whBranchCombo) {
      if (value.Code) {
        this.whBranchCombo['reload']({
          ClientCode: this.filters['ClientCode'],
          //  data: this.filters['WarehouseCode'] 
        });
      } else {
        this.whBranchCombo['clear'](false, true);
        this.whBranchCombo['setDefaultValue'](this.translate.instant('combo.all'));
      }
    }
  }

  showConfirm(data: any, type = "") {
    let _msg = `Bạn có chắc chắn muốn HỦY POR ${data.SOCode}?`;
    if (type === "gi") {
      _msg = `Bạn có chắc muốn thực hiện GI đơn hàng ${data.SOCode} này?`;
    } 
    // else if (type === "gr") {
    //   _msg = `Bạn có chắc muốn thực hiện GR đơn hàng ${data.SOCode} này?`;
    // }
    const dialogRef = this.dialog.open(NotificationComponent, {
      data: {
        message: _msg,
        type: 1
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (type) {
          this.processGIGR(data, type);
        } else {
          this.cancelPOR(data.SOCode);
        }
      }
    });
  }

  processGIGR(data: any, type = "gi") {
    this.service.processGIGRPOR({
      "SOCode": data.SOCode,
      "Type": type
    })
      .subscribe((resp: any) => {
        if (resp.Status && resp.Data) {
          this.search(null);
        }
      });
  }



  cancelPOR(code: String) {
    this.service.cancelPOR({
      "SOCode": code
    })
      .subscribe((resp: any) => {
        if (resp.Status) {
          let tmp = this.appTable['data']['rows'];
          let index = -1;
          for (let i = 0; i < tmp.length; i++) {
            if (tmp[i].SOCode == code) {
              index = i;
              break;
            }
          }
          if (index != -1) {
            this.appTable['data']['rows'][index].Status = 'Canceled';
            this.appTable['updateRow'](index, 7);
          }

          this.toast.success(`Hủy POR ${code} thành công`, 'success_title');
        }
        else if (resp.ErrorMessages && resp.ErrorMessages.length) {
          this.toast.error(`SOErrors.${resp.ErrorMessages[0]}`, 'error_title');
        }
        else {
          this.toast.success(`Hủy POR ${code} không thành công`, 'error_title');
        }
      })
  }
  onEnter(event: any) {
    let code = event.target['value'];
    this.filters['Content'] = code;
    this.search(null);
  }
  search(event: any) {
    const fromDate = this.fromDate.getValue();
    const toDate = this.toDate.getValue();
    if (fromDate) {
      const _date = moment(fromDate);
      this.filters['FromDate'] = _date.format('YYYY-MM-DD');
    } else {
      this.filters['FromDate'] = '';
    }
    if (toDate) {
      const _date = moment(toDate);
      this.filters['ToDate'] = _date.format('YYYY-MM-DD');
    } else {
      this.filters['ToDate'] = '';
    }
    this.appTable['search'](this.filters);
  }

  exportExcel(data: any = {}) {
    return this.service.exportPOR(this.filters);
  }
  compareDate() {
    const createdFromDate = this.fromDate.getValue();
    const createdToDate = this.toDate.getValue();
    if (createdFromDate && createdToDate) {
      const formatCreatedFromDate = new Date(createdFromDate.getFullYear(), createdFromDate.getMonth(), createdFromDate.getDate());
      const formatCreatedToDate = new Date(createdToDate.getFullYear(), createdToDate.getMonth(), createdToDate.getDate());
      if (formatCreatedFromDate > formatCreatedToDate) {
        this.toast.error('invalid_date_range', 'error_title');
        this.toDate.setValue(new Date());
      }
      let days = -15;
      if (formatCreatedFromDate.getTime() < Utils.addDays(formatCreatedToDate, days).getTime()) {
        this.toast.error('invalid_limit_date_range', 'error_title');
        this.fromDate.setValue(Utils.addDays(formatCreatedToDate, days));
      }
    }
  }

  private renderValueCombo(option: any) {
    return option['Code'] ? `${option['Code']} - ${option['Name']}` : option['Name'];
  }
  private renderValue(value: any, isName = false) {
    return value ? (isName ? value.Name : (value.Code ? value.Code : '')) : '';
  }
}
