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

// import { STATUS_BORDER_MASANSTORE } from '../../../shared/constant';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Service } from '../../service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../shared/toast.service';
import { NotificationComponent } from '../../../components/notification/notification.component';
// import * as moment from 'moment';
// import { Utils } from '../../../shared/utils';

interface TableAction {
  icon: string;
  class?: string;
  name?: String;
  toolTip?: any;
  actionName?: any;
  disabledCondition?: any;
}

@Component({
  selector: 'app-list-lost',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})

export class CreateLostComponent implements OnInit, AfterViewInit {
  tableConfig: any;
  filters: Object;
  clientConfig: Object;
  losttypeConfig: Object;
  whBranchConfig: Object;

  data: any = {
    LocationLabel: '',
    ClientCode: '',
    WarehouseCode: '',
    WarehouseSiteId: '',
    Note: '',
    IssueType: '',
    Details: []
  }
  ProductIssue: any = {
    SKU: '',
    Qty: ''
  }
  IsEnableSave: boolean;
  
  @ViewChild('lostLocationLabel', { static: false }) lostLocationLabel: ElementRef;
  @ViewChild('createdBy', { static: false }) createdBy: ElementRef;
  @ViewChild('SKU', { static: false }) SKU: ElementRef;
  @ViewChild('Qty', { static: false }) Qty: ElementRef;

  @ViewChild('client', { static: false }) client: ElementRef;
  @ViewChild('whBranch', { static: false }) whBranch: ElementRef;
  @ViewChild('issueType', { static: false }) issueType: ElementRef;
  @ViewChild('note', { static: false }) note: ElementRef;
  @ViewChild('appTable', { static: false }) appTable: ElementRef;

  constructor(
    private translate: TranslateService,
    private toast: ToastService,
    private service: Service,
    public dialog: MatDialog,
    private router: Router) { }

