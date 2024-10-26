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
import { Service } from '../../service';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../shared/toast.service';
import { MatDialog } from '@angular/material/dialog';
import { PrintService } from '../../../shared/printService';
import { Utils } from '../../../shared/utils';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { STATUS_COLOR } from '../../../shared/constant';

interface TableAction {
  icon: string;
  toolTip?: any;
  actionName?: any;
  name: string,
  class: string,
  disabledCondition?: any;
}

@Component({
  selector: 'app-po-details',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class ProductClaimDetailComponent implements OnInit, AfterViewInit {
  @ViewChild('appTableDamage', { static: false }) appTableDamage: ElementRef;
  @ViewChild('appTableOutDate', { static: false }) appTableOutDate: ElementRef;

  outDateConfig: Object;
  outDateData: any[];
  damageConfig: Object;
  damageData: any[];
  productclaim: string;

  data: any = {
    CalendarDay: '',
    CreatedBy: '',
    CreatedDate: '',
    WarehouseName: '',
    FileName: '',
    DCSite: ''
  }

  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private toast: ToastService,
    private service: Service,
    public dialog: MatDialog,
    private printService: PrintService) {
    this.productclaim = this.route.snapshot.params.productclaim;
  }

  ngOnInit() {
    this.damageData = [];
    this.outDateData = [];

    this.initData();
    this.initTable();
  }
  ngAfterViewInit() {
    this.initEvent();
    this.loadData();
  }

  initEvent() {

  }

  initData() {
    this.data = {
      CalendarDay: '',
      CreatedBy: '',
      CreatedDate: '',
      WarehouseName: '',
      FileName: '',
      DCSite: ''
    }
  }

  initTable() {
    let status = {
      DamagedByVendor: 'Hư hỏng do NCC',
      DamagedByOperation: 'Hư hỏng do vận hành',
      DamagedInWarehouse: 'Hư hỏng trong kho',
      OutOfDate: 'Hàng hết date'
    }
    this.damageConfig = {
      style: {
        'overflow-x': 'hidden'
      },
      columns: {
        isContextMenu: false,
        displayedColumns: [
          'index',
          'SKU',
          'Name',
          'BaseUOM',
          'CreatedDate',
          'Location',
          'Qty',
          'ClaimType',
          'NCC',
          'UnitPrice',
          'TotalPrice',
          'Note',
          'Action'
        ],
        options: [
          {
            title: 'SKU',
            name: 'SKU',
          },
          {
            title: 'Tên sản phẩm',
            name: 'Name',
          },
          {
            title: 'ĐVT',
            name: 'BaseUOM',
          },
          {
            title: 'Ngày cập nhật',
            name: 'CreatedDate'
          },
          {
            title: 'Vị trí',
            name: 'Location',
          },
          {
            title: 'Số lượng',
            name: 'Qty',
          },
          {
            title: 'Claim',
            name: 'ClaimType',
            render: (data: any) => {
              return status[data.ClaimType] ? status[data.ClaimType] : data.ClaimType;
            }
          },
          {
            title: 'NCC',
            name: 'NCC'
          },
          {
            title: 'Giá',
            name: 'UnitPrice'
          },
          {
            title: 'Thành tiền',
            name: 'TotalPrice'
          },
          {
            title: 'Ghi chú',
            name: 'Note'
          },
          {
            title: 'Hướng xử lý',
            name: 'Action'
          }
        ]
      },
      data: {
        rows: [],
        total: 0
      }
    }

    this.outDateConfig = {
      style: {
        'overflow-x': 'hidden'
      },
      enableFirstLoad: false,
      columns: {
        isContextMenu: false,
        displayedColumns: [
          'index',
          'SKU',
          'Name',
          'BaseUOM',
          'CreatedDate',
          'ClaimedBy',
          'ClaimType',
          'ManufactureDate',
          'ExpiredDate',
          'Qty',
          'UnitPrice',
          'TotalPrice',
          'Note',
          'Action'
        ],
        options: [
          {
            title: 'SKU',
            name: 'SKU',
          },
          {
            title: 'Tên sản phẩm',
            name: 'Name',
          },
          {
            title: 'ĐVT',
            name: 'BaseUOM',
          },
          {
            title: 'Ngày cập nhật',
            name: 'CreatedDate'
          },
          {
            title: 'NV Claim',
            name: 'ClaimedBy'
          },
          {
            title: 'Loại Claim',
            name: 'ClaimType',
            render: (data: any) => {
              return status[data.ClaimType] ? status[data.ClaimType] : data.ClaimType;
            }
          },
          {
            title: 'NSX',
            name: 'ManufactureDate',
          },
          {
            title: 'HSD',
            name: 'ExpiredDate',
          },
          {
            title: 'Số lượng',
            name: 'Qty',
          },
          {
            title: 'Giá',
            name: 'UnitPrice'
          },
          {
            title: 'Thành tiền',
            name: 'TotalPrice'
          },
          {
            title: 'Ghi chú',
            name: 'Note'
          },
          {
            title: 'Hướng xử lý',
            name: 'Action'
          }
        ]
      },
      data: {
        rows: [],
        total: 0
      }
    }
  }
  borderColor(status: string) {
    return {
      'color': STATUS_COLOR[status]
    };
  }

  loadData() {
    let filters = {
      Keygen: this.productclaim
    };
    this.service.getProductClaimUploadDetails(filters)
      .subscribe((resp: any) => {
        if (resp.Data && resp.Status) {
          this.data = resp.Data;
          let contents = {};
          for (let i in resp.Data.Details) {
            let item = resp.Data.Details[i];
            if (!contents[item.Type]) {
              contents[item.Type] = [];
            }
            contents[item.Type].push(item);
          }
          if (contents['Damaged'])
            this.appTableDamage['renderData'](contents['Damaged']);
          if (contents['OutOfDate'])
            this.appTableOutDate['renderData'](contents['OutOfDate']);
          console.log('::response::', contents);
        }
      });
  }

  onTabClick(event: any) {
    this.selectTab(event.index);
  }
  selectTab(index: any) {
    switch (index) {
      case 1:

        break;
      case 2:

        break;
    }
  }
}
