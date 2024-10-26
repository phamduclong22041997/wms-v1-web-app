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
import { MatDialog } from '@angular/material/dialog';
import { Service } from '../../service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../shared/toast.service';

import * as moment from 'moment';
import { NotificationComponent } from '../../../components/notification/notification.component';
import { ShowListErrorFoundComponent } from '../found-create/showErrors/component';
interface TableAction {
  icon: string;
  class?: string;
  name?: String;
  toolTip?: any;
  actionName?: any;
  disabledCondition?: any;
}
@Component({
  selector: 'app-list-po',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})

export class ImportProcessLostFoundComponent implements OnInit, AfterViewInit {
  @ViewChild('barcodeIssue', { static: false }) barcodeIssue: ElementRef;
  @ViewChild('qtyIssue', { static: false }) qtyIssue: ElementRef;

  @ViewChild('appTable', { static: false }) appTable: ElementRef;

  @ViewChild('code', { static: false }) inputScan: ElementRef;

  @ViewChild('inputFile', { static: false }) inputFile: ElementRef;

  @ViewChild('client', { static: false }) client: ElementRef;
  @ViewChild('whBranch', { static: false }) whBranch: ElementRef;
  tableConfig: any;
  filters: Object;
  clientConfig: Object;
  whBranchConfig: Object;
  fileUpload: any;
  nameFileUpload: string;
  checkFileExcel: boolean;
  IsShowErrorButton: boolean;
  IsShowSaveButton: boolean;

  data: any = {
    ClientCode: '',
    WarehouseSiteId: '',
    LocationLabel: '',
    LocationType: '',
    SubLocLabel: '',
    IssueLocationLabel: '',
    IssueSubLocLabel: '',
    Note: '',
    WarehouseCode: window.localStorage.getItem('_warehouse') || '',
    Details: []
  }

  IsImport: boolean;

  constructor(
    private translate: TranslateService,
    private toast: ToastService,
    private service: Service,
    public dialog: MatDialog,
    private router: Router) { }

