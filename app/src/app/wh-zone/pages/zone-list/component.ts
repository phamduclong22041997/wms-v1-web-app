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

import { STATUS_BORDER_MASANSTORE, DEVICE_STATUS } from '../../../shared/constant';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Service } from '../../service';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../shared/toast.service';

interface TableAction {
  name: string,
  icon: string;
  class?: string;
  toolTip?: any;
  actionName?: any;
  disabledCondition?: any;
}
@Component({
  selector: 'app-zone-list',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})

export class ZoneListComponent implements OnInit, AfterViewInit {
  tableConfig: any;
  zoneConfig: any;
  filters: Object;

  @ViewChild('zone', { static: false }) zone: ElementRef;
  @ViewChild('appTable', { static: false }) appTable: ElementRef;

  constructor(
    private translate: TranslateService,
    private service: Service,
    public dialog: MatDialog,
    private toast: ToastService) { }

  ngOnInit() {
    this.filters = {
      Type: 'PicklistZone',
      Code: ''
    };

    this.initData();
  }

  initData() {
    this.initTable();

    this.zoneConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      isSorting: false,
      isSelectedAllValueIsEmpty: true,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Code'] ? `${option['Code']} - ${option['Name']}` : `${option['Name']}`;
      },
      type: 'autocomplete',
      filter_key: 'Name',
      URL_CODE: 'SFT.warehouseZone'
    }
  }
  initTableAction(): TableAction[] {
    return [
      {
        name: "setup",
        icon: "arrow_upward",
        toolTip: {
          name: "Tăng thứ tự ưu tiên",
        },
        class: "ac-task",
        disabledCondition: (row: any) => {
          return row.ZOrder != 1;
        }
      },
      {
        name: "setupdisable",
        icon: "arrow_upward",
        disabledCondition: (row: any) => {
          return row.ZOrder == 1;
        }
      },
      {
        name: "setdown",
        icon: "arrow_downward",
        toolTip: {
          name: "Hạ thứ tự ưu tiên",
        },
        class: "ac-task",
        disabledCondition: (row: any) => {
          return row.ZOrder != row.ZOrderMax;
        }
      },
      {
        name: "setdowndisable",
        icon: "arrow_downward",
        disabledCondition: (row: any) => {
          return row.ZOrder == row.ZOrderMax;
        }
      },
      {
        name: "setdefault",
        icon: "check_circle_outline",
        toolTip: {
          name: "Đặt khu vực mặc định",
        },
        class: "ac-task",
        disabledCondition: (row: any) => {
          return row.ZOrder != 1;
        }
      },
      {
        name: "setdefaultdisable",
        icon: "check_circle_outline",
        disabledCondition: (row: any) => {
          return row.ZOrder == 1;
        }
      },
    ];
  }
  initTable() {
    this.tableConfig = {
      style: {
        'overflow-x': 'hidden'
      },
      columns: {
        isContextMenu: false,
        actionTitle: 'Thay đổi thứ tự ưu tiên',
        actions: this.initTableAction(),
        displayedColumns: [
          'index',
          'Code',
          'Type',
          'Name',
          'ZOrder',
          'actions'
        ],
        options: [
          {
            title: 'Point.ZoneName',
            name: 'Code',
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/zone/${data.Code}`;
            },
            style: {
              'min-width': '120px',
              'max-width': '120px'
            }
          },
          {
            title: 'Point.ZoneType',
            name: 'Type',
            render: (data: any) => {
              return this.translate.instant(`PointType.${data.Type}`);
            },
            style: {
              'min-width': '180px',
              'max-width': '180px'
            }
          },
          {
            title: 'Point.ZoneDescription',
            name: 'Name',
            style: {
              'min-width': '200px',
              'max-width': '250px'
            }
          },
          {
            title: 'Point.ZoneOrder',
            name: 'ZOrder',
            style: {
              'min-width': '100px',
              'max-width': '100px'
            }
          },
          {
            title: 'Point.IsDefault',
            name: 'IsDefault',
            style: {
              'min-width': '100px',
              'max-width': '100px'
            }
          }
        ]
      },
      remote: {
        url: this.service.getAPI('list'),
        params: {
          filter: JSON.stringify(this.filters),
          Type: 'PicklistZone'
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
  }

  initEvent() {
    this.zone['change'].subscribe({
      next: (value: any) => {
        this.filters['Code'] = value ? value['Code'] : ""
      }
    });
    this.appTable['actionEvent'].subscribe({
      next: (event: any) => {
        if (!event) {
          return;
        }
        const action = event["action"];
        switch (action) {
          case 'setup':
            this.changeZoneOrder(event["data"], 'up');
            break;
          case 'setdown':
            this.changeZoneOrder(event["data"], 'down');
            break;
          case 'setdefault':
            this.changeZoneOrder(event["data"], 'default');
            break;
        }
      }
    });
  }
  changeZoneOrder(data: any, type: string) {
    this.service.changeZoneOrder({Code: data.Code, Order: data.ZOrder, Type: type}).subscribe({
      next: (res: any) => {
        if (res.Status) {
          this.appTable['search'](this.filters);
          this.toast.success("Cập nhập dữ liệu thành công!", "success_title");
        }
        else
        {
          this.toast.error("Cập nhập dữ liệu thất bại. Vui lòng kiểm tra lại!", "error_title");
        }
      }
    });
  }
  search(event: any) {
    this.appTable['search'](this.filters);
  }
  SettingDefaultZone(event: any){
    this.service.settingZoneOrderDefaut(this.filters).subscribe({
      next: (res: any) => {
        if (res.Status) {
          this.appTable['search'](this.filters);
          this.toast.success("Cập nhập dữ liệu thành công!", "success_title");
        }
        else {
          this.toast.error("Dữ liệu không có thay đổi!", "error_title");
        }
      }
    });
  }
}
