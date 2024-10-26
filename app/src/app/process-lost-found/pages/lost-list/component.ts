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

import { STATUS_BORDER_MASANSTORE, ISSUE_STATUS } from '../../../shared/constant';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Service } from '../../service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../shared/toast.service';
import { ConfirmCancelComponent } from '../../../components/confirm-cancel/component';
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
  selector: 'app-list-po',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})

export class ListLostComponent implements OnInit, AfterViewInit {
  tableConfig: any;
  statusConfig: Object;
  filters: Object;
  configDate: any;
  lostStatusConfig: Object;
  clientConfig: Object;
  whBranchConfig: Object;
  data: any = {
    LostLocationLabel: ''
  }

  @ViewChild('content', { static: false }) contentInput: ElementRef;
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
      Status: 'New',
      Type: '',
      LostLocationLabel: ''
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
    this.filters['WarehouseCode'] = window.localStorage.getItem('_warehouse');
    this.initTable();
    this.initCombo();
  }

  initCombo() {
    let _session = this.loadSession();
    if (_session['FromDate'] && this.filters['ToDate'] == _session['ToDate']) {
      if (this.filters['FromDate'] > _session['FromDate']) {
        this.filters['FromDate'] = _session['FromDate'];
      }
    } else {
      this.clearSession();
      _session = {};
    }

    // this.whBranchConfig = {
    //   selectedFirst: true,
    //   isSelectedAll: false,
    //   isSorting: false,
    //   defaultValue: _session['WarehouseSiteId'] || "",
    //   val: (option: any) => {
    //     return option['Code'];
    //   },
    //   render: (option: any) => {
    //     return `${option['Code']} - ${option['Name']}`;
    //   },
    //   type: 'autocomplete',
    //   filter_key: 'Code',
    //   URL_CODE:'SFT.branchscombo',
    //   filters: {
    //     WarehouseCode: this.filters['WarehouseCode']
    //   }
    // };
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
    this.whBranchConfig = {
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
    this.lostStatusConfig = {
      selectedFirst: false,
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
          'ClientCode',
          'DCSite',
          'Code',
          'Status',
          'IssueType',
          'CreatedDate',
          'SKU',
          'ProductName',
          'Uom',
          "Qty"
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
            title: 'LostFound.Grid.LostType',
            name: 'IssueType',
            render: (data: any) => {
              return this.translate.instant(`IssueType.${data.IssueType}`);
            }
          },
          
          {
            title: 'LostFound.Grid.Code',
            name: 'Code',
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/lost-found/lost-detail/${data.Code}`;
            }
          },
          {
            title: 'LostFound.Grid.CreatedDate',
            name: 'CreatedDate'
          },
          {
            title: 'SKU',
            name: 'SKU',
          },
          {
            title: 'LostFound.Grid.ProductName',
            name: 'ProductName'
          },
          {
            title: 'LostFound.Grid.Unit',
            name: 'Uom',
          },
          {
            title: 'LostFound.Grid.LostQty',
            name: 'Qty'
          },
          {
            title: 'LostFound.Grid.Status',
            name: 'Status',
            render: (data: any) => {
              return this.translate.instant(`LostFoundStatus.${data.Status}`);
            }
          },
          {
            title: 'LostFound.DCSite',
            name: 'DCSite'
          }
        ]
      },
      remote: {
        url: this.service.getAPI('list'),
        params: {
          filter: JSON.stringify(this.filters)
        }
      }
    };
  }
  initTableAction(): TableAction[] {
    return [
      {
        icon: "remove_circle",
        class: 'ac-remove',
        name: 'cancel-issue',
        toolTip: {
          name: "Hủy",
        },
        disabledCondition: (row: any) => {
          return row.Status == ISSUE_STATUS.NEW && row.IssueType == "LOST_RANDOM"
        }
      }
    ];
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

    setTimeout(() => {
      if (this.contentInput) this.contentInput.nativeElement.focus();
      if (this.filters['FromDate']) {
        const sevenDayBefore = moment(this.filters['FromDate'], "YYYY-MM-DD").toDate();
        this.fromDate.setValue(sevenDayBefore);
      }
    }, 500)
  }
  reloadWarehouseBranch(data: any) {
    if (this.whBranch) {
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
      this.whBranch['clear'](false, true);
      this.whBranch['setData'](_data);
      if (_data.length > 0) {
        this.filters['WarehouseSiteId'] = _data[0].Code;
        this.whBranch['setValue'](_data[0].Code);
      }
    }
  }
  initEvent() {
    this.client['change'].subscribe({
      next: (value: any) => {
        this.filters['ClientCode'] = value ? value.Code : "";
        if(this.whBranch) {
          this.reloadWarehouseBranch(value);
        }
      }
    });
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
    this.whBranch['change'].subscribe({
      next: (value: any) => {
        this.filters['WarehouseSiteId'] = value ? value.Code : '';
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
          case 'cancel-issue':
            this.cancelLostIssue(event.data.Code);
            break;
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
    this.filters['LostLocationLabel'] = this.data.LostLocationLabel;
    
    this.appTable['search'](this.filters);

    this.saveSession(this.filters);
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

  createNew(event: any) {
    window.open(`/${window.getRootPath()}/lost-found/lost-create`, '_blank')
  }

  cancelLostIssue(code: String) {
    const dialogRef = this.dialog.open(ConfirmCancelComponent, {
      data: {
        title: "Huỷ bút toán thất lạc",
        Items: [{
          Key: "Mã bút toán",
          Val: code
        }]
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.execCancelIssue(code);
      }
    });
  }

  execCancelIssue(code: String) {
    this.service.cancelLost({ Code: code })
      .subscribe((resp: any) => {
        if (resp.Status) {
          let tmp = this.appTable['data']['rows'];
          let index = -1;
          for (let i = 0; i < tmp.length; i++) {
            if (tmp[i].Code == code) {
              index = i;
              break;
            }
          }
          if (index != -1) {
            this.appTable['data']['rows'][index].Status = 'Canceled';
          }
          this.toast.success(`HUỶ Lost Issue: ${code} thành công`, 'success_title');
        }
        else {
          this.toast.error(`HUỶ Lost Issue: ${code} không thành công`, 'error_title');
        }
      })
  }

  saveSession(data: any) {
    localStorage.setItem("LOST_SESSION", JSON.stringify({
      ClientCode: data.ClientCode,
      WarehouseCode: data.WarehouseCode,
      WarehouseSiteId: data.WarehouseSiteId,
      Status: data.Status,
      FromDate: data.FromDate,
      ToDate: data.ToDate
    }));
  }
  clearSession() {
    localStorage.removeItem("LOST_SESSION");
  }
  loadSession() {
    let s = localStorage.getItem("LOST_SESSION");
    if (s) {
      return JSON.parse(s);
    }
    return {};
  }
}
