import { STATUS_BORDER_MASANSTORE, SO_STATUS, SO_CANCELED_STATUS } from '../../../shared/constant';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Service } from '../../service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../shared/toast.service';
import * as moment from 'moment';
import { Utils } from '../../../shared/utils';

interface TableAction {
  icon: string;
  class?: string;
  name?: String;
  toolTip?: any;
  actionName?: any;
  disabledCondition?: any;
}

@Component({
  selector: 'app-list-balancetrans',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})

export class BalanceTransComponent implements OnInit, AfterViewInit {
  tableConfig: any;
  statusConfig: Object;
  filters: Object;
  clientConfig: Object;
  warehouseHandleConfig: Object;
  warehouseSiteConfig: Object;
  storeTypeConfig: Object;
  regionCode: string;
  configDate: any;
  conditionTypeConfig: Object;

  @ViewChild('fromDate', { static: false }) fromDate: any;
  @ViewChild('toDate', { static: false }) toDate: any;
  @ViewChild('client', { static: false }) client: any;
  @ViewChild('dcsite', { static: false }) dcsite: any;
  @ViewChild('status', { static: false }) status: any;
  @ViewChild('conditionType', { static: false }) conditionType: any;
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('inputFile', { static: false }) inputFile: ElementRef;

  constructor(
    private translate: TranslateService,
    private toast: ToastService,
    private service: Service,
    public dialog: MatDialog,
    private router: Router) { }

  ngOnInit() {
    this.filters = {
      Content: '',
      WhCode: window.localStorage.getItem('_warehouse'),
      FromDate: moment().subtract(7, 'day').format('YYYY-MM-DD'),
      ToDate: moment().format('YYYY-MM-DD'),
      ClientCode: ''
    };

    this.initData();
  }

