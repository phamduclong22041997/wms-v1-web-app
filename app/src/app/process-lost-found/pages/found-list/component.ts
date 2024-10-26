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

@Component({
  selector: 'app-list-po',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})

export class ListFoundComponent implements OnInit, AfterViewInit {
  tableConfig: any;
  statusConfig: Object;
  filters: Object;
  configDate: any;
  clientConfig: Object;
  whBranchConfig: Object;
  binConfig: Object;
  palletConfig: Object;

  @ViewChild('content', { static: false }) content: ElementRef;
  @ViewChild('fromDate', { static: false }) fromDate: any;
  @ViewChild('toDate', { static: false }) toDate: any;
  @ViewChild('status', { static: false }) status: any;
  @ViewChild('client', { static: false }) client: any;
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('whBranch', { static: false }) whBranch: ElementRef;
  @ViewChild('locationlabel', { static: false }) locationlabel: any;
  @ViewChild('sublocationlabel', { static: false }) sublocationlabel: any;
  @ViewChild('bin', { static: false }) bin: ElementRef;
  @ViewChild('pallet', { static: false }) pallet: ElementRef;

  constructor(
    private translate: TranslateService,
    private toast: ToastService,
    private service: Service,
    public dialog: MatDialog,
    private router: Router) { }

  ngOnInit() {

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
  onChangeLocationLabel(event: any) {
    let code = event.target['value'];
    this.filters['LocationLabel'] = code;
  }
  onChangeSubLocationLabel(event: any) {
    let code = event.target['value'];
    this.filters['SubLocationLabel'] = code;
  }
  initData() {
    this.filters = {
      WarehouseCode: '',
      WarehouseSiteId: '',
      FromDate: moment().subtract(7, 'day').format('YYYY-MM-DD'),
      ToDate: moment().format('YYYY-MM-DD'),
      ClientCode: '',
      Status: '',
      LocationLabel: '',
      SubLocationLabel: '',
      Content: '',
    };
    this.initTable();
    this.initCombo();
  }
  initCombo() {
    this.filters['WarehouseCode'] = window.localStorage.getItem('_warehouse');

    this.clientConfig = {
      selectedFirst: true,
      isSelectedAll: false,
      isSorting: false,
      isSelectedAllValueIsEmpty: true,
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

    this.statusConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      isSelectedAllValueIsEmpty: true,
      filters: {
        Collection: 'INV.Issues',
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

    this.whBranchConfig = {
      selectedFirst: true,
      isSelectedAll: false,
      isSorting: false,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return `${option['Code']} - ${option['Name']}`;
      },
      type: 'autocomplete',
      filter_key: 'Code',
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
    this.palletConfig = {
      selectedFirst: true,
      isSelectedAll: false,
      filters: {},
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Code'];
      },
      type: 'combo',
      filter_key: 'Code',
      data: []
    }
  }

  initTable() {
    this.tableConfig = {
      style: {
        'overflow-x': 'hidden'
      },
      // enableFirstLoad: false,
      columns: {
        isContextMenu: false,
        displayedColumns: [
          'index',
          'ClientCode',
          'DCSite',
          'Code',
          'Status',
          'IssueType',
          'FoundDate',
          'SKU',
          'SKUName',
          'BaseUom',
          'BaseQty',
          'RefEmployee'
        ],
        options: [
          {
            title: 'client',
            name: 'ClientCode',
            style: {
              'min-width': '90px',
              'max-width': '90px'
            }
          },
          {
            title: 'LostFound.DCSite',
            name: 'DCSite'
          },
          {
            title: 'LostFound.FoundCode',
            name: 'Code',
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/lost-found/found-detail/${data.Code}`;
            },
            style: {
              'min-width': '120px',
              'max-width': '120px'
            }
          },
          {
            title: 'LostFound.SKU',
            name: 'SKU',
          },
          {
            title: 'LostFound.FoundDate',
            name: 'FoundDate',
          },
          {
            title: 'LostFound.SKUName',
            name: 'SKUName',
            style: {
              'min-width': '200px'
            }
          },
          {
            title: 'LostFound.FoundLocation',
            name: 'IssueLocationLabel'
          },
          {
            title: 'LostFound.PalletCode',
            name: 'IssueSubLocLabel'
          },
          {
            title: 'LostFound.FoundQty',
            name: 'BaseQty',
          },
          {
            title: 'LostFound.RemainingQty',
            name: 'RemainingQty',
          },
          {
            title: 'LostFound.Uom',
            name: 'BaseUom'
          },
          {
            title: 'LostFound.FoundBy',
            name: 'RefEmployee'
          },
          {
            title: 'LostFound.Status',
            name: 'Status',
            render: (data: any) => {
              return this.translate.instant(`LostFoundStatus.${data.Status}`);
            }
          },
          {
            title: 'LostFound.IssueType',
            name: 'IssueType',
            render: (data: any) => {
              return this.translate.instant(`IssueType.${data.IssueType}`);
            }
          }
        ]
      },
      remote: {
        url: this.service.getAPI('listFound'),
        params: {
          filter: JSON.stringify(this.filters)
        }
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

    this.content.nativeElement.focus();
    const sevenDayBefore = moment().subtract(7, 'day').toDate();
    this.fromDate.setValue(sevenDayBefore);
  }

  reloadPallets(data: any) {
    if (this.pallet) {
      let _data = []
      for (let idx in data) {
        _data.push({
          Code: data[idx],
          Name: data[idx]
        })
      }
      this.pallet['clear'](false, true);
      this.pallet['setData'](_data);
    }
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
        this.filters['ClientCode'] = value ? value.Code : '';
        if(this.whBranch) {
          this.whBranch['reload']({ClientCode: this.filters['ClientCode'], data: this.filters['WarehouseCode']});
        }
      }
    });
   
    this.bin['change'].subscribe({
      next: (data: any) => {
        this.filters['LocationLabel'] = data ? data.Code : "";
        this.filters['LocationType'] = data ? data.Type : "";
        if (data) {
          this.reloadPallets(data.SubLocations);
        }
      }
    });
    this.pallet['change'].subscribe({
      next: (data: any) => {
        this.filters['SubLocationLabel'] = data ? data.Code : "";
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
  }
  addNew(event: any) {
    window.location.href = `/${window.getRootPath()}/lost-found/found-create`;
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
