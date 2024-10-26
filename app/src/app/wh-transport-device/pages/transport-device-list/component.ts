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

import { STATUS_BORDER_MASANSTORE, DEVICE_STATUS, DEVICE_TYPE } from '../../../shared/constant';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Service } from '../../service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-transport-devices',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})

export class TransportDeviceListComponent implements OnInit, AfterViewInit {
  tableConfig: any;
  dcConfig: Object;
  statusConfig: Object;
  typeConfig: Object;
  filters: Object;
  clientConfig: Object;

  @ViewChild('content', { static: false }) contentInput: ElementRef;
  @ViewChild('dcCombo', { static: false }) dcCombo: any;
  @ViewChild('status', { static: false }) status: any;
  @ViewChild('type', { static: false }) type: any;
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('client', { static: false }) client: any;
  constructor(
    private translate: TranslateService,
    private service: Service,
    public dialog: MatDialog,) { }

  ngOnInit() {
    this.filters = {
      ClientCode:'',
      Content: '',
      Status: '',
      Type: '',
      WarehouseSiteId: '',
      WarehouseCode: window.localStorage.getItem('_warehouse') || window.getRootPath().toUpperCase()
    };

    this.initData();
  }

  initData() {
    this.initTable();

    let deviceType = [
      { Code: DEVICE_TYPE.Pallet, Name: 'Pallet' },
      { Code: DEVICE_TYPE.Tote, Name: 'Tote' }
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
      data: deviceType
    };

    let deviceStatus = [
      { Code: DEVICE_STATUS.Empty, Name: 'Rỗng' },
      { Code: DEVICE_STATUS.Inputing, Name: 'Đang nhập hàng' },
      { Code: DEVICE_STATUS.Storing, Name: 'Đang chứa hàng' },
      { Code: DEVICE_STATUS.WaitingRelease, Name: 'Đợi xử lý' }
    ];

    this.statusConfig = {
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
      data: deviceStatus
    };

    this.dcConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      isSorting: false,
      isFilter: true,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return this.renderValueCombo(option);
      },
      type: 'combo',
      filter_key: 'Name',
      filters: {
        data: this.filters['WarehouseCode']
      },
      URL_CODE: 'SFT.branchscombo'
    };
    this.clientConfig = {
      selectedFirst: true,
      isSelectedAll: true,
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
          'DCName',
          'Code',
          'Type',
          'Status',
          'CreatedDate'
        ],
        options: [
          {
            title: 'client',
            name: 'ClientCode',
            style: {
              'min-width': '100px',
              'max-width': '100px'
            }
          },
          {
            title: 'DCSite',
            name: 'DCName'
          },
          {
            title: 'TransportDevice.Code',
            name: 'Code',
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/transport-device/${data.Code}`;
            }
          },
          {
            title: 'TransportDevice.Type',
            name: 'Type'
          },
          {
            title: 'TransportDevice.Status',
            name: 'Status',
            render: (data: any) => {
              return this.translate.instant(`DeviceStatus.${data.Status}`);
            }
          },
          {
            title: 'TransportDevice.CreatedDate',
            name: 'CreatedDate'
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

    setTimeout(() => {
      if (this.contentInput) this.contentInput.nativeElement.focus();
    }, 200)
    // this.appTable['search'](this.filters);
  }

  initEvent() {
    this.status['change'].subscribe({
      next: (value: any) => {
        this.filters['Status'] = value ? value.Code : '';
      }
    });
    this.type['change'].subscribe({
      next: (value: any) => {
        this.filters['Type'] = value ? value.Code : '';
      }
    });
    this.dcCombo['change'].subscribe({
      next: (value: any) => {
        this.filters['WarehouseSiteId'] = value ? value.Code : '';
        this.search();
      }
    });

    this.client['change'].subscribe({
      next: (value: any) => {
        this.filters['ClientCode'] = value && value.Code ? value.Code : '';
        if (this.dcCombo) {
          if(value.Code){
            this.dcCombo['reload']({ ClientCode: this.filters['ClientCode'], data: this.filters['WarehouseCode'] });
          } else {
            this.dcCombo['clear'](false, true);
            this.dcCombo['setDefaultValue'](this.translate.instant('combo.all'));
          }
        }      
      }
    });
  }

  search() {
    this.appTable['search'](this.filters);
  }

  createTransport(event: any) {
    window.open(`/${window.getRootPath()}/print/transport`, '_blank')
  }

  printTransport(event: any) {
    window.open(`/${window.getRootPath()}/print/transport#print`, '_blank')
  }

  private renderValueCombo(option: any) {
    return option['Code'] ? `${option['Code']} - ${option['Name']}` : option['Name'];
  }

  exportExcel(data: any = {}) {
    if (this.filters['Content']) {
      this.filters['Content'] = this.filters['Content'].trim();
    }
    return this.service.exportTransportDevice(this.filters);
  }
}
