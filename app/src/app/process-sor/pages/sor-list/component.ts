import { STATUS_BORDER_MASANSTORE } from '../../../shared/constant';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Service } from '../../service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../shared/toast.service';
// import { NotificationComponent } from '../../../components/notification/notification.component';
import * as moment from 'moment';

@Component({
  selector: 'app-list-sor',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})

export class ListSORComponent implements OnInit, AfterViewInit {

  @ViewChild('fromDate', { static: false }) fromDate: any;
  @ViewChild('toDate', { static: false }) toDate: any;
  @ViewChild('inputContent', { static: false }) inputContent: ElementRef;
  @ViewChild('cbbStatus', { static: false }) cbbStatus: any;
  @ViewChild('ccbType', { static: false }) ccbType: any;
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('cbbClient', { static: false }) cbbClient: any;
  @ViewChild('cbbWHBranch', { static: false }) cbbWHBranch: any;
  @ViewChild('ccbStore', { static: false }) ccbStore: any;

  tableConfig: any;
  statusConfig: Object;
  clientConfig: Object;
  warehouseBrachConfig: any;
  typeConfig: Object;
  regionCode: string;
  wareHouseList: any = [];
  configDate: any;
  storeConfig: Object;
  filters: Object;


  constructor(
    private translate: TranslateService,
    private toast: ToastService,
    private service: Service,
    public dialog: MatDialog,
    private router: Router) { }

  ngOnInit() {
    this.filters = {
      Content: '',
      WarehouseCode: window.localStorage.getItem('_warehouse') || window.getRootPath().toUpperCase(),
      WarehouseSiteId: '',
      FromDate: moment().subtract(7, 'day').format('YYYY-MM-DD'),
      ToDate: moment().format('YYYY-MM-DD'),
      RegionCode: '',
      ClientCode: '',
      Status: '',
      Type: '',
      SiteId:''
    };
    this.initTable();
    this.initData();
  }

