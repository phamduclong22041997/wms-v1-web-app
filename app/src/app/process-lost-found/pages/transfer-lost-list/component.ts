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

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../../shared/toast.service';
import { Service } from '../../service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { NotificationComponent } from '../../../components/notification/notification.component';
interface TableAction {
  name: string,
  icon: string;
  class?: string;
  toolTip?: any;
  actionName?: any;
  disabledCondition?: any;
}
@Component({
  selector: 'app-so-auto-pickpack-list',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class ListTransferLostComponent implements OnInit {
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('fromDate', { static: false }) fromDate: any;
  @ViewChild('toDate', { static: false }) toDate: any;
  @ViewChild('lostBin', { static: false }) lostBinCombo: ElementRef;
  @ViewChild('content', { static: false }) contentInput: ElementRef;
  @ViewChild('client', { static: false }) client: any;
  @ViewChild('whBranchCombo', { static: false }) whBranchCombo: any;

  dataSourceGrid = {
    rows: <any>[],
    total: 0
  };

  tableConfig: any;
  configDate: any;
  lostBinConfig: any;
  clientConfig: Object;
  warehouseBrachConfig: any;
  filters: any = { 
    WarehouseCode: "",
    ClientCode: "",
    WarehouseSiteId: "",
    FromDate: "",
    ToDate: "",
    Content: "",
    LocationLabel: ""
  };
  allowCreateTransfer : boolean;
  constructor(
    public dialog: MatDialog,
    private service: Service,
    private router: Router,
    private translate: TranslateService,
    private toast: ToastService) {

  }

  ngOnInit() {
    this.allowCreateTransfer = false;
    this.filters['FromDate'] = moment().subtract(1, 'day').format('YYYY-MM-DD');
    this.filters['WarehouseCode'] = window.localStorage.getItem('_warehouse') ||  window.getRootPath().toUpperCase();
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
    let req = this.getFilter();
    this.service.getTransfers(req)
      .subscribe((resp: any) => {
        if (resp.Status) {
          this.makeData(resp);
        } else {
          this.toast.error(resp.ErrorMessages.join("\n"), 'error_title');
        }
      })
  }
  addNew(event: any){
    this.router.navigate([`/${window.getRootPath()}/lost-found/create-transfer-lost`]);
  }
  getFilter() {
    let _filters = this.filters;
    const fromDate = this.fromDate.getValue();
    if (fromDate) {
      _filters['FromDate'] = moment(fromDate).format('YYYY-MM-DD');
    } else {
      _filters['FromDate'] = '';
    }
    const toDate = this.toDate.getValue();
    if (toDate) {
      _filters['ToDate'] = moment(toDate).format('YYYY-MM-DD');
    } else {
      _filters['ToDate'] = '';
    }
    return _filters;
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
        return option['Code'] ? `${option['Code']} - ${option['Name']}` : option['Name'];
      },
      type: 'combo',
      filter_key: 'Name',
      URL_CODE: 'SFT.clientcombo'
    };
    this.warehouseBrachConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      isSelectedAllValueIsEmpty: true,
      filters: {},
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Code'] ? `${option['Code']} - ${option['Name']}` : option['Name'];
      },
      type: 'combo',
      filter_key: 'Code',
      data: []
    }
    this.lostBinConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      isSelectedAllValueIsEmpty: true,
      filters: {},
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Name'] ? `${option['Name']}` : 'Tất cả';
      },
      type: 'combo',
      filter_key: 'Code',
      data: []
    }
  }

  makeData(data: any) {
    let _data = [];
    if (data.Status) {
      _data = data.Data;
    }
    this.appTable['renderData'](_data || []);
    // this.appTable['selectedAllData']();
  }

  initTable() {
    this.tableConfig = {
      columns: {
        isContextMenu: false,
        displayedColumns: [
          'index','ClientCode', 'DCSite','Code','CreatedDate', 'LostCode', 
          'SKU', 'SKUName', 'Uom', 'TransferQty'
        ],
        options: [
          {
            title: 'client',
            name: 'ClientCode',
            style: {
              'min-width': '80px',
              'max-width': '80px'
            }
          },
          {
            title: 'TransferLost.BranchWH',
            name: 'DCSite',
            style: {
              'min-width': '90px',
              'max-width': '90px'
            }
          },
          {
            title: 'TransferLost.TransferCode',
            name: 'Code',
            style: {
              'min-width': '80px',
              'max-width': '160px',
            },
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/lost-found/transfer-lost/${data.Code}`;
            }
          },
          {
            title: 'TransferLost.CreatedDate',
            name: 'CreatedDate',
            style: {
              'min-width': '90px',
              'max-width': '90px',
            }
          },
          {
            title: 'TransferLost.LostCode',
            name: 'LostCode',
            style: {
              'min-width': '80px',
              'max-width': '160px',
            },
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/lost-found/lost-detail/${data.LostCode}`;
            }
          },
          {
            title: 'SKU',
            name: 'SKU',
            style: {
              'min-width': '80px',
              'max-width': '120px',
            }
          },
          {
            title: 'TransferLost.SKUName',
            name: 'SKUName'
          },
          {
            title: 'TransferLost.Uom',
            name: 'Uom',
            style: {
              'min-width': '80px',
              'max-width': '120px'
            },
          },
          {
            title: 'TransferLost.TransferQty',
            name: 'TransferQty',
            style: {
              'min-width': '80px',
              'max-width': '120px'
            },
          },
          
        ]
      },
      data: this.dataSourceGrid
    };

  }

  initTableAction(): TableAction[] {
    return [
    ];
  }
  reloadWarehouseBranch(data: any) {
    if (this.whBranchCombo) {
      let _data = []
      _data.push({
        Code: '',
        Name: 'Tất cả'
      });
      for (let idx in data.Branch) {
        let site = data.Branch[idx];
        if (site.WarehouseCode === this.filters['WarehouseCode']) {
          _data.push({
            Code: site.Code,
            Name: site.Name,
          })
        }
      }
      this.whBranchCombo['clear'](false, true);
      this.whBranchCombo['setData'](_data);
      if (_data.length > 0) {
        this.filters['WarehouseSiteId'] = _data[0].Code;
        this.whBranchCombo['setValue'](_data[0].Code);
      }
    }
  }
  reloadLostBin() {
    if (this.lostBinCombo) {
      let req = {
        ClientCode: this.filters['ClientCode'] || "",
        WarehouseSiteId: this.filters['WarehouseSiteId'] || ""
      }

      this.lostBinCombo['clear'](false, true);
      this.service.getLostBinPhycical(req)
      .subscribe((resp: any) => {  
        let _data = [{
          Code: "",
          Name: "Tất cả"
        }];
        if (resp.Status) {
          for (let i = 0; i < resp.Data.length; i++) {
            let bin = resp.Data[i];
            _data.push({
              Code: bin.Code,
              Name: bin.Code
            })
          }
          
        }
        this.lostBinCombo['setData'](_data);
          if (_data.length > 0) {
            this.filters['WarehouseSiteId'] = _data[0].Code;
            this.lostBinCombo['setValue'](_data[0].Code);
          }
      });
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

    this.lostBinCombo['change'].subscribe({
      next: (value: any) => {
        this.filters['LocationLabel'] =  value && value.Code ? value.Code : '';
        this.search(null);
      }
    });
    this.client['change'].subscribe({
      next: (value: any) => {
        this.filters['ClientCode'] = value && value.Code ? value.Code : '';
        this.reloadWarehouseBranch(value);
      }
    });
    this.whBranchCombo['change'].subscribe({
      next: (value: any) => {
        this.filters['WarehouseSiteId'] = value && value.Code ? value.Code : '';
        this.reloadLostBin();
      }
    });
    this.appTable['rowEvent'].subscribe({
      next: (event: any) => {
        let data = this.appTable['getData']()['data'];
        let _selected = false;
        for (let idx in data) {
          if (data[idx].selected) {
            _selected = true;
          }
        }
        this.allowCreateTransfer = _selected;
      }
    })
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
