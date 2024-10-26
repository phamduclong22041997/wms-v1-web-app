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
import { ToastService } from '../../../shared/toast.service';
import { Service } from '../../service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { UploadProductClaimComponent } from './confirm/component';

interface TableAction {
  name: string,
  icon: string;
  class?: string;
  toolTip?: any;
  actionName?: any;
  disabledCondition?: any;
}
@Component({
  selector: 'app-product-issue',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class ProductClaimComponent implements OnInit, AfterViewInit {
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('fromDate', { static: false }) fromDate: any;
  @ViewChild('toDate', { static: false }) toDate: any;
  @ViewChild('statusPL', { static: false }) statusPLCombo: ElementRef;
  @ViewChild('content', { static: false }) contentInput: ElementRef;
  @ViewChild('client', { static: false }) client: any;
  @ViewChild('whBranchCombo', { static: false }) whBranchCombo: any;

  dataSourceGrid = {
    rows: <any>[],
    total: 0
  };

  tableConfig: any;
  configDate: any;
  statusConfig: any;
  storeConfig: any;
  employeeConfig: any;
  clientConfig: Object;
  warehouseBrachConfig: any;
  EmployeeCode: string;
  TaskProcess: any;
  isShowTaskProcess: boolean = false;
  allowCreatePickList: boolean;
  filters: any = {
    WarehouseCode: "",
    FromDate: "",
    ToDate: "",
    Content: "",
    Status: "",
    Store: ""
  };

  constructor(
    public dialog: MatDialog,
    private service: Service,
    private router: Router,
    private translate: TranslateService,
    private toast: ToastService) {

  }

  ngOnInit() {
    this.allowCreatePickList = false;
    this.filters['FromDate'] = moment().subtract(1, 'day').format('YYYY-MM-DD');
    this.filters['WarehouseCode'] = window.localStorage.getItem('_warehouse') || window.getRootPath().toUpperCase();
    this.initTable();
    this.initCombo();
  }

  ngAfterViewInit() {
    this.initEvent();
    const sevenDayBefore = moment().subtract(7, 'day').toDate();
    this.fromDate.setValue(sevenDayBefore);

    setTimeout(() => {
      if (this.contentInput) {
        this.contentInput.nativeElement.focus();
      }
    }, 300)
  }

  onEnter(event: any) {
    this.search(event);
  }
  search(event: any) {
    
    this.appTable['search'](this.getFilter());
  }

  getFilter() {
    let _filters = this.filters;
    const fromDate = this.fromDate.getValue();
    if (fromDate) {
      _filters['FromDate'] = moment(fromDate).format('YYYY-MM-DD');
    }
    const toDate = this.toDate.getValue();
    if (toDate) {
      _filters['ToDate'] = moment(toDate).format('YYYY-MM-DD');
    }
    return _filters;
  }

  exportExcel(event: any = {}) {
    this.getFilter();
    this.filters["isExport"] = true;
    // return this.service.exportAutoPickPack(this.filters);
  }

  initCombo() {
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
    this.warehouseBrachConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      isSorting: false,
      isSelectedAllValueIsEmpty: true,
      disableAutoload: true,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return this.renderValueCombo(option);
      },
      type: 'combo',
      filter_key: 'Name',
      filters: {
        data: this.filters['WarehouseCode']
      },
      URL_CODE: 'SFT.branchscombo'
    }
    this.statusConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      isSorting: false,
      isSelectedAllValueIsEmpty: true,
      filters: {
        Collection: 'INV.PickList',
        Column: 'Status',
        Codes: 'New,AssignedPicker'
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

    this.employeeConfig = {
      selectedFirst: false,
      isSelectedAll: false,
      isSorting: false,
      isSelectedAllValueIsEmpty: true,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return this.renderValueCombo(option);
      },
      type: 'autocomplete',
      filter_key: 'Code',
      URL_CODE: 'SFT.employee',
      filters: {
        WarehouseCode: window.localStorage.getItem('_warehouse') || window.getRootPath().toUpperCase()
      },
    };
  }

  initTable() {
    this.tableConfig = {
      enableCheckbox: true,
      columns: {
        isContextMenu: false,
        headerActionCheckBox: true,
        actionTitle: this.translate.instant('action'),
        actions: this.initTableAction(),
        displayedColumns: [
          'index', 'ClientCode', 'WarehouseCode', 'FileName', 'Status','CreatedDate', 'CreatedBy','actions'
        ],
        options: [
          {
            title: 'client',
            name: 'ClientCode',
            style: {
              'min-width': '120px',
              'max-width': '120px',
            }
          },
          {
            title: 'Rocket.Warehouse',
            name: 'WarehouseCode',
            style: {
              'min-width': '160px',
              'max-width': '160px',
            }
          },
          {
            title: 'RocketPlanning.FileName',
            name: 'FileName'
          },
          {
            title: 'RocketPlanning.Status',
            name: 'Status',
            style: {
              'min-width': '200px',
              'max-width': '200px',
            }
          },
          {
            title: 'Ngày import',
            name: 'CreatedDate',
            style: {
              'min-width': '140px',
              'max-width': '140px'
            }
          },
          {
            title: 'Thực hiện bởi',
            name: 'CreatedBy',
            style: {
              'min-width': '140px',
              'max-width': '140px'
            }
          }
        ]
      },
      remote: {
        url: this.service.getProductClaimUploadUrl(),
        params: {
          filter: JSON.stringify(this.filters)
        },
        callback: function (rs) {

        }
      }
    };

  }

  initTableAction(): TableAction[] {
    return [
      {
        icon: "view_list",
        name: 'view-doc',
        toolTip: {
          name: "Xem chi tiết",
        },
        class: "ac-task",
        disabledCondition: (row: any) => {
          return true;
        }
      }
    ];
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

    this.client['change'].subscribe({
      next: (value: any) => {
        this.filters['ClientCode'] = this.renderValue(value);
        if (this.whBranchCombo) {
          this.whBranchCombo['reload']({ ClientCode: this.filters['ClientCode'], data: this.filters['WarehouseCode'] })
        }
      }
    });
    this.whBranchCombo['change'].subscribe({
      next: (data: any) => {
        this.filters['WarehouseSiteId'] = data.Code || '';
      }
    });

    this.appTable['actionEvent'].subscribe({
      next: (event: any) => {
        if (!event) {
          return;
        }
        const action = event["action"];
        switch (action) {
          case 'view-doc':
            window.open(`/${window.getRootPath()}/manager/product-claim/${event.data['Keygen']}`, '_blank')
            break;
        }
      }
    });

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
    }
  }

  importProductIssue(event: any) {
    let dialogRef = this.dialog.open(UploadProductClaimComponent, {
      data: {
        HashTag: "ProductClaim",
        Title: 'Upload Sản phẩm bị Claim'
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.TaskProcess = result.Data;
      if (this.TaskProcess && this.TaskProcess['Code']) {
        this.isShowTaskProcess = true;
      }
      this.search(null);
    });

  }
  getLastTaskProcess(event: any) {
    if (this.TaskProcess) {
      let url = `${window.getRootPath()}/saleorder/task-process/${this.TaskProcess['Code']}/${this.TaskProcess['TaskType']}`;
      window.open(url, '_blank');
    }
  }

  private renderValueCombo(option: any) {
    return option['Code'] ? `${option['Code']} - ${option['Name']}` : option['Name'];
  }
  private renderValue(value: any, isName = false) {
    return value ? isName ? value.Name : value.Code : '';
  }
}
