import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { ToastService } from '../../../../shared/toast.service';
import { Service } from '../../../service';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
@Component({
  selector: 'app-po-list',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class ViewPOListComponent implements OnInit, AfterViewInit {


  @ViewChild('fromDate', { static: false }) fromDate: any;
  @ViewChild('toDate', { static: false }) toDate: any;
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('typeCombo', { static: false }) typeCombo: any;
  @ViewChild('rocketCombo', { static: false }) rocketCombo: any;
  @ViewChild('statusCombo', { static: false }) statusCombo: any;
  @ViewChild('statusSAPCombo', { static: false }) statusSAPCombo: any;
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
  filters = {

  };
  isPO = '';
  tableConfig: any;
  typeConfig: any;
  rocketConfig: any;
  statusConfig: any;
  statusSAPConfig: any;
  configDate: any;
  clientConfig: object;
  warehouseConfig: any;
  poConfig: any;
  dataComboCTKM: any;
  dataComboWarehouse = [];
  poList: any;
  strWarehouse: string;
  statusSKUConfig: object;
  periodPromotionMonth = '';
  isExportHidden = true;
  disabledCombo = true;
  dataStatus: [];
  DataStatusSAP = [
    { Code: '', Name: 'All' },
    { Code: 'Y', Name: 'THÀNH CÔNG CÓ POID' },
    { Code: 'N', Name: 'THÀNH CÔNG CHƯA CÓ POID' },
    { Code: '1', Name: 'LỖI TỪ SFT' },
    { Code: 'E', Name: 'LỖI TỪ SAP' },
  ];
  constructor(
    public dialog: MatDialog,
    private service: Service,
    private router: Router,
    private toast: ToastService,
    private translate: TranslateService) { }

  ngOnInit() {
    this.isExportHidden = true;
    this.initTable();
    this.initCombo();
    // this.initEvent();
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
      selectedFirst: false,
      isSelectedAll: false,
      isSorting: false,
      isFilter: true,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Name'];
      },
      type: 'combo',
      filter_key: 'Name',
      data: [{ Code: '', Name: 'All' }]
    };
    this.statusConfig = {
      selectedFirst: true,
      isSelectedAll: false,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        if (this.dataStatus.length > 0) {
          // return option['Name'];
          return this.translate.instant(`ViewRocketPlanning.RocketPOStatus.${option['Name']}`);
        }
        return null;

      },
      type: 'combo',
      filter_key: 'Name',
      data: [
        // { Code: 'New', Name: 'ĐANG CHỜ TẠO PO' },
        // { Code: 'Create', Name: 'ĐÃ TẠO PO' },
      ]
    };

    this.statusSAPConfig = {
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
      type: 'combo',
      filter_key: 'Name',
      data: this.DataStatusSAP
    };
    this.warehouseConfig = {
      selectedFirst: true,
      isSelectedAll: false,
      defaultValue: session ? session['WarehouseCode'] : "",
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

  private FotmatDate() {
    const fromDate = this.fromDate.getValue();
    const toDate = this.toDate.getValue();
    if (fromDate) {
      const _date = moment(fromDate);
      this.filters['FromDate'] = _date.format('YYYY-MM-DD');
    } else {
      this.filters['FromDate'] = '';
    }
    if (toDate) {
      const _date = moment(toDate);
      this.filters['ToDate'] = _date.format('YYYY-MM-DD');
    } else {
      this.filters['ToDate'] = '';
    }
  }
  getDemandListPO() {
   this.FotmatDate();
    this.service.getDemandListPO({   
      FromDate: this.filters['FromDate'],
      ToDate: this.filters['ToDate'],
      Name: 'PO',
      Status: this.filters['status'],
      WarehouseCode: this.filters['warehouseCode'],

    }).subscribe((resp: any) => {
      let _data = [];

      if (resp['Status']) {
        _data = resp['Data']['Data'] || [];
        this.dataStatus = resp['Data']['DataStatus'];
        // this.mappingStatus();
        if (this.disabledCombo) {
          this.statusSAPCombo.clear(true)
        }
      } else {
        this.resetData();
      }
      this.reloadComboCTKM(_data);
    });

  }

  // private reloadComboStatusSAP(data:any){
  //   console.log(data)
  //   this.statusSAPCombo.clear();
  //   this.statusSAPCombo.reload();
  //   this.statusCombo.setValue(data[0]['Code']);
  // }
  private mappingStatus() {
    if (this.dataStatus.length > 0) {
      const data = this.dataStatus.filter(item => {
        return item['Key'] === this.filters['code'];
      });


      this.statusConfig.data = [...data];
      this.statusCombo.clear();
      this.statusCombo.reload();
      console.log(data[0]['Code']);
      this.statusCombo.setValue(data[0]['Code']);

    }
  }
  private getFilter() {
    let filters = {
      ...this.filters,
    };
    return filters;
  }

  private validateFilter() {
    // if (!this.filters['type']) {
    //   this.toast.error('RocketPlanning.Validate_Type', 'error_title');
    //   return false;
    // }

    if (!this.filters['code']) {
      this.toast.error('RocketPlanning.Validate_CTKM', 'error_title');
      return false;
    }
    // if (!this.filters['status']) {
    //   this.toast.error('RocketPlanning.Status', 'error_title');
    //   return false;
    // }
    // if (!this.filters['warehouseCode']) {
    //   this.toast.error('RocketPlanning.Validate_Warehouse', 'error_title');
    //   return false;
    // }
    return true;
  }

  exportPO() {
    if (!this.validateFilter()) return;
    this.service.exportPO(this.getFilter());
  }

  search() {

    const fromDate = this.fromDate.getValue();
    const toDate = this.toDate.getValue();
    if (fromDate) {
      const _date = moment(fromDate);
      this.filters['FromDate'] = _date.format('YYYY-MM-DD');
    } else {
      this.filters['FromDate'] = '';
    }
    if (toDate) {
      const _date = moment(toDate);
      this.filters['ToDate'] = _date.format('YYYY-MM-DD');
    } else {
      this.filters['ToDate'] = '';
    }
    if (!this.validateFilter()) return;
    this.loadData(this.getFilter());
  }

  loadData(filter: any) {
    this.service.getPoFromRocket(filter)
      .subscribe((resp: any) => {
        if (resp['Status'] && resp['Data']) {
          console.log(resp['Data'].length)
          if (resp['Data'].length) {
            this.isExportHidden = false
          } else {
            this.isExportHidden = true
          }
          this.poList = resp['Data'] ? resp['Data'] : [];
          this.appTable['renderData'](this.poList);

          for (let idx in this.poList) {
            this.poList[idx]['Status'] = this.translate.instant(`ViewRocketPlanning.RocketPOStatus.${this.poList[idx]['Status']}`);
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
  private reloadComboStatusPO() {
    if (!this.disabledCombo) {
      this.statusSAPConfig.data = this.DataStatusSAP;
      this.statusSAPCombo.setValue(this.DataStatusSAP[0]['Code']);
      this.statusSAPCombo.reload();
    } else {
      console.log('dddd');
      this.statusSAPCombo.clear(true);
      this.statusSAPConfig.data = [];
    }
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

    this.statusCombo['change'].subscribe({
      next: (data: any) => {

        if (data) {
          this.filters['status'] = data.Code;
          // this.getDemandListPO();

          if (data.Code === 'Create') {
            this.disabledCombo = false;

          } else {
            this.disabledCombo = true;
            this.search();
          }
          this.reloadComboStatusPO();
        } else {
          this.filters['status'] = '';
        }

      }
    });

    this.statusSAPCombo['change'].subscribe({
      next: (data: any) => {
        if (data) {
          console.log(data)
          this.filters['statusSAP'] = data.Code;
          // this.reloadComboStatusSAP(data)
          this.search();
        } else {
          this.filters['statusSAP'] = '';
        }
      }
    });

    this.rocketCombo['change'].subscribe({
      next: (data: any) => {
        if (data) {
          this.filters['code'] = data.Name;
          // this.search();
          this.mappingStatus();
          // this.reloadComboCTKM
        } else {
          this.filters['code'] = '';
        }
      }
    });
    this.warehouseCombo['change'].subscribe({
      next: (data: any) => {
        if (data) {

          this.filters['warehouseCode'] = data.Code;
          this.getDemandListPO();
        } else {
          this.filters['warehouseCode'] = '';
        }
      }
    });
    this.fromDate['change'].subscribe({
      next: (value: any) => {
        this.compareDate();
      }
    });

    this.toDate['change'].subscribe({
      next: (value: any) => {
        this.compareDate();
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
          "Code",
          'SKU',
          'SKUName',
          'Qty',
          'Uom',
          'POCode',
          "ExternalCode",
          'Status',
          'CreatedBy',
          'MessageError'
        ],
        options: [
          {
            title: 'ViewRocketPlanning.Code',
            name: 'Code',
            style: {
              'min-width': '250px',
              'max-width': '300px'
            }
          },
          {
            title: 'ViewRocketPlanning.SKU',
            name: 'SKU',
            style: {
              'min-width': '100px',
              'max-width': '100px'
            }
          },
          {
            title: 'ViewRocketPlanning.SKUName',
            name: 'SKUName',
            // style: {
            //   'min-width': '200px',
            //   'max-width': '200px'
            // }
          },
          {
            title: 'ViewRocketPlanning.RequestQty',
            name: 'Qty',
            style: {
              'min-width': '70px',
              'max-width': '70px'
            }
          },
          {
            title: 'ViewRocketPlanning.BaseUOM',
            name: 'Uom',
            style: {
              'min-width': '50px',
              'max-width': '50px'
            }
          },
          {
            title: 'ViewRocketPlanning.POCode',
            name: 'POCode',
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/purchaseorder/details/${data.POCode}`;
            },
            style: {
              'min-width': '180px',
              'max-width': '180px'
            }
          },
          {
            title: 'ViewRocketPlanning.POID',
            name: 'ExternalCode',
            style: {
              'min-width': '120px',
              'max-width': '140px'
            }
          },
          {
            title: 'ViewRocketPlanning.Status',
            name: 'Status',
            style: {
              'min-width': '100px',
              'max-width': '120px'
            }
          },
          {
            title: 'ViewRocketPlanning.CreatedBy',
            name: 'CreatedBy',
            style: {
              'min-width': '100px',
              'max-width': '120px'
            }
          },
          {
            title: 'ViewRocketPlanning.Note',
            name: 'MessageError',
            // style: {
            //   'min-width': '200px',
            //   'max-width': '250px'
            // }
          },

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
    // this.disabledCombo = false;
    this.appTable['renderData']([]);
  }

  ngAfterViewInit() {
    const sevenDayBefore = moment().subtract(7, 'day').toDate();
    this.fromDate.setValue(sevenDayBefore);
    this.initEvent();
    this.configDate = {
      setMinDate: true,
      minDate: sevenDayBefore
    }
    this.fromDate.setValue(sevenDayBefore);

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

  exportExcel(data: any = {}) {
    const fromDate = this.fromDate.getValue();
    const toDate = this.toDate.getValue();
    if (fromDate) {
      const _date = moment(fromDate);
      this.filters['FromDate'] = _date.format('YYYY-MM-DD');
    } else {
      this.filters['FromDate'] = '';
    }
    if (toDate) {
      const _date = moment(toDate);
      this.filters['ToDate'] = _date.format('YYYY-MM-DD');
    } else {
      this.filters['ToDate'] = '';
    }
    return this.service.exportPOList(this.filters);
  }
  compareDate() {
    const sevenDayBefore = moment(this.toDate).subtract(7, 'days').toDate();
    const createdFromDate = this.fromDate.getValue(sevenDayBefore);
    const createdToDate = this.toDate.getValue();

    if (createdFromDate && createdToDate) {
      const formatCreatedFromDate = new Date(createdFromDate.getFullYear(), createdFromDate.getMonth(), createdFromDate.getDate());
      const formatCreatedToDate = new Date(createdToDate.getFullYear(), createdToDate.getMonth(), createdToDate.getDate());
      if (formatCreatedFromDate < sevenDayBefore) {
        this.toast.error('Dữ liệu chỉ được lấy trong vòng 7 ngày qua', 'error_title');
        this.fromDate.setValue(sevenDayBefore);
        return false;
      }
      if (formatCreatedFromDate > formatCreatedToDate) {
        this.toast.error('invalid_date_range', 'error_title');
        this.toDate.setValue(new Date());
        return false;
      }
      return true;
      // const today = new Date();
    }
  }
}
