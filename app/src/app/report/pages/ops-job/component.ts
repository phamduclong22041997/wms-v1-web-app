import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
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
  selector: 'app-list-ops-job',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})

export class OpsJobComponent implements OnInit, AfterViewInit {
  filters: Object;
  pda: Object;
  tabIndexActive: string;
  jobConfig: Object;
  jobData: any[];
  jobPendingConfig: Object;
  jobPendingData: any[];
  configDate: any;
  statusConfig: Object;

  @ViewChild('jobTable', { static: false }) jobTable: ElementRef;
  @ViewChild('fromDate', { static: false }) fromDate: any;
  @ViewChild('toDate', { static: false }) toDate: any;
  @ViewChild('status', { static: false }) statusCombo: ElementRef;

  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private toast: ToastService,
    private service: Service,
    public dialog: MatDialog,
    private router: Router) { 
      const fragment: string = route.snapshot.fragment;
      switch (fragment) {
        case "pda":
          this.tabIndexActive = "2";
          break;
        case "pending":
          this.tabIndexActive = "1";
          break;
        default:
          this.tabIndexActive = "0";
          break;
      }
    }

  ngOnInit() {
    this.jobData = [];
    this.jobPendingData = [];

    this.pda = {
      Employee: '',
      WarehouseCode: window.localStorage.getItem('_warehouse')
    }
    this.filters = {
      Employee: '',
      WarehouseCode: window.localStorage.getItem('_warehouse'),
      FromDate: moment().subtract(7, 'day').format('YYYY-MM-DD'),
      ToDate: moment().format('YYYY-MM-DD')
    };

    this.initData();
  }

  initData() {
    this.initTable();
    this.initCombo();
  }
  initCombo() {
    this.statusConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      isSorting: false,
      isSelectedAllValueIsEmpty: true,
      filters: {
        Collection: 'WH.OpsJobs',
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
    this.jobConfig = {
      columns: {
        isContextMenu: false,
        displayedColumns: [
          'index',
          'WarehouseSiteId',
          'Employee',
          'StartTime',
          'EndTime',
          'Status',
          'Type',
          'ObjectCode',
          'RefCode'
        ],
        options: [
          {
            title: 'Report.ClientCode',
            name: 'ClientCode',
            style: {
              'min-width': '70px',
              'max-width': '70px'
            }
          },
          {
            title: 'SODetails.WarehouseSiteId',
            name: 'WarehouseSiteId',
            style: {
              'min-width': '100px',
              'max-width': '100px'
            },
            render: (data: any) => {
              return `${data.WarehouseCode} - ${data.WarehouseSiteId}`;
            }
          },
          {
            title: 'TaskProcess.EmployeeCode',
            name: 'Employee',
            style: {
              'min-width': '200px',
              'max-width': '200px'
            }
          },
          {
            title: 'FinishPo.StartTime',
            name: 'StartTime',
            style: {
              'min-width': '140px',
              'max-width': '140px'
            }
          },
          {
            title: 'FinishPo.EndTime',
            name: 'EndTime',
            style: {
              'min-width': '140px',
              'max-width': '140px'
            }
          },
          {
            title: 'Report.Status',
            name: 'Status',
            style: {
              'min-width': '160px',
              'max-width': '160px'
            }
          },
          {
            title: 'FinishPo.JobType',
            name: 'Type',
            style: {
              'min-width': '200px',
              'max-width': '200px'
            }
          },
          {
            title: 'Report.AutoProcess.DocumentObject',
            name: 'ObjectCode',
            style: {
              'min-width': '120px',
              'max-width': '120px'
            },
            link: true,
            newpage: true,
            onClick: (data: any) => {
              if (data.ObjectType == "SOPickList") {
                return `/${window.getRootPath()}/saleorder/auto-pickpack/${data.ObjectCode}`;
              }
              else if (data.ObjectType == 'SO') {
                return `/${window.getRootPath()}/saleorder/details/${data.ObjectCode}`;
              }
              return '#';
            }
          },
          {
            title: 'Mã Code',
            name: 'RefCode',
            style: {
              'min-width': '160px',
              'max-width': '160px'
            },
            link: true,
            newpage: true,
            onClick: (data: any) => {
              if (data.ObjectType == "SOPickList") {
                return `/${window.getRootPath()}/saleorder/details/${data.RefCode}`;
              }
              return '#';
            }
          }
        ]
      },
      remote: {
        url: this.service.getAPI('getOpsJob'),
        params: this.filters
      }
    };
  }
  
  ngAfterViewInit() {
    this.initEvent();
    const sevenDayBefore = moment().subtract(7, 'day').toDate();
    this.fromDate.setValue(sevenDayBefore);
  }
  
  initEvent() {
    this.fromDate['change'].subscribe({
      next: (value: any) => {
        this.compareDate()
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
  onEnter(event: any) {
    let value = event.target['value'];
    this.filters['Employee'] = value;
    this.jobTable['search'](this.filters);
  }
  onChange(event: any){
    let val = event.target['value'];
    this.filters['Employee'] = val;
  }
  onTabClick(event: any) {
    this.selectTab(event.index);
  }
  selectTab(index: any) {
    switch (index) {
      case 1:
        
        break;

      default:
        if (!this.jobData.length) {
          this.jobTable['search'](this.filters);
        }
        break;
    }
  }

  findJob(event: any) {
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
    this.jobTable['search'](this.filters);
  }

  removeAccessToken(event: any) {
    let employee = this.pda['Employee'];
    let warehouseCode = this.pda['WarehouseCode'];
    this.service.removeAccessToken({ UserCode: employee, WarehouseCode: warehouseCode })
      .subscribe((resp: any) => {
        if (resp.Data && resp.Status) {
          this.toast.success(`Huỷ phiên làm việc PDA của tài khoản [${employee}] thành công`, 'success_title');
        }
        else {
          this.toast.error(`Huỷ phiên làm việc PDA của tài khoản [${employee}] không thành công`, 'error_title');
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
      let days = -30;
      if(formatCreatedFromDate.getTime() < Utils.addDays(formatCreatedToDate, days).getTime()){
        this.toast.error('invalid_limit_date_range', 'error_title');
        this.fromDate.setValue(Utils.addDays(formatCreatedToDate, days));
      }
    }
  }
}
