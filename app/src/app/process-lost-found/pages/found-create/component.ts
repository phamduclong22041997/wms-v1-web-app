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
import { ConfirmItemFoundComponent } from './confirm/component';
import { ShowListErrorFoundComponent } from '../found-create/showErrors/component';
import { NotificationComponent } from '../../../components/notification/notification.component';

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

export class CreateFoundComponent implements OnInit, AfterViewInit {
  @ViewChild('barcodeIssue', { static: false }) barcodeIssue: ElementRef;
  @ViewChild('qtyIssue', { static: false }) qtyIssue: ElementRef;

  @ViewChild('issueType', { static: false }) issueType: ElementRef;
  @ViewChild('client', { static: false }) client: ElementRef;
  @ViewChild('whBranch', { static: false }) whBranch: ElementRef;
  @ViewChild('bin', { static: false }) bin: ElementRef;
  @ViewChild('pallet', { static: false }) pallet: ElementRef;

  @ViewChild('locationcode', { static: false }) locationcode: ElementRef;
  @ViewChild('palletcode', { static: false }) palletcode: ElementRef;
  @ViewChild('createdDate', { static: false }) createdDate: ElementRef;
  @ViewChild('foundDate', { static: false }) foundDate: any;
  @ViewChild('note', { static: false }) note: ElementRef;
  @ViewChild('appTable', { static: false }) appTable: ElementRef;

  @ViewChild('code', { static: false }) inputScan: ElementRef;

  @ViewChild('inputFile', { static: false }) inputFile: ElementRef;
  @ViewChild('foundLocationLabel', { static: false }) foundLocationLabel: ElementRef;
  @ViewChild('foundSubLocationLabel', { static: false }) foundSubLocationLabel: ElementRef;
  
  inputPlaceholder: String;
  tableConfig: any;
  filters: Object;
  clientConfig: Object;
  foundTypeConfig: Object;
  whBranchConfig: Object;
  binConfig: Object;
  fileUpload: any;
  nameFileUpload: string;
  checkFileExcel: boolean;
  IsShowErrorButton: boolean;
  IsShowSaveButton: boolean;
  palletConfig: any;

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

  productIssue: any = {
    SKU: '',
    Barcode: '',
    ExpiredDate: '',
    ManufactureDate: '',
    Qty: 0
  }

  IsImport: boolean;

  constructor(
    private translate: TranslateService,
    private toast: ToastService,
    private service: Service,
    public dialog: MatDialog,
    private router: Router) { }

