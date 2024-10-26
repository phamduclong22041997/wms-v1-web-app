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
import { Service } from '../../service';
import { TranslateService } from '@ngx-translate/core';
import { STATUS_BORDER_COLOR } from '../../../shared/constant';

@Component({
  selector: 'app-auto-process',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class AutoProcessComponent implements OnInit, AfterViewInit {
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('status', { static: false }) statusCombo: any;
  @ViewChild('client', { static: false }) client: any;
  @ViewChild('dcSite', { static: false }) dcSite: any;
  @ViewChild('status', { static: false }) status: any;

  tableConfig: any;
  statusConfig: Object;
  filters: Object;
  clientConfig: Object;
  warehouseSiteConfig: Object;

  constructor(
    private translate: TranslateService,
    private service: Service,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.init();
  }

  ngAfterViewInit() {
    this.initEvent();
    this.initData();
  }

  init() {
    this.filters = {
      Content: '',
      ClientCode: '',
      WarehouseCode: window.localStorage.getItem('_warehouse')
    };

    this.initCombo();
    this.initTable();
  }

  initCombo() {
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
    this.warehouseSiteConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      isSorting: false,
      isFilter: false,
      disableAutoload: true,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Code'] ? `${option['Code']} - ${option['Name']}` : option['Name'];
      },
      type: 'combo',
      filter_key: 'Name'
    }

    this.statusConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      filters: {
        Collection: 'AutoProcess',
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
    }
  }

  initTable() {
    this.tableConfig = {
      style: {
        "overflow-x": "hidden",
      },
      showFirstLastButton: true,
      enableFirstLoad: false,
      columns: {
        actionTitle: "action",
        isContextMenu: false,
        displayedColumns: [
          "index",
          "ClientCode",
          "DCSite",
          "Name",
          "DocumentObject",
          "Status",
          "CreatedBy",
          "CreatedDate",
          "Message"
        ],
        options: [
          {
            title: "client",
            name: "ClientCode"
          },
          {
            title: "DCSite",
            name: "DCSite"
          },
          {
            title: "Report.AutoProcess.Name",
            name: "Name"
          },
          {
            title: "Report.AutoProcess.DocumentObject",
            name: "DocumentObject"
          },
          {
            title: "status",
            name: "Status",
            borderStyle: (row: any) => {
              return this.borderColorFinish(row['Status']);
            },
            render: (row: any) => {
              return this.translate.instant(`Report.AutoProcess.${row['Status']}`) || '';
            }
          },
          {
            title: "Report.AutoProcess.ProcessBy",
            name: "CreatedBy"
          },
          {
            title: "Report.AutoProcess.ProcessDate",
            name: "CreatedDate"
          },
          {
            title: "Report.AutoProcess.Content",
            name: "Message"
          }
        ]
      },
      remote: {
        url: this.service.getAPI('getAutoProcessList'),
        params: this.filters
      }
    };
  }
  initData() {

  }
  search(event: any) {
    if (this.filters['Content']) {
      this.filters['Content'] = this.filters['Content'].trim();
    }
    this.appTable['search'](this.filters);
  }


  borderColorFinish(status: string) {
    return {
      'color': STATUS_BORDER_COLOR[status],
      'border': `2px solid ${STATUS_BORDER_COLOR[status]}`,
      'border-radius': '2px',
      'padding': '5px 10px',
      'font-weight': '500'
    };
  }
  reloadComboWHBranch(data: any) {
    if (this.dcSite && data) {
      this.dcSite['clear'](false, true);
      this.dcSite['setData']([].concat(data));
      this.dcSite['reset']();
    }
  }
  initEvent() {
    this.client['change'].subscribe({
      next: (value: any) => {
        this.filters['ClientCode'] = value && value.Code ? value.Code : '';
        this.reloadComboWHBranch(value ? (value.Branch || []) : []);
      }
    });
    this.dcSite['change'].subscribe({
      next: (value: any) => {
        this.filters['WarehouseSiteId'] = value && value.Code ? value.Code : '';
        this.search(this.filters);
      }
    });
    this.status['change'].subscribe({
      next: (value: any) => {
        this.filters['Status'] = value && value.Code ? value.Code : '';
        this.search(this.filters);
      }
    });
  }
  exportExcel(data: any = {}) {
    if (this.filters['Content']) {
      this.filters['Content'] = this.filters['Content'].trim();
    }
    return this.service.exportBinInventory(this.filters);
  }
}