  initData() {
    this.initTable();
    this.filters['WhCode'] = window.localStorage.getItem('_warehouse') ;

    this.warehouseHandleConfig = {
      selectedFirst: false,
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

    this.conditionTypeConfig = {
      selectedFirst: false,
      isSelectedAll: false,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Name'];
      },
      type: 'autocomplete',
      filter_key: 'Name',
      data: [
        { Code: "New", Name: "Mới" }
      ]
    };

    this.storeTypeConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      // defaultValue: _session['StoreType'] || "",
      filters: {
        Collection: 'GEO.Stores',
        Column: 'Type'
      },
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Code'] ? `${option['Code']} - ${option['Description']}` : option['Description'];
      },
      type: 'autocomplete',
      filter_key: 'Description',
      URL_CODE: 'SFT.enum'
    };

    this.clientConfig = {
      selectedFirst: true,
      isSelectedAll: true,
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
    this.warehouseSiteConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      filters: {},
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Code'] ? `${option['Code']} - ${option['Name']}` : option['Name'];
      },
      type: 'combo',
      filter_key: 'Name',
      filter_value: 'Code',
      data: []
    }
  }

  initTable() {
    this.tableConfig = {
      style: {
        'overflow-x': 'hidden'
      },
      columns: {
        isContextMenu: false,
        actionTitle: this.translate.instant('FinishPo.Action'),
        displayedColumns: [
          'index',
          'ClientCode',
          'WarehouseSiteName',
          'SKU',
          'ProductName',
          'Uom',
          'TranDate',
          'ConditionType',
          'TranDescText',
          'TranTypeText',
          'Qty',
          'DocumentCode',
          'CreatedDate',
          'CreatedBy'
        ],
        options: [
          {
            title: 'Product.SKU',
            name: 'SKU',
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/product/${data.ClientCode}/${data.WarehouseSiteId}/${data.SKU}`;
            },
            style: {
              'min-width': '90px',
              'max-width': '90px'
            }
          },
          {
            title: 'Product.ProductName',
            name: 'ProductName'
          },
          {
            title: 'DCSite',
            name: 'WarehouseSiteName',
            render: (data: any) => {
              return data.WarehouseSiteName ? `${data.WarehouseSiteId} - ${data.WarehouseSiteName}` : data.WarehouseSiteId;
            },
            style: {
              'min-width': '80px',
              'max-width': '80px'
            }
          },
          {
            title: 'Report.ConditionType',
            name: 'ConditionType',
            render: (data: any) => {
              return this.translate.instant(`SOStatus.${data.ConditionType}`);
            },
            style: {
              'min-width': '70px',
              'max-width': '70px'
            }
          },
          {
            title: 'STO.WarehouseCode',
            name: 'WarehouseCode',
            style: {
              'min-width': '70px',
              'max-width': '70px'
            }
          },
          {
            title: 'Report.ClientCode',
            name: 'ClientCode',
            style: {
              'min-width': '70px',
              'max-width': '70px'
            }
          },
          {
            title: 'Product.BaseUom',
            name: 'Uom',
            style: {
              'min-width': '50px',
              'max-width': '50px'
            }
          },
          {
            title: 'Product.TransactionType',
            name: 'TranDescText',
            style: {
              'min-width': '90px',
              'max-width': '100px'
            }
          },
          {
            title: 'Product.TransactionDesc',
            name: 'TranTypeText',
            style: {
              'min-width': '90px',
              'max-width': '100px'
            }
          },
          
          {
            title: 'AdjustProduct.ProcessDate',
            name: 'TranDate',
            style: {
              'min-width': '90px',
              'max-width': '100px'
            }
          },
          {
            title: 'Product.TransactionCode',
            name: 'DocumentCode',
            style: {
              'min-width': '150px',
              'max-width': '150px'
            }
          },
          {
            title: 'FinishPo.CreatedDate',
            name: 'CreatedDate',
            style: {
              'min-width': '90px',
              'max-width': '90px'
            }
          },
          {
            title: 'FinishPo.CreatedBy',
            name: 'CreatedBy',
            style: {
              'min-width': '90px',
              'max-width': '90px'
            }
          },
          {
            title: 'Product.Qty',
            name: 'Qty',
            style: {
              'min-width': '70px',
              'max-width': '70px'
            }
          }
        ]
      },
      remote: {
        url: this.service.getAPI('getBalanceTrans'),
        params: {
          filter: JSON.stringify(this.filters)
        }
      }
    };
  }
  private renderSOTypeColor(row: any) {
    if (row.SOType) {
      if (row.SOType == 'Even') {
        return {
          color: '#2A9CFF'
        };
      } else if(row.SOType =='Odd') {
        return {
          color: '#C67000'
        };
      } else {
        return {
          color: '#f05858'
        };
      }
    }
    return null;
  }
  ngAfterViewInit() {
    this.initEvent();

    const sevenDayBefore = moment().subtract(7, 'day').toDate();
    this.fromDate.setValue(sevenDayBefore);
    this.appTable['search'](this.filters);
  }
  reloadWarehouseBranch(data: any) {
    if (this.dcsite) {
      let _data = []
      _data.push({
        Code: '',
        Name: 'Tất cả'
      });
      for (let idx in data.Branch) {
        let site = data.Branch[idx];
        if (site.WarehouseCode === this.filters['WhCode']) {
          _data.push({
            Code: site.Code,
            Name: site.Name,
          })
        }
      }
      this.dcsite['clear'](false, true);
      this.dcsite['setData'](_data);
      if (_data.length > 0) {
        this.filters['WhSite'] = _data[0].Code;
        this.dcsite['setValue'](_data[0].Code);
      }
    }
  }
  initEvent() {
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
    this.client['change'].subscribe({
      next: (value: any) => {
        this.filters['ClientCode'] = value && value.Code ? value.Code : '';
        this.reloadWarehouseBranch(value);
      }
    });

    this.conditionType['change'].subscribe({
      next: (value: any) => {
        this.filters['ConditionType'] = value ? [value.Code] : '';
      }
    });
    this.dcsite['change'].subscribe({
      next: (value: any) => {
        this.filters['WarehouseSiteId'] = value ? value.Code : '';
      }
    });
  }
  
  onEnter(event: any) {
    let code = event.target['value'];
    this.filters['Content'] = code;
    this.search(null);
  }

  search(event: any) {
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
    this.appTable['search'](this.filters);
  }

  exportExcel(event: any) {
    return this.service.exportBalanceTrans(this.filters);
  }
  compareDate() {
    const createdFromDate = this.fromDate.getValue();
    const createdToDate = this.toDate.getValue();
    if (createdFromDate && createdToDate) {
      const formatCreatedFromDate = new Date(createdFromDate.getFullYear(), createdFromDate.getMonth(), createdFromDate.getDate());
      const formatCreatedToDate = new Date(createdToDate.getFullYear(), createdToDate.getMonth(), createdToDate.getDate());
      if (formatCreatedFromDate > formatCreatedToDate) {
        this.toast.error('invalid_date_range', 'error_title');
        this.toDate.setValue(new Date());
      }
      let days = -15;
      if(formatCreatedFromDate.getTime() < Utils.addDays(formatCreatedToDate, days).getTime()){
        this.toast.error('invalid_limit_date_range', 'error_title');
        this.fromDate.setValue(Utils.addDays(formatCreatedToDate, days));
      }
    }
  }
}
