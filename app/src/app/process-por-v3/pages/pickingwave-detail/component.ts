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
import { ToastService } from '../../../shared/toast.service';
import { Service } from '../../service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PrintService } from '../../../shared/printService';

@Component({
  selector: 'app-pickingwave-detail',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class PickingwaveDetailComponent implements OnInit, AfterViewInit {
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('fromDate', { static: false }) fromDate: any;
  @ViewChild('toDate', { static: false }) toDate: any;
  @ViewChild('status', { static: false }) statusCombo: ElementRef;
  @ViewChild('store', { static: false }) store: ElementRef;
  @ViewChild('content', { static: false }) contentInput: ElementRef;

  code: String;
  tableConfig: any;
  configDate: any;
  provinceConfig: any;
  service3PLConfig: any;
  statusConfig: any;
  storeConfig: any;
  allowCreatePickList: boolean;
  data: any = {
    Code: "",
    CreatedBy: '',
    CreatedDate: '',
    Status: '',
    UpdatedBy: '',
    UpdatedDate: '',
    SOList: [],
    TotalSO: 0,
    TotalPickQty: 0,
    TotalPickedQty: 0,
    Details: []
  };
  warehouseInfor: any;
  constructor(
    public dialog: MatDialog,
    private service: Service,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private printService: PrintService,
    private toast: ToastService) {
      this.code = this.route.snapshot.params.code;
    }

  ngOnInit() {
    this.initTable();
    this.warehouseInfor = JSON.parse(window.localStorage.getItem('_info'));

  }

  ngAfterViewInit() {
    this.initEvent();
    this.loadData()
  }

  initEvent() {

  }

  initTable() {
    this.tableConfig = {
      disablePagination: false,
      columns: {
        isContextMenu: false,
        displayedColumns: [
          'index',  'Code', 'SOCode', 'TotalPickQty', 'TotalPickedQty', 'Status', 
          'CreatedDate', 'CreatedBy', 'UpdatedDate', "UpdatedBy"
        ],
        options: [
          {
            title: 'Pickingwave.PLCode',
            name: 'Code',
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/por/auto-pickpack/${data.Code}`;
            },
            style: {
              'min-width': '150px',
              'max-width': '150px'
            }
          },
          {
            title: 'Pickingwave.SOCode',
            name: 'SOCode',
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/por/details/${data.SOCode}`;
            },
            style: {
              'min-width': '160px',
              'max-width': '160px'
            }
          },
          {
            title: 'Pickingwave.TotalPick',
            name: 'TotalPickQty',
            style: {
              'min-width': '90px',
              'max-width': '90px'
            }
          },
          {
            title: 'Pickingwave.TotalPicked',
            name: 'TotalPickedQty',
            style: {
              'min-width': '90px',
              'max-width': '90px'
            }
          },
          {
            title: 'Pickingwave.Status',
            name: 'Status',
            render: (data: any) => {
              return this.translate.instant(`PickListStatus.${data.Status}`);
            },
            style: {
              'min-width': '140px',
              'max-width': '140px'
            }
          },
          {
            title: 'Pickingwave.CreatedDate',
            name: 'CreatedDate',
            style: {
              'min-width': '140px',
              'max-width': '140px'
            }
          },
          {
            title: 'Pickingwave.CreatedBy',
            name: 'CreatedBy'
          },
          {
            title: 'Pickingwave.UpdatedDate',
            name: 'UpdatedDate',
            style: {
              'min-width': '140px',
              'max-width': '140px'
            }
          },
          {
            title: 'Pickingwave.UpdatedBy',
            name: 'UpdatedBy'
          }
        ]
      },
      data: {
        rows: this.data.Details || [],
        total: this.data.Details.length
      }
    };

  }

  loadData() {
    this.service.getPickwaveDetail({Code: this.code})
      .subscribe((resp: any) => {
        if (resp.Data) {
          console.log('resp.Data', resp.Data);
          let data = resp.Data;
          this.data = {
            Code: data.Code,
            CreatedBy: data.CreatedBy,
            CreatedDate: data.CreatedDate,
            Status: data.Status,
            UpdatedBy: data.UpdatedBy,
            UpdatedDate: data.UpdatedDate,
            SOList: data.SOList,
            TotalSO: data.SOList.length,
            TotalPickQty: data.Details.reduce((a, { TotalPickQty }) => a + TotalPickQty, 0),
            TotalPickedQty: data.Details.reduce((a, { TotalPickedQty }) => a + TotalPickedQty, 0),
            Details: data.Details
          }
          this.appTable['renderData'](this.data.Details);
        }
      });
  }

  exportExcel(data: any = {}) {
    return this.service.exportPickwaveDetail({Code: this.code});
  }

  printPickingList(data: any = {}) {
    const printer = window.localStorage.getItem("_printer");
    if (!printer) {
      this.toast.error(`Vui lòng chọn máy in`, 'error_title');
      return;
    }
    if (this.data && this.data.Details) {
      let codes = this.data.Details.map(x => x.Code);
      this.service.getPickingListPrint({ 
          Codes: codes.join(','),
          IsPrint: true,
          LogPrintRequest: true,
          RequestBy: this.warehouseInfor && this.warehouseInfor.DisplayName ? this.warehouseInfor.DisplayName :  "",
          PrintDocument: "printPickingList"
       })
        .subscribe((resp: any) => {
          if (resp.Data) {
            this.printMultilPickList(resp.Data, printer);
          }
        });
    }
  }
  async printMultilPickList(listData: any = [], printer: string ) {
    const dataPrint = this.printService.repairMultilPickList(listData, this.data.PickListCode);
    let printRS = null;
    if (printer == 'InTrucTiep') {
      printRS = await this.printService.sendToSmartPrintV1(dataPrint);
    } else {
      printRS = await this.printService.sendToSmartPrintV2(dataPrint, dataPrint.keygen, printer);
    }
    if (printRS) {
      this.toast.success(`In ${dataPrint.label} cho ${listData.length} danh sách lấy hàng thành công`, 'success_title');
    } else {
      this.toast.error(`In ${dataPrint.label} thất bại`, 'error_title');
    }
  }
  printPickingListEven(data: any = {}) {
    const printer = window.localStorage.getItem("_printer");
    if (!printer) {
      this.toast.error(`Vui lòng chọn máy in`, 'error_title');
      return;
    }
    if (this.data && this.data.Details) {
      let codes = this.data.Details.map(x => x.Code);
      this.service.getPickingListEvenPrint({ 
        Codes: codes.join(','),
        IsPrint: true,
        LogPrintRequest: true,
        RequestBy: this.warehouseInfor && this.warehouseInfor.DisplayName ? this.warehouseInfor.DisplayName : "",
        PrintDocument: "printPickingListEven"
    })
        .subscribe((resp: any) => {
          if (resp.Data) {
            const dataPrint = this.printService.repairMultiDataLabel50mm_100mm(resp.Data);
            if (printer == 'InTrucTiep') {
              this.printService.sendToSmartPrintV1(dataPrint);
            } else {
              this.printService.sendToSmartPrintV2(dataPrint, dataPrint.keygen, printer);
            }
            this.toast.success(`In label: thành công !`, 'success_title');

          }
        });
    }
  }
  exportPickingList(data: any = {}) {
    if (this.data && this.data.Details) {
      let codes = this.data.Details.map(x => x.Code);
      return this.service.exportPickingListPrint({ Codes: codes });
    }
  };
}
