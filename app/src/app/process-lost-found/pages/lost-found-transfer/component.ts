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
import { Router } from '@angular/router';
import { ToastService } from '../../../shared/toast.service';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

@Component({
  selector: "app-lost-found-mapping-session",
  templateUrl: "./component.html",
  styleUrls: ["./component.css"],
})
export class TransferLostFoundComponent implements OnInit, AfterViewInit {
  @ViewChild("appTable", { static: false }) appTable: ElementRef;
  @ViewChild("Content", { static: false }) contentInput: ElementRef;
  @ViewChild('fromDate', { static: false }) fromDate: any;
  @ViewChild('toDate', { static: false }) toDate: any;
  @ViewChild('client', { static: false }) client: any;
  @ViewChild('whBranch', { static: false }) whBranch: any;
  @ViewChild('location', { static: false }) location: any;
  @ViewChild('bin', { static: false }) bin: any;

  tableConfig: any;
  filters: Object;
  configDate: any;
  clientConfig: Object;
  whBranchConfig: Object;
  storageConfig: Object;
  binConfig: Object;

  constructor(
    private translate: TranslateService,
    private service: Service,
    private toast: ToastService,
    public dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit() {
    this.initData();
  }

  initData() {
    this.filters = {
      ClientCode: '',
      Content: '',
      LocationLabel: "",
      LocationType: "",
      FromDate: moment().subtract(7, 'day').format('YYYY-MM-DD'),
      ToDate: moment().format('YYYY-MM-DD'),
      WarehouseCode: window.localStorage.getItem('_warehouse') || window.getRootPath().toUpperCase()
    };
    this.initCombo();
    this.initTable();
  }

  initCombo() {
    this.clientConfig = {
      selectedFirst: true,
      isSelectedAll: true,
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

    this.whBranchConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      isSorting: false,
      isFilter: true,
      isSelectedAllValueIsEmpty: true,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return this.renderValueCombo(option);
      },
      type: 'combo',
      filter_key: 'Name',
      URL_CODE: 'SFT.branchscombo',
      filters: {
        WarehouseCode: this.filters['WarehouseCode']
      }
    };
    this.binConfig = {
      selectedFirst: false,
      isSelectedAll: false,
      filters: {},
      isFilter: true,
      disableAutoload: true,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Code'];
      },
      type: 'combo',
      filter_key: 'Code',
      URL_CODE: 'SFT.foundBins'
    }
  }

  initTable() {
    this.tableConfig = {
      style: {
        'overflow-x': 'hidden'
      },
      enableFirstLoad: false,
      columns: {
        actionTitle: "action",
        displayedColumns: [
          "index",
          'ClientCode',
          "DCSite",
          "Code",
          "Status",
          "CreatedDate",
          "LostCode",
          "FoundCode",
          "SKU",
          "SKUName",
          "Uom",
          "TransferQty"
        ],
        options: [
          {
            title: 'client',
            name: 'ClientCode',
            style: {
              'min-width': '60px',
              'max-width': '90px'
            }
          },
          {
            title: "DCSite",
            name: "DCSite",
            isEllipsis: false,
          },
          {
            title: "status",
            name: "Status",
            isEllipsis: false,
            render: (row: any) => {
              return this.translate.instant(`LostFoundStatus.${row.Status}`)
            }
          },
          {
            title: "LostFound.CreatedDate",
            name: "CreatedDate",
            isEllipsis: true,
          },
          {
            title: "LostFound.SKU",
            name: "SKU",
            isEllipsis: true,
          },
          {
            title: "LostFound.SKUName",
            name: "SKUName",
            isEllipsis: false,
          },
          {
            title: "uom",
            name: "Uom",
          },
          {
            title: "LostFound.TransferCode",
            name: "Code",
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/lost-found/transfer-lost-found/${data.Code}`;
            }
          },
          {
            title: "LostFound.LostCode",
            name: "LostCode",
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/lost-found/lost-detail/${data.LostCode}`;
            }
          },
          {
            title: "LostFound.FoundCode",
            name: "FoundCode",
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/lost-found/found-detail/${data.FoundCode}`;
            }
          },
          {
            title: "LostFound.TransferQty",
            name: "TransferQty",
          },
          {
            title: "LostFound.FoundLocationLabel",
            name: "LocationLabel"
          },
          {
            title: "LostFound.FoundSubLocLabel",
            name: "SubLocLabel"
          }
        ]
      },
      remote: {
        url: this.service.getAPI("getTransferList")
      }
    };
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

  ngAfterViewInit() {
    this.initEvent();

    const sevenDayBefore = moment().subtract(7, 'day').toDate();
    this.fromDate.setValue(sevenDayBefore);

    setTimeout(() => {
      if (this.contentInput) {
        this.contentInput.nativeElement.focus();
      }
    }, 500)
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
        this.filters['ClientCode'] = value ? value.Code : '';
        if (this.whBranch) {
          if (value.Code) {
            this.whBranch['reload']({ ClientCode: this.filters['ClientCode'], data: this.filters['WarehouseCode'] });
          } else {
            this.whBranch['clear'](false, true);
            this.whBranch['setDefaultValue'](this.translate.instant('combo.all'));
          }
        }
      }
    });

    this.whBranch['change'].subscribe({
      next: (data: any) => {
        let val = data ? data.Code : "";
        if(this.filters['WarehouseSiteId'] != val){
          this.filters['WarehouseSiteId'] = val;
          if (this.bin) {
            this.bin['clear'](false, true);
            this.bin['reload']({ ClientCode: this.filters['ClientCode'], WarehouseSiteId: this.filters['WarehouseSiteId'] });
          }
        }
      }
    });

    this.bin['change'].subscribe({
      next: (data: any) => {
        this.filters['LocationLabel'] = data ? data.Code : "";
        this.filters['LocationType'] = data ? data.Type : "";

      }
    });
    this.appTable['actionEvent'].subscribe({
      next: (event: any) => {
        if (!event) {
          return;
        }
        const action = event["action"];
        switch (action) {
          case 'edit':
            this.router.navigate([`/${window.getRootPath()}/lost-found/mapping-lost-found/${event['data'].Code}`]);
            break;
        }
      }
    });
  }

  onEnter(event: any) {
    this.search(null);
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
  private renderValueCombo(option: any) {
    return option['Code'] ? `${option['Code']} - ${option['Name']}` : option['Name'];
  }
}
