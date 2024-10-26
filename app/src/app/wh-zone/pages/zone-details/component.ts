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
import { ToastService } from '../../../shared/toast.service';
import { PrintService } from '../../../shared/printService';

@Component({
  selector: 'app-zone-detail',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class ZoneDetailComponent implements OnInit, AfterViewInit {
  @ViewChild('appTable', { static: false }) appTable: ElementRef;

  tableConfig: any;
  code: string;
  type: string;
  data: any = {}

  dataSourceGrid = {
    rows: <any>[],
    total: 0
  };
  dataChecked: [];
  enablePrint: boolean = false;

  constructor(
    public dialog: MatDialog,
    private service: Service,
    private router: Router,
    private toast: ToastService,
    private printService: PrintService,
    private route: ActivatedRoute) {
    this.code = this.route.snapshot.params.code;
  }

  ngOnInit() {
    this.initTable();
    this.loadDetails();
  }

  ngAfterViewInit() { 

  }

  loadDetails() {
    this.service.getDetails(this.code)
      .subscribe((resp: any) => {
        if (resp.Status && resp.Data && resp.Data.length) {
          this.data = resp.Data[0];
        }
        
        setTimeout(() => {
          if (this.appTable) {
            this.appTable['renderData'](this.data['Details'] || []);
          }
        }, 500);
      })
  }
  initTable() {
    let columns = {
        isContextMenu: false,
        displayedColumns: [
          'index', 'WarehouseSiteId', 'Code','LocationType', 'Status', 'Type', 'LW', 'MaxSKUPerSlot', 'MaxSlot'],
        options: [
          {
            title: 'Point.Status',
            name: 'Status',
            style: {
              'min-width': '150px',
              'max-width': '150px'
            }
          },
          {
            title: 'Report.Location',
            name: 'Code',
            style: {
              'min-width': '120px',
              'max-width': '120px'
            }
          },
          {
            title: 'Report.LocationStorageType',
            name: 'Type',
            style: {
              'min-width': '200px'
            }
          },
          {
            title: 'DCSite',
            name: 'WarehouseSiteId',
            style: {
              'min-width': '90px',
              'max-width': '90px'
            }
          },
          {
            title: 'Report.LocationType',
            name: 'LocationType',
            style: {
              'min-width': '90px',
              'max-width': '90px'
            }
          },
          {
            title: 'Point.MaxSKUPerSlot',
            name: 'MaxSKUPerSlot'
          },
          {
            title: 'Point.MaxSlot',
            name: 'MaxSlot'
          },
          {
            title: 'Point.LW',
            name: 'LW',
            render: (data: any) => {
              return `${data.Length} x ${data.Width}`;
            },
            style: {
              'min-width': '90px',
              'max-width': '90px'
            }
          }
        ]
      }
  
    this.tableConfig = {
      style: {
        'overflow-x': 'hidden'
      },
      // disablePagination: true,
      hoverContentText: "Khu vực lưu trữ rỗng",
      columns: columns,
      data: this.dataSourceGrid
    };

  }
  exportDetail(event: any) {
    return this.service.exportDetail({
      Code: this.data.Code
    });
  }
}
