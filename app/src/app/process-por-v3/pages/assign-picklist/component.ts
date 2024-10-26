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
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { ConfirmEmployeeComponent } from './confirm/component';
import { ConfirmTaskProcessListComponent } from '../task-process/confirm/component';
import { TableAction } from '../../../interfaces/tableAction';


@Component({
  selector: 'app-so-auto-pickpack-list',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class AssignPickListComponent implements OnInit {
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('fromDate', { static: false }) fromDate: any;
  @ViewChild('toDate', { static: false }) toDate: any;
  @ViewChild('statusPL', { static: false }) statusPLCombo: ElementRef;
  @ViewChild('vendor', { static: false }) vendor: ElementRef;
  @ViewChild('content', { static: false }) contentInput: ElementRef;
  @ViewChild('client', { static: false }) client: any;

  dataSourceGrid = {
    rows: <any>[],
    total: 0
  };

  tableConfig: any;
  configDate: any;
  provinceConfig: any;
  service3PLConfig: any;
  statusConfig: any;
  statusPLConfig: any;
  vendorConfig: any;
  employeeConfig: any;
  clientConfig: Object;
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
    Vendor: "",
    FromPOR: 1
  };

  constructor(
    public dialog: MatDialog,
    private service: Service,
    private translate: TranslateService,
    private toast: ToastService) {

  }

  ngOnInit() {
    this.allowCreatePickList = false;
    this.filters['FromDate'] = moment().subtract(1, 'day').format('YYYY-MM-DD');
    this.filters['WarehouseCode'] = window.localStorage.getItem('_warehouse') ||  window.getRootPath().toUpperCase();
    this.EmployeeCode = '';
    this.TaskProcess = null;
    this.isShowTaskProcess = false;
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
  onClickAssignEmployee(event: any) {
    let data = this.appTable['getData']()['data'];
    
    if (!data.length) {
      return;
    }
    let saveData = [];
    for (let idx in data) {
      if (data[idx].selected) {
        saveData.push(data[idx]);
      }
    }
    if (!saveData.length) return;
    this.showEmployeeList(saveData, false);
  }
  showEmployeeList(data: any, isRow = false) {
    const dialogRef = this.dialog.open(ConfirmEmployeeComponent, {
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.AssignPicklistForEmployee(data,result);
      }
    });
  }
  AssignPicklistForEmployee(data: any, EmployeeCode: string) {
    if (!data.length) {
      this.toast.error('Vui lòng chọn ít nhất 1 PL để phân công!', 'common.error');
      return;
    }
    let saveData = {
      PickListCodes: [],
      EmployeeCode: EmployeeCode
    }
    for (let idx in data) {
      saveData.PickListCodes.push(data[idx].Code);
    }
    this.service.AssignEmployeePickLists(saveData)
    .subscribe((resp: any) => {
      if (resp.Status) {
        this.toast.success('Phân công đi lấy hàng thành công!', 'success_title');
        this.search(null);
      }
      else
      {
        if (resp.ErrorMessages && resp.ErrorMessages.length) {
          this.toast.error(resp.ErrorMessages.join("\n"), 'error_title');
        }
      }
    })
  }
  onEnter(event: any) {
    this.search(event);
  }
  search(event: any) {
    this.service.GetAssignPickLists(this.getFilter())
      .subscribe((resp: any) => {
        this.makeData(resp);
      })
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
    return this.service.exportAutoPickPack(this.filters);
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
    this.vendorConfig = {
      selectedFirst: false,
      isSelectedAll: false,
      isSorting: false,
      isSelectedAllValueIsEmpty: true,
      val: (option: any) => {
        return option['VendorId'];
      },
      render: (option: any) => {
        return option['VendorId'] ? `${option['VendorId']} - ${option['Name']}` : option['Name'];
      },
      type: 'autocomplete',
      filter_key: 'Name',
      URL_CODE: 'SFT.vendorcombo'
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
        WarehouseCode: window.localStorage.getItem('_warehouse') ||  window.getRootPath().toUpperCase()
      },
    };

  }

  makeData(data: any) {
    let _data = [];
    if (data.Status) {
      _data = data.Data;
    }
    this.appTable['renderData'](_data);
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
          'index', 
          'Code', 
          'SOCode', 
          'DOId', 
          'TotalSKU', 
          'TotalQty',
          'Employee', 
          'headerAction', 
          'actions'
        ],
        options: [
          {
            title: 'AssignPickListPOR.PickListCode',
            name: 'Code',
            style: {
              'min-width': '130px'
            },
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/por/auto-pickpack/${data.Code}`;
            }
          },
          {
            title: 'AssignPickListPOR.SOCode',
            name: 'SOCode',
            style: {
              'min-width': '150px'
            },
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/por/details/${data.SOCode}`;
            }
          },
          {
            title: 'AssignPickListPOR.DOCode',
            name: 'DOId',
            style: {
              'min-width': '140px'
            },
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/por/details/${data.SOCode}`;
            }
          },
          {
            title: 'AssignPickListPOR.TotalSKU',
            name: 'TotalSKU'
          },
          {
            title: 'AssignPickListPOR.TotalQty',
            name: 'TotalQty'
          },
          {
            title: 'AssignPickListPOR.Employee',
            name: 'Employee',
            style: {
              'min-width': '100px'
            },
          }
        ]
      },
      data: this.dataSourceGrid
    };

  }

  initTableAction(): TableAction[] {
    return [
      {
        name: "assign",
        icon: "assignment_ind",
        toolTip: {
          name: "Chọn nhân viên lấy hàng",
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

    this.vendor['change'].subscribe({
      next: (value: any) => {
        this.filters['vendor'] = value && value.VendorId ? value.VendorId:"";
      }
    });

    this.client['change'].subscribe({
      next: (value: any) => {
        this.filters['ClientCode'] = this.renderValue(value);
      }
    });

    this.appTable['actionEvent'].subscribe({
      next: (event: any) => {
        if (!event) {
          return;
        }
        
        const action = event["action"];
        console.log("RA", action)
        switch (action) {
          case 'assign':
            this.showEmployeeList([event["data"]], true);
            break;
        }
      }
    });
    this.appTable['rowEvent'].subscribe({
      next: (event: any) => {
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
  importAssignPickList(event: any){
    let dialogRef = this.dialog.open(ConfirmTaskProcessListComponent, {
      data: {
        HashTag: "AssignPickList",
        Title: this.translate.instant('TaskProcess.ImportFile')
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
      let url = `${window.getRootPath()}/por/task-process/${this.TaskProcess['Code']}/${this.TaskProcess['TaskType']}`;
      window.open(url, '_blank');
    }
  }

  private renderValueCombo(option: any) {
    return option['Code'] ? `${option['Code']} - ${option['Name']}` : option['Name'];
  }
  private renderValue(value: any, isName = false){
    return value ? isName ? value.Name: value.Code : '';
  }
}