  initData() {
    let region = window.localStorage.getItem('region') || 'none';
    if (region != 'none') {
      this.regionCode = JSON.parse(region)['Code'];
      this.filters['RegionCode'] = this.regionCode;
    }

    this.clientConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      isSorting: false,
      isSelectedAllValueIsEmpty: true,
      filters: { sort: 1 },
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return this.renderValueCombo(option);
      },
      type: 'combo',
      filter_key: 'Name',
      URL_CODE: 'SFT.clientcombo'
    };
    this.warehouseBrachConfig = {
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
      type: 'combo',
      filter_key: 'Name',
      filters: {
        data: this.filters['WarehouseCode']
      },
      URL_CODE: 'SFT.branchscombo'
    };

    this.typeConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      isSelectedAllValueIsEmpty: true,
      filters: {
        Collection: 'INV.SOReturns',
        Column: 'Type'
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

    this.statusConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      isSelectedAllValueIsEmpty: true,
      filters: {
        Collection: 'INV.SOReturns',
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

    this.storeConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      disableAutoload: true,
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
    };
  }

  initTable() {
    this.tableConfig = {
      style: {
        'overflow-x': 'hidden'
      },
      enableFirstLoad: false,
      columns: {
        isContextMenu: false,
        displayedColumns: [
          'index',
          'ClientCode',
          'WarehouseSite',
          'SORCode',
          'Status',
          "SOCode",
          'SOExternalCode',
          'Site',
          'Type',
          'CreatedDate',
          "Note"
        ],
        options: [
          {
            title: 'client',
            name: 'ClientCode',
            style: {
              'min-width': '60px',
              'max-width': '60px'
            }
          },
          {
            title: 'SOReturns.BranchWH',
            name: 'WarehouseSite',
            style: {
              'min-width': '140px',
              'max-width': '140px'
            }
          },
          {
            title: 'SOReturns.SORCode',
            name: 'SORCode',
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/sor/details/${data.SORCode}`;
            },
            style: {
              'min-width': '140px',
              'max-width': '140px'
            }
          },
          {
            title: 'SOReturns.Status',
            name: 'Status',
            render: (data: any) => {
              return this.translate.instant(`SOReturns.Status_${data.Status}`);
            },
            style: {
              'min-width': '60px',
              'max-width': '80px'
            }
          },
          {
            title: 'SOReturns.SOCode',
            name: 'SOCode',
            style: {
              'min-width': '150px',
              'max-width': '150px'
            }
          },
          {
            title: 'SOReturns.SOExternalCode',
            name: 'SOExternalCode',
          },
          {
            title: 'SOReturns.Store',
            name: 'Site',
            render: (data: any) => {
              return data.SiteName ? `${data.SiteId} - ${data.SiteName}` : `${data.SiteId}`;
            }
          },
          {
            title: 'SOReturns.Type',
            name: 'Type',
            render: (data: any) => {
              return this.translate.instant(`SOReturns.${data.Type}`);
            }
          },
          {
            title: 'SOReturns.CreatedDate',
            name: 'CreatedDate',
            style: {
              'min-width': '100px',
              'max-width': '100px'
            }
          },
          {
            title: 'SOReturns.Note',
            name: 'Note'
          }
        ]
      },
      remote: {
        url: this.service.getAPI("list")
      }
    };
  }

  borderColorByStatus(status: string) {
    if (status != "") {
      return {
        'color': STATUS_BORDER_MASANSTORE[status],
        'border': `2px solid ${STATUS_BORDER_MASANSTORE[status]}`,
        'border-radius': '2px',
        'padding': '5px 10px',
        'font-weight': '500'
      };
    }
    return "";
  }

  ngAfterViewInit() {
    this.initEvent();
    const sevenDayBefore = moment().subtract(7, 'day').toDate();
    this.fromDate.setValue(sevenDayBefore);

    // let region = window.localStorage.getItem('region') || 'none';
    // if (region != 'none') {
    //   this.regionCode = JSON.parse(region)['Code'];
    //   this.filters['RegionCode'] = JSON.parse(region)['Code'];
    // }
    // this.search();
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
    this.cbbClient['change'].subscribe({
      next: (value: any) => {
        this.filters['ClientCode'] = this.renderValue(value);
        if (this.cbbWHBranch) {
          if (value.Code) {
            this.cbbWHBranch['reload']({ ClientCode: this.filters['ClientCode'], data: this.filters['WarehouseCode'] });
          } else {
            this.cbbWHBranch['clear'](false, true);
            this.cbbWHBranch['setDefaultValue'](this.translate.instant('combo.all'));
          }
        }
        if (this.ccbStore) {
          // if (value.Code) {
            this.ccbStore['reload']({ ClientCode: this.filters['ClientCode'] });
          // } else {
          //   this.ccbStore['clear'](false, true);
          //   this.ccbStore['setDefaultValue'](this.translate.instant('combo.all'));
          // }
        }
      }
    });
    this.cbbWHBranch['change'].subscribe({
      next: (data: any) => {
        if (data) {
          if (this.filters['WarehouseCode']) {
            this.filters['WarehouseSiteId'] = data.Code || '';
            this.search();
          }
        }
      }
    });
    this.cbbStatus['change'].subscribe({
      next: (value: any) => {
        this.filters['Status'] = this.renderValue(value);
      }
    });
    this.ccbType['change'].subscribe({
      next: (value: any) => {
        this.filters['Type'] = this.renderValue(value);
      }
    });

    this.ccbStore['change'].subscribe({
      next: (value: any) => {
        this.filters['SiteId'] = this.renderValue(value);
      }
    });
  }


  onEnter(event: any) {
    const code = event.target['value'];
    if (code) {
      this.filters['Content'] = code;
      this.search();
    } else {
      this.toast.warning("warning_message", "warning_title");
      this.inputContent.nativeElement.focus();
    }
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

    this.appTable['search'](this.filters);
  }
  exportExcel() {
    return this.service.exportSORList(this.filters);
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
    }
  }

  private renderValueCombo(option: any) {
    return option['Code'] ? `${option['Code']} - ${option['Name']}` : option['Name'];
  }

  private renderValue(value: any, isName = false) {
    return value ? isName ? value.Name : value.Code : '';
  }
}