  ngOnInit() {
    this.data['WarehouseCode'] = window.localStorage.getItem('_warehouse') || window.getRootPath().toUpperCase();
    this.initData();
    this.IsEnableSave = false;
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
    this.losttypeConfig = {
      selectedFirst: true,
      isSelectedAll: false,
      filters: {
        Collection: 'INV.Issues',
        Column: 'LostType'
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
          'IssueLocationLabel',
          'IssueSubLocLabel',
          'IssueType',
          'SKU',
          'SKUName',
          'Barcode',
          'LotNumber',
          'Uom',
          "Qty",
          "ManufactureDate",
          "ExpiredDate",
          "Note",
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
            title: 'LostFound.LostLocation',
            name: 'IssueLocationLabel',
          },
          {
            title: 'LostFound.IssueLocationType',
            name: 'IssueLocationType',
          },
          {
            title: 'LostFound.PalletCode',
            name: 'IssueSubLocLabel',
          },
          {
            title: 'LostFound.LotNumber',
            name: 'LotNumber',
          },
          {
            title: 'LostFound.IssueType',
            name: 'IssueType',
            render: (row: any) => {
              return row && row.IssueType ?  this.translate.instant(`IssueType.${row.IssueType}`) : '';
            }
          },
          {
            title: 'SKU',
            name: 'SKU',
          },
          {
            title: 'LostFound.Grid.ProductName',
            name: 'SKUName',
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
            title: 'LostFound.Grid.LostQty',
            name: 'Qty'
          },
          {
            title: 'BaseBarcode',
            name: 'BaseBarcode',
          },
          {
            title: 'LostFound.Grid.Unit',
            name: 'BaseUom',
          },
          {
            title: 'LostFound.Grid.BaseQty',
            name: 'BaseQty'
          },
          {
            title: 'LostFound.Grid.RemainingQty',
            name: 'RemainingQty'
          },
          {
            title: 'LostFound.Grid.ConditionType',
            name: 'ConditionType'
          },
          {
            title: 'LostFound.Grid.ManufactureDate',
            name: 'ManufactureDate'
          },
          {
            title: 'LostFound.Grid.BestBeforeDate',
            name: 'BestBeforeDate'
          },
          {
            title: 'LostFound.Grid.ExpiredDate',
            name: 'ExpiredDate'
          },
          {
            title: 'LostFound.Note',
            name: 'Note'
          },
          {
            title: 'LostFound.MaxQty',
            name: 'MaxQty',
          }
        ]
      },
      data: {
        tota: 0,
        rows: []
      }
    };
  }
  onChange(event:any){
    let code = event.target['value'];
    let name = event.target['name'];
    this.data[name] = code;
  }
  ngAfterViewInit() {
    this.initEvent();

    setTimeout(() => {
      if (this.lostLocationLabel) this.lostLocationLabel.nativeElement.focus();
    }, 200);
  }

  validate() {
    if (!this.data.ClientCode) {
      this.toast.error("LostFound.Error.ClientCode", 'error_title');
      return false;
    }

    if (!this.data.WarehouseSiteId) {
      this.toast.error("LostFound.Error.WarehouseSiteId", 'error_title');
      return false;
    }

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
        this.data.WarehouseSiteId = data ? data.Code : "";
      }
    });

    this.issueType['change'].subscribe({
      next: (value: any) => {
        this.data['IssueType'] = value ? value.Code : '';
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
    let curentData = this.appTable['getData']()['data'];
    if (curentData.length <= 0)
    {
      this.IsEnableSave = false;
    }
  }
  createIssue(event:any){
    const dialogRef = this.dialog.open(NotificationComponent, {
      data: {
        message: `Bạn chắc chắn muốn tạo danh sách hàng thất lạc?`,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.execCreateIssue();
      }
    });
  }

  execCreateIssue(){
    let curentData = this.appTable['getData']()['data'];
    this.service.createLost({Details:curentData})
      .subscribe((resp: any) => {
        if(resp.Status) {
          this.toast.success(`Tạo danh sách hàng thất lạc thành công`, 'success_title');
          this.resetData();
          this.appTable['render']();
          setTimeout(() => {
            if (this.lostLocationLabel) this.lostLocationLabel.nativeElement.focus();
          }, 200);
        }
        else{
          if (resp.ErrorMessages && resp.ErrorMessages.length){
            this.toast.error(resp.ErrorMessages.join("\n"), 'error_title');
          }
          else {
            this.toast.error(`Tạo danh sách hàng thất lạc không thành công. Vui lòng kiểm tra lại`, 'error_title');
          }
        }
      })
  }

  clearIssue(event: any){
    console.log('event::clear Issue');
  }
  onProductChange(event:any){
    let code = event.target['value'];
    let name = event.target['name'];

    switch(name){
      case 'Qty':
        if(code < 0){
          code = code.replace('-','');
        }
        else if(code){
          code = code * 1;
        }
        if(code == 0 || code > 100000)
          event.target['value'] = '';
          this.ProductIssue[name] = code;
        break;
      default:
        this.ProductIssue[name] = code;
        break;
    }
  }
  onLocationChange(event: any){
    let code = event.target['value'];
    this.data['LocationLabel'] = code;
  }
  onNoteChange(event: any){
    let code = event.target['value'];
    this.data['Note'] = code;
  }
  resetData(){
    this.appTable['renderData']([]);
    this.resetProduct();
  }

  resetProduct(){
    if (this.SKU) {
      this.SKU.nativeElement.value = "";
    }
    if (this.Qty) {
      this.Qty.nativeElement.value = "";
    }
    this.ProductIssue = {
      SKU: '',
      Qty: ''
    }
  }

  addSKUIssue(){
    if (!this.data.LocationLabel) {
      this.toast.error("LostFound.Error.LocationLabel", 'error_title');
      return;
    }
    if (!this.ProductIssue.SKU) {
      this.toast.error("LostFound.Error.SKU", 'error_title');
      return;
    }
    if (!this.ProductIssue.Qty) {
      this.toast.error("LostFound.Error.Qty", 'error_title');
      return;
    }

    let data = {
      LocationLabel: this.data.LocationLabel.trim(),
      IssueType: this.data.IssueType,
      ClientCode: this.data.ClientCode,
      WarehouseCode: this.data.WarehouseCode,
      WarehouseSiteId: this.data.WarehouseSiteId,
      Note: this.data.Note.trim(),
      SKU: this.ProductIssue.SKU.trim(),
      Qty: this.ProductIssue.Qty ? this.ProductIssue.Qty * 1 : 0
    };
    this.__checkUpdateDataGrid(data);
  }
  addProductItems(data: any)
  {
    this.service.getSKULost(data)
      .subscribe((resp: any) => {
        if(resp.Status && resp.Data && resp.Data.length){
          this.__addDataGrid(resp.Data[0]);
        }
        else{
          this.toast.error(`${resp.ErrorMessages[0]}`, 'error_title');
        }
      });
  }
  __addDataGrid(data: any) {
    let details = this.appTable['getData']();
    let checkexists = null;
    for (let index in details.data) {
      if (    details.data[index].SKU == data.SKU 
          &&  details.data[index].Barcode == data.Barcode 
          &&  details.data[index].IssueType == data.IssueType
          &&  details.data[index].IssueLocationLabel == data.IssueLocationLabel
          &&  details.data[index].ExpiredDate == data.ExpiredDate
          &&  details.data[index].ManufactureDate == data.ManufactureDate
        ) {
        details.data[index]['BaseQty'] += parseInt(data.BaseQty);
        details.data[index]['Qty'] += parseInt(data.Qty);
        checkexists = true;
        this.IsEnableSave = true;
        break;
      }
    }
    
    if (!checkexists) {
      data.Error = [];
      this.appTable['addRow'](data);
      this.IsEnableSave = true;
    }
    this.clearSKUIssue();
  }
  __checkUpdateDataGrid(data: any) {
    let details = this.appTable['getData']();
    let checkexists = null;
    for (let index in details.data) {
      if (    details.data[index].SKU == data.SKU 
          &&  (   details.data[index].IssueLocationLabel == data.LocationLabel 
              ||  details.data[index].IssueSubLocLabel == data.LocationLabel
              )
          && details.data[index].IssueType == data.IssueType
          && details.data[index].WarehouseSiteId == data.WarehouseSiteId
        ) {
        if (data.Qty + details.data[index].Qty > details.data[index].MaxQty) {
          this.toast.error(`Số lượng vượt quá tồn kho trong hệ thống!`, 'error_title');
          return;
        }
        details.data[index]['BaseQty'] += parseInt(data.Qty);
        details.data[index]['Qty'] += parseInt(data.Qty);
        details.data[index]['RemainingQty'] += parseInt(data.Qty);
        checkexists = true;
        this.IsEnableSave = true;
        break;
      }
    }
    
    if (!checkexists) {
      this.addProductItems(data);
      return;
    }
    this.clearSKUIssue();
  }
  clearSKUIssue(){
    this.resetProduct();
    this.SKU.nativeElement.value = '';
    setTimeout(() => {
      if (this.SKU) this.SKU.nativeElement.focus();
    }, 200);
  }
  onClickExit(event: any){
    this.router.navigate([`/${window.getRootPath()}/lost-found/lost-list`]);
  }
  private renderValueCombo(option: any) {
    return option['Code'] ? `${option['Code']} - ${option['Name']}` : option['Name'];
  }
}
