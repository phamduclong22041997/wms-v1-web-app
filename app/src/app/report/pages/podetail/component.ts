import { STATUS_BORDER_MASANSTORE, PO_STATUS, PO_SOURCE, PO_CONDITIONTYPE } from '../../../shared/constant';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Service } from '../../service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../shared/toast.service';
import * as moment from 'moment';
import { Utils } from '../../../shared/utils';

@Component({
  selector: 'app-list-po',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})

export class PODetailComponent implements OnInit, AfterViewInit {
  tableConfig: any;
  statusConfig: Object;
  filters: Object;
  regionCode: string;
  configDate: any;
  wareHouseList: any = [];
  poStatusConfig: Object;
  poTypeConfig: Object;
  clientConfig: Object;
  promotionConfig: Object;
  vendorConfig: Object;
  warehouseSiteConfig: Object;
  GRStatusConfig : Object;

  @ViewChild('Content', { static: false }) contentInput: ElementRef;
  @ViewChild('fromDate', { static: false }) fromDate: any;
  @ViewChild('toDate', { static: false }) toDate: any;
  @ViewChild('status', { static: false }) status: any;
  @ViewChild('content', { static: false }) content: any;
  @ViewChild('potype', { static: false }) potype: any;
  @ViewChild('client', { static: false }) client: any;
  @ViewChild('vendor', { static: false }) vendor: any;
  @ViewChild('dcsite', { static: false }) dcsite: any;
  @ViewChild('GRStatus', { static: false }) GRStatus: any;
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
      WhCode: [],
      FromDate: moment().subtract(7, 'day').format('YYYY-MM-DD'),
      ToDate: moment().format('YYYY-MM-DD'),
      RegionCode: '',
      Promotion: '',
      Vendor: '',
      ClientCode: '',
      Status: '',
      Type: '',
      IsStatusDate: false
    };

    this.initData();
  }

  onEnter(event: any) {
    let code = event.target['value'];
    this.filters['Content'] = code;
    this.search(null);
  }
  onChange(event: any){
    let code = event.target['value'];
    this.filters['Content'] = code;
  }
  initData() {
    this.initTable();

    let region = window.localStorage.getItem('region') || 'none';
    if (region != 'none') {
      this.regionCode = JSON.parse(region)['Code'];
      this.filters['RegionCode'] = this.regionCode;
    }

    this.filters['WhCode'] = window.localStorage.getItem('_warehouse') || 'CCH';

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
        { Code: "Standard", Name: "Nhập hàng từ NCC" }
      ]
    };

    this.vendorConfig = {
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
      filter_key: 'Code',
      URL_CODE: 'SFT.vendorcombo'
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
      data: []
    }

    let poStatus = [
      { Code: PO_STATUS.New, Name: 'Mới' },
      { Code: PO_STATUS.Processing, Name: 'Đang xử lý' },
      { Code: PO_STATUS.Finished, Name: 'Hoàn thành' },
      { Code: PO_STATUS.Canceled, Name: 'Đã hủy' }
    ];
    this.poStatusConfig = {
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
      data: poStatus
    };
    let GRType = [
      { Code: "ALL", Name: 'Tất cả' },
      { Code: "NULL", Name: 'Chưa GR' },
      { Code: "OK", Name: 'GR thành công' },
      { Code: "ERR", Name: 'GR lỗi' }
    ];
    this.GRStatusConfig = {
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
      data: GRType
    }
  }

  initTable() {
    this.tableConfig = {
      style: {
        'overflow-x': 'hidden'
      },
      columns: {
        isContextMenu: false,
        displayedColumns: [
          'index',
          'WarehouseSiteName',
          'POCode',
          'ExternalCode',
          'Source',
          'VendorId',
          "PoStatus",
          'POType',
          'PODate',
          'TotalSKU',
          'TotalQty',
          'TotalReceiveSKU',
          'TotalReceiveQty',
          'FinishedDate',
          //'Promotion',
          //'Note'
        ],
        options: [
          {
            title: 'DCSite',
            name: 'WarehouseSiteName',
          },
          {
            title: 'FinishPo.PoCode',
            name: 'POCode',
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/purchaseorder/details/${data.POCode}`;
            },
            style: {
              'min-width': '160px',
              'max-width': '160px'
            }
          },
          {
            title: 'FinishPo.ExternalCode',
            name: 'ExternalCode',
          },
          {
            title: 'FinishPo.CreatedDate',
            name: 'PODate',
          },
          {
            title: 'FinishPo.VendorName',
            name: 'VendorId',
            style: {
              'min-width': '90px',
              'max-width': '90px'
            }
          },
          {
            title: 'FinishPo.FinishedDate',
            name: 'FinishedDate',
            style: {
              'min-width': '90px',
              'max-width': '90px'
            }
          },
          {
            title: 'FinishPo.POType',
            name: 'POType',
            render: (data: any) => {
              return this.translate.instant(`POType.${data.POType}`);
            }
          },
          {
            title: 'FinishPo.Status',
            name: 'PoStatus',
            render: (data: any) => {
              return this.translate.instant(`POStatus.${data.Status}`);
            }
          },
          {
            title: 'FinishPo.PromotionCode',
            name: 'Promotion'
          },
          {
            title: 'FinishPo.Note',
            name: 'Note'
          },
          {
            title: 'FinishPo.Source',
            name: 'Source',
            style: {
              'min-width': '60px',
              'max-width': '60px'
            }
          },
          {
            title: 'FinishPo.TotalQty',
            name: 'TotalQty',
            style: {
              'min-width': '90px',
              'max-width': '90px'
            },
            render: (data: any) => {
              return Utils.formatNumber(data.TotalQty);
            }
          },
          {
            title: 'FinishPo.TotalSKU',
            name: 'TotalSKU',
            style: {
              'min-width': '70px',
              'max-width': '70px'
            }
          },
          {
            title: 'FinishPo.TotalReceiveQty',
            name: 'TotalReceiveQty',
            style: {
              'min-width': '80px',
              'max-width': '80px'
            },
            render: (data: any) => {
              return Utils.formatNumber(data.TotalReceiveQty);
            }
          },
          {
            title: 'FinishPo.TotalReceiveSKU',
            name: 'TotalReceiveSKU',
            style: {
              'min-width': '80px',
              'max-width': '80px'
            }
          }
        ]
      },
      remote: {
        url: this.service.getAPI('getPODetailList'),
        params: this.filters
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

    setTimeout(() => {
      if(this.contentInput) this.contentInput.nativeElement.focus();
    }, 200)

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
        // this.compareDate()
      }
    });

    this.toDate['change'].subscribe({
      next: (value: any) => {
        // this.compareDate();
      }
    });

    this.status['change'].subscribe({
      next: (value: any) => {
        this.filters['Status'] = value ? [value.Code] : '';
      }
    });
    this.client['change'].subscribe({
      next: (value: any) => {
        this.filters['ClientCode'] = value && value.Code ? value.Code : '';
        this.reloadWarehouseBranch(value);
      }
    });
    this.potype['change'].subscribe({
      next: (value: any) => {
        this.filters['Type'] = value ? [value.Code] : '';
      }
    });
    this.vendor['change'].subscribe({
      next: (value: any) => {
        this.filters['Vendor'] = value ? [value.Code] : '';
      }
    });
    this.dcsite['change'].subscribe({
      next: (value: any) => {
        this.filters['WarehouseSiteId'] = value ? value.Code : '';
      }
    });
    this.GRStatus['change'].subscribe({
      next: (value: any) => {
        if(value && value.Code == "ALL" && this.filters['GRStatus']) {
            delete this.filters['GRStatus']
        } else {
          this.filters['GRStatus'] = value ? value.Code : '';
        }
      }
    });
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

  exportExcel(data: any = {}) {
    return this.service.exportPODetailList(this.filters);
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
