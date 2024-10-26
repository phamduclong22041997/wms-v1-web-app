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

import { STATUS_BORDER_MASANSTORE, SO_CANCELED_STATUS } from '../../../shared/constant';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Service } from '../../service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../shared/toast.service';
import { NotificationComponent } from '../../../components/notification/notification.component';
import * as moment from 'moment';
import { Utils } from '../../../shared/utils';

interface TableAction {
  icon: string;
  class?: string;
  name?: String;
  toolTip?: any;
  actionName?: any;
  disabledCondition?: any;
}

@Component({
  selector: 'app-list-po',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})

export class ListSOComponent implements OnInit, AfterViewInit {
  tableConfig: any;
  statusConfig: Object;
  filters: Object;
  warehouseHandleConfig: Object;
  regionCode: string;
  configDate: any;
  wareHouseList: any = [];
  soStatusConfig: Object;
  poTypeConfig: Object;
  storeConfig: Object;
  storeTypeConfig: Object;
  promotionConfig: Object;
  clientConfig: Object;
  warehouseBrachConfig: any;
  storePriorityConfig: Object;
  @ViewChild('fromDate', { static: false }) fromDate: any;
  @ViewChild('toDate', { static: false }) toDate: any;
  @ViewChild('whCode', { static: false }) whCode: any;
  @ViewChild('status', { static: false }) status: any;
  @ViewChild('potype', { static: false }) potype: any;
  @ViewChild('store', { static: false }) store: any;
  @ViewChild('storetype', { static: false }) storetype: any;
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('inputFile', { static: false }) inputFile: ElementRef;
  @ViewChild('client', { static: false }) client: any;
  @ViewChild('whBranchCombo', { static: false }) whBranchCombo: any;
  @ViewChild('storepriority', { static: false }) storepriority: any;
  constructor(
    private translate: TranslateService,
    private toast: ToastService,
    private service: Service,
    public dialog: MatDialog,
    private router: Router) { }

  ngOnInit() {
    this.filters = {
      Content: '',
      WarehouseCode: window.localStorage.getItem('_warehouse') || window.getRootPath().toUpperCase(),
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
      Type: ''
    };

    this.initData();
  }

  initData() {
    this.initTable();

    let region = window.localStorage.getItem('region') || 'none';
    if (region != 'none') {
      this.regionCode = JSON.parse(region)['Code'];
      this.filters['RegionCode'] = this.regionCode;
    }

    this.warehouseBrachConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      isSorting: false,
      isFilter: true,
      disableAutoload: true,
      // defaultValue: _session['WarehouseSiteId'] || "",
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return this.renderValueCombo(option);
      },
      type: 'combo',
      filter_key: 'Name',
      filters: {
        data: this.filters['WhCode']
      },
      URL_CODE: 'SFT.branchscombo'
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

    this.poTypeConfig = {
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
      data: [
        { Code: "New", Name: "Mới" }
      ]
    };

