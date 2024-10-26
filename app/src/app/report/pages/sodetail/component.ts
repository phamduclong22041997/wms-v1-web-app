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
  selector: 'app-list-sodetail',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})

export class SODetailComponent implements OnInit, AfterViewInit {
  tableConfig: any;
  statusConfig: Object;
  filters: Object;
  clientConfig: Object;
  warehouseHandleConfig: Object;
  warehouseSiteConfig: Object;
  storeTypeConfig: Object;
  storePriorityConfig: Object;
  regionCode: string;
  configDate: any;
  wareHouseList: any = [];
  soStatusConfig: Object;
  poTypeConfig: Object;
  storeConfig: Object;
  promotionConfig: Object;
  GIStatusConfig : Object;

  @ViewChild('fromDate', { static: false }) fromDate: any;
  @ViewChild('toDate', { static: false }) toDate: any;
  @ViewChild('client', { static: false }) client: any;
  @ViewChild('dcsite', { static: false }) dcsite: any;
  @ViewChild('status', { static: false }) status: any;
  @ViewChild('potype', { static: false }) potype: any;
  @ViewChild('store', { static: false }) store: any;
  @ViewChild('storetype', { static: false }) storetype: any;
  @ViewChild('storepriority', { static: false }) storepriority: any;
  @ViewChild('GIStatus', { static: false }) GIStatus: any;
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('inputFile', { static: false }) inputFile: ElementRef;
  @ViewChild('isStatusDate', { static: false }) isStatusDate: any;

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
      RegionCode: '',
      Promotion: '',
      Vendor: '',
      Store: '',
      StoreType: '',
      ClientCode: '',
      Status: '',
      Type: '',
      StorePriority: '',
      IsStatusDate: false
    };

    this.initData();
  }

  initData() {
    this.initTable();

    let region = window.localStorage.getItem('region') || 'none';
    if (region != 'none') {
      this.regionCode = JSON.parse(region)['Code'];
      this.filters['RegionCode'] = this.regionCode;
    }

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

    this.poTypeConfig = {
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

    this.storeConfig = {
      selectedFirst: false,
      isSelectedAll: false,
      isSorting: false,
      val: (option: any) => {
        return option['Code'];

      },
      render: (option: any) => {
        return `${option['Code']} - ${option['Name']}`;
      },
      type: 'autocomplete',
      filter_key: 'Name',
      URL_CODE: 'SFT.storecombo'
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

    this.storePriorityConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      filters: {
        Collection: 'GEO.Stores',
        Column: 'Attributes.Priority'
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

    this.soStatusConfig = {
      selectedFirst: false,
      isSelectedAll: true,
      filters: {
        Collection: 'INV.SO',
        Column: 'Status'
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
    let GIType = [
      { Code: "ALL", Name: 'Tất cả' },
      { Code: "NULL", Name: 'Chưa GI' },
      { Code: "OK", Name: 'GI thành công' },
      { Code: "ERR", Name: 'GI lỗi' }
    ];
    this.GIStatusConfig = {
      selectedFirst: true,
      isSelectedAll: false,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Name'];
      },
      type: 'autocomplete',
      filter_key: 'Name',
      data: GIType
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
          'SOCode',
          'ExternalCode',
          'SiteId',
          // 'WarehouseCode',
          'Priority',
          'SOType',
          'Status',
          'TotalSKU',
          'TotalUnit',
          'TotalPackage',
          'TotalVolume',
          'TotalWeight',
          'CreatedDate',
          'UpdatedDate'
        ],
        options: [
          {
            title: 'STO.SOCode',
            name: 'SOCode',
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/saleorder/details/${data.SOCode}`;
            },
            style: {
              'min-width': '140px',
              'max-width': '140px'
            }
          },
          {
            title: 'STO.ExternalCode',
            name: 'ExternalCode',
            style: {
              'min-width': '120px',
              'max-width': '120px'
            }
          },
          {
            title: 'DCSite',
            name: 'WarehouseSiteName',
            render: (data: any) => {
              return data.WarehouseSiteName ? `${data.WarehouseSiteId} - ${data.WarehouseSiteName}` : data.WarehouseSiteId;
            },
            style: {
              'min-width': '100px',
              'max-width': '300px'
            }
          },
          
          // {
          //   title: 'Report.ConditionType',
          //   name: 'ConditionType',
          //   render: (data: any) => {
          //     return this.translate.instant(`SOStatus.${data.ConditionType}`);
          //   }
          // },
          {
            title: 'store',
            name: 'SiteId',
            render: (data: any) => {
              return  data.SiteName ? `${data.SiteId} - ${data.SiteName}` : data.SiteId;
            },
            style: {
              'min-width': '120px',
              'max-width': '120px'
            }
          },
          {
            title: 'STO.STOStatus',
            name: 'Status',
            render: (data: any) => {
              return this.translate.instant(`SOStatus.${data.Status}`);
            }
          },
          {
            title: 'STO.SOType',
            name: 'SOType',
            render: (row: any) => {
              return row.SOType ? this.translate.instant(`SOType.${row.SOType}`) : "";
            },
            borderStyle: (row: any) => {
              return this.renderSOTypeColor(row);
            }
          },
          {
            title: 'STO.WarehouseCode',
            name: 'WarehouseCode',
            style: {
              'min-width': '80px',
              'max-width': '80px'
            }
          },
          {
            title: 'Report.TotalUnit',
            name: 'TotalUnit',
            render: (data: any) => {
              return Utils.formatNumber(data.TotalUnit)
            }
          },
          {
            title: 'Report.TotalSKU',
            name: 'TotalSKU'
          },
          {
            title: 'Report.ClientCode',
            name: 'ClientCode',
            style: {
              'min-width': '50px',
              'max-width': '50px'
            }
          },
          {
            title: 'Report.TotalPackage',
            name: 'TotalPackage',
            render: (data: any) => {
              return Utils.formatNumber(data.TotalPackage, 1)
            }
          },
          {
            title: 'Report.TotalVolume',
            name: 'TotalVolume',
            render: (data: any) => {
              return Utils.formatNumber(data.TotalVolume, 4)
            },
            style: {
              'min-width': '80px',
              'max-width': '80px'
            }
          },
          {
            title: 'Report.TotalWeight',
            name: 'TotalWeight',
            render: (data: any) => {
              return Utils.formatNumber(data.TotalWeight, 2)
            },
            style: {
              'min-width': '80px',
              'max-width': '80px'
            }
          },
          {
            title: 'STO.SODate',
            name: 'CreatedDate',
            style: {
              'min-width': '90px',
              'max-width': '90px'
            }
          },
          {
            title: 'SODetails.UpdatedDate',
            name: 'UpdatedDate',
            style: {
              'min-width': '90px',
              'max-width': '90px'
            }
          },
          {
            title: 'Priority',
            name: 'Priority',
            style: {
              'min-width': '60px',
              'max-width': '60px'
            },
            borderStyle: (row: any) => {
              return row.Priority == 'VIP' ? { color: '#7bbd7b' } : null;
            }
          }
        ]
      },
      remote: {
        url: this.service.getAPI('getsodetails'),
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

    let region = window.localStorage.getItem('region') || 'none';
    if (region != 'none') {
      this.regionCode = JSON.parse(region)['Code'];
      this.filters['RegionCode'] = JSON.parse(region)['Code'];
    }
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
        // this.compareDate();
      }
    });

    this.toDate['change'].subscribe({
      next: (value: any) => {
        // this.compareDate();
      }
    });
    this.client['change'].subscribe({
      next: (value: any) => {
        this.filters['ClientCode'] = value && value.Code ? value.Code : '';
        this.reloadWarehouseBranch(value);
      }
    });

    this.status['change'].subscribe({
      next: (value: any) => {
        this.filters['Status'] = value && value.length ? value : "";
      }
    });
    this.store['change'].subscribe({
      next: (value: any) => {
        this.filters['Store'] = value ? [value.Code] : '';
      }
    });
    this.potype['change'].subscribe({
      next: (value: any) => {
        this.filters['ConditionType'] = value ? [value.Code] : '';
      }
    });
    this.dcsite['change'].subscribe({
      next: (value: any) => {
        this.filters['WarehouseSiteId'] = value ? value.Code : '';
      }
    });
    this.GIStatus['change'].subscribe({
      next: (value: any) => {
        if(value && value.Code == "ALL" && this.filters['GIStatus']) {
            delete this.filters['GIStatus']
        } else {
          this.filters['GIStatus'] = value && value.Code ? value.Code : '';
        }
      }
    });
    this.storetype['change'].subscribe({
      next: (value: any) => {
        this.filters['StoreType'] = value && value.Code ? value.Code : '';
      }
    });

    this.storepriority['change'].subscribe({
      next: (value: any) => {
        this.filters['StorePriority'] = value && value.Code ? value.Code : '';
      }
    });
  }
  
  onEnter(event: any) {
    let code = event.target['value'];
    this.filters['Content'] = code;
    this.search(null);
  }

  search(event: any) {
    this.compareDate();
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
    let filters = Object.assign({}, this.filters);
    if (filters['Status']) {
      filters['Status'] = JSON.stringify(filters['Status']);
    }
    return this.service.exportSODetailList(filters);
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
