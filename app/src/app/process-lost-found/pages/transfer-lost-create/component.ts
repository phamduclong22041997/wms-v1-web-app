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
export class CreateTransferLostComponent implements OnInit {
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('fromDate', { static: false }) fromDate: any;
  @ViewChild('toDate', { static: false }) toDate: any;
  @ViewChild('status', { static: false }) statusCombo: ElementRef;
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
  clientConfig: Object;
  warehouseBrachConfig: any;
  filters: any = { 
    WarehouseCode: "",
    ClientCode: "",
    WarehouseSiteId: "",
    FromDate: "",
    ToDate: "",
    Content: "",
    Status: ""
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
    this.service.getLostListTransfer(req)
      .subscribe((resp: any) => {
        if (resp.Status) {
          this.makeData(resp);
        } else {
          this.toast.error(resp.ErrorMessages.join("\n"), 'error_title');
        }
      })
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
    this.statusConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      isSelectedAllValueIsEmpty: true,
      filters: {
        Collection: 'INV.Issues',
        Column: 'Status',
        Codes: 'New,PartiallyProcessed'
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
      enableCheckbox: true,
      columns: {
        isContextMenu: false,
        headerActionCheckBox: true,
        actionTitle: this.translate.instant('action'),
        actions: this.initTableAction(),
        displayedColumns: [
          'index', 'headerAction','ClientCode', 'WarehouseSiteId','Code','Type', 'Status', 
          'CreatedDate', 'SKU', 'SKUName', 'Qty', 'ProcessedQty', 'RemainingQty', 'actions'
        ],
        options: [
          {
            title: 'client',
            name: 'ClientCode',
            style: {
              'min-width': '60px',
              'max-width': '60px'
            }
          },
          {
            title: 'TransferLost.BranchWH',
            name: 'WarehouseSiteId',
            style: {
              'min-width': '90px',
              'max-width': '90px'
            }
          },
          {
            title: 'TransferLost.LostCode',
            name: 'Code',
            style: {
              'min-width': '130px',
              'max-width': '130px',
            },
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/lost-found/lost-detail/${data.Code}`;
            }
          },
          {
            title: 'TransferLost.LostType',
            name: 'Type',
            style: {
              'min-width': '100px',
              'max-width': '100px',
            },
          },
          {
            title: 'TransferLost.LostStatus',
            name: 'Status',
            style: {
              'min-width': '80px',
              'max-width': '80px',
            },
            render: (row: any, options: any) => {
              return this.translate.instant(`LostFoundStatus.${row.Status}`);
            },
          },
          {
            title: 'TransferLost.CreatedDate',
            name: 'CreatedDate',
            style: {
              'min-width': '80px',
              'max-width': '80px',
            }
          },
          {
            title: 'SKU',
            name: 'SKU',
            style: {
              'min-width': '80px',
              'max-width': '80px',
            }
          },
          {
            title: 'TransferLost.SKUName',
            name: 'SKUName'
          },
          {
            title: 'TransferLost.Qty',
            name: 'Qty',
            style: {
              'min-width': '70px',
              'max-width': '70px'
            },
          },
          {
            title: 'TransferLost.ProcessedQty',
            name: 'ProcessedQty',
            style: {
              'min-width': '70px',
              'max-width': '70px'
            },
          },
          {
            title: 'TransferLost.RemainingQty',
            name: 'RemainingQty',
            style: {
              'min-width': '70px',
              'max-width': '70px'
            },
          },
        ]
      },
      data: this.dataSourceGrid
    };

  }

  initTableAction(): TableAction[] {
    return [
      {
        name: "viewtransfer",
        icon: "launch",
        toolTip: {
          name: "Chuyển hàng mất vật lý",
        },
        class: "ac-task",
        disabledCondition: (row: any) => {
          return true;
        }
      }
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

    this.statusCombo['change'].subscribe({
      next: (value: any) => {
        this.filters['Status'] =  value && value.Code ? value.Code : '';
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
        this.search(null);
      }
    });

    this.appTable['actionEvent'].subscribe({
      next: (event: any) => {
        if (!event) {
          return;
        }
        
        const action = event["action"];
        switch (action) {
          case 'viewtransfer':
            this.CreateTransferLost(event["data"]);
            break;
        }
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
  CreateTransferLost(data: any) {
    let url = `/${window.getRootPath()}/lost-found/create-transfer-lost/${data.Code}`;
    this.router.navigate([url]);
  }
  showConfirmCreateSession(event: any) {
    const dialogRef = this.dialog.open(NotificationComponent, {
      data: {
        message: `Bạn chắc chắn sản phẩm trong các Lost Issue đã mất hàng vật lý ? (Yes/ No)`,
        type: 1
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.TransferLostPhysical();
      }
    });
  }
  TransferLostPhysical(){
    let data = this.appTable['getData']()['data'];
    if (!data.length) {
      return;
    }
    let saveData = {
      Details: []
    }
    for (let idx in data) {
      if (data[idx].selected) {
        saveData.Details.push(data[idx]);
      }
    }
    
    this.service.createMutilTransferLost(saveData)
      .subscribe((resp: any) => {  
        if (resp.Status) {
          this.toast.success(`Tạo thành công phiên luân chuyển hàng ${resp.Data ? resp.Data.Code || "" : ""}`, 'success_title');
          this.search(null);
        } else {
          this.toast.error(resp.ErrorMessages.join('\n'), 'error_title')
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
}
