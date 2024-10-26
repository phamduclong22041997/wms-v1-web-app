import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../../shared/toast.service';
import { Service } from '../../service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmCreatePicklistComponent } from './confirm/component';
import { Utils } from '../../../shared/utils';

interface TableAction {
  name: string,
  icon: string;
  class?: string;
  toolTip?: any;
  actionName?: any;
  disabledCondition?: any;
}

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
  @ViewChild('store', { static: false }) store: ElementRef;
  @ViewChild('productType', { static: false }) productType: ElementRef;
  @ViewChild('soType', { static: false }) soType: ElementRef;
  @ViewChild('promotion', { static: false }) promotion: ElementRef;
  @ViewChild('content', { static: false }) contentInput: ElementRef

  dataSourceGrid = {
    rows: <any>[],
    total: 0
  };

  tableConfig: any;
  clientConfig: any;
  storeConfig: any;
  configDate: any;
  provinceConfig: any;
  districtConfig: any;
  productTypeConfig: any;
  soTypeConfig: any;
  promotionConfig: any;
  warehouseBrachConfig: any;
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
    Store: "",
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
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result) {
          this.createPickList(result.ZoneCode);
        }
      }
    });
  }

  createPickList(zoneCode = "") {
    this.ZoneCode = zoneCode;
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

    if (zoneCode) {
      saveData['ZoneCode'] = zoneCode;
    }

    if (!this.allowCreatePickList) return;
    this.service.createPickList(saveData)
      .subscribe((resp) => {
        if (resp.Status) {
          this.toast.success("AutoPickPack.CreatePickListSuccessful", "success_title");
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

  onEnter(event) {
    let text = event.target['value'];
    this.filters['Content'] = Utils.formatFilterContent(text);
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
    this.storeConfig = {
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
      URL_CODE: 'SFT.storecombo'
    }
    this.provinceConfig = {
      selectedFirst: false,
      isSelectedAll: false,
      isSorting: false,
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
      selectedFirst: false,
      isSelectedAll: false,
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
    this.productTypeConfig = {
      selectedFirst: true,
      isSelectedAll: false,
      isSorting: false,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return this.translate.instant(`AutoPickPack.ProductType.${option['Name']}`);
      },
      filters: {
        WarehouseCode: this.filters['WarehouseCode'],
      },
      type: 'autocomplete',
      filter_key: 'Name',
      URL_CODE: 'SFT.producttypecombo'
    };

    this.soTypeConfig = {
      selectedFirst: true,
      isSelectedAll: false,
      isSorting: false,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return this.translate.instant(`AutoPickPack.SOTypes.${option['Name']}`);
      },
      filters: {
        WarehouseCode: this.filters['WarehouseCode'],
      },
      type: 'autocomplete',
      filter_key: 'Name',
      URL_CODE: 'SFT.sotypecombo'
    };

    this.promotionConfig = {
      selectedFirst: true,
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
          name: "Loại SO khỏi danh sách",
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
          'index','ClientCode', 'SOCode', 'ExternalCode', "Status", "CreatedDate", "headerAction"],
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
            title: 'AutoPickPack.SOCode',
            name: 'SOCode'
          },
          {
            title: 'AutoPickPack.DOID',
            name: 'ExternalCode'
          },
          {
            title: 'AutoPickPack.Status',
            name: 'Status'
          },
          {
            title: 'AutoPickPack.CreatedDate',
            name: 'CreatedDate'
          }
        ]
      },
      data: this.dataSourceGrid
    };

  }

  loadDistrict(provice: string) {
    if (this.district) {
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
        this.filters['Province'] = this.renderValue(value, true);
        this.loadDistrict(this.filters['Province']);
      }
    });

    this.district['change'].subscribe({
      next: (value: any) => {
        this.filters['District'] = this.renderValue(value, true);
      }
    });

    this.soType['change'].subscribe({
      next: (value: any) => {
        this.filters['Type'] = this.renderValue(value);
      }
    });

    this.store['change'].subscribe({
      next: (value: any) => {
        this.filters['Store'] = this.renderValue(value);
      }
    });

    this.productType['change'].subscribe({
      next: (value: any) => {
        this.filters['ConditionType'] = this.renderValue(value);
      }
    });


    this.whBranchCombo['change'].subscribe({
      next: (data: any) => {
        this.filters['WarehouseSiteId'] = data.Code || '';
      }
    });
    this.client['change'].subscribe({
      next: (value: any) => {
        this.filters['ClientCode'] = this.renderValue(value);
        if (this.whBranchCombo) {
          if(value.Code){
            this.whBranchCombo['reload']({ ClientCode: this.filters['ClientCode'], data: this.filters['WarehouseCode'] });
          } else {
            this.whBranchCombo['clear'](false, true);
            this.whBranchCombo['setDefaultValue'](this.translate.instant('combo.all'));
          }
        }  
      }
    });
  }
  cancelPickList() {
    this.router.navigate([`/${window.getRootPath()}/saleorder/auto-pickpack`]);
  }
  goPickList() {
    this.router.navigate([`/${window.getRootPath()}/saleorder/auto-pickpack`])
  }
  ExportError(event: any){
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
