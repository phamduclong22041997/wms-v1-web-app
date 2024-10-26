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
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmCreatePicklistComponent } from './confirm/component';
import { TableAction } from '../../../interfaces/tableAction';

@Component({
  selector: 'app-so-auto-pickpack',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class SOAutoPickPackComponent implements OnInit {
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('province', { static: false }) province: ElementRef;
  @ViewChild('district', { static: false }) district: ElementRef;
  @ViewChild('client', { static: false }) client: ElementRef;
  @ViewChild('whBranchCombo', { static: false }) whBranchCombo: any;
  // @ViewChild('store', { static: false }) store: ElementRef;
  @ViewChild('vendor', { static: false }) vendor: ElementRef;
  @ViewChild('promotion', { static: false }) promotion: ElementRef;
  @ViewChild('content', { static: false }) contentInput: ElementRef;
  @ViewChild('productType', { static: false }) productType: ElementRef;
  @ViewChild('soType', { static: false }) soType: ElementRef;

  isOnlyDC: boolean;

  dataSourceGrid = {
    rows: <any>[],
    total: 0
  };

  tableConfig: any;
  clientConfig: any;
  warehouseBrachConfig: any;
  storeConfig: any;
  vendorConfig: any;
  configDate: any;
  provinceConfig: any;
  districtConfig: any;
  promotionConfig: any;
  soTypeConfig: any;
  productTypeConfig: any;
  IsExportError: boolean;
  ListDataError: [{}];
  ZoneCode = "";
  allowCreatePickList: boolean;
  numOfSO: number;
  filters: any = {
    ClientCode: "",
    WarehouseCode: "",
    Province: "",
    District: "",
    Type: "",
    ConditionType: "",
    Vendor: "",
    Content: "",
    IsCreatePickList: 1
  }

  constructor(
    public dialog: MatDialog,
    private service: Service,
    private router: Router,
    private toast: ToastService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.isOnlyDC = window.loadSettings("EnableDCSite") === true;
    this.ZoneCode = "";
    this.IsExportError = false;
    this.ListDataError = [{}];
    this.allowCreatePickList = false;
    this.numOfSO = 0;
    this.filters['WarehouseCode'] = window.localStorage.getItem('_warehouse') ||  window.getRootPath().toUpperCase();

    this.initTable();
    this.initCombo();
  }

  ngAfterViewInit() {
    this.initEvent();
    if (this.contentInput) {
      setTimeout(() => {
        this.contentInput.nativeElement.focus();
      }, 500)
    }
  }

  showConfirm(data: any) {
    const dialogRef = this.dialog.open(ConfirmCreatePicklistComponent, {
      disableClose: true,
      data: {
        ClientCode: this.filters['ClientCode']
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
          this.createPickList(result)//.ZoneCode);
      }
    });
  }

  createPickList(info: any) {
    this.ZoneCode = info.ZoneCode;
    this.IsExportError = false;
    let data = this.appTable['getData']()['data'];
    if (!data.length) {
      return;
    }
    let saveData = {
      SOList: []
    }
    for (let idx in data) {
      if (data[idx].selected) {
        saveData.SOList.push(data[idx].SOCode);
      }
    }

    if (info.ZoneCode) {
      saveData['ZoneCode'] = info.ZoneCode;
    }

    if (info.PickupMethod) {
      saveData['PickupMethod'] = info.PickupMethod;
    }

    if (info.LotNumber) {
      saveData['LotNumbers'] = info.LotNumber;
    }
    
    if (!this.allowCreatePickList) return;
    this.service.createPickList(saveData)
      .subscribe((resp) => {
        if (resp.Status) {
          this.toast.success("AutoPickPackPOR.CreatePickListSuccessful", "success_title");
          setTimeout(() => {
            this.goPickList();
          }, 500)
        } else {
          this.IsExportError = true;
          this.allowCreatePickList = false;
          if (resp.ErrorMessages && resp.ErrorMessages.length) {
            this.toast.error(`${resp.ErrorMessages[0]}`, 'error_title');
          }
        }
      })
  }

  onEnter() {
    this.search(null); 
  }
  search(event: any) {
    this.IsExportError = false;
    this.service.loadSOList(this.filters)
      .subscribe((resp: any) => {
        this.makeData(resp);
      })
  }

  initCombo() {
    this.clientConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      isSorting: false,
      isSelectedAllValueIsEmpty: true,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return this.renderValueCombo(option);
      },
      type: 'autocomplete',
      filter_key: 'Name',
      URL_CODE: 'SFT.clientcombo'
    };
    this.warehouseBrachConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      isSorting: false,
      isFilter: true,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return this.renderValueCombo(option);
      },
      type: 'combo',
      filter_key: 'Name',
      filters: {
        data: this.filters['WarehouseCode']
      },
      URL_CODE: 'SFT.branchscombo'
    }
    this.soTypeConfig = {
      selectedFirst: true,
      isSelectedAll: false,
      isSorting: false,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return this.translate.instant(`AutoPickPackPOR.SOTypes.${option['Name']}`);
      },
      filters: {
        WarehouseCode: this.filters['WarehouseCode'],
      },
      type: 'autocomplete',
      filter_key: 'Name',
      URL_CODE: 'SFT.sotypecombo'
    };
    this.productTypeConfig = {
      selectedFirst: true,
      isSelectedAll: false,
      isSorting: false,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return this.translate.instant(`AutoPickPackPOR.ProductType.${option['Name']}`);
      },
      filters: {
        WarehouseCode: this.filters['WarehouseCode'],
      },
      type: 'autocomplete',
      filter_key: 'Name',
      URL_CODE: 'SFT.producttypecombo'
    };
    this.vendorConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      isSorting: false,
      isSelectedAllValueIsEmpty: true,
      val: (option: any) => {
        return option['VendorId'];
      },
      render: (option: any) => {
        return option['VendorId'] ? `${option['VendorId']} - ${option['Name']}` : option['Name'];
      },
      type: 'autocomplete',
      filter_key: 'Name',
      URL_CODE: 'SFT.vendorcombo'
    }
    this.provinceConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      isSorting: false,
      isSelectedAllValueIsEmpty: true,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return `${option['Name']}`;
      },
      type: 'autocomplete',
      filter_key: 'Name',
      URL_CODE: 'SFT.provincescombo'
    };
    this.districtConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      isSorting: false,
      disableAutoload: true,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return `${option['Name']}`;
      },
      type: 'autocomplete',
      filter_key: 'Name',
      URL_CODE: 'SFT.districtscombo'
    };

    this.promotionConfig = {
      selectedFirst: false,
      isSelectedAll: false,
      isSorting: false,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return `${option['Code']}`;
      },
      filters: {
        WarehouseCode: this.filters['WarehouseCode']        
      },
      type: 'autocomplete',
      filter_key: 'Name',
      URL_CODE: 'SFT.servicecombo'
    };
  }

  makeData(data: any) {
    let _data = [];
    if (data.Status) {
      _data = data.Data;
    }
    this.appTable['renderData'](_data);
    this.numOfSO = _data.length;
    this.appTable['selectedAllData']();
  }

  removeRow(data: any) {
    this.appTable['removeRow'](data.index);
  }

  initTableAction(): TableAction[] {
    return [
      {
        name: "remove",
        icon: "delete",
        toolTip: {
          name: "Loại POR khỏi danh sách",
        },
        class: "ac-task",
        disabledCondition: (row: any) => {
          return true;
        }
      }
    ];
  }

  initTable() {
    this.tableConfig = {
      enableCheckbox: true,
      columns: {
        isContextMenu: false,
        headerActionCheckBox: true,
        displayedColumns: [
          'index',
          'SOCode', 
          'ExternalCode', 
          "Status", 
          "CreatedDate", 
          "headerAction"
        ],
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
            title: 'AutoPickPackPOR.SOCode',
            name: 'SOCode'
          },
          {
            title: 'AutoPickPackPOR.DOID',
            name: 'ExternalCode'
          },
          {
            title: 'AutoPickPackPOR.Status',
            name: 'Status'
          },
          {
            title: 'AutoPickPackPOR.CreatedDate',
            name: 'CreatedDate'
          }
        ]
      },
      data: this.dataSourceGrid
    };

  }

  loadDistrict(provice: string) {
    if (provice) {
      this.district['reload']({ Province: provice });
    }
  }

  initEvent() {

    this.appTable['actionEvent'].subscribe({
      next: (event: any) => {
        if (event) {
          this.removeRow(event);
        }
      }
    });

    this.appTable['rowEvent'].subscribe({
      next: (event: any) => {
        let data = this.appTable['getData']()['data'];
        let _selected = false;
        for (let idx in data) {
          if (data[idx].selected) {
            _selected = true;
          }
        }
        this.allowCreatePickList = _selected;
        this.IsExportError = false;
      }
    })
    this.province['change'].subscribe({
      next: (value: any) => {
        this.filters['Province'] = value && value.Code ? this.renderValue(value, true): "";
        this.loadDistrict(this.filters['Province']);
      }
    });

    this.district['change'].subscribe({
      next: (value: any) => {
        this.filters['District'] = value && value.Code ? this.renderValue(value, true): "";
      }
    });

    this.vendor['change'].subscribe({
      next: (value: any) => {
        this.filters['Vendor'] =value && value.VendorId ? value.VendorId: "";
      }
    });

    this.client['change'].subscribe({
      next: (value: any) => {
        this.filters['ClientCode'] = this.renderValue(value);
        this.loadDCSites();
      }
    });

    if(this.isOnlyDC) {
      this.whBranchCombo['change'].subscribe({
        next: (data: any) => {
          this.filters['WarehouseSiteId'] = data.Code || '';
        }
      });

      this.productType['change'].subscribe({
        next: (value: any) => {
          this.filters['ConditionType'] = this.renderValue(value);
        }
      });

      this.soType['change'].subscribe({
        next: (value: any) => {
          this.filters['Type'] = this.renderValue(value);
        }
      });
    }
  }

  loadDCSites() {
    if(!this.isOnlyDC) return;
    if (this.whBranchCombo) {
      if(this.filters['ClientCode']) {
        this.whBranchCombo['reload']({ ClientCode: this.filters['ClientCode'], data: this.filters['WarehouseCode'] });
      } else {
        this.whBranchCombo['clear'](false, true);
        this.whBranchCombo['setDefaultValue'](this.translate.instant('combo.all'));
      }
    }  
  }

  cancelPickList() {
    this.router.navigate([`/${window.getRootPath(true)}/por/auto-pickpack`]);
  }
  goPickList() {
    this.router.navigate([`/${window.getRootPath(true)}/por/auto-pickpack`])
  }
  exportError(event: any){
    let data = this.appTable['getData']()['data'];
    if (!data.length) {
      return;
    }
    let params = {
      SOList: []
    }
    for (let idx in data) {
      if (data[idx].selected) {
        params.SOList.push(data[idx].SOCode);
      }
    }

    if (this.ZoneCode) {
      params['ZoneCode'] = this.ZoneCode;
    }
    return this.service.exportError(params);
  }
  private renderValueCombo(option: any) {
    return option['Code'] ? `${option['Code']} - ${option['Name']}` : option['Name'];
  }
  private renderValue(value: any, isName = false){
    return value ? isName ? value.Name: value.Code : '';
  }
}