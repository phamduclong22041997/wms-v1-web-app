import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { ToastService } from '../../../shared/toast.service';
import { Service } from '../../service';
import { CreatePOComponent } from './create-po/component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-po-list',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class POListComponent implements OnInit, AfterViewInit {
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('typeCombo', { static: false }) typeCombo: any;
  @ViewChild('rocketCombo', { static: false }) rocketCombo: any;
  @ViewChild('warehouseCombo', { static: false }) warehouseCombo: any;

  summary = {
    TotalSKU: 0,
    Total: 0,
    SKUInActive: 0,
    SKUActive: 0,
    TotalSKUActive: 0,
    TotalSKUInActive: 0,
    PromotionMonth: '',
    Period: '',
    PromotionCode: '',
    StartDate: '',
    EndDate: '',

  };

  dataSourceGrid = {
    rows: <any>[],
    total: 0
  };
  filters = {};
  isPO = '';
  tableConfig: any;
  typeConfig: any;
  rocketConfig: any;
  clientConfig: object;
  warehouseConfig: any;
  poConfig: any;
  dataComboCTKM: any;
  dataComboWarehouse = [];
  poList: any;
  strWarehouse: string;
  statusSKUConfig: object;
  periodPromotionMonth = '';
  allowCreatePO: boolean;
  allowExportPO: boolean;
  constructor(
    public dialog: MatDialog,
    private service: Service,
    private router: Router,
    private toast: ToastService,
    private translate: TranslateService) { }

  ngOnInit() {
    this.allowCreatePO = false;
    this.allowExportPO = false;
    this.initTable();
    this.initCombo();
  }

  showCreatePO() {
    let _data = this.getFilter();
    if (this.allowCreatePO && _data && _data['code'] && _data['type']) {
      const dialogRef = this.dialog.open(CreatePOComponent, {
        data: this.getFilter(),
      });
      dialogRef.afterClosed().subscribe(result => {
        this.search();
      });
    }
  }

  initCombo() {
    let session = this.loadSession();
    this.typeConfig = {
      selectedFirst: true,
      isSelectedAll: false,
      defaultValue: session ? session['Type'] : "",
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Name'];
      },
      type: 'combo',
      data: [
        { Code: 'DEFAULT', Name: 'Mặc định' },
        { Code: 'WMP', Name: 'Winmart+' },
        { Code: "WMT", Name: 'Winmart' }
      ],
    };

    this.rocketConfig = {
      selectedFirst: true,
      isSelectedAll: false,
      isSorting: false,
      isFilter: true,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Name'];
      },
      type: 'autocomplete',
      filter_key: 'Name',
      data: []
    };

    this.warehouseConfig = {
      selectedFirst: true,
      isSelectedAll: false,
      isSorting: false,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return `${option['Code']} - ${option['Name']}`;
      },
      type: 'combo',
      filter_key: 'Name',
      URL_CODE: 'SFT.warehousecombo'
    };
  }

  getCTKMDemandSet() {
    this.service.getDemandSets({
      Name: 'PO',
      Type: this.filters['type'],
      WarehouseCode: this.filters['warehouseCode']
    }).subscribe((resp: any) => {
      let _data = [];
      if (resp['Status']) {
        _data = resp['Data'] || [];
      } else {
        this.resetData();
      }
      this.reloadComboCTKM(_data);
    });
  }

  private getFilter() {
    let filters = {
      ...this.filters,
    };
    return filters;
  }

  private validateFilter() {
    if (!this.filters['type']) {
      this.toast.error('RocketPlanning.Validate_Type', 'error_title');
      return false;
    }

    if (!this.filters['code']) {
      this.toast.error('RocketPlanning.Validate_CTKM', 'error_title');
      return false;
    }
    if (!this.filters['warehouseCode']) {
      this.toast.error('RocketPlanning.Validate_Warehouse', 'error_title');
      return false;
    }
    return true;
  }

  exportPO() {
    if (!this.validateFilter()) return;
    this.service.exportPO(this.getFilter());
  }

  search() {
    if (!this.validateFilter()) return;
    this.loadData(this.getFilter());
  }

  loadData(filter: any) {
    this.allowCreatePO = false;
    this.service.getListSKU(filter)
      .subscribe((resp: any) => {
        if (resp['Status'] && resp['Data']) {
          this.poList = resp['Data'].DataList ? resp['Data'].DataList : [];
          this.summary = resp['Data'].Summary ? resp['Data'].Summary : {};
          this.appTable['renderData'](this.poList);
          if (resp['Data'].Summary && resp['Data'].Summary.Status == 'Create') {
            this.allowExportPO = true
          }else{
            this.allowExportPO = false
          }
          for (let idx in this.poList) {
            if (this.poList[idx]['Status'] == "New" && this.allowCreatePO == false) {
              this.allowCreatePO = true;
            }
            this.poList[idx]['Status'] = this.translate.instant(`RocketPlanning.POStatus.${this.poList[idx]['Status']}`);
          }
        } else {
          this.resetData();
        }

      });
  }

  referenceDataCombox(data, key) {
    if (data && key && data[key]) {
      return data[key];
    }
    return [];
  }

  getCTKMFirstValue(listCTKM: any) {
    let value = '';
    if (listCTKM && listCTKM.length) {
      value = listCTKM[0]['Name'];
    }
    return value;
  }

  reloadComboCTKM(data: any) {
    this.rocketCombo['clear'](false, true);
    if (this.rocketCombo && this.rocketCombo['reload'] && data.length) {
      this.rocketCombo['setData'](data);
      this.rocketCombo['setValue'](data[0].Code);
    } else {
      this.resetData();
    }
  }

  initEvent() {
    this.typeCombo['change'].subscribe({
      next: (data: any) => {
        if (data) {
          this.filters['type'] = data.Code;
          this.getCTKMDemandSet();
        } else {
          this.filters['type'] = '';
        }
      }
    });

    this.rocketCombo['change'].subscribe({
      next: (data: any) => {
        if (data) {
          this.filters['code'] = data.Name;
          this.search();
        } else {
          this.filters['code'] = '';
        }
      }
    });

    this.warehouseCombo['change'].subscribe({
      next: (data: any) => {
        if (data) {
          this.filters['warehouseCode'] = data.Code;
          this.getCTKMDemandSet();
        } else {
          this.filters['warehouseCode'] = '';
        }
      }
    });
  }

  onFocusOutEvent(event: any) {
  }
  initTable() {
    this.tableConfig = {
      showFirstLastButton: true,
      style: {
        // 'overflow-x': 'hidden'
      },
      pageSize: 10,
      columns: {
        isContextMenu: false,
        displayedColumns: [
          'index',
          'SKU',
          'SKUName',
          'Qty',
          'UOM',
          'Note',
          'Status',
          'POCode',
          'PromotionCode'
        ],
        options: [
          {
            title: 'RocketPlanning.SKU',
            name: 'SKU',
            style: {
              'min-width': '100px',
              'max-width': '100px'
            }
          },
          {
            title: 'RocketPlanning.SKUName',
            name: 'SKUName',
            style: {
              'min-width': '250px',
              'max-width': '300px'
            }
          },
          {
            title: 'RocketPlanning.RequestQty',
            name: 'Qty',
          },
          {
            title: 'RocketPlanning.BaseUOM',
            name: 'UOM',
          },
          {
            title: 'RocketPlanning.Note',
            name: 'Note',
            style: {
              'margin-left': '5px',
              'min-width': '250px'
            }
          },
          {
            title: 'RocketPlanning.POCode',
            name: 'POCode',
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/purchaseorder/details/${data.POCode}`;
            },
            style: {
              'min-width': '150px'
            }
          },
          {
            title: 'RocketPlanning.Status',
            name: 'Status',
          },
          {
            title: 'RocketPlanning.PromotionCode',
            name: 'PromotionCode',
            style: {
              'min-width': '150px'
            }
          }
        ]
      },
      data: this.dataSourceGrid
    };
  }

  resetData() {
    this.summary = {
      TotalSKU: 0,
      Total: 0,
      SKUInActive: 0,
      SKUActive: 0,
      TotalSKUActive: 0,
      TotalSKUInActive: 0,
      PromotionMonth: '',
      Period: '',
      PromotionCode: '',
      StartDate: '',
      EndDate: ''
    };

    this.appTable['renderData']([]);
  }
  exportExcel(data: any = {}) {
    return this.service.exportPOProcess(this.filters);
  }
  exportPOScc(data: any = {}) {
    return this.service.exportPOScc(this.filters);
  }

  exportPOErr(data: any = {}) {
    return this.service.exportPOErr(this.filters);
  }
  ngAfterViewInit() {
    this.initEvent();
  }
  loadSession() {
    let session = window.sessionStorage.getItem("ROCKET_SESSION");
    if (session) {
      session = JSON.parse(session);
    }
    return session;
  }
  goToPageImportPO(event: any = null) {
    this.router.navigate([`/${window.getRootPath()}/rocket/planning-po-upload`]);
  }
}
