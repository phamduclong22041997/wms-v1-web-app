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
import { STATUS_BORDER_MASANSTORE } from '../../../shared/constant';
import { MatDialog } from '@angular/material/dialog';
import { Service } from '../../service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../shared/toast.service';
import * as moment from 'moment';
interface TableAction {
  icon: string;
  toolTip?: any;
  name: string,
  actionName?: any;
  disabledCondition?: any;
  class: string
}

@Component({
  selector: 'app-masan-product-edit',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class AdjustProductListComponent implements OnInit, AfterViewInit {
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('employee', { static: false }) employee: ElementRef;
  @ViewChild('client', { static: false }) client: any;
  @ViewChild('whBranchCombo', { static: false }) whBranchCombo: any;
  @ViewChild('fromDate', { static: false }) fromDate: any;
  @ViewChild('toDate', { static: false }) toDate: any;
  @ViewChild('content', { static: false }) contentInput: ElementRef;

  configDate: any;
  tableConfig: any;
  employeeConfig: any;
  filters: Object;
  warehouseBrachConfig: Object;
  clientConfig: Object;

  constructor(
    private translate: TranslateService,
    private service: Service,
    // private toast: ToastService,
    public dialog: MatDialog,
    private router: Router,
    private toast: ToastService) { }


  ngOnInit() {
    this.initData();
    this.initCombo();
    this.initTable();
  }

  initData() {
    this.filters = {
      Content: '',
      ClientCode: '',
      WarehouseSiteId: '',
      FromDate: '',
      ToDate: '',
      Employee: '',
      WarehouseCode: ''
    };
    this.filters['FromDate'] = moment().subtract(7, 'day').format('YYYY-MM-DD');
    this.filters['ToDate'] = moment().format('YYYY-MM-DD');
    this.filters['WarehouseCode'] = window.localStorage.getItem('_warehouse') || window.getRootPath().toUpperCase();

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
  initCombo() {
    this.employeeConfig = {
      selectedFirst: false,
      isSelectedAll: false,
      isSorting: false,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Name']? option['Name'] : option['Code'];
      },
      type: 'autocomplete',
      filter_key: 'Name',
      URL_CODE: 'SFT.employee'
    };

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

    this.warehouseBrachConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      isSorting: false,
      isFilter: false,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Code'] ? `${option['Code']} - ${option['Name']}` : option['Name'];
      },
      type: 'combo',
      filter_key: 'Name'
    }
  }

  initTable() {
    this.tableConfig = {
      style: {
        "overflow-x": "hidden",
      },
      columns: {
        displayedColumns: [
          "index",
          "ClientCode",
          "DCSite",
          "Code",
          "LotNumber",
          "TotalLocationLabel",
          "SKU",
          "SKUName",
          "Uom",
          "Qty",
          "AdjustManufactureDate",
          "AdjustExpiredDate",
          "CreatedDate",
          "Employee",
        ],
        options: [
          {
            title: "client",
            name: "ClientCode",
            style: {
              'min-width': '60px',
              'max-width': '60px'
            }
          },
          {
            title: "DCSite",
            name: "DCSite",
            style: {
              'min-width': '100px',
              'max-width': '100px'
            }
          },
          {
            title: "AdjustProduct.AdjustCode",
            name: "Code",
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/product/adjust-product/${data.Code}`;
            },
            style: {
              'min-width': '120px',
              'max-width': '120px'
            }
          },
          {
            title: "AdjustProduct.AdjustDate",
            name: "CreatedDate",
            style: {
              'min-width': '80px',
              'max-width': '80px'
            }
          },
          {
            title: "AdjustProduct.LotNumber",
            name: "LotNumber",
            style: {
              'min-width': '80px',
              'max-width': '80px'
            }
          },
          {
            title: "AdjustProduct.AdjustEmployee",
            name: "Employee",
            style: {
              'min-width': '100px',
              'max-width': '100px'
            }
          },
          {
            title: "AdjustProduct.Qty",
            name: "Qty",
            style: {
              'min-width': '50px',
              'max-width': '50px'
            }
          },
          {
            title: "AdjustProduct.LocationLabel",
            name: "LocationLabel",
            style: {
              'min-width': '70px',
              'max-width': '70px'
            }
          },
          {
            title: "AdjustProduct.TotalLocationLabel",
            name: "TotalLocationLabel",
            style: {
              'min-width': '50px',
              'max-width': '50px'
            }
          },
          {
            title: "AdjustProduct.SubLocationLabel",
            name: "SubLocationLabel",
            style: {
              'min-width': '70px',
              'max-width': '70px'
            }
          },
          {
            title: "AdjustProduct.SKUName",
            name: "SKUName"
          },
          {
            title: "AdjustProduct.SKU",
            name: "SKU",
            style: {
              'min-width': '90px',
              'max-width': '90px'
            }
          },
          {
            title: "AdjustProduct.Uom",
            name: "Uom",
            style: {
              'min-width': '50px',
              'max-width': '50px'
            }
          },
          {
            title: "AdjustProduct.AdjustExpiredDate",
            name: "AdjustExpiredDate",
            style: {
              'min-width': '90px',
              'max-width': '90px'
            }
          },
          {
            title: "AdjustProduct.AdjustManufactureDate",
            name: "AdjustManufactureDate",
            style: {
              'min-width': '90px',
              'max-width': '90px'
            }
          }
        ]
      },
      remote: {
        url: this.service.getAPI("adjustProductList"),
        params: {
          filter: JSON.stringify(this.filters)
        }
      },
    };
  }
  addNew(event: any) {
    this.router.navigate([`/${window.getRootPath()}/product/adjust-product-create`]);
  }
  reloadComboWHBranch(data: any) {
    if (this.whBranchCombo && data) {
      this.whBranchCombo['clear'](false, true);
      this.whBranchCombo['setData']([].concat(data));
      this.whBranchCombo['reset']();
    } else {
      this.whBranchCombo['clear'](false, true);
      this.whBranchCombo['setData']([]);
      this.whBranchCombo['reset']();
    }

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

  initTableAction(): TableAction[] {
    return [{
      icon: "mode_edit",
      name: 'edit-sku',
      toolTip: {
        name: "Cập nhật sản phẩm",
      },
      class: "ac-task",
      disabledCondition: (row: any) => {
        return (true);
      }
    }]
  }

  search(event: any) {
    if (this.filters['Content']) {
      this.filters['Content'] = this.filters['Content'].trim();
    }
    let filters = this.getFilter();
    this.appTable['search'](filters);
  }

  ngAfterViewInit() {
    this.initEvent();
    const sevenDayBefore = moment().subtract(7, 'day').toDate();
    this.fromDate.setValue(sevenDayBefore);
    this.toDate.setValue(moment().toDate())
    setTimeout(() => {
      if (this.contentInput) {
        this.contentInput.nativeElement.focus();
      }
    }, 300)
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
    this.appTable['actionEvent'].subscribe({
      next: (event: any) => {
        if (!event) {
          return;
        }
        const action = event['action'];
        switch (action) {
          case 'mode_edit':
            break;
        }
      }
    });
    this.employee['change'].subscribe({
      next: (data: any) => {
        if (data) {
          this.filters['Employee'] = data.Code;
        } else {
          this.filters['Employee'] = '';
        }
      }
    });
    this.client['change'].subscribe({
      next: (value: any) => {
        this.filters['ClientCode'] = value ? value.Code : '';
        this.reloadComboWHBranch(value ? (value.Branch || []) : []);
      }
    });
    this.whBranchCombo['change'].subscribe({
      next: (value: any) => {
        this.filters['WarehouseSiteId'] = "";
        if(value && value.Code) {
          this.filters['WarehouseSiteId'] = value.Code;
        }
      }
    });
  }
}