  ngOnInit() {
    this.data = {
      ClientCode: '',
      WarehouseSiteId: '',
      LocationLabel: '',
      LocationType: '',
      SubLocLabel: '',
      IssueLocationLabel: '',
      IssueSubLocLabel: '',
      Note: '',
      WarehouseCode: window.localStorage.getItem('_warehouse') || '',
      Details: []
    };
    this.IsShowErrorButton = false;
    this.IsShowSaveButton = false;
    this.IsImport = false;
    this.initData();
    this.nameFileUpload ='Chọn File Upload';
  }
  initData() {
    this.initTable();
    this.initCombo();
  }
  initCombo() {
    this.clientConfig = {
      selectedFirst: true,
      isSelectedAll: false,
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
    this.whBranchConfig = {
      selectedFirst: true,
      isSelectedAll: false,
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
  }
  initTableAction(): TableAction[] {
    return [
      {
        icon: "remove_circle",
        name: 'remove-sku',
        toolTip: {
          name: "Xoá",
        },
        class: "ac-remove",
        disabledCondition: (row:any) => {
          return true;
        }
      }
    ];
  }
  
  initTable() {
    this.tableConfig = {
      style: {
        'overflow-x': 'hidden'
      },
      enableFirstLoad: false,
      columns: {
        actions: this.initTableAction(),
        isContextMenu: false,
        actionTitle: this.translate.instant('action'),
        displayedColumns: [
          'index',
          'LostCode',
          'LocationLabel',
          'SubLocLabel',
          'SKU',
          'SKUName',
          'Barcode',
          'BaseUomName',
          'LostQty',
          "BaseQty",
          // "ManufactureDate",
          "ExpiredDate",
          "Message",
          "actions"
        ],
        options: [
          {
            title: 'client',
            name: 'ClientCode',
          },
          {
            title: 'LostFound.LostCode',
            name: 'LostCode',
          },
          {
            title: 'LostFound.WarehouseSiteId',
            name: 'WarehouseSiteId',
          },
          {
            title: 'LostFound.LocationLabel',
            name: 'LocationLabel',
          },
          {
            title: 'LostFound.SubLocationLabel',
            name: 'SubLocLabel',
          },
          {
            title: 'SKU',
            name: 'SKU',
          },
          {
            title: 'LostFound.Grid.ProductName',
            name: 'SKUName',
            style: {
              'min-width': '200px',
              'max-width': '200px'
            }
          },
          {
            title: 'Barcode',
            name: 'Barcode',
          },
          {
            title: 'LostFound.Grid.Unit',
            name: 'Uom',
          },
          {
            title: 'LostFound.Grid.Unit',
            name: 'UomName',
          },
          {
            title: 'LostFound.Grid.LostQty',
            name: 'LostQty'
          },
          {
            title: 'LostFound.Grid.FoundQty',
            name: 'Qty'
          },
          {
            title: 'LostFound.Grid.BaseUnit',
            name: 'BaseUom',
          },
          {
            title: 'LostFound.Grid.BaseUnit',
            name: 'BaseUomName',
          },
          {
            title: 'LostFound.Grid.FoundBaseQty',
            name: 'BaseQty'
          },
          {
            title: 'LostFound.Grid.ManufactureDate',
            name: 'ManufactureDate'
          },
          {
            title: 'LostFound.Grid.ExpiredDate',
            name: 'ExpiredDate'
          },
          {
            title: 'LostFound.Grid.Message',
            name: 'Message',
            // link: true,
            // newpage: true,
            onClick: (data: any) => {
              this.OnShowListErrorMessages(data.Error);
            },
            borderStyle: (row: any) => {
              if (row.Error && row.Error.length > 0) {
                return {
                  color: '#f05858',
                  border: `2px solid #f05858`,
                  "border-radius": "2px",
                  padding: "5px 10px",
                  "font-weight": "500",
                }
              }
              return ""
            }
          }
        ]
      },
      data: {
        tota: 0,
        rows: []
      }
    };
  }
  OnShowListErrorMessages(data, title = null) {
    const dialogRef = this.dialog.open(ShowListErrorFoundComponent, {
      disableClose: true,
      data: {
        title: title || this.translate.instant('LostFound.ListErrors'),
        ListErrrors: data,
        type: 1
      }
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }
  onEnter(event: any) {
    let code = event.target['value'].trim();
    let CaseQty = code.split('|');
    let param = {
      Code: CaseQty ? CaseQty[0] : code,
      Qty: CaseQty[1] ? CaseQty[1] : 1
    };
  }
  onChange(event: any) {

  }

  ngAfterViewInit() {
    this.initEvent();
    setTimeout(() => {
      this.resetProduct();
    }, 200);
  }

  reloadWarehouseBranch(data: any) {
    if (this.whBranch) {
      let _data = []
      for (let idx in data.Branch) {
        let site = data.Branch[idx];
        if (site.WarehouseCode === this.data['WarehouseCode']) {
          _data.push({
            Code: site.Code,
            Name: site.Name,
          })
        }
      }
      this.whBranch['clear'](false, true);
      this.whBranch['setData'](_data);
      if (_data.length > 0) {
        this.data['WarehouseSiteId'] = _data[0].Code;
        this.whBranch['setValue'](_data[0].Code);
      }
    }
  }
  initEvent() {
    this.appTable['actionEvent'].subscribe({
      next: (event:any) => {
        this.deleteRowHanlde(event['index']);
      }
    });
    this.client['change'].subscribe({
      next: (data: any) => {
        this.data.ClientCode = data ? data.Code : "";
        if(this.whBranch) {
          this.reloadWarehouseBranch(data);
        }
      }
    });
    this.whBranch['change'].subscribe({
      next: (data: any) => {
        this.data.WarehouseSiteId = data ? data.Code : "";
      }
    });
  }
  deleteRowHanlde(data: any){
    this.appTable['removeRow'](data);
}

  validate() {
    if (!this.data.LocationCode) {
      this.toast.error("LostFound.Error.LocationCode", 'error_title');
      return false;
    }

    if (this.data.Details.length == 0) {
      this.toast.error("LostFound.Error.Details", 'error_title');
      return false;
    }
    return true;
  }

  saveIssue() {
    let rowData = this.appTable['getData']();
    let details = rowData.data || [];

    if (details.length == 0) {
      this.toast.error("LostFound.Error.Details", 'error_title');
      return false;
    }
    let listErrors = rowData.data.filter(s => s.IsError) || [];
    if (listErrors.length > 0) {
      const dialogRef = this.dialog.open(NotificationComponent, {
        data: {
          message: `Danh sách có ${listErrors.length} dòng lỗi. Bạn vẫn muốn tiếp tục trước khi kiểm tra lỗi?`,
          type: 1
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.saveFoundIssue({ WarehouseCode: window.localStorage.getItem('_warehouse') || '',Details: details });
        }
      });
    }
    else {
      const dialogRef = this.dialog.open(NotificationComponent, {
        data: {
          message: `Bạn có chắc chắn muốn lưu?`,
          type: 1
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.saveFoundIssue({WarehouseCode: window.localStorage.getItem('_warehouse') || '', Details: details });
        }
      });
    }
  }
  saveFoundIssue(data: any) {
    this.service.saveDataIssue(data)
      .subscribe((resp: any) => {
        if (resp.Status) {
          this.toast.success(`Đã xử lý dữ liệu thành công!`, 'success_title');
          this.resetGirdData();
        } else {
          this.toast.error(resp.ErrorMessages.join("\n"), 'error_title');
        }
      })
  }
  checkBarcodeInDataGird(data: any) {
    let details = this.appTable['getData']();
    let row = details.data.find(s => s.SKU == data.SKU && s.Barcode == data.Barcode && s.IssueType == data.IssueType && s.LocationLabel == data.LocationLabel && s.SubLocLabel == data.SubLocLabel);
    return row;
  }
  __addDataGrid(data: any) {
    let details = this.appTable['getData']();
    let checkexists = null;
    for (let index in details.data) {
      if (    details.data[index].SKU == data.SKU 
          &&  details.data[index].Barcode == data.Barcode 
          &&  details.data[index].IssueType == data.IssueType
          &&  details.data[index].LocationLabel == data.LocationLabel
          &&  details.data[index].SubLocLabel == data.SubLocLabel
          &&  details.data[index].ExpiredDate == data.ExpiredDate
          &&  details.data[index].ManufactureDate == data.ManufactureDate
        ) {
        details.data[index]['BaseQty'] += data.BaseQty;
        details.data[index]['Qty'] += data.Qty;
        checkexists = true;
        break;
      }
    }
    
    if (!checkexists) {
      data.Error = [];
      this.appTable['addRow'](data);
      this.IsShowSaveButton = true;
    }
    if (this.inputScan) {
      this.inputScan.nativeElement.value = "";
    }
  }
  ReviewErrors() {
    let details = this.appTable['getData']();
    let errors = [];
    details.data.filter(s => s.IsError).forEach(item => {
      errors = errors.concat(item.Error);
    });
    if (errors.length > 0) {
      this.OnShowListErrorMessages(errors, `Danh sách lỗi`);
    }
  }
  clearIssue(event: any) {
    console.log('event::clear Issue');
  }

  resetProduct() {
  }
  onClickImportFound() {
    this.IsImport = true;
    this.resetGirdData();
  }
  onClickCreateFound() {
    this.IsImport = false;
    this.resetGirdData();
  }
  checkUploadFile(files: any) {
    this.checkFileExcel = false;
    this.nameFileUpload = files[0].name ? files[0].name : '';
    let ext = this.nameFileUpload.split('.').pop();
    if (!this.validateParam()) return;

    if (ext == 'xlsx' || ext == 'xls') {
      let formData = new FormData();
      formData.append('file', files[0]);
      this.fileUpload = files[0];
      this.checkFileExcel = true;
      this.service.importLostFound(formData,this.data['WarehouseCode'], this.data['ClientCode'], this.data['WarehouseSiteId'])
        .subscribe((resp: any) => {
          if (resp.Data) {
            this.appTable['renderData'](resp.Data['Data']);
            this.IsShowErrorButton = resp.Data['Data'].filter(s => s.IsError).length > 0;
            this.IsShowSaveButton = resp.Data['Data'].filter(s => !s.IsError).length > 0;
          } else {
            if (resp.ErrorMessages && resp.ErrorMessages.length) {
              this.toast.error(resp.ErrorMessages.join("\n"), 'error_title');
            }
            this.resetUploadForm();
          }
        });
    } else {
      this.checkFileExcel = false;
      this.toast.error('LostFound.ErrorFileExcel', 'error_title');
      this.resetUploadForm();
      this.appTable['renderData']([]);
      this.IsShowSaveButton = false;
    }
  }
  private validateParam() {
    return true;
  }
  resetUploadForm() {
    this.nameFileUpload = 'Chọn File Upload';
    this.fileUpload = null;
    if (this.inputFile && this.inputFile.nativeElement) {
      this.inputFile.nativeElement.value = null;
    }
    this.checkFileExcel = false;
  }
  resetGirdData() {
    this.appTable['renderData']([]);
    this.resetUploadForm();
    this.IsShowErrorButton = false;
    this.IsShowSaveButton = false;
  }
  downloadTemplate(event: any){
    this.service.downloadTemplate(`ImportFound_Auto.xlsx`);
  }
  onClickExit(event: any){
    this.router.navigate([`/${window.getRootPath()}/lost-found/found-list`]);
  }
  onClickClearImport(event: any){
    this.resetGirdData();
  }
}
