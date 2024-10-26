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

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../../shared/toast.service';
import { Service } from '../../service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { DialogCreateTransferLost } from './confirm/component';
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
export class CreateTransferLostDetailComponent implements OnInit {
  @ViewChild('appTable', { static: false }) appTable: ElementRef;

  dataSourceGrid = {
    rows: <any>[],
    total: 0
  };
  code: string;
  data: any = {
    Code: '',
    Type: '',
    IssueType: '',
    WarehouseCode: '',
    WarehouseSiteId: '',
    ClientCode: '',
    SKU: '',
    Barcode: '',
    LocationLabel: '',
    LocationType: '',
    SubLocLabel: '',
    Qty: '',
    Uom: '',
    BaseQty: '',
    BaseUom: '',
    MappingQty: '',
    ProcessedQty: '',
    RemainingQty: '',
    ReceiveDate: '',
    ExpiredDate: '',
    BestBeforeDate: '',
    ManufactureDate: '',
    ConditionType: '',
    LostLocationLabel: '',
    LostLocationType: '',
    LostSubLocLabel: '',
    POCode: '',
    Note: '',
    RefEmployee: '',
    RefJobCode: '',
    RefJobType: '',
    Status: '',
    CanceledBy: '',
    CanceledDate: '',
    CanceledReason: '',
    CanceledNote: '',
    CompletedBy: '',
    CompletedDate: '',
    CreatedDate: '',
    MatchQty: 0,
    Details: []
  }
  tableConfig: any;
  filters: any = { 
    WarehouseCode: "",
    ClientCode: "",
    WarehouseSiteId: "",
    FromDate: "",
    ToDate: "",
    Content: "",
    Status: ""
  };
  allowCreate: boolean;
  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private toast: ToastService,
    private service: Service,
    public dialog: MatDialog,
    private router: Router) {
    this.code = this.route.snapshot.params.code;
  }

  ngOnInit() {
    this.allowCreate = false;
    this.filters['FromDate'] = moment().subtract(1, 'day').format('YYYY-MM-DD');
    this.filters['WarehouseCode'] = window.localStorage.getItem('_warehouse') ||  window.getRootPath().toUpperCase();
    this.initData();
    this.initTable();
  }
  ngAfterViewInit() {
    this.initEvent();
    this.loadData(this.code);
  }
  initData() {
    
  }
  loadData(code: string) {
    this.service.getLostDetailTransfer({
      Code: code
    })
      .subscribe((resp: any) => {  
        console.log(resp);
              
        if (resp.Status) {
          this.buildData(resp.Data || []);
        } else {
          this.toast.error(`Mã thất lạc ${this.code} không tìm thấy hoặc không phù hợp luân chuyển. Vui lòng kiểm tra lại`, 'error_title')
          setTimeout(() => {
            this.router.navigate([`/${window.getRootPath()}/lost-found/create-transfer-lost`]);
          }, 300);
        }
      });
  }
  buildData(data) {
    this.data = {
      Code: data.Code,
      Type: data.Type,
      IssueType: data.IssueType,
      WarehouseCode: data.WarehouseCode,
      WarehouseSiteId: data.WarehouseSiteId,
      ClientCode: data.ClientCode,
      SKU: data.SKU,
      Barcode: data.Barcode,
      LocationLabel: data.LocationLabel,
      LocationType: data.LocationType,
      SubLocLabel: data.SubLocLabel,
      Location: data.SubLocLabel ? `${data.LocationLabel} - ${data.SubLocLabel}`: data.LocationLabel,
      Qty: data.Qty,
      Uom: data.Uom,
      BaseQty: data.BaseQty,
      BaseUom: data.BaseUom,
      MappingQty: data.MappingQty,
      ProcessedQty: data.ProcessedQty,
      RemainingQty: data.RemainingQty,
      MatchQty:  data.RemainingQty,
      ReceiveDate: data.ReceiveDate,
      ExpiredDate: data.ExpiredDate,
      BestBeforeDate: data.BestBeforeDate,
      ManufactureDate: data.ManufactureDate,
      ConditionType: data.ConditionType,
      IssueLocationLabel: data.IssueLocationLabel,
      IssueLocationType: data.IssueLocationType,
      IssueSubLocLabel: data.IssueSubLocLabel,
      POCode: data.POCode,
      Note: data.Note,
      RefEmployee: data.RefEmployee,
      RefJobCode: data.RefJobCode,
      RefJobType: data.RefJobType,
      Status: data.Status,
      CanceledBy: data.CanceledBy,
      CanceledDate: data.CanceledDate,
      CanceledReason: data.CanceledReason,
      CanceledNote: data.CanceledNote,
      CompletedBy: data.CompletedBy,
      CompletedDate: data.CompletedDate,
      CreatedDate: data.CreatedDate,
      Details: data.Details
    }
    this.appTable['renderData'](this.data.Details || []);
    this.allowCreate = true;
  }

  initTable() {
    this.tableConfig = {
      columns: {
        isContextMenu: false,
        displayedColumns: [
          'index', 'SKU', 'SKUName', 'Barcode', 'Uom', 'ExpiredDate', 'ManufactureDate', 'LotNumber', 'Qty', 'MappingQty','ProcessedQty', 'RemainingQty'
        ],
        options: [
          {
            title: 'SKU',
            name: 'SKU',
            style: {
              'min-width': '80px',
              'max-width': '80px',
            }
          },
          {
            title: 'TransferLost.SKUName',
            name: 'SKUName'
          },
          {
            title: 'Barcode',
            name: 'Barcode'
          },
          {
            title: 'TransferLost.Uom',
            name: 'Uom'
          },
          {
            title: 'TransferLost.ExpiredDate',
            name: 'ExpiredDate'
          },
          {
            title: 'TransferLost.ManufactureDate',
            name: 'ManufactureDate'
          },
          {
            title: 'TransferLost.LotNumber',
            name: 'LotNumber'
          },

          {
            title: 'TransferLost.Qty',
            name: 'Qty',
            style: {
              'min-width': '70px',
              'max-width': '70px'
            },
          },
          {
            title: 'TransferLost.MappingQty',
            name: 'MappingQty',
            style: {
              'min-width': '70px',
              'max-width': '70px'
            },
          },
          {
            title: 'TransferLost.ProcessedQty',
            name: 'ProcessedQty',
            style: {
              'min-width': '70px',
              'max-width': '70px'
            },
          },
          {
            title: 'TransferLost.RemainingQty',
            name: 'RemainingQty',
            style: {
              'min-width': '70px',
              'max-width': '70px'
            },
          },
        ]
      },
      data: this.dataSourceGrid
    };

  }

  initTableAction(): TableAction[] {
    return [
      {
        name: "viewtransfer",
        icon: "launch",
        toolTip: {
          name: "Chuyển hàng mất vật lý",
        },
        class: "ac-task",
        disabledCondition: (row: any) => {
          return true;
        }
      }
    ];
  }
  initEvent() {
    this.appTable['actionEvent'].subscribe({
      next: (event: any) => {
        if (!event) {
          return;
        }
        
        const action = event["action"];
        switch (action) {
          case 'viewtransfer':
            break;
        }
      }
    });
    this.appTable['rowEvent'].subscribe({
      next: (event: any) => {
      }
    })
  }
  createTransferLost(event: any){
    if (this.data.Code) {
      if (!this.data.MatchQty || this.data.MatchQty <= 0 || this.data.MatchQty > this.data.RemainingQty) {
        this.toast.error(`Số lượng luân chuyển không phù hợp. Vui lòng kiểm tra lại`, 'error_title');
        return;
      }
      this.service.createTransferLost({
        Code: this.data.Code,
        MatchQty: this.data.MatchQty || 0
      })
        .subscribe((resp: any) => {  
          if (resp.Status) {
            this.toast.success(`Tạo thành công phiên luân chuyển hàng ${resp.Data ? resp.Data.Code || "" : ""}`, 'success_title');
            this.allowCreate = false;
            this.router.navigate([`/${window.getRootPath()}/lost-found/create-transfer-lost`]);
          } else {
            this.toast.error(resp.ErrorMessages.join('\n'), 'error_title')
          }
        });
    }
  }
  goToBack(event: any) {
    this.router.navigate([`/${window.getRootPath()}/lost-found/create-transfer-lost`]);
  }
}
