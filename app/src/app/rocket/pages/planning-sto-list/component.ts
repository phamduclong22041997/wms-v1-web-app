import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { ToastService } from '../../../shared/toast.service';
import { Service } from '../../service';
import { CreateSTOComponent } from './create-sto/component';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-sto-list',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class STOListComponent implements OnInit, AfterViewInit {

  @ViewChild('appTableList', { static: false }) appTableList: ElementRef;
  @ViewChild('typeCombo', { static: false }) typeCombo: any;
  @ViewChild('ctkmCombo', { static: false }) ctkmCombo: any;
  @ViewChild('warehouseCombo', { static: false }) warehouseCombo: any;

  tableConfigList: any;
  typeConfigList: Object;
  clientConfig: object;
  summaryList = {
    TotalUnit: 0,
    StartDate: null,
    EndDate: null,
    PromotionCode: '',
    Period: '',
    PromotionMonth: '',
    FileName: '',
    SKUS: 0,
    Stores: 0
  };
  dataSourceGrid = {
    rows: <any>[],
    total: 0
  };
  filters = {
  };

  totalStock: Number;
  warehouseName: string;
  ctkmConfig: any;
  warehouseConfig: any;
  dataComboCTKM: any;
  dataComboWarehouse: any;
  allowCreateSTO: Boolean;
  allowExportSTO: Boolean;

  constructor(
    private translate: TranslateService,
    public dialog: MatDialog,
    private service: Service,
    private router: Router,
    private toast: ToastService,) { }

  ngOnInit() {
    this.allowCreateSTO = true;
    this.allowExportSTO = true;
    this.totalStock = 0;
    this.initTable();
    this.initCombo();
  }

  showCreateSTO() {
    let _session = localStorage.getItem("ROCKET_SESSION_IMPORT");
    console.log(_session);
    if (_session) {
      // update code
    }
    let _data = { ...this.getFilter() }
    if (_data && _data['code'] && _data['type'] && _data['warehouseCode']) {
      _data['warehouseName'] = this.warehouseName;
      const dialogRef = this.dialog.open(CreateSTOComponent, {
        data: _data
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.search();
        }
      });
    }
  }

  initCombo() {
    this.typeConfigList = {
      selectedFirst: true,
      isSelectedAll: false,
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

    this.ctkmConfig = {
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
    if (!this.filters['type'] || !this.filters['warehouseCode']) {
      return;
    }
    this.service.getDemandSets(
      {
        name: 'STO',
        type: this.filters['type'],
        warehouseCode: this.filters['warehouseCode']
      }).subscribe((resp: any) => {
        let _data = [];
        if (resp['Status']) {
          _data = resp['Data'] || [];
        } else {
          this.resetData();
        }
        this.reloadComboCTKM(_data);
      })
  }

  referenceDataCombox(data: any, key: any) {
    if (data && key && data[key]) {
      return data[key];
    }
  }

  getCTKMFirstValue(listCTKM: any) {
    let value = '';
    if (listCTKM && listCTKM.length) {
      value = listCTKM[0]['Name'];
    }
    return value;
  }

  reloadComboCTKM(data: any) {
    this.ctkmCombo['clear'](false, true);
    if (this.ctkmCombo && this.ctkmCombo['reload'] && data.length) {
      this.ctkmCombo['setData'](data);
      this.ctkmCombo['setValue'](data[0].Code);
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

    this.ctkmCombo['change'].subscribe({
      next: (data: any) => {
        if (data) {
          this.filters['code'] = data.Name;
        } else {
          this.filters['code'] = '';
        }
        this.loadData(this.getFilter());
      }
    });

    this.warehouseCombo['change'].subscribe({
      next: (data: any) => {
        if (data) {
          this.filters['warehouseCode'] = data.Code;
          this.warehouseName = data.Name;
          this.getCTKMDemandSet();
        } else {
          this.filters['warehouseCode'] = '';
          this.warehouseName = '';
        }
      }
    });
  }

  initTable() {
    //table list
    this.tableConfigList = {
      enableCollapse: true,
      rowSelected: true,
      showFirstLastButton: true,
      pageSize: 10,
      columns: {
        isContextMenu: false,
        //Table show nam o ngoai
        displayedColumns: [
          'index',
          'StoreName',
          'SKU',
          'SKUName',
          'FinalUnits',
          'UOM',
          'SOCode',
          'Doid',
          'Status',
          'Note'
        ],
        options: [
          {
            title: 'RocketPlanning.StoreName',
            name: 'StoreName',
            render: (data: any) => {
              return data.StoreCode + ' - '+ data.StoreName;
            },
          },
          {
            title: 'STO.ExternalCode',
            name: 'Doid',
          },
          {
            title: 'RocketPlanning.SKU',
            name: 'SKU',
            style: {
              'min-width': '120px',
              'max-width': '120px'
            }
          },
          {
            title: 'RocketPlanning.SKUName',
            name: 'SKUName',
          },
          {
            title: 'RocketPlanning.FinalUnit',
            name: 'FinalUnits',
            style: {
              'margin-left': '10px',
              'min-width': '100px',
              'max-width': '100px',
              'justify-conten': 'center'
            },
          },

          {
            title: 'RocketPlanning.BaseUOM',
            name: 'UOM',
            style: {
              'min-width': '100px',
              'max-width': '100px'
            }
          },
          {
            title: 'RocketPlanning.SOCode',
            name: 'SOCode',
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/saleorder/details/${data.SOCode}`;
            },
          },
          {
            title: 'RocketPlanning.Status',
            name: 'Status',
            render: (data: any) => {
              return this.translate.instant(`RocketPlanningSOStatus.${data.Status}`);
            },
          },
          {
            title: 'RocketPlanning.Note',
            name: 'Note',
          }

        ]
      },
      data: this.dataSourceGrid
    };
  }
  private getFilter() {
    return {
      ...this.filters,
    };
  }
  private validateFilter(isexport = false) {

    if (!this.filters['type']) {
      this.toast.error('RocketPlanning.Validate_Type', 'error_title');
      return false;
    }
    if (!this.filters['promotionCode'] && this.dataComboCTKM) {
      this.toast.error('RocketPlanning.Validate_CTKM', 'error_title');
      return false;
    }
    if (isexport && !this.filters['warehouseCode']) {
      this.toast.error('RocketPlanning.Validate_Warehouse', 'error_title');
      return false;
    }
    return true;
  }

  search() {
    if (!this.validateFilter()) return;
    this.loadData(this.getFilter());
  }

  loadData(filter: any) {
    if (!filter['type'] || !filter['code']) {
      return;
    }
    this.service.getListSKUSTO(filter)
      .subscribe((resp: any) => {
        if (resp['Status'] && resp['Data'] && resp['Data'].DataList[0].Status === "New") {
          this.allowCreateSTO = false;
        } else {
          this.allowCreateSTO = true;
        }
        if (resp['Status'] && resp['Data']) {
          if (resp['Data'].Summary.Status == 'Create') {
            this.allowExportSTO = false
          } else {
            this.allowExportSTO = true
          }
          this.summaryList = resp['Data'].Summary ? resp['Data'].Summary : [];
          let data = resp['Data'].DataList ? resp['Data'].DataList : [];
          this.appTableList['renderData'](data);
        } else {
          this.resetData();
        }
      });
  }

  resetData() {
    this.summaryList = {
      TotalUnit: 0,
      StartDate: null,
      EndDate: null,
      PromotionCode: '',
      Period: '',
      PromotionMonth: '',
      FileName: '',
      SKUS: 0,
      Stores: 0
    };
    this.appTableList['renderData']([]);
  }


  exportSTOList(data: any = {}) {
    return this.service.exportSTOList(this.filters);
  }

  exportSOScc(data: any = {}) {
    return this.service.exportSOScc(this.filters);
  }

  exportSOErr(data: any = {}) {
    return this.service.exportSOErr(this.filters);
  }

  ngAfterViewInit() {
    this.initEvent();
  }
  exportSTO() {
    if (!this.validateFilter(true)) return;
    this.service.exportSTO(this.getFilter());
  }

  goToPageImport() {
    this.router.navigate([`/${window.getRootPath()}/rocket/planning-sto-upload`]);
  }
}
