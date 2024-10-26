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

import { STATUS_BORDER_MASANSTORE } from '../../../shared/constant';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Service } from '../../service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../shared/toast.service';
import * as moment from 'moment';

interface TableAction {
  icon: string;
  class?: string;
  name?: String;
  toolTip?: any;
  actionName?: any;
  disabledCondition?: any;
}

@Component({
  selector: 'app-list-mapping-lost-found',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})

export class ListMappingListFoundComponent implements OnInit, AfterViewInit {
  tableConfig: any;
  statusConfig: Object;
  storageConfig: Object;
  filters: Object;
  configDate: any;
  wareHouseList: any = [];
  lossStatusConfig: Object;
  clientConfig: Object;
  whBranchConfig: Object;

  @ViewChild('Content', { static: false }) contentInput: ElementRef;
  @ViewChild('fromDate', { static: false }) fromDate: any;
  @ViewChild('toDate', { static: false }) toDate: any;
  @ViewChild('status', { static: false }) status: any;
  @ViewChild('client', { static: false }) client: any;
  @ViewChild('whBranch', { static: false }) whBranch: any;
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('inputFile', { static: false }) inputFile: ElementRef;

  constructor(
    private translate: TranslateService,
    private toast: ToastService,
    private service: Service,
    public dialog: MatDialog,
    private router: Router) { }

  ngOnInit() {
    this.filters = {
      Content: '',
      WarehouseCode: "",
      WarehouseSiteId: "",
      FromDate: moment().subtract(7, 'day').format('YYYY-MM-DD'),
      ToDate: moment().format('YYYY-MM-DD'),
      ClientCode: '',
      Status: '',
      Type: ''
    };

    this.initData();
  }

  onEnter(event: any) {
    let code = event.target['value'];
    this.filters['Content'] = code;
    this.search(null);
  }
  onChange(event: any) {
    let code = event.target['value'];
    this.filters['Content'] = code;
  }
  initData() {
    this.initTable();
    this.filters['WarehouseCode'] = window.localStorage.getItem('_warehouse');

    this.whBranchConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      isSorting: false,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return `${option['Code']} - ${option['Name']}`;
      },
      type: 'autocomplete',
      filter_key: 'Code',
      URL_CODE: 'SFT.warehousebranchcombo',
      filters: {
        WarehouseCode: this.filters['WarehouseCode']
      }
    };

    this.clientConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      isSorting: false,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return `${option['Code']} - ${option['Name']}`;
      },
      type: 'combo',
      filter_key: 'Name',
      URL_CODE: 'SFT.clientcombo'
    };

    let lossStatus = [
      { Code: "New", Name: 'Mới' },
      { Code: "Processing", Name: 'Đang xử lý' },
      { Code: "Completed", Name: 'Hoàn thành' }
    ];

    this.lossStatusConfig = {
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
      data: lossStatus
    };

    this.storageConfig = {
      selectedFirst: false,
      isSelectedAll: false,
      filters: {
        Collection: 'FOUND_STORAGE',
        Column: 'Found',
        Type: 'found-bin'
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

  }

  initTableAction(): TableAction[] {
    return [
      {
        icon: "check_circle",
        name: 'finish-po',
        class: 'ac-finish',
        toolTip: {
          name: "Hoàn thành",
        },
        disabledCondition: (row: any) => {
          return false
        }
      },
      {
        icon: "remove_circle",
        class: 'ac-remove',
        name: 'cancel-po',
        toolTip: {
          name: "Hủy",
        },
        disabledCondition: (row:any) => {          
          return false;
        }
      }
    ];
  }

  initTable() {
    this.tableConfig = {
      style: {
        'overflow-x': 'hidden'
      },
      enableFirstLoad: false,
      columns: {
        isContextMenu: false,
        displayedColumns: [
          'index',
          'SKU',
          'SKUName',
          'Uom',
          'LostCode',
          'LostQty',
          'FoundCode',
          'FoundQty',
          'MatchQty',
          'CreatedDate'
        ],
        options: [
          {
            title: 'LostFound.SKU',
            name: 'SKU'
          },
          {
            title: 'LostFound.SKUName',
            name: 'SKUName'
          },
          {
            title: 'LostFound.Uom',
            name: 'Uom'
          },
          {
            title: 'LostFound.FoundCode',
            name: 'FoundCode',
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/lost-found/matching-detail/${data.Code}`;
            }
          },
          {
            title: 'LostFound.FoundQty',
            name: 'FoundQty'
          },
          {
            title: 'LostFound.LostCode',
            name: 'LostCode',
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/lost-found/matching-detail/${data.Code}`;
            }
          },
          {
            title: 'LostFound.LostQty',
            name: 'LostQty'
          },
          {
            title: 'LostFound.MatchQty',
            name: 'MatchQty'
          },
          {
            title: 'LostFound.CreatedDate',
            name: 'CreatedDate'
          }
        ]
      },
      data: {
        rows: [],
        total: 0
      }
    };
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

    setTimeout(() => {
      if (this.contentInput) this.contentInput.nativeElement.focus();
    }, 200)

    const sevenDayBefore = moment().subtract(7, 'day').toDate();
    this.fromDate.setValue(sevenDayBefore);
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

    this.status['change'].subscribe({
      next: (value: any) => {
        this.filters['Status'] = value ? value.Code : '';
      }
    });

    this.client['change'].subscribe({
      next: (value: any) => {
        this.filters['ClientCode'] = value ? value.Code: '';
        if(this.filters['WarehouseSiteId']) {
          this.search(null);
        }
      }
    });

    this.whBranch['change'].subscribe({
      next: (value: any) => {
        this.filters['WarehouseSiteId'] = value ? value.Code : '';
        if(this.filters['ClientCode']) {
          this.search(null);
        }
      }
    });
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

  importNewPO() {
    this.router.navigate([`/${window.getRootPath()}/rocket/planning-po-list`]);
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
}