    this.storeConfig = {
      selectedFirst: false,
      isSelectedAll: false,
      isSorting: false,
      disableAutoload: true,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return this.renderValueCombo(option);
      },
      type: 'autocomplete',
      filter_key: 'Code',
      URL_CODE: 'SFT.storecombo'
    };

    this.soStatusConfig = {
      selectedFirst: true,
      isSelectedAll: true,
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
    this.storeTypeConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      // defaultValue: _session['StoreType'] || "",
      filters: {
        Collection: 'GEO.Stores',
        Column: 'Type'
      },
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Code'] ? `${option['Code']} - ${option['Description']}` : option['Description'];
      },
      type: 'autocomplete',
      filter_key: 'Description',
      URL_CODE: 'SFT.enum'
    };
    this.storePriorityConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      disableAutoload: true,
      filters: {
        Collection: 'GEO.Stores',
        Column: 'Attributes.Priority'
      },
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Code'] ? `${option['Code']} - ${option['Description']}` : option['Description'];
      },
      type: 'combo',
      filter_key: 'Description',
      URL_CODE: 'SFT.enum'
    };
  }

  initTableAction(): TableAction[] {
    return [
      {
        icon: "remove_circle",
        class: 'ac-remove',
        name: 'cancel-so',
        toolTip: {
          name: this.translate.instant('STO.CancelSO'),
        },
        disabledCondition: (row) => {
          return (SO_CANCELED_STATUS.indexOf(row.Status) != -1);
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
        isContextMenu: false,
        // actionTitle: this.translate.instant('FinishPo.Action'),
        // actions: this.initTableAction(),
        displayedColumns: [
          'index',
          'ClientCode',
          'WarehouseCode',
          'SOCode',
          'ExternalCode',
          'SiteId',
          'Priority',
          'SortCode',
          'SOType',
          'ConditionType',
          'Status',
          'CreatedDate',
          'UpdatedDate',
          // 'actions',
        ],
        options: [
          {
            title: 'client',
            name: 'ClientCode',
            style: {
              'min-width': '60px',
              'max-width': '70px'
            }
          },
          {
            title: 'STO.SOCode',
            name: 'SOCode',
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/saleorder/details/${data.SOCode}`;
            },
            style: {
              'min-width': '160px',
              'max-width': '160px'
            }
          },
          {
            title: 'STO.ExternalCode',
            name: 'ExternalCode',
            borderStyle: (row: any) => {
              return this.renderColor(row);
            }
          },
          {
            title: 'STO.SOType',
            name: 'SOType',
            render: (data: any) => {
              return data.SOType ? this.translate.instant(`SOType.${data.SOType}`) : "";
            },
            borderStyle: (row: any) => {
              return this.renderSOTypeColor(row);
            },
            style: {
              'min-width': '80px',
              'max-width': '80px'
            }
          },
          {
            title: 'STO.ConditionType',
            name: 'ConditionType',
            render: (data: any) => {
              return this.translate.instant(`SOStatus.${data.ConditionType}`);
            },
            style: {
              'min-width': '80px',
              'max-width': '80px'
            }
          },
          {
            title: 'STO.Store',
            name: 'SiteId',
            render: (data: any) => {
              return data.StoreName ? `${data.SiteId} - ${data.StoreName}` : data.SiteId;
            }
          },
          {
            title: 'STO.STOStatus',
            name: 'Status',
            render: (data: any) => {
              return this.translate.instant(`SOStatus.${data.Status}`);
            }
          },
          {
            title: 'SODetails.WarehouseSiteId',
            name: 'WarehouseCode',
            render: (data: any) => {
              return data.WarehouseSiteName ? `${data.WarehouseSiteId} - ${data.WarehouseSiteName}` : `${data.WarehouseSiteId}`;
            }
          },
          {
            title: 'Priority',
            name: 'Priority',
            style: {
              'min-width': '80px',
              'max-width': '80px'
            },
            borderStyle: (row: any) => {
              return row.Priority == 'VIP' ? { color: '#7bbd7b' } : null;
            }
          },
          {
            title: 'SortCode',
            name: 'SortCode',
            style: {
              'min-width': '80px',
              'max-width': '80px'
            }
          },
          {
            title: 'STO.SODate',
            name: 'CreatedDate'
          },
          {
            title: 'SODetails.UpdatedDate',
            name: 'UpdatedDate'
          }
        ]
      },
      remote: {
        url: this.service.getSOList(),
        params: {
          filter: JSON.stringify(this.filters)
        },
        callback: function (rs) {

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
      } else if(row.GRStatus =='E' || row.GRStatus =='ERR') {
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
    if(row.GIStatus || row.GRStatus) {
      return { color: '#7bbd7b'};
    }
    return null;
  }
  private renderSOTypeColor(row: any) {
    if (row.SOType) {
      if (row.SOType == 'Even') {
        return {
          color: '#2A9CFF'
        };
      } else if(row.SOType =='Odd') {
        return {
          color: '#C67000'
        };
      } else {
        return {
          color: '#f05858'
        };
      }
    }
    return null;
  }
  borderColorByStatus(status: string) {
    if (status != "") {
      return {
        'color': STATUS_BORDER_MASANSTORE[status],
        'border': `2px solid ${STATUS_BORDER_MASANSTORE[status]}`,
        'border-radius': '2px',
        'padding': '5px 10px',
        'font-weight': '500'
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
  }

  downloadMDLPO(data: any) {
    if (!data.EtonCode) {
      this.toast.error('UploadSTO.InvalidPO', 'error_title');
      return;
    }
    if (data.SortCode != 'MDL') {
      this.toast.error('UploadSTO.InvalidMDLPO', 'error_title');
      return;
    }
    if (!this.wareHouseList) {
      this.toast.error('UploadSTO.InvalidWH', 'error_title');
      return;
    }
  }


  initEvent() {
    this.fromDate['change'].subscribe({
      next: (value: any) => {
        // this.compareDate();
      }
    });

    this.toDate['change'].subscribe({
      next: (value: any) => {
        // this.compareDate();
      }
    });

    this.appTable['actionEvent'].subscribe({
      next: (event: any) => {
        if (!event) {
          return;
        }
        const action = event["action"];
        switch (action) {
          case 'cancel-so':
            this.showConfirm(event.data, event.index);
            break;
        }
      }
    });
    this.client['change'].subscribe({
      next: (value: any) => {
        this.filters['ClientCode'] = this.renderValue(value);
        if (this.whBranchCombo) {
          if (value.Code) {
            this.whBranchCombo['reload']({ ClientCode: this.filters['ClientCode'], data: this.filters['WarehouseCode'] });
          } else {
            this.whBranchCombo['clear'](false, true);
            this.whBranchCombo['setDefaultValue'](this.translate.instant('combo.all'));
          }
        }

        if (this.storepriority) {
          if (value.Code) {
            this.storepriority['reload']({Collection: 'GEO.Stores', Column: 'Attributes.Priority'});
          } else {
            this.storepriority['clear'](false, true);
            this.storepriority['setDefaultValue'](this.translate.instant('combo.all'));
          }
        }

        if (this.store) {
          this.store['reload']({ ClientCode: this.filters['ClientCode'] });
        }
      }
    });
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
    this.status['change'].subscribe({
      next: (value: any) => {
        this.filters['Status'] = value && value.length ? value : "";
      }
    });
    this.store['change'].subscribe({
      next: (value: any) => {
        this.filters['Store'] = this.renderValue(value);
      }
    });

    this.storetype['change'].subscribe({
      next: (value: any) => {
        this.filters['StoreType'] = this.renderValue(value);
      }
    });
    this.storepriority['change'].subscribe({
      next: (value: any) => {
        this.filters['StorePriority'] = value && value.Code ? value.Code : '';
      }
    });
  }

  showConfirm(data: any, index: any) {
    const dialogRef = this.dialog.open(NotificationComponent, {
      data: {
        message: `Bạn có chắc chắn muốn HỦY SO ${data.SOCode}?`,
        type: 1
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cancelSO(data.SOCode);
      }
    });
  }
  cancelSO(code: String) {
    this.service.cancelSO({
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

          this.toast.success(`Hủy SO ${code} thành công`, 'success_title');
        }
        else if (resp.ErrorMessages && resp.ErrorMessages.length) {
          this.toast.error(`SOErrors.${resp.ErrorMessages[0]}`, 'error_title');
        }
        else {
          this.toast.success(`Hủy SO ${code} không thành công`, 'error_title');
        }
      })
  }
  onEnter(event: any) {
    let text = event.target['value'];
    this.filters['Content'] = Utils.formatFilterContent(text);
    this.search(null);
  }
  search(event: any) {
    this.compareDate();
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

  importSTO() {
    window.open("/app/fresh-product/sto-process", '_blank');
  }

  exportExcel(data: any = {}) {
    let filters = Object.assign({}, this.filters);
    if (filters['Status']) {
      filters['Status'] = JSON.stringify(filters['Status']);
    }
    return this.service.exportSO(filters);
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
      if(formatCreatedFromDate.getTime() < Utils.addDays(formatCreatedToDate, days).getTime()){
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
