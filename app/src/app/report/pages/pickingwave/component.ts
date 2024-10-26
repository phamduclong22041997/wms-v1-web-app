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
  selector: 'app-pickingwave-list',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class PickingwaveListComponent implements OnInit, AfterViewInit {
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('fromDate', { static: false }) fromDate: any;
  @ViewChild('toDate', { static: false }) toDate: any;
  @ViewChild('status', { static: false }) statusCombo: ElementRef;
  @ViewChild('content', { static: false }) contentInput: ElementRef;

  dataSourceGrid = {
    rows: <any>[],
    total: 0
  };

  waveStatusConfig: Object;
  tableConfig: any;
  configDate: any;
  statusConfig: any;
  filters: any = {
    FromDate: "",
    ToDate: "",
    Content: "",
    Status: ""
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
  createPickingwave(){
    window.open(`/${window.getRootPath()}/saleorder/create-auto-pickpack`, '_blank');
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
    this.waveStatusConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      filters: {
        Collection: 'INV.PickWaves',
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
  }

  initTable() {
    this.tableConfig = {
      disablePagination: false,
      columns: {
        isContextMenu: false,
        displayedColumns: [
          'index',  'Code', 'Status', 'TotalSO',
          'PickQty', 'PickedQty',
          'CreatedDate', 'CreatedBy', 'UpdatedDate', "UpdatedBy"
        ],
        options: [
          {
            title: 'Pickingwave.Code',
            name: 'Code',
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/saleorder/pw-detail/${data.Code}`;
            }
          },
          {
            title: 'Pickingwave.Type',
            name: 'Type'
          },
          {
            title: 'Pickingwave.Status',
            name: 'Status',
            render: (data: any) => {
              return this.translate.instant(`PickListStatus.${data.Status}`);
            }
          },
          {
            title: 'Pickingwave.TotalSO',
            name: 'TotalSO',
            render: (data: any) => {
              return `${data.SOList.length}`;
            },
            style: {
              'min-width': '70px',
              'max-width': '70px'
            }
          },
          {
            title: 'Pickingwave.TotalPick',
            name: 'PickQty',
            style: {
              'min-width': '90px',
              'max-width': '90px'
            }
          },
          {
            title: 'Pickingwave.TotalPicked',
            name: 'PickedQty',
            style: {
              'min-width': '90px',
              'max-width': '90px'
            }
          },
          {
            title: 'Pickingwave.CreatedDate',
            name: 'CreatedDate'
          },
          {
            title: 'Pickingwave.CreatedBy',
            name: 'CreatedBy'
          },
          {
            title: 'Pickingwave.UpdatedDate',
            name: 'UpdatedDate'
          },
          {
            title: 'Pickingwave.UpdatedBy',
            name: 'UpdatedBy'
          }
        ]
      },
      remote: {
        url: this.service.getAPI('getPickwaveList'),
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
