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
import { TranslateService } from '@ngx-translate/core';
import { Utils } from '../../../shared/utils';

@Component({
  selector: 'app-stocks',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})

export class StockListComponent implements OnInit, AfterViewInit {
  tableConfig: any;
  typeConfig: Object;
  clientConfig: Object;
  warehouseSiteConfig: Object;
  filters: Object;
  summary: any = {
    TotalInStock: '',
    TotalAvailable: '',
    TotalPendingIn: '',
    TotalPendingOut: '',
    TotalReadyToStow: ''
  }
  tooltip: any = {
    TotalInventory: 'Tổng "Tồn kho" của tất cả sản phẩm đang vận hành trong kho.',
    TotalAvailable: 'Tổng "Tồn kho khả dụng" của tất cả sản phẩm đang vận hành trong kho.',
    TotalPendingIn: 'Tổng "Số lượng chờ nhập" của tất cả sản phẩm đang vận hành trong kho.',
    TotalPendingOut: 'Tổng "Số lượng chờ xuất" của tất cả sản phẩm đang vận hành trong kho.',
    TotalReadyToStow: 'Tổng "Số lượng chờ lưu trữ" của tất cả sản phẩm đang vận hành trong kho.',
    Inventory: 'Tồn kho: Tổng số lượng sản phẩm đang được ghi nhận lưu trữ trong kho bao gồm tất cả các loại hàng hoá đang lưu trữ: Hàng mới, hàng hư hỏng, hàng chờ xử lý, hàng thất lạc, hàng hết date,.. Được tính theo nguyên tắc: Tổng số lượng sản phẩm nhập kho - Tổng số lượng sản phẩm xuất ra khỏi kho. Tồn kho = Tồn khả dụng + Tồn chờ xuất',
    Available: 'Số lượng Tồn khả dụng là số lượng sản phẩm vận hành trong kho được hệ thống ghi nhận đang sẳn sàng để xuất hàng. Số lượng Tồn khả dụng = Số lượng tồn kho - Số lượng chờ xuất',
    PendingIn: 'Số lượng chờ nhập là số lượng sản phẩm đã đặt hàng trên các đơn nhận hàng (Purchase Order) nhưng chưa nhận hàng. Số lượng chờ nhập không bao gồm trong số lượng "Tồn kho".',
    PendingOut: 'Số lượng chờ xuất là số lượng sản phẩm được hệ thống giữ lại để xuất cho các đơn xuất hàng (Sales Order) trên hệ thống. Số lượng chờ xuất là giá trị bao gồm trong số lượng "Tồn kho"; nhưng không bao gồm trong giá trị "Tồn khả dụng".',
    ReadyToStow: 'Số lượng chờ lưu trữ là số lượng sản phẩm theo từng SKU đã được nhận hàng theo từng phiên nhận hàng của từng PO và được lưu trữ trên Pallet và chưa được định vị trên các vị trí lưu trữ trong kho. Số lượng chờ lưu trữ là giá trị được bao gồm trong số lượng "Tồn kho".'
  }

  @ViewChild('content', { static: false }) contentInput: ElementRef;
  @ViewChild('type', { static: false }) type: any;
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('dcSite', { static: false }) dcSite: any;
  @ViewChild('client', { static: false }) client: any;

  constructor(
    private translate: TranslateService,
    private service: Service,
    public dialog: MatDialog,) { }

  ngOnInit() {
    this.filters = {
      Content: '',
      ConditionType: '',
      WhCode: window.localStorage.getItem('_warehouse') || window.getRootPath().toUpperCase()
    };

    this.initData();
  }