  ngOnInit() {
    this.inputPlaceholder = "Scan Barcode"
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
  }
  initData() {
    this.initTable();
    this.initCombo();
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
    this.foundTypeConfig = {
      selectedFirst: true,
      isSelectedAll: false,
      filters: {
        Collection: 'INV.Issues',
        Column: 'FoundType'
      },
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Description'];
      },
      type: 'autocomplete',
      filter_key: 'Description',
      URL_CODE: 'SFT.enum'
    };
    this.binConfig = {
      selectedFirst: false,
      isSelectedAll: false,
      filters: {},
      isFilter: true,
      disableAutoload: true,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Code'];
      },
      type: 'autocomplete',
      filter_key: 'Code',
      URL_CODE: 'SFT.foundBins'
    }
    this.palletConfig = {
      selectedFirst: true,
      isSelectedAll: false,
      filters: {},
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Code'];
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
          'ClientCode',
          'LocationLabel',
          'SubLocLabel',
          'IssueLocationLabel',
          'IssueSubLocLabel',
          'IssueType',
          'SKU',
          'SKUName',
          'Barcode',
          'UomName',
          "Qty",
          'BaseUomName',
          "LotNumber",
          "BaseQty",
          "ManufactureDate",
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
            title: 'LostFound.WarehouseCode',
            name: 'WarehouseCode',
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
            title: 'LostFound.LocationType',
            name: 'LocationType',
          },
          {
            title: 'LostFound.PalletCode',
            name: 'SubLocLabel',
          },
          {
            title: 'LostFound.FoundLocation',
            name: 'IssueLocationLabel',
          },
          {
            title: 'LostFound.IssueLocationType',
            name: 'IssueLocationType',
          },
          {
            title: 'LostFound.FoundSubLocLabel',
            name: 'IssueSubLocLabel',
          },
          {
            title: 'LostFound.FoundIssueType',
            name: 'IssueType',
            render: (row: any) => {
              return row.IssueType ?  this.translate.instant(`IssueType.${row.IssueType}`) : '';
            }
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
            title: 'LostFound.LotNumber',
            name: 'LotNumber'
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
    param['ClientCode'] = this.data.ClientCode;
    param['WarehouseSiteId'] = this.data.WarehouseSiteId;
    param['WarehouseCode'] = this.data.WarehouseCode;
    param['IssueLocationLabel'] = this.data.IssueLocationLabel || this.foundLocationLabel.nativeElement.value;
    param['Note'] = this.data.Note || this.note.nativeElement.value;
    param['IssueType'] = this.data.IssueType;
    param['LocationLabel'] = this.data.LocationLabel;
    param['LocationType'] = this.data.LocationType;
    param['SubLocLabel'] = this.data.SubLocLabel;
    
    this.addProductData(param);
  }
  addProductData(data: any) {
    this.service.scanBarcode(data)
      .subscribe((resp: any) => {
        if (resp.Status == false) {
          this.toast.error(resp.ErrorMessages.join("\n"), 'error_title');
        } else {
          let rowsku = this.checkBarcodeInDataGird({
            LocationLabel: resp.Data['LocationLabel'] || "",
            SubLocLabel: resp.Data['SubLocLabel'] || "",
            SKU: resp.Data['SKU'],
            Barcode: resp.Data['Barcode'],
            IssueType: resp.Data['IssueType'],
          });
          let dataresult = {
            SKU: resp.Data['SKU'],
            SKUName: resp.Data['SKUName'],
            Barcode: resp.Data['Barcode'],
            BaseBarcode: resp.Data['BaseBarcode'],
            Uom: resp.Data['Uom'],
            UomName: resp.Data['UomName'],
            Qty: resp.Data['Qty'],
            BaseQty: resp.Data['BaseQty'],
            BaseUom: resp.Data['BaseUom'],
            BaseUomName: resp.Data['BaseUomName'],
            Numerator: resp.Data['Numerator'],
            ExpiredDate: rowsku ? rowsku.ExpiredDate : null,
            ManufactureDate: rowsku ? rowsku.ManufactureDate : null,
            ExpirationType: resp.Data['ExpirationType'],
            storageType: resp.Data['StorageType'] || "",
            LotNumber: rowsku ? rowsku.LotNumber : "",
          };
          data = { ...dataresult, title: `Thông tin SL & HSD` };
          
          const dialogRef = this.dialog.open(ConfirmItemFoundComponent, {
            disableClose: true,
            data: data
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              result['LocationLabel'] = resp.Data['LocationLabel'] || "";
              result['SubLocLabel'] = resp.Data['SubLocLabel'] || "";
              result['LocationType'] =  resp.Data['LocationType'] || "";
              result['IssueLocationLabel'] = resp.Data['IssueLocationLabel'] || "";
              result['IssueSubLocLabel'] = resp.Data['IssueSubLocLabel'] || "";
              result['IssueLocationType'] =  resp.Data['IssueLocationType'] || "";
              result['IssueType'] =  resp.Data['IssueType'];
              result['Note'] =   resp.Data['Note'];
              result['ClientCode'] =   resp.Data['ClientCode'];
              result['WarehouseCode'] =   resp.Data['WarehouseCode'];
              result['WarehouseSiteId'] =  resp.Data['WarehouseSiteId'];
              this.__addDataGrid(result);
            }
          });
        }
      })
  }
  onChange(event: any) {

  }

  ngAfterViewInit() {
    this.initEvent();
    setTimeout(() => {
      this.resetProduct();
    }, 200);
  }

  reloadPallets(data: any) {
    if (this.pallet) {
      let _data = []
      for (let idx in data) {
        _data.push({
          Code: data[idx],
          Name: data[idx]
        })
      }
      this.pallet['clear'](false, true);
      this.pallet['setData'](_data);
    }
  }

  initEvent() {
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
        let val = data ? data.Code : "";
        if(this.data.WarehouseSiteId != val){
          this.data.WarehouseSiteId = val;
          if (this.bin) {
            this.bin['clear'](false, true);
            this.bin['reload']({ ClientCode: this.data['ClientCode'], WarehouseSiteId: this.data.WarehouseSiteId });
          }
        }
      }
    });
    this.bin['change'].subscribe({
      next: (data: any) => {
        this.data.LocationLabel = data ? data.Code : "";
        this.data.LocationType = data ? data.Type : "";
        this.data.SubLocLabel = data && data.SubLocations[0] ? data.SubLocations[0] : "";
        if (data) {
          this.reloadPallets(data.SubLocations);
        }
      }
    });
    this.pallet['change'].subscribe({
      next: (data: any) => {
        this.data.SubLocLabel = data ? data.Code : "";
      }
    });
    this.issueType['change'].subscribe({
      next: (data: any) => {
        this.data.IssueType = data ? data.Code : "";
      }
    });
    this.appTable['actionEvent'].subscribe({
      next: (event:any) => {
        this.deleteRowHanlde(event['index']);
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

  createIssue() {
    let rowData = this.appTable['getData']();
    let details = rowData.data ? rowData.data.filter(s => !s.IsError) : [];

    if (details.length == 0) {
      this.toast.error("LostFound.Error.Details", 'error_title');
      return false;
    }
    let listErrors = rowData.data.filter(s => s.IsError) || [];
    if (listErrors.length > 0) {
      const dialogRef = this.dialog.open(NotificationComponent, {
        data: {
          message: `Danh sách có ${listErrors.length} dòng lỗi, nếu vẫn tiếp tục lưu sẽ bỏ qua các dòng đó.`,
          type: 1
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.saveFoundIssue({ Details: details });
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
    this.service.saveDataFound(data)
      .subscribe((resp: any) => {
        if (resp.Status) {
          this.toast.success(`Tạo thành công tìm thấy hàng!`, 'success_title');
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
        details.data[index]['LotNumber'] = data.LotNumber || "";
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
      this.service.importFound(formData,this.data['WarehouseCode'])
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
    this.service.downloadTemplate(`ImportFound_${window.localStorage.getItem('_warehouse') || ''}20220808.xlsx`);
  }
  onClickExit(event: any){
    this.router.navigate([`/${window.getRootPath()}/lost-found/found-list`]);
  }
  onClickClearImport(event: any){
    this.resetGirdData();
  }
}
