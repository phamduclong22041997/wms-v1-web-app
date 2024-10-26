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

import { STATUS_BORDER_MASANSTORE, BIN_TYPE, BIN_STATUS } from '../../../shared/constant';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Service } from '../../service';
import { TranslateService } from '@ngx-translate/core';
import { DockPalletComponent } from './../../../wh-transport-device/dock-pallet/component';

interface TableAction {
  name: string,
  icon: string;
  class?: string;
  toolTip?: any;
  actionName?: any;
  disabledCondition?: any;
}

@Component({
  selector: 'app-bins',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})

export class BinListComponent implements OnInit, AfterViewInit {
  tableConfig: any;
  dcConfig: Object;
  zoneConfig: any;
  statusConfig: Object;
  typeConfig: Object;
  filters: Object;
  clientConfig: Object;
  @ViewChild('content', { static: false }) contentInput: ElementRef;
  @ViewChild('dcCombo', { static: false }) dcCombo: any;
  @ViewChild('zone', { static: false }) zone: ElementRef;
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
      ClientCode: '',
      Content: '',
      Status: '',
      Type: '',
      WarehouseSiteId: '',
      ZoneCode: '',
      WarehouseCode: window.localStorage.getItem('_warehouse') || window.getRootPath().toUpperCase()
    };

    this.initData();
  }

  initData() {
    this.initTable();

    let deviceType = [
      { Code: BIN_TYPE.Pickable, Name: 'Có thể lấy hàng' },
      { Code: BIN_TYPE.UnPickable, Name: 'Chỉ chứa hàng' },
      { Code: BIN_TYPE.Lost, Name: 'Chứa hàng thất lạc' },
      { Code: BIN_TYPE.Found, Name: 'Chứa hàng tìm thấy' }
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
      { Code: BIN_STATUS.Empty, Name: 'Rỗng' },
      { Code: BIN_STATUS.Inputing, Name: 'Đang nhập hàng' },
      { Code: BIN_STATUS.Storing, Name: 'Đang chứa hàng' },
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
    }
    this.zoneConfig = {
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
      type: 'autocomplete',
      filter_key: 'Name',
      URL_CODE: 'SFT.warehouseZone'
    }

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
        actionTitle: this.translate.instant('action'),
        actions: this.initTableAction(),
        isContextMenu: false,
        displayedColumns: [
          'index',
          'ClientCode',
          'DCName',
          'ZoneCode',
          'Code',
          'Type',
          'Status',
          'CreatedDate',
          'actions'
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
            title: 'BIN.ZoneName',
            name: 'ZoneCode'
          },
          {
            title: 'BIN.Code',
            name: 'Code',
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/bin/${data.Code}`;
            }
          },
          {
            title: 'BIN.Type',
            name: 'Type',
            render: (data: any) => {
              return this.translate.instant(`BINType.${data.Type}`);
            }
          },
          {
            title: 'BIN.Status',
            name: 'Status',
            render: (data: any) => {
              return this.translate.instant(`BINStatus.${data.Status}`);
            }
          },
          {
            title: 'BIN.CreatedDate',
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

  initTableAction(): TableAction[] {
    return [
      {
        name: "dock-pallet",
        icon: "filter_none",
        toolTip: {
          name: "Định vị pallet rỗng",
        },
        class: "ac-task",
        disabledCondition: (row: any) => {
          return true;
        }
      }
    ];
  }

  showDockPallet(data: any) {
    const dialogRef = this.dialog.open(DockPalletComponent, {
      disableClose: true,
      data: data,
      width: '570px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.search();
      }
    });
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
      if(this.contentInput) this.contentInput.nativeElement.focus();
    }, 200)
    // this.appTable['search'](this.filters);
  }

  initEvent() {
    this.appTable['actionEvent'].subscribe({
      next: (event: any) => {
        if (event) {
          switch (event['action']) {
            case 'dock-pallet':
              this.showDockPallet({LocationCode: event['data'].Code, Type: 'bin'});
              break;
          }
        }
      }
    });
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
    this.zone['change'].subscribe({
      next: (value: any) => {
        this.filters['ZoneCode'] = value ? value['Code'] : ""
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

  ExportExcel(event: any){
    return this.service.exportExcel(this.filters);
  }

  private renderValueCombo(option: any) {
    return option['Code'] ? `${option['Code']} - ${option['Name']}` : option['Name'];
  }
}
