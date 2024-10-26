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

import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Service } from '../../service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-po-receive-pallet',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class BinDetailComponent implements OnInit, AfterViewInit{
  @ViewChild('appTable', { static: false }) appTable: ElementRef;

  tableConfig: any = {}
  code: string;
  data: any = {}

  dataSourceGrid = {
    rows: <any>[],
    total: 0
  };

  constructor(
    public dialog: MatDialog,
    private service: Service,
    private router: Router,
    private route: ActivatedRoute) {
    this.code = this.route.snapshot.params.code;
  }

  ngOnInit() {
    this.initTable();
    this.loadDetails();
  }

  ngAfterViewInit() {}

  resetPage() {
    if (!this.code) {
      window.location.reload();
    } else {
      this.router.navigate([`/${window.getRootPath()}/purchaseorder/receive-pallet`]);
    }
  }

  loadDetails() {
    this.service.getDetails(this.code)
      .subscribe((resp: any) => {
        let data = {};
        if (resp.Status) {
          data = resp.Data;
        }
        this.data = data;
        this.appTable['renderData'](data['Details'] || []);
      })
  }
  initTable() {
    this.tableConfig = {
      disablePagination: true,
      hoverContentText: "BIN lưu trữ rỗng",
      columns: {
        isContextMenu: false,
        displayedColumns: [
          'index', 'SKU', 'SKUName', 'Barcode', 'Availabel', 
          'Stock', 'PendingOutQty', 'Uom', 'ExpiredDate', 'SubLocationLabel', 'LotNumber'],
        options: [
          {
            title: 'client',
            name: 'ClientCode',
            style: {
              'min-width': '60px',
              'max-width': '90px'
            }
          },
          {
            title: 'BIN.SKU',
            name: 'SKU',
            style: {
              'min-width': '100px',
              'max-width': '100px'
            }
          },
          {
            title: 'BIN.SKUName',
            name: 'SKUName',
            style: {
              'min-width': '200px'
            }
          },
          {
            title: 'BIN.Barcode',
            name: 'Barcode',
            style: {
              'min-width': '150px',
              'max-width': '150px'
            }
          },
          {
            title: 'BIN.Stock',
            name: 'Stock'
          },
          {
            title: 'BIN.PendingOutQty',
            name: 'PendingOutQty'
          },
          {
            title: 'BIN.Availabel',
            name: 'Availabel'
          },
          {
            title: 'BIN.Uom',
            name: 'Uom'
          },
          {
            title: 'BIN.ExpiredDate',
            name: 'ExpiredDate',
            render: (row: any) => {
              return row['ExpiredDate'] != 'Invalid date' ? row['ExpiredDate']: "";
            },
            style:{
              'min-width': '60px',
              'max-width': '80px'
            }
          },
          {
            title: 'BIN.Pallet',
            name: 'SubLocationLabel'           
          },
          {
            title: 'LotNumber',
            name: 'LotNumber',
            render: (row: any) => {
              return row['LotNumber'] || "N/A"
            },
            style:{
              'padding-right':'5px'
            }
          }
        ]
      },
      data: this.dataSourceGrid
    };

  }

  goToBackList(event: any = null) {
    this.router.navigate([`/${window.getRootPath()}/bins`]);
  }
}
