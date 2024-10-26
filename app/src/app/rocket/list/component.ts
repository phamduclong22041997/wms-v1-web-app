import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../shared/toast.service';
// import { Router } from '@angular/router';
import { Service } from '../service';
// import { Workbook } from 'exceljs';
// import * as fs from 'file-saver';
// import * as moment from 'moment';

@Component({
  selector: 'app-po-promotion',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class POPromotionListComponent implements OnInit, AfterViewInit {
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('typeCombo', { static: false }) typeCombo: any;
  @ViewChild('clientCombo', { static: false }) clientCombo: any;
  // @ViewChild('inputPeriod', { static: false }) inputPeriod: ElementRef;
  // @ViewChild('inputpromotionCode', { static: false }) inputpromotionCode: ElementRef;

  // @ViewChild('inputCTKM', { static: false }) inputCTKM: ElementRef;
  @ViewChild('ctkmCombo', { static: false }) ctkmCombo: any;
  @ViewChild('warehouseCombo', { static: false }) warehouseCombo: any;
  @ViewChild('statusCombo', { static: false }) statusCombo: any;
  // @ViewChild('stoCombo', { static: false }) stoCombo: any;

  // detail
  @ViewChild('inputPOCode', { static: false }) inputPOCode: ElementRef;
  @ViewChild('typeComboDetail', { static: false }) typeComboDetail: any;
  @ViewChild('appTableDetail', { static: false }) appTableDetail: any;
  @ViewChild('clientComboDetail', { static: false }) clientComboDetail: any;

  tableConfig: any;
  typeConfig: object;
clientConfig:object;
  tableConfigDetail: any;
  typeConfigDetail: Object;
  clientConfigDetail: object;
  ctkmConfig: object;
  warehouseConfig: object;
  statusConfig: Object;
  stoConfig: object;
  filters: Object;
  params = {};
  summary = {
    New: 0,
    Finished: 0,
    Processing: 0,
    Canceled: 0,
    // TotalPO:0,
    Total: 0,
    TotalReq: 0,
    TotalRes: 0,

    CountIsSTO: 0,
    TotalActual: 0,
    TotalAvailable: 0,
    TotalPendingOut: 0,
    TotalDamaged: 0,
    TotalWeight: 0
  };
  summaryDetail = {
    TotalQty: 0,
    TotalSAPQty: 0,
    TotalExpQty: 0,
    TotalActualQty: 0
  };
  poList: any;
  dataSourceGrid = {
    rows: <any>[],
    total: 0
  };
  dataComboCTKM: any;
  dataComboCTKMTK: any;
  dataTypeCombo: any;
  dataComboWarehouse: any;
  typePODetial = '';

  constructor(
    public dialog: MatDialog,
    private service: Service,
    private toast: ToastService) { }
  ngOnInit() {
    this.filters = {
      status: 'New',
    }
    this.initCombo();
    this.initTable();
  }

  ngAfterViewInit() {
    this.initEvent();
  }

  // initDataCombo() {
  //   this.service.getDataCombo({})
  //     .subscribe((resp: any) => {
  //       if (resp['Status'] && resp['Data']['CTKM']) {
  //         const dataCTKM = resp['Data']['CTKM'];
  //         this.dataComboCTKM = dataCTKM;
  //         this.dataComboCTKMTK = dataCTKM;
  //         this.dataComboWarehouse = resp['Data']['Warehouse'] ? resp['Data']['Warehouse'] : [];

  //         this.dataTypeCombo = resp['Data']['DataType'];
  //         // this.reloadTypeCombo();
  //         this.reloadComboCTKM();
  //         this.reloadTypeComboDetail();
  //         this.reloadComboWarehouse('');
  //       }
  //     });
  // }
  getCTKMDemandSet() {
    this.service.getDemandSets({ name: 'PO', type: this.filters['type'] })
      .subscribe((resp: any) => {
        if (resp['Status'] && resp['Data']['CTKM']) {
          this.dataComboCTKM = resp['Data']['CTKM'];
          this.reloadComboCTKM();
        }else {
          // this.resetData();
          this.resetCTKMCombo();
        }
        
      });
  }
  referenceDataCombox(data, key) {
    if (data && key) {
      return data[key];
    }
    let result = [];
    for (const k in data) {
      for (const item of data[k]) {
        result.push({
          Code: item.Code,
          Name: item.Name
        });
      }
    }
    return result;
  }
  getCTKMFirstValue(listCTKM) {
    let value = '';
    if (listCTKM && listCTKM.length) {
      value = listCTKM[0]['Name'];
    }
    return value;
  }

  reloadComboCTKM() {
    const type = this.filters['type'];
    this.ctkmConfig['data'] = this.referenceDataCombox(this.dataComboCTKM, type);
    const comboType = this.dataComboCTKM && this.dataComboCTKM[type] ? this.dataComboCTKM[type] : '';
    if (comboType) {
      const getCTKMDefaultValue = this.getCTKMFirstValue(comboType);
      this.ctkmCombo.clear();
      this.ctkmCombo.reload();
      this.ctkmCombo.setDefaultValue(getCTKMDefaultValue);
      this.filters['promotionCode'] = getCTKMDefaultValue;
      this.getWarehouse();
    }else {
      this.resetCTKMCombo();
    }
  }

  reloadTypeComboDetail() {
    this.typeConfigDetail['data'] = [{ Code: '', Name: 'Tất cả' }, ...this.referenceDataCombox(this.dataTypeCombo, this.filters['type'])];
    this.typeComboDetail.reload();
    // this.typeComboDetail.clear();
  }




  reloadComboWarehouse(key) {
    if(key){
      this.warehouseConfig['data'] = [{Code:'', Name:'Tất cả'},...this.dataComboWarehouse[key]];
    }else {
      this.warehouseConfig['data']=[];
    }
    this.warehouseCombo.reload();
    this.warehouseCombo.clear();
    this.warehouseCombo.setDefaultValue('Tất cả');
    this.search();
  }

  initCombo() {
    this.clientConfig = {
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
        // { Code: '', Name: 'Chọn khách hàng' },
        { Code: 'WKT', Name: 'WKT' },
        // { Code: 'WIN', Name: 'WIN' },
      ],
    };
    this.typeConfig = {
      selectedFirst: true,
      isSelectedAll: false,
      isSorting: false,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Name'];
      },
      type: 'combo',
      data: [
        { Code: 'WMP', Name: 'WIN Mart +' },
        { Code: 'WMT', Name: 'WIN Mart' },
      ],
    };

    this.ctkmConfig = {
      selectedFirst: true,
      isSelectedAll: false,
      isFilter: true,
      isSorting: false,
      val: (option: any) => {
        return option['Name'];
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
        if(option['Code']){
          return `${option['Code']} - ${option['Name']}`;
          }return option['Name'];
      },
      type: 'combo',
      filter_key: 'Name',
      data:[{ Code: '', Name: 'Tất cả' }]
      // URL_CODE: 'EFT.wms_warehouse_combo'
    };

    this.statusConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      isSorting: false,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Name'];
      },
      type: 'autocomplete',
      data: [
        { Code: '', Name: 'Tất cả' },
        { Code: 'New', Name: 'New' },
        { Code: 'Processing', Name: 'Processing' },
        { Code: 'Finished', Name: 'Finished' }
      ],
    };


    // PODetail
    this.clientConfigDetail = {
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
        // { Code: '', Name: 'Chọn khách hàng' },
        { Code: 'WKT', Name: 'WKT' },
        // { Code: 'WIN', Name: 'WIN' },
      ],
    };

    this.typeConfigDetail = {
      selectedFirst: true,
      isSelectedAll: false,
      isSorting: false,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Name'];
      },
      type: 'combo',
      data: [
        // { Code: '', Name: 'Tất cả' },
        { Code: 'WMP', Name: 'WIN Mart +' },
        { Code: 'WMT', Name: 'WIN Mart' },
      ],
    };

  }

  initEvent() {
    this.typeCombo['change'].subscribe({
      next: (data: any) => {
        if (data && data.Code) {
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
          this.filters['promotionCode'] = data.Name;
   
          this.getWarehouse();
        } else {
          this.filters['promotionCode'] = '';
        }
      }
    });

    this.warehouseCombo['change'].subscribe({
      next: (option: any) => {
        if (option) {
          this.filters['warehouseCode'] = option.Code;
          this.search();         
        } else {
          this.filters['warehouseCode'] = '';
        }
      }
    });

    this.statusCombo['change'].subscribe({
      next: (data: any) => {
        if (data) {
          this.filters['status'] = data.Code;
          this.search();
        } else {
          this.filters['status'] = '';
        }
      }
    });

  
    // PODetail

    this.typeComboDetail['change'].subscribe({
      next: (data: any) => {
        if (data) {
          this.typePODetial = data.Code;
        } else {
          this.typePODetial = '';
        }
      }
    });
    this.clientCombo['change'].subscribe({
      next: (data: any) => {
        if (data) {
          this.filters['client'] = data.Code;
          this.getCTKMDemandSet();
        } else {
          this.filters['client'] = '';
        }
      }
    });

  }
  getWarehouse() {
    let params = {
      ...this.filters
    };
    params['name'] = "PO";
    this.service.getWarehouse(params).subscribe((resp: any) => {
      if (resp['Status'] && resp['Data']) {
        this.dataComboWarehouse = resp['Data'];
        this.reloadComboWarehouse(this.filters['promotionCode']);
      }else{
        this.resetWarehouse();
      }
    });
  }
  resetWarehouse(){
    this.warehouseCombo.reload();
    this.warehouseCombo.clear();
    this.warehouseCombo.setDefaultValue('Tất cả');
  }
  search() {
    if (!this.filters['type']) {
      this.toast.error('RocketPlanning.Validate_Type', 'error_title');
      return false;
    }

    if (!this.filters['promotionCode'] && this.dataComboCTKM && this.dataComboCTKM[this.filters['type']]) {
      this.toast.error('RocketPlanning.Validate_CTKM', 'error_title');
      return;
    }

    this.loadData(this.getFilter());
  }

  private getFilter() {
    let filters = {
      ...this.filters
    };
    // if (this.filters['type']) {
    //   filters['type'] = this.filters['type'];
    // }

    // if (this.filters['promotionCode']) {
    //   filters['promotionCode'] = this.filters['promotionCode'];
    // }
    // if (this.filters['fileName']) {
    //   filters['fileName'] = this.filters['fileName'];
    // }
    // if (this.filters['warehouseCode']) {
    //   filters['warehouseCode'] = this.filters['warehouseCode'];
    // }
    // if (this.filters['status']) {
    //   filters['status'] = this.filters['status'];
    // }
    // if (this.filters['isSTO']) {
    //   filters['isSTO'] = this.filters['isSTO'];
    // }
    return filters;
  }

  loadData(filter) {
    this.service.list(filter)
      .subscribe((resp: any) => {
        if (resp['Status'] && resp['Data']) {
          this.poList = resp['Data'].POList ? resp['Data'].POList : [];
          this.summary = resp['Data'].Totals ? resp['Data'].Totals : [];
          this.appTable['renderData'](this.poList);
        } else {
          this.appTable['renderData']([]);
        }
      })
  }

  // exportFilePO() {
  //   const filters = this.getFilter();
  //   this.service.exportFilePO(filters);
  // }

  initTable() {
    this.tableConfig = {
      showFirstLastButton: true,
      enableTools: { 'refresh': true },
      style: {
        // 'overflow-x': 'hidden'
      },
      pageSize: 10,
      columns: {
        isContextMenu: false,
        displayedColumns: ['index','WarehouseName',  'SupraCode', 'Qty', 'QtySAP',
        //  'QtySAPPlus', 
         'ActualQty', 'Available', 'Status', 'ArrivalDate', 'FinishedDate','PromotionCode'],
        options: [
          {
            title: 'RocketPlanning.Warehouse',
            name: 'WarehouseName',
            style: {
              'max-width': '60px',
            },
          },
         
          {
            title: 'RocketPlanning.POCode',
            name: 'SupraCode',
            style: {
              'min-width': '140px',
            },
          },
          {
            title: 'RocketPlanning.Units',
            name: 'Qty'
          },
          {
            title: 'RocketPlanning.UnitSAP',
            name: 'QtySAP'
          },
          // {
          //   title: 'RocketPlanning.UnitPlus',
          //   name: 'QtySAPPlus'
          // },
          {
            title: 'RocketPlanning.ActualUnits',
            name: 'ActualQty'
          },
          {
            title: 'RocketPlanning.Available',
            name: 'Available'
          }, {
            title: 'RocketPlanning.Status',
            name: 'Status'
          },
          {
            title: 'RocketPlanning.ArrialDate',
            name: 'ArrivalDate'
          },
          {
            title: 'RocketPlanning.FinishedDate',
            name: 'FinishedDate'
          },
          {
            title: 'RocketPlanning.PromotionCode',
            name: 'PromotionCode',
            style: {
              'min-width': '260px',
            },
          },
        ]
      },
      data: this.dataSourceGrid
    };
    this.tableConfigDetail = {
      showFirstLastButton: true,
      enableTools: { 'refresh': true },
      style: {
        // 'overflow-x': 'hidden'
      },
      pageSize: 10,
      columns: {
        isContextMenu: false,
        displayedColumns: ['index','Warehouse', 'SupraCode',  'SKU',
          // 'Name', 
          'Qty', 'QtySAP', 
          // 'ExpQty',
           'ActualQty', 'Status',
            // 'Type', 
            'PromotionCode'],
        options: [
          {
            title: 'RocketPlanning.Warehouse',
            name: 'Warehouse',
            style: {
              'max-width': '60px',
            },
          },
          {
            title: 'RocketPlanning.POCode',
            name: 'SupraCode',
            style: {
              'min-width': '160px',
            },
          },         
          {
            title: 'RocketPlanning.SKU',
            name: 'SKU'
          },
          // {
          //   title: 'RocketPlanning.SKUName',
          //   name: 'Name'
          // },
          {
            title: 'RocketPlanning.Units',
            name: 'Qty'
          },
          {
            title: 'RocketPlanning.UnitSAP',
            name: 'QtySAP'
          },
          // {
          //   title: 'RocketPlanning.ExpQty',
          //   name: 'ExpQty'
          // },
          {
            title: 'RocketPlanning.ActualUnits',
            name: 'ActualQty'
          },
          {
            title: 'RocketPlanning.Status',
            name: 'Status'
          },
          // {
          //   title: 'RocketPlanning.Type',
          //   name: 'Type'
          // },
          {
            title: 'RocketPlanning.PromotionCode',
            name: 'PromotionCode',
            style: {
              'min-width': '250px',
            },
          }
        ]
      },
      data: this.dataSourceGrid
    };

  }
  onFocusOutEvent(event: any){
// const value = event.target.value;
  this.filters['CTKM']= event.target.value;
  }
  private resetCTKMCombo(){
    this.ctkmConfig['data']=[];
    this.ctkmCombo.clear();
    this.ctkmCombo.reload();
    this.ctkmCombo.setDefaultValue('Chọn mã CTKM');  
  }
  // Begin PO detial
  onSearchPO(): void {
    const value = this.inputPOCode.nativeElement.value;
    if (!value || value === '') {
      this.toast.error('RocketPlanning.Validate_Input_PO', 'error_title');
      this.inputPOCode.nativeElement.focus();
      return;
    } else if (value.indexOf('PO') === -1) {
      this.toast.error('RocketPlanning.Validate_Correct_PO', 'error_title');
      this.inputPOCode.nativeElement.focus();
      return;
    }

    this.service.getDataByPOCode({
      type: this.typePODetial,
      POCodes: value
    }).subscribe(resp => {
      if (resp.Status && resp.Data) {
        this.appTableDetail['renderData'](resp.Data.Data || []);
        this.summaryDetail = resp.Data.Summary || {};
      } else {
        const msgError = resp.ErrorMessages.Message;
        this.toast.error(msgError, 'error_title');
      }
    });
  }
}
