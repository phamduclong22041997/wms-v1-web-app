
/**
 * Copyright (c) 2019 OVTeam
 * Modified by: Duy Huynh, Huy Nghiem
 * Modified date: 2020/08
 */

import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { STATUS_BORDER_MASANSTORE } from '../../../shared/constant';
import { MatDialog } from '@angular/material/dialog';
import { Service } from '../../service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../shared/toast.service';
import { EditProductComponent } from '../../popup-edit/item.component';


interface TableAction {
  icon: string;
  toolTip?: any;
  actionName?: any;
  disabledCondition?: any;
}

@Component({
  selector: 'app-masan-store',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class MasanProductListComponent implements OnInit, AfterViewInit {
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('status', { static: false }) statusCombo: any;

  tableConfig: any;
  statusConfig: Object;
  filters: Object;

  constructor(
    private translate: TranslateService,
    private service: Service,
    private toast: ToastService,
    public dialog: MatDialog,
    private router: Router) { }


  ngOnInit() {
    this.initData();
  }

  initData() {
    this.initTable();
    this.filters = {
      Status: '',
      Content: ''
    };
    this.statusConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      filters: { module: 'MASANSTORE' },
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
        { Code: 'ACTIVE', Name: 'Ngưng hoạt động' },
        { Code: 'INACTIVED', Name: 'Đang hoạt động' },
      ]
    };
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
          "SKU",
          "Name",
          "UnitsPerCase",
          "Shelflife",
          "UOM",
          "Status",
          "actions",
        ],
        options: [
          {
            title: "MasanProduct.SKU",
            name: "SKU",
            style: {
              "min-width": "75px",
              "max-width": "100px",
            },
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
            title: "MasanProduct.UnitsPerCase",
            name: "UnitsPerCase",
            style: {
              "min-width": "50px",
            },
          },
          {
            title: "MasanProduct.Shelflife",
            name: "Shelflife",
            style: {
              "min-width": "50px",
            },
          },
          {
            title: "MasanProduct.UOM",
            name: "UOM",
            style: {
              "min-width": "50px",
            },
          },
          {
            title: "MasanProduct.Status",
            name: "Status",
            style: {
              "min-width": "50px",
              "max-width": "175px",
            },
            borderStyle: (data: any) => {
              return this.borderColorByStatus(data.Status);
            },
            render: (data: any) => {
              return this.translate.instant(
                `MasanProduct.Status_${data.Status}`
              );
            }
          },
        ],
      },
      remote: {
        url: this.service.getAPI("list"),
      },
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

  initTableAction(): TableAction[] {
    return [{
      icon: 'edit',
      toolTip: {
        name: 'Edit',
      },
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
          case 'storefront':
            this.showSKUinStore(event);
          case 'edit':
            this.showPopupEdit(event['data']);
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
  }
  showSKUinStore(data) {
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

}
