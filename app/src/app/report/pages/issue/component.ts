import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../../shared/toast.service';
import { Service } from '../../service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

interface TableAction {
  name: string,
  icon: string;
  class?: string;
  toolTip?: any;
  actionName?: any;
  disabledCondition?: any;
}

@Component({
  selector: 'app-issue-list',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class IssueListComponent implements OnInit, AfterViewInit {
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('fromDate', { static: false }) fromDate: any;
  @ViewChild('toDate', { static: false }) toDate: any;
  @ViewChild('issueStatus', { static: false }) statusCombo: ElementRef;
  @ViewChild('issueType', { static: false }) issueType: ElementRef;
  @ViewChild('content', { static: false }) contentInput: ElementRef;
  @ViewChild('client', { static: false }) client: ElementRef;
  dataSourceGrid = {
    rows: <any>[],
    total: 0
  };

  issueStatusConfig: Object;
  issueTypeConfig: Object;
  clientConfig: Object;
  tableConfig: any;
  configDate: any;
  statusConfig: any;
  filters: any = {
    WarehouseCode: '',
    FromDate: "",
    ToDate: "",
    Content: "",
    Status: "",
    IssueType: "",
    ClientCode: ""
  };
  
  constructor(
    public dialog: MatDialog,
    private service: Service,
    private router: Router,
    private translate: TranslateService,
    private toast: ToastService) {
      
    }

  ngOnInit() {
    this.filters['FromDate'] = moment().subtract(7, 'day').format('YYYY-MM-DD');
    this.filters['ToDate'] = moment().format('YYYY-MM-DD');
    this.filters['WarehouseCode'] = window.localStorage.getItem('_warehouse');
    
    this.initTable();
    this.initCombo();
  }

  ngAfterViewInit() {
    this.initEvent();
    const sevenDayBefore = moment().subtract(7, 'day').toDate();
    this.fromDate.setValue(sevenDayBefore);

    setTimeout(() => {
      if (this.contentInput) {
        this.contentInput.nativeElement.focus();
      }
    }, 300)
  }

  onEnter(event: any) {
    this.search(event);
  }
  search(event: any) {
    this.appTable['search'](this.getFilter());
  }
  exportExcel(data: any = {}) {
    return this.service.exportIssue(this.getFilter());
  }
  getFilter() {
    let _filters = this.filters;
    const fromDate = this.fromDate.getValue();
    if (fromDate) {
      _filters['FromDate'] = moment(fromDate).format('YYYY-MM-DD');
    }
    const toDate = this.toDate.getValue();
    if (toDate) {
      _filters['ToDate'] = moment(toDate).format('YYYY-MM-DD');
    }

    return _filters;
  }

  initCombo() {
    this.issueStatusConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      filters: {
        Collection: 'INV.Issues',
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
    this.issueTypeConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      filters: {
        Collection: 'INV.Issues',
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
  }

  initTable() {
    this.tableConfig = {
      disablePagination: false,
      columns: {
        isContextMenu: false,
        displayedColumns: [
          'index',  'Code', 'Type', 'ClientCode', 'SKU', 'SKUName', 
          'Status', 'Qty', 'Uom', 'ExpiredDate', 
          //'MappingQty', 'ProcessedQty', 'RemainingQty',
          'LocationLabel', 'SubLocLabel', 'IssueLocationLabel', 'IssueSubLocLabel', 'CreatedDate', 'RefEmployee'
        ],
        options: [
          {
            title: 'Report.IssueCode',
            name: 'Code',
            link: true,
            newpage: true,
            onClick: (data: any) => {
              let issueType = data.Type === 'Found' ? 'found-detail' : 'lost-detail';
              return `/${window.getRootPath()}/lost-found/${issueType}/${data.Code}`;
            },
            style: {
              'min-width': '120px',
              'max-width': '120px'
            }
          },
          {
            title: 'Report.IssueType',
            name: 'Type',
            render: (data: any) => {
              return this.translate.instant(`IssueType.${data.IssueType}`);
            },
            style: {
              'min-width': '120px',
              'max-width': '120px'
            }
          },
          {
            title: 'client',
            name: 'ClientCode',
            style: {
              'min-width': '50px',
              'max-width': '50px'
            },
          },
          {
            title: 'SKU',
            name: 'SKU',
            style: {
              'min-width': '80px',
              'max-width': '80px'
            },
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/product/${data.ClientCode}/${data.WarehouseSiteId}/${data.SKU}`;
            }
          },
          {
            title: 'Report.ProductName',
            name: 'SKUName',
            style: {
              'min-width': '90px',
              'max-width': '350px'
            }
          },
          {
            title: 'Barcode',
            name: 'Barcode'
          },
          {
            title: 'Report.Status',
            name: 'Status',
            render: (data: any) => {
              return this.translate.instant(`LostFoundStatus.${data.Status}`);
            },
            style: {
              'min-width': '70px',
              'max-width': '70px'
            }
          },
          {
            title: 'Report.Qty',
            name: 'Qty',
            style: {
              'min-width': '50px',
              'max-width': '50px'
            }
          },
          {
            title: 'Report.Uom',
            name: 'Uom',
            style: {
              'min-width': '50px',
              'max-width': '50px'
            }
          },
          {
            title: 'Report.ExpiredDate',
            name: 'ExpiredDate',
            style: {
              'min-width': '80px',
              'max-width': '80px'
            }
          },
          {
            title: 'Report.MappingQty',
            name: 'MappingQty',
            style: {
              'min-width': '70px',
              'max-width': '70px'
            }
          },
          {
            title: 'Report.ProcessedQty',
            name: 'ProcessedQty',
            style: {
              'min-width': '70px',
              'max-width': '70px'
            }
          },
          {
            title: 'Report.RemainingQty',
            name: 'RemainingQty',
            style: {
              'min-width': '70px',
              'max-width': '70px'
            }
          },
          {
            title: 'Report.Location',
            name: 'LocationLabel',
            style: {
              'min-width': '70px',
              'max-width': '70px'
            },
            link: true,
            newpage: true,
            onClick: (data: any) => {
              if(data.LocationType == 'Bin'){
                return `/${window.getRootPath()}/bin/${data.LocationLabel}`;
              }
              else if(data.LocationType == 'Point'){
                return `/${window.getRootPath()}/point/${data.LocationLabel}`;
              }
              else {
                return data.IssueLocationLabel
              }
            }
          },
          {
            title: 'Report.TransportCode',
            name: 'SubLocLabel',
            style: {
              'min-width': '100px',
              'max-width': '100px'
            },
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/transport-device/${data.IssueSubLocLabel}`;
            }
          },
          {
            title: 'Report.IssueLocationLabel',
            name: 'IssueLocationLabel',
            style: {
              'min-width': '90px',
              'max-width': '90px'
            },
            link: true,
            newpage: true,
            onClick: (data: any) => {
              if(data.IssueLocationType == 'Bin'){
                return `/${window.getRootPath()}/bin/${data.IssueLocationLabel}`;
              }
              else if(data.IssueLocationType == 'Point'){
                return `/${window.getRootPath()}/point/${data.IssueLocationLabel}`;
              }
              else {
                return data.IssueLocationLabel
              }
            }
          },
          {
            title: 'Report.IssueSubLocLabel',
            name: 'IssueSubLocLabel',
            style: {
              'min-width': '100px',
              'max-width': '100px'
            },
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/transport-device/${data.IssueSubLocLabel}`;
            }
          },
          {
            title: 'Pickingwave.CreatedDate',
            name: 'CreatedDate',
            style: {
              'min-width': '80px',
              'max-width': '80px'
            }
          },
          {
            title: 'GoodAssign.Employee',
            name: 'RefEmployee',
            style: {
              'min-width': '100px',
              'max-width': '100px'
            }
          }
        ]
      },
      remote: {
        url: this.service.getAPI('getIssue'),
        params: this.filters
      }
    };

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

    this.statusCombo['change'].subscribe({
      next: (value: any) => {
        this.filters['Status'] = value && value.Code ? value.Code : '';
      }
    });

    this.issueType['change'].subscribe({
      next: (value: any) => {
        this.filters['IssueType'] = value && value.Code ? value.Code : '';
      }
    });
    this.client['change'].subscribe({
      next: (value: any) => {
        this.filters['ClientCode'] = value && value.Code ? value.Code : '';
      }
    });
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
}
