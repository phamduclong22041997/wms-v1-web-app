import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../../shared/toast.service';
import { Service } from '../../service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
const _ = require('lodash')
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
export class ExportDelivery implements OnInit {
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('fromDate', { static: false }) fromDate: any;
  @ViewChild('toDate', { static: false }) toDate: any;
  dataSourceGrid = {
    rows: <any>[],
    total: 0
  };

  tableConfig: any;
  configDate: any;
  provinceConfig: any;
  service3PLConfig: any;
  soTypeConfig: any;
  allowCreatePickList: boolean;
  filters: any = {
    Content: ""
  }
  data: any[];
  enableDownload = false;

  constructor(
    public dialog: MatDialog,
    private service: Service,
    private router: Router,
    private translate: TranslateService,
    private toast: ToastService) { }

  ngOnInit() {
    this.initTable();
  }

  ngAfterViewInit() {
    this.initEvent();
  }
  search(event: any) {
    let _filters = this.filters;
    this.service.getDataSODelivery(_filters.Content).subscribe(result => {
      if (result.Status) {
        this.data = result.Data && result.Data.details && result.Data.details.length > 0 ? JSON.parse(JSON.stringify(result.Data.details)) : [];
        this.appTable['renderData'](this.data);
        this.enableDownload = this.data.length > 0 ? true : false;
      } else {
        this.enableDownload = false;
      }
    })
  }
  download(event: any) {
    const listSOCode = [];
    for (let order of this.data) {
      if (order.SOCode && order.SOCode.length > 0) listSOCode.push(order.SOCode)
    }
    this.enableDownload = false;
    if (listSOCode.length > 0) {
      return this.service.exportSODelivery(listSOCode);
    } else {
      return;
    }
  }

  initTable() {
    this.tableConfig = {
      disablePagination: false,
      columns: {
        isContextMenu: false,
        actionTitle: this.translate.instant('action'),
        actions: this.initTableAction(),
        displayedColumns: [
          'index', 'SOCode', 'ExternalCode', 'Status', 'TotalPackage', 'GatheredPoint', 'SiteId', 'FullAddress'],
        options: [
          {
            title: 'Export.SOCode',
            name: 'SOCode',
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/saleorder/details/${data.SOCode}`;
            },
            style: {
              'max-width': '200px',
            },
          },
          {
            title: 'Export.ExternalCode',
            name: 'ExternalCode',
            style: {
              'max-width': '200px',
            }
          },
          {
            title: 'Export.Status',
            name: 'Status',
            render: (row: any, options: any) => {
              return this.translate.instant(`SOStatus.${row.Status}`);
            },
            style: {
              'max-width': '200px',
            },
          },
          {
            title: 'Export.TotalPackage',
            name: 'TotalPackage',
            style: {
              'max-width': '150px',
            },
          },
          {
            title: 'Export.GatheredPoint',
            name: 'GatheredPoint',
            style: {
              'max-width': '150px',
            },
          },
          {
            title: 'Export.SiteId',
            name: 'SiteId',
            style: {
              'max-width': '250px',
            },
            render: (row: any, options: any) => {
              return row.SiteId + " - " + row.StoreName
            },
          },
          {
            title: 'Export.FullAddress',
            name: 'FullAddress',
            render: (row: any, options: any) => {
              return row.ShippingAddress ? row.ShippingAddress.FullAddress : "";
            },
          }
        ]
      },
      data: {
        rows: this.data || [],
      }
    };

  }

  initTableAction(): TableAction[] {
    return [
      {
        icon: "view_list",
        name: 'view',
        toolTip: {
          name: "Xem",
        },
        class: "ac-task",
        // disabledCondition: (row: any) => {
        //   return (row.Status === "New" || row.Status === "Processing" || row.Status === "Completed" || row.Status === "Canceled");
        // }
      }
    ];
  }

  initEvent() {
  }
}
