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

import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../../shared/toast.service';
import { Service } from '../../service';
import { ConfirmSkipComponent } from './confirm/component';
import { STATUS_BORDER_CONFIRM_PICKING_COLOR, CONFIRM_PICKING_STATUS } from '../../../shared/constant';

@Component({
  selector: 'app-so-auto-pickpack-confirm-list',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class SOAutoPickPackConfirmListComponent implements OnInit {
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('fromDate', { static: false }) fromDate: any;
  @ViewChild('toDate', { static: false }) toDate: any;
  @ViewChild('employee', { static: false }) employee: ElementRef;
  @ViewChild('statusConfirm', { static: false }) statusConfirm: ElementRef;
  @ViewChild('content', { static: false }) contentInput: ElementRef;
  @ViewChild('client', { static: false }) client: any;

  tableConfig: any;
  configDate: any = {
    setDefaultDate: true
  };
  employeeConfig: any;
  statusConfirmConfig: any;
  clientConfig: Object;
  selectedRow: any = null;
  firstLoad: boolean = true;
  filters: any = {
    WarehouseCode: '',
    WarehouseSiteId: '',
    ClientCode: 'DEFAULT',
    FromDate: '',
    ToDate: '',
    Content: '',
    Employee: '',
    IsAllowSkipped: '',
    FromPOR: 1
  };

  constructor(
    public dialog: MatDialog,
    private service: Service,
    private translate: TranslateService,
    private toast: ToastService) {
      this.firstLoad = true;
  }

  ngOnInit() {
    this.filters['WarehouseCode'] = window.localStorage.getItem('_warehouse') || window.getRootPath().toUpperCase();
    this.initTable();
    this.initCombo();
  }

  ngAfterViewInit() {
    const sevenDayBefore = moment().subtract(1, 'week').toDate();
    this.fromDate.setValue(sevenDayBefore);

    this.initEvent();
    setTimeout(() => {
      if (this.contentInput) {
        this.contentInput.nativeElement.focus();
      }
    }, 300)
  }
  getSelectedTableData() {
    let data = this.appTable['getData']()['data'];

    if (!data.length) {
      return;
    }
    let saveData = [];
    for (let idx in data) {

      let valid =  data[idx].Status != 'PickingAfterPacked' ||
      (data[idx].IsPickedLastItem != undefined && !data[idx].IsPickedLastItem) ||
      (data[idx].RemainSkip != undefined && data[idx].RemainSkip <= 0)
      || data[idx].IsAllowSkipped == false;

      if(valid) {
        continue;
      }

      if (data[idx].selected) {
        saveData.push(data[idx]);
      }
    }
    if (!saveData.length) return;
    return saveData;
  }
  onClickConfirmPickAgain(event: any) {
    let selectedTableData = this.getSelectedTableData();
    this.showConfirmPickList(selectedTableData, true);
  }
  onClickConfirmDone(event: any) {
    let selectedTableData = this.getSelectedTableData();
    this.showConfirmPickList(selectedTableData, false);
  }
  showConfirmPickList(pickListData: any, isAllowSkipped: boolean) {
    if (!pickListData) {
      this.toast.error('Vui lòng chọn ít nhất 1 PL để xác nhận!', 'error_title');
      return;
    }

    const dialogRef = this.dialog.open(ConfirmSkipComponent, {
      disableClose: true,
      data: {
        pickListData: pickListData || [],
        isAllowSkipped: isAllowSkipped
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.pickListConfirmSkip(result);
      }
    });
  }
  pickListConfirmSkip(data: any) {
    let saveData = {
      PickListCodes: [],
      IsAllowSkipped: data.isAllowSkipped,
      RemainSkip: 1
    };
    let pickListData = data.pickListData;
    for (let idx in pickListData) {
      saveData.PickListCodes.push(pickListData[idx].PickListCode);
    }
    this.service.ConfirmSkipItem(saveData)
      .subscribe((resp: any) => {
        if (resp.Status) {
          let msgTxt = `PickListConfirmSkip.${data.isAllowSkipped ? 'ConfirmDone' : 'ConfirmPickAgain'}`;
          this.toast.success(`${this.translate.instant(msgTxt)} thành công`, 'success_title');
          this.search(null);
        } else {
          if (resp.ErrorMessages && resp.ErrorMessages.length) {
            this.toast.error(resp.ErrorMessages.join('\n'), 'error_title');
          }
        }
      })
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
    if (this.filters.Content) {
      _filters.Content = this.filters.Content.trim();
    }
    return _filters;
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
    
    this.employeeConfig = {
      selectedFirst: false,
      isSelectedAll: false,
      isSorting: false,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return this.renderValueCombo(option, false);
      },
      type: 'autocomplete',
      filter_key: 'Name',
      URL_CODE: 'SFT.employee',
      filters: {
        WarehouseCode: window.localStorage.getItem('_warehouse') || window.getRootPath().toUpperCase()
      }
    };
    this.statusConfirmConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      isSorting: false,
      isSelectedAllValueIsEmpty: true,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Name'] ? option['Name'] : option['Code'];
      },
      type: 'autocomplete',
      filter_key: 'Name',
      data: [{
        Code: '',
        Name: 'Tất cả'
      }, {
        Code: 'null',
        Name: 'Chưa duyệt'
      }, {
        Code: '0',
        Name: 'Hoàn thành'
      }, {
        Code: '1',
        Name: 'Lấy lại hàng'
      }]
    }
  }

  private renderSOTypeColor(row: any) {
    if (row.IsPackingEven) {
      if (row.IsPackingEven == 'Even') {
        return {
          color: '#2A9CFF'
        };
      } else if (row.IsPackingEven == 'Odd') {
        return {
          color: '#C67000'
        };
      } else {
        return {
          color: '#f05858'
        };
      }
    }
    return null;
  }

  initTable() {
    this.tableConfig = {
      showFirstLastButton: true,
      enableCheckbox: true,
      rowSelected: false,
      enableSelectRow: false,
      columns: {
        headerActionCheckBox: true,
        disabledActionCondition: (row: any) => {
          return row.Status != 'PickingAfterPacked' ||
            (row.IsPickedLastItem != undefined && !row.IsPickedLastItem) ||
            (row.RemainSkip != undefined && row.RemainSkip <= 0)
            || row.IsAllowSkipped == false;
          // return row.IsAllowSkipped != null;
        },
        actionTitle: this.translate.instant('action'),
        displayedColumns: [
          'index', 'PickListCode', 'SOCode',
          'Status', 'Employee', 'ConfirmPickingBy', 'TotalPickLocation', 'TotalSkipLocation',
          'TotalQty', 'TotalQtySkip', 'IsAllowSkipped', 'headerAction'
        ],
        options: [
          {
            title: 'PickListConfirmSkipPOR.PickListCode',
            name: 'PickListCode',
            style: {
              'min-width': '110px',
              'max-width': '110px'
            },
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/por/auto-pickpack/${data.PickListCode}`;
            }
          },
          {
            title: 'PickListConfirmSkipPOR.SOCode',
            name: 'SOCode',
            style: {
              'min-width': '160px',
              'max-width': '160px'
            },
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/por/details/${data.SOCode}`;
            }
          },
          {
            title: 'PickListConfirmSkipPOR.Status',
            name: 'Status',
            style: {
              'min-width': '140px'
            },
            render: (row: any, options: any) => {
              return this.translate.instant(`PickListStatus.${row.Status}`);
            },
          },
          {
            title: 'PickListConfirmSkipPOR.Employee',
            name: 'Employee',
            style: {
              'min-width': '120px',
              'max-width': '120px',
              'display': 'inline-grid',
            },
          },
          {
            title: 'PickListConfirmSkipPOR.ConfirmPickingBy',
            name: 'ConfirmPickingBy',
            style: {
              'min-width': '90px',
              'max-width': '90px',
              'display': 'inline-grid',
            },
          },
          {
            title: 'PickListConfirmSkipPOR.TotalPickLocation',
            name: 'TotalPickLocation',
            style: {
              'min-width': '80px',
              'max-width': '80px',
              'text-align': 'center',
              'display': 'inline-grid',
            },
          },
          {
            title: 'PickListConfirmSkipPOR.TotalSkipLocation',
            name: 'TotalSkipLocation',
            style: {
              'min-width': '80px',
              'max-width': '80px',
              'text-align': 'center',
              'display': 'inline-grid',
            },
          },
          {
            title: 'PickListConfirmSkipPOR.TotalQty',
            name: 'TotalQty',
            style: {
              'min-width': '80px',
              'max-width': '100px',
              'text-align': 'center',
              'display': 'inline-grid',
            },
          },
          {
            title: 'PickListConfirmSkipPOR.TotalQtySkip',
            name: 'TotalQtySkip',
            style: {
              'min-width': '80px',
              'max-width': '120px',
              'text-align': 'center',
              'display': 'inline-grid',
            },
          },
          {
            title: 'PickListConfirmSkipPOR.ConfirmStatus',
            name: 'IsAllowSkipped',
            // style: {
            //   'min-width': '140px',
            //   'max-width': '140px',
            // },
            borderStyle: (data: any) => {
              let status = '';
              if (data.IsAllowSkipped == false) {
                status = CONFIRM_PICKING_STATUS.Completed;
              } else if (data.IsAllowSkipped == true || data.ConfirmPickingBy) {
                status = CONFIRM_PICKING_STATUS.PickAgain;
              }
              return status ? this.borderColorByStatus(status) : '';
            },
            render: (row: any, options: any) => {
              let allowSkip = '';
              if (row.ConfirmPickingBy) {
                if (row.IsAllowSkipped == false) {
                  allowSkip = `${this.translate.instant(`PickListConfirmSkipPOR.ConfirmDone`)}`;
                }
                else {
                  allowSkip = `${this.translate.instant(`PickListConfirmSkipPOR.ConfirmPickAgain`)}`;
                }
              }
              else {
                if (row.IsAllowSkipped == true) {
                  allowSkip = `${this.translate.instant(`PickListConfirmSkipPOR.ConfirmPickAgain`)}`;
                } else if (row.IsAllowSkipped == false) {
                  allowSkip = `${this.translate.instant(`PickListConfirmSkipPOR.ConfirmDone`)}`;
                }
              }
              return allowSkip;
            },
          },
        ]
      },
      remote: {
        url: this.service.getAPI('pickListConfirms'),
        params: {
          filter: JSON.stringify(this.filters)
        }
      }
    };
  }

  exportData(event: any = {}) {
    return this.service.exportConfirmPick(this.getFilter());
  }

  borderColorByStatus(status: string) {
    if (status != "") {
      return {
        'color': STATUS_BORDER_CONFIRM_PICKING_COLOR[status],
        'border': `2px solid ${STATUS_BORDER_CONFIRM_PICKING_COLOR[status]}`,
        'border-radius': '2px',
        'padding': '5px 10px',
        'font-weight': '500'
      };
    }
    return "";
  }

  applyValueConfirmStatus(strValue: string) {
    let value: any;
    switch (strValue) {
      case '0':
        value = false;
        break;
      case '1':
        value = true;
        break;
      case 'null':
        value = null;
        break;
    }
    return value;
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
    this.employee['change'].subscribe({
      next: (value: any) => {
        if (value && value.Code) {
          this.filters['Employee'] = value ? value.Code : '';
          this.search(null);
        }
      }
    });
    this.statusConfirm['change'].subscribe({
      next: (value: any) => {
        if (value.Code != '') {
          this.filters['IsAllowSkipped'] = this.applyValueConfirmStatus(value.Code);
        } else {
          this.filters['IsAllowSkipped'] = '';
        }
        this.search(null);
      }
    });
    this.client['change'].subscribe({
      next: (value: any) => {
        this.filters['ClientCode'] = this.renderValue(value);

        if(this.filters["ClientCode"] && this.firstLoad) {
          this.firstLoad = false;
          this.search(null)
        }
      }
    });
    this.appTable['rowEvent'].subscribe({
      next: (event: any) => {
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

  private renderValueCombo(option: any, isShowCodeField: boolean = true) {
    let valueCombo = '';
    if (isShowCodeField && option['Code']) {
      valueCombo += `${option['Code']} - `;
    }
    valueCombo += option['Name'];
    return valueCombo;
  }

  private renderValue(value: any, isName = false) {
    return value ? isName ? value.Name : value.Code : '';
  }
}
