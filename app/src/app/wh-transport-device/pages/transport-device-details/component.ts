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
  selector: 'app-transport-device-details',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class TransportDeviceDetailComponent implements OnInit, AfterViewInit{
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
      hoverContentText: "PTVC rỗng",
      columns: {
        isContextMenu: false,
        displayedColumns: [
          'index', 'SKU', 'SKUName', 'Barcode', 'Stock', 'PendingOutQty', 'Uom', 'ExpiredDate', 'LotNumber'],
        options: [
          {
            title: 'TransportDevice.SKU',
            name: 'SKU',
            style: {
              'min-width': '100px',
              'max-width': '100px'
            }
          },
          {
            title: 'TransportDevice.SKUName',
            name: 'SKUName',
            style: {
              'min-width': '200px',
              'max-width': '300px'
            }
          },
          {
            title: 'TransportDevice.Barcode',
            name: 'Barcode'
          },
          {
            title: 'TransportDevice.Stock',
            name: 'Stock'
          },
          {
            title: 'TransportDevice.PendingOutQty',
            name: 'PendingOutQty'
          },
          {
            title: 'TransportDevice.Uom',
            name: 'Uom'
          },
          {
            title: 'TransportDevice.ExpiredDate',
            name: 'ExpiredDate'
          },
          {
            title: 'LotNumber',
            name: 'LotNumber',
            render: (row: any) => {
              return row['LotNumber'] || "N/A"
            }
          }
        ]
      },
      data: this.dataSourceGrid
    };

  }

  goToBackList(event: any = null) {
    this.router.navigate([`/${window.getRootPath()}/transport-devices`]);
  }
}
