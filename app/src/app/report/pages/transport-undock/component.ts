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
import { Service } from '../../../report/service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../shared/toast.service';
import { PrintService } from '../../../shared/printService';
import { Utils } from '../../../shared/utils';
import { NUMBERIC } from '../../../shared/constant';
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
  selector: 'app-transport-undock',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})

export class TransportUndockComponent implements OnInit, AfterViewInit {
  tableConfig: any;
  filters: Object;
  data: any[];
  isExport: boolean;
  clientConfig: Object;
  configDate: any;

  @ViewChild('inputNumber', { static: false }) inputNumber: ElementRef;
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('client', { static: false }) client: any;
  @ViewChild('fromDate', { static: false }) fromDate: any;
  @ViewChild('toDate', { static: false }) toDate: any;

  constructor(
    private translate: TranslateService,
    private service: Service, private toast: ToastService,
    private printService: PrintService,
    private route: ActivatedRoute,
    public dialog: MatDialog,) {
  }

  ngOnInit() {
    this.isExport = true;
    this.data = [];
    this.filters = {
      LocationLabel: '',
      ClientCode: '',
      WarehouseCode: window.localStorage.getItem('_warehouse') || '',
      FromDate: moment().subtract(30, 'day').format('YYYY-MM-DD'),
      ToDate: moment().format('YYYY-MM-DD'),
    };
    this.initTable();
    this.initData();
  }

  initData() {
    this.clientConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Code'] ? `${option['Code']} - ${option['Name']}` : option['Name'];
      },
      type: 'combo',
      filter_key: 'Name',
      URL_CODE: 'SFT.clientcombo'
    };
  }

  initTable() {
    this.tableConfig = {
      disablePagination: false,
      style: {
        'overflow-x': 'hidden'
      },
      columns: {
        isContextMenu: false,
        displayedColumns: [
          'index',
          'ClientCode',
          'WarehouseSiteName',
          'POCode',
          'LocationLabel',
          'LocationType',
          'SKU',
          'ProductName',
          'Qty',
          'Uom',
          'ReceiveDate',
          'ManufactureDate',
          'ExpiredDate',
          'ConditionType'
        ],
        options: [
          {
            title: 'Report.ClientCode',
            name: 'ClientCode',
            style: {
              'min-width': '50px',
              'max-width': '50px'
            }
          },
          {
            title: "DCSite",
            name: "WarehouseSiteName",
            style: {
              "min-width": "120px",
              "max-width": "120px",
            }
          },
          {
            title: 'Report.POCode',
            name: 'POCode',
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/purchaseorder/details/${data.POCode}`;
            },
            style: {
              'min-width': '150px',
              'max-width': '150px'
            }
          },
          {
            title: 'Report.Location',
            name: 'LocationLabel',
            style: {
              'min-width': '120px',
              'max-width': '120px'
            }
          },
          {
            title: 'Report.LocationType',
            name: 'LocationType',
            style: {
              'min-width': '70px',
              'max-width': '70px'
            }
          },
          {
            title: 'SKU',
            name: 'SKU',
            style: {
              'min-width': '90px',
              'max-width': '90px'
            }
          },
          {
            title: 'Report.ProductName',
            name: 'ProductName',
            style: {
              'min-width': '220px',
              'max-width': '220px'
            }
          },
          {
            title: 'Report.Qty',
            name: 'Qty',
            render(row: any){
              return Utils.formatNumber(row.Qty);
            }
          },
          {
            title: 'Report.Uom',
            name: 'Uom'
          },
          {
            title: 'Report.ReceiveDate',
            name: 'ReceiveDate',
            style: {
              'min-width': '90px',
              'max-width': '90px'
            }
          },
          {
            title: 'Report.ExpiredDate',
            name: 'ExpiredDate',
            style: {
              'min-width': '90px',
              'max-width': '90px'
            }
          },
          {
            title: 'Report.ManufactureDate',
            name: 'ManufactureDate',
            style: {
              'min-width': '90px',
              'max-width': '90px'
            }
          },
          {
            title: 'Report.ConditionType',
            name: 'ConditionType',
            style: {
              'min-width': '60px',
              'max-width': '60px'
            }
          },
        ]
      },
      remote: {
        url: this.service.getAPI('getTransportUndock'),
        params: {
          filter: JSON.stringify(this.filters)
        }
      }
    };
  }

  ngAfterViewInit() {
    this.initEvent();

    setTimeout(() => {
      if (this.inputNumber) this.inputNumber.nativeElement.focus();
    }, 200);
    const sevenDayBefore = moment().subtract(7, 'day').toDate();
    this.fromDate.setValue(sevenDayBefore);
  }

  initEvent() {
    this.client['change'].subscribe({
      next: (value: any) => {
        this.filters['ClientCode'] = value && value.Code ? value.Code : '';
      }
    });
  }

  onEnter(event: any) {
    let code = event.target['value'];
    this.filters['LocationLabel'] = code;
    this.search(null);
  }
  
  search(event: any) {
    this.compareDate();
    const fromDate = this.fromDate.getValue();
    const toDate = this.toDate.getValue();
    if (fromDate) {
      const _date = moment(fromDate);
      this.filters['FromDate'] = _date.format('YYYY-MM-DD');
    }
    else {
      this.filters['FromDate'] = '';
    }
    if (toDate) {
      const _date = moment(toDate);
      this.filters['ToDate'] = _date.format('YYYY-MM-DD');
    } else {
      this.filters['ToDate'] = '';
    }

    this.filters['LocationLabel'] = this.filters['LocationLabel'].trim().toUpperCase();
    this.appTable['search'](this.filters);
    this.isExport = true;
  }
  loadData() {
    this.service.getTransportUndock(this.filters)
      .subscribe(res => {
        if (res.Status) {
          this.data = res.Data;
          this.appTable['renderData'](res.Data.Rows);
        } else if(res.ErrorMessages){
          this.toast.error(res.ErrorMessages, 'error_title');
        }
      });
  }
  async timer(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  exportExcel(event: any) {
    return this.service.exportTransportUndock(this.filters);
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
      let days = -45;
      if(formatCreatedFromDate.getTime() < Utils.addDays(formatCreatedToDate, days).getTime()){
        this.toast.error('invalid_limit_date_range', 'error_title');
        this.fromDate.setValue(Utils.addDays(formatCreatedToDate, days));
      }
    }
  }
}