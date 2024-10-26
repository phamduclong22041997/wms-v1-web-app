
/**
 * Copyright (c) 2019 OVTeam
 * Modified by: Duy Huynh, Huy Nghiem
 * Modified date: 2020/08
 */

import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Service } from '../../service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../shared/toast.service';


interface TableAction {
  icon: string;
  toolTip?: any;
  name: string,
  actionName?: any;
  disabledCondition?: any;
  class: string
}

@Component({
  selector: 'app-masan-store',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class BinInventoryComponent implements OnInit, AfterViewInit {
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('status', { static: false }) statusCombo: any;
  @ViewChild('client', { static: false }) client: any;
  @ViewChild('dcSite', { static: false }) dcSite: any;

  tableConfig: any;
  statusConfig: Object;
  filters: Object;
  clientConfig: Object;
  warehouseSiteConfig: Object;

  constructor(
    private translate: TranslateService,
    private service: Service,
    private toast: ToastService,
    public dialog: MatDialog,
    private router: Router) { }


  ngOnInit() {
    this.init();
  }

  init() {

    this.filters = {
      Content: '',
      ClientCode: '',
      WhCode: window.localStorage.getItem('_warehouse')
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
      isSelectedAll: true,
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
    this.initTable();
  }

  initTable() {
    this.tableConfig = {
      style: {
        "overflow-x": "hidden",
      },
      showFirstLastButton: true,
      columns: {
        actionTitle: "action",
        isContextMenu: false,
        displayedColumns: [
          "index",
          "ClientCode",
          "WarehouseSiteName",
          "SKU",
          "ProductName",
          "ConditionType",
          //"MHC5Desc",
          //"LocationType",
          "POCode",
          "ReceiveDate",
          "LocationLabel",
          "SubLocationLabel",
          "LotNumber",
          "LocationStorageType",
          "Qty",
          "PendingOutQty",
          "Uom",
          "ExpiredDate"
        ],
        options: [
          {
            title: "Report.ClientCode",
            name: "ClientCode",
            style: {
              "min-width": "50px",
              "max-width": "50px",
            }
          },
          {
            title: "DCSite",
            name: "WarehouseSiteName",
            style: {
              "min-width": "80px",
              "max-width": "90px",
            }
          },
          {
            title: "SKU",
            name: "SKU",
            style: {
              "min-width": "75px",
              "max-width": "75px",
            },
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/product/${data['ClientCode']}/${data['WarehouseSiteId']}/${data.SKU}`;
            }
          },
          {
            title: "Report.ProductName",
            name: "ProductName",
            //isEllipsis: true,
            style: {
              "min-width": "200px",
              "max-width": "300px"
            }
          },
          {
            title: "Report.ProductType",
            name: "ConditionType",
            render: (data: any) => {
              return this.translate.instant(`SOStatus.${data.ConditionType}`);
            },
            style: {
              "min-width": "50px",
              "max-width": "70px",
            }
          },
          // {
          //   title: "Report.ProductBrand",
          //   name: "MHC5Desc"
          // },
          {
            title: "Report.Location",
            name: "LocationLabel",
            style: {
              "min-width": "70px",
              "max-width": "70px",
            }
          },
          {
            title: "Report.TransportCode",
            name: "SubLocationLabel",
            style: {
              "min-width": "80px",
              "max-width": "100px",
            }
          },
          {
            title: "Report.LocationType",
            name: "LocationType",
            style: {
              "min-width": "50px",
              "max-width": "70px",
            }
          },
          {
            title: "Report.LotNumber",
            name: "LotNumber",
            style: {
              "min-width": "50px",
              "max-width": "50px",
            }
          },
          {
            title: "Report.LocationStorageType",
            name: "LocationStorageType",
            render: (data: any) => {
              return data.LocationStorageType ? this.translate.instant(`Report.${data.LocationStorageType}`) : '';
            },
            style: {
              "min-width": "70px",
              "max-width": "90px",
            }
          },
          {
            title: "Base Unit",
            name: "Uom",
            style: {
              "min-width": "50px",
              "max-width": "50px",
            }
          },
          {
            title: "Report.ExpiredDate",
            name: "ExpiredDate",
            style: {
              "min-width": "80px",
              "max-width": "80px",
            }
          },
          {
            title: "Report.BinInventory",
            name: "Qty",
            style: {
              "min-width": "50px",
              "max-width": "50px",
            }
          },
          {
            title: "BIN.PendingOutQty",
            name: "PendingOutQty",
            style: {
              "min-width": "60px",
              "max-width": "60px",
            }
          },
          {
            title: "BIN.POCode",
            name: "POCode",
            style: {
              "min-width": "130px",
              "max-width": "130px",
            }
          },
          {
            title: "BIN.ReceiveDate",
            name: "ReceiveDate",
            style: {
              "min-width": "80px",
              "max-width": "80px",
            }
          }
        ]
      },
      remote: {
        url: this.service.getAPI('getBinInventory'),
        params: this.filters
      }
    };
  }
  initData(){

  }
  search(event: any) {
    if (this.filters['Content']) {
      this.filters['Content'] = this.filters['Content'].trim();
    }
    this.appTable['search'](this.filters);
  }

  ngAfterViewInit() {
    this.initEvent();
    this.initData();
  }
  reloadWarehouseBranch(data: any) {
    if (this.dcSite) {
      let _data = []
      _data.push({
        Code: '',
        Name: 'Tất cả'
      });
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
  exportExcel(data: any = {}) {
    if (this.filters['Content']) {
      this.filters['Content'] = this.filters['Content'].trim();
    }
    return this.service.exportBinInventory(this.filters);
  }
}
