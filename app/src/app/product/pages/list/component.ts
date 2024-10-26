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
// import { ToastService } from '../../../shared/toast.service';
import { EditProductComponent } from '../../popup-edit/item.component';
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
export class ProductListComponent implements OnInit, AfterViewInit {
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('status', { static: false }) statusCombo: any;
  @ViewChild('client', { static: false }) client: any;
  @ViewChild('whBranchCombo', { static: false }) whBranchCombo: any;

  tableConfig: any;
  statusConfig: Object;
  filters: Object;
  warehouseBrachConfig: Object;
  clientConfig: Object;

  constructor(
    private translate: TranslateService,
    private service: Service,
    // private toast: ToastService,
    public dialog: MatDialog,
    private router: Router) { }


  ngOnInit() {
    this.initData();
    this.initCombo();
    this.initTable();
  }

  initData() {
    this.filters = {
      Status: '',
      Content: '',
      ClientCode: ''
    };

    if (window.localStorage.getItem("_warehouse"))
      this.filters['WarehouseCode'] = window.localStorage.getItem("_warehouse");
  }

  initCombo() {
    this.statusConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Name'];
      },
      type: 'autocomplete',
      filter_key: 'Name',
      data: [
        { Code: '', Name: 'Tất cả' },
        { Code: 'ACTIVED', Name: 'Đang hoạt động' },
        { Code: 'INACTIVED', Name: 'Ngưng hoạt động' },
      ]
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
      disableAutoload: true,
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
      showFirstLastButton: true,
      columns: {
        actionTitle: "action",
        isContextMenu: false,
        actions: this.initTableAction(),
        displayedColumns: [
          "index",
          "ClientCode",
          "DCSite",
          "SKU",
          "Name",
          "Origin",
          "SelfLife",
          "ExpirationType",
          "Uom",
          "Status",
          "InboundInterval",
          "OutboundInterval",
          "StockManagementType",
          "ProductType",
          "actions"
        ],
        options: [
          {
            title: "MasanProduct.SKU",
            name: "SKU",
            style: {
              "min-width": "75px",
              "max-width": "100px",
            }
          },
          {
            title: "DCSite",
            name: "DCSite",
            style: {
              "min-width": "100px",
              "max-width": "100px",
            }
          },
          {
            title: "MasanProduct.Name",
            name: "Name",
            isEllipsis: true,
            style: {
              "min-width": "300px",
              "max-width": "350px",
            }
          },
          {
            title: "MasanProduct.Origin",
            name: "Origin"
          },
          {
            title: "client",
            name: "ClientCode",
            style: {
              "min-width": "50px",
              "max-width": "50px",
            }
          },
          {
            title: "MasanProduct.VendorId",
            name: "VendorId"
          },
          {
            title: "MasanProduct.Shelflife",
            name: "SelfLife",
            style: {
              "min-width": "50px"
            }
          },
          {
            title: "MasanProduct.UOM",
            name: "Uom"
          },
          {
            title: "MasanProduct.Status",
            name: "Status",
            style: {
              "min-width": "50px",
              "max-width": "175px"
            },
            render: (data: any) => {
              return this.translate.instant(`MasanProduct.Status_${data.IsActived ? 'ACTIVED' : 'INACTIVE'}`);
            }
          },
          {
            title: "MasanProduct.ExpirationType",
            name: "ExpirationType",
            render: (data: any) => {
              return this.translate.instant(`MasanProduct.ExpiredType_${data.ExpirationType}`)
            }
          },
          {
            title: "MasanProduct.StockManagementType",
            name: "StockManagementType"
          },
          {
            title: "MasanProduct.InboundInterval",
            name: "InboundInterval"
          },
          {
            title: "MasanProduct.OutboundInterval",
            name: "OutboundInterval"
          },
          {
            title: "MasanProduct.ProductType",
            name: "ProductType"
          }
        ]
      },
      remote: {
        url: this.service.getAPI("list"),
      },
    };
  }

  reloadComboWHBranch(data: any) {
    if (this.whBranchCombo && data) {
      this.whBranchCombo['clear'](false, true);
      this.whBranchCombo['setData']([].concat(data));
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
    this.appTable['search'](this.filters);
  }

  ngAfterViewInit() {
    this.initEvent();
  }

  initEvent() {
    this.appTable['actionEvent'].subscribe({
      next: (event: any) => {
        if (!event) {
          return;
        }
        const action = event['action'];
        switch (action) {
          case 'mode_edit':
            this.showSKUinStore(event);
          case 'edit-sku':
            window.open(`/${window.getRootPath()}/product/${event.data['ClientCode']}/${event.data['WarehouseSiteId'] || "DC"}/${event.data['SKU']}`, '_blank')
            break;
        }
      }
    });
    this.statusCombo['change'].subscribe({
      next: (data: any) => {
        if (data) {
          this.filters['Status'] = data.Code;
        } else {
          this.filters['Status'] = '';
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
  showSKUinStore(data: any) {
    window.localStorage.setItem('CURRENT_MODULE', 'masan-product');
    this.router.navigate([`/app/masan-product/productinstore/${data.data.SKU}`]);
  }
  showPopupEdit(event: any) {
    const dialogRef = this.dialog.open(EditProductComponent, {
      hasBackdrop: true,
      panelClass: 'app-dialog',
      data: event
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.Status) {
        this.search(result)
      }
    });
  }

  exportExcel(data: any = {}) {
    if (this.filters["Content"]) {
      this.filters["Content"] = this.filters["Content"].trim();
    }
    return this.service.exportProducts(this.filters);
  }
}