  initData() {
    this.initTable();

    let productType = [
      { Code: "New", Name: 'Mới' },
      { Code: "Quarantine", Name: 'Chờ xử lý' },
      { Code: "Damage", Name: 'Hàng hư hỏng' }
    ];

    this.typeConfig = {
      selectedFirst: false,
      isSelectedAll: false,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Name'];
      },
      type: 'autocomplete',
      filter_key: 'Name',
      data: productType
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
    this.warehouseSiteConfig = {
      selectedFirst: true,
      isSelectedAll: false,
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
          'WarehouseSiteName',
          'SKU',
          'InStock',
          'Available',
          'PendingIn',
          'PendingOut',
          'ReadyToStow',
          'Uom',
          'ConditionType'
        ],
        options: [
          {
            title: "Report.ClientCode",
            name: "ClientCode",
            style: {
              "min-width": "70px",
              "max-width": "70px",
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
            title: 'Stock.SKU',
            name: 'SKU'
          },
          {
            title: 'Stock.InStock',
            name: 'InStock',
            render: (data: any) => {
              return Utils.formatNumber(data.InStock);
            },
            toolTip: this.tooltip.Inventory,
            toolTipCss: 'header-tooltip'
          },
          {
            title: 'Stock.Available',
            name: 'Available',
            render: (data: any) => {
              return Utils.formatNumber(data.Available);
            },
            toolTip: this.tooltip.Available,
            toolTipCss: 'header-tooltip'
          },
          {
            title: 'Stock.PendingIn',
            name: 'PendingIn',
            render: (data: any) => {
              return Utils.formatNumber(data.PendingIn);
            },
            toolTip: this.tooltip.PendingIn,
            toolTipCss: 'header-tooltip'
          },
          {
            title: 'Stock.PendingOut',
            name: 'PendingOut',
            render: (data: any) => {
              return Utils.formatNumber(data.PendingOut);
            },
            toolTip: this.tooltip.PendingOut,
            toolTipCss: 'header-tooltip'
          },
          {
            title: 'Stock.ReadyToStow',
            name: 'ReadyToStow',
            render: (data: any) => {
              return Utils.formatNumber(data.ReadyToStow);
            },
            toolTip: this.tooltip.ReadyToStow,
            toolTipCss: 'header-tooltip'
          },
          {
            title: 'Stock.Uom',
            name: 'Uom'
          },
          {
            title: 'Stock.ConditionType',
            name: 'ConditionType',
            render: (data: any) => {
              return this.translate.instant(`POConditionType.${data.ConditionType}`);
            }
          },
        ]
      },
      remote: {
        url: this.service.getAPI('list'),
        params: {
          filter: JSON.stringify(this.filters)
        },
        callback: () => {
          this.buildSummary();
        }
      }
    };
  }

  ngAfterViewInit() {
    this.initEvent();

    setTimeout(() => {
      if (this.contentInput) this.contentInput.nativeElement.focus();
      this.search(null);
    }, 200);

  }
  reloadWarehouseBranch(data: any) {
    if (this.dcSite) {
      let _data = [];
      if (data.Code) {
        _data.push({ Code: '', Name: this.translate.instant('combo.all') });
      }
      for (let idx in data.Branch) {
        let site = data.Branch[idx];
        if (site.WarehouseCode === this.filters['WhCode']) {
          _data.push({
            Code: site.Code,
            Name: site.Name,
          })
        }
      }
      this.dcSite['clear'](false, true);
      this.dcSite['setData'](_data);
      if (_data.length > 0) {
        this.filters['WhSite'] = _data[0].Code;
        this.dcSite['setValue'](_data[0].Code);
      }
    }
  }
  initEvent() {
    this.type['change'].subscribe({
      next: (value: any) => {
        this.filters['ConditionType'] = value ? value.Code : '';
      }
    });
    this.client['change'].subscribe({
      next: (value: any) => {
        this.filters['ClientCode'] = value && value.Code ? value.Code : '';
        this.reloadWarehouseBranch(value);
      }
    });
    this.dcSite['change'].subscribe({
      next: (value: any) => {
        this.filters['WarehouseSiteId'] = value && value.Code ? value.Code : '';
      }
    });
  }

  search(event: any) {
    this.summary = {
      TotalInStock: '',
      TotalAvailable: '',
      TotalPendingIn: '',
      TotalPendingOut: '',
      TotalReadyToStow: ''
    };

    this.appTable['search'](this.filters);

  }

  buildSummary() {
    let data = this.appTable['getData']();
    if (data && data.summary) {
      this.summary = {
        TotalInStock: Utils.formatNumber(data.summary.TotalInStock),
        TotalAvailable: Utils.formatNumber(data.summary.TotalAvailable),
        TotalPendingIn: Utils.formatNumber(data.summary.TotalPendingIn),
        TotalPendingOut: Utils.formatNumber(data.summary.TotalPendingOut),
        TotalReadyToStow: Utils.formatNumber(data.summary.TotalReadyToStow)
      };
    }
  }

  exportExcel(event: any) {
    return this.service.exportStock(this.filters);
  }
}
