
/**
 * Copyright (c) 2019 OVTeam
 * Modified by: Duy Huynh, Huy Nghiem
 * Modified date: 2020/08
 */

import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { Service } from '../../service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../shared/toast.service';



interface TableAction {
  icon: string;
  toolTip?: any;
  actionName?: any;
  disabledCondition?: any;
}

@Component({
  selector: 'app-product-in-store',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class ProductInStoreComponent implements OnInit, AfterViewInit {
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('store', { static: false }) storeCombo: any;

  mainRoute: String = '/app/masan-product';
  tableConfig: any;
  filters: Object;
  Code: string;
  Content : string;
  storeConfig :Object;
  Store : string;
  constructor(
    private translate: TranslateService,
    private service: Service,
    private toast: ToastService,
    public dialog: MatDialog,
    private router: Router,
    private rout :ActivatedRoute) { }


  ngOnInit() {
    this.Code = this.rout.snapshot.params.code;
    this.initData();
  }

  initData() {
    this.storeConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      isSorting: true,
      filters: {}, // Remember fix here
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Name'];
      },
      type: 'autocomplete',
      filter_key: 'Name',
      URL_CODE: 'WFT.masanstores'
    };
    this.initTable();
    this.filters = {
      Store: '',
      Content: '',
    };
  }
  initTable() {
    this.tableConfig = {
      style: {
        'overflow-x': 'hidden'
      },
      columns: {
        actionTitle: 'action',
        isContextMenu: false,
        displayedColumns: [
          'index',
          'Code',
          'SupraCode',
          'Name',
          'BeginningBalance',
          'Qty'
        ],
        options: [
          {
            title: 'MasanProduct.StoreSupraCode',
            name: 'SupraCode',
            style: {
              'min-width': '100px'
            },
          },
          {
            title: 'MasanProduct.StoreCode',
            name: 'Code',
            style: {
              'min-width': '100px'
            },
          },
          {
            title: 'MasanProduct.Name',
            name: 'Name',
            style: {
              'min-width': '150px'
            },
          },
          {
            title: 'MasanProduct.BeginningBalance',
            name: 'BeginningBalance',
            style: {
              'min-width': '150px'
            },
          },
          {
            title: 'MasanProduct.Qty',
            name: 'Qty',
            style: {
              'min-width': '150px'
            },
          }
        ]
      },
      data: {
        rows: [],
        total: 0
      }
    };
  }

  cancel(event: any = null) {
    const redirectModule = window.localStorage.getItem('CURRENT_MODULE') || '';
    if (redirectModule) {
      localStorage.setItem('CURRENT_MODULE', '');
    }
      this.router.navigate([this.mainRoute, {}]);
  }

  search(event: any) {
    let _content = ''; 
    if(this.Content){
      _content = this.Content
    }
    this.service.getlistproductinventory(
      { Code: this.Code, Store: this.Store, Content : _content}
    ).subscribe((resp: any) => {
      if (resp.Data) {
        const data = resp.Data;
        const tableData = data && data.Rows ? data.Rows : [];
        this.appTable['renderData'](tableData);
      }
    });

    this.appTable['search'](this.filters);
  }

  ngAfterViewInit() {
    this.loadData();
    this.initEvent();
  }

  initEvent() {
    this.storeCombo['change'].subscribe({
      next: (data: any) => {
        if (data) {
          this.Store = data.Code;
        } else {
          this.Store = '';
        }
      }
    });
  }

  ApplyDetailData(data){
    const tableData = data && data.Rows ? data.Rows : [];
    this.appTable['renderData'](tableData);
  }
  loadData(code: string = this.Code) {
    if (code) {
      this.service.getlistproductinventory(
        { Code: code }
      ).subscribe((resp: any) => {
        if (resp.Data) {
          this.ApplyDetailData(resp.Data || {});
        }
      });
    }
  }
}
