import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../../shared/toast.service';
import { Service } from '../../service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Utils } from "../../../shared/utils";

interface TableAction {
  name: string,
  icon: string;
  class?: string;
  toolTip?: any;
  actionName?: any;
  disabledCondition?: any;
}

@Component({
  selector: 'app-autoassign-list',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class AssignPickListAutoListComponent implements OnInit, AfterViewInit {
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('fromDate', { static: false }) fromDate: any;
  @ViewChild('toDate', { static: false }) toDate: any;
  @ViewChild('content', { static: false }) contentInput: ElementRef;
  dataSourceGrid = {
    rows: <any>[],
    total: 0
  };

  tableConfig: any;
  configDate: any;
  filters: any = {
    FromDate: "",
    ToDate: "",
    Content: ""
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
    let text = event.target['value'];
    this.filters['Content'] = Utils.formatFilterContent(text);
    this.search(event);
  }
  search(event: any) {
    this.appTable['search'](this.getFilter());
  }
  exportExcel(data: any = {}) {
    return this.service.exportAutoAssignPicklist(this.getFilter());
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

  initTable() {
    this.tableConfig = {
      disablePagination: false,
      columns: {
        isContextMenu: false,
        displayedColumns: [
          'index', 'ClientCode', 'Employee', 'PicklistCode', 'Status', 'AssignBy', 'AssignDate',
          'SOCode', 'TotalQty', 'CountSKU', 'GatheredPoints'
        ],
        options: [
          {
            title: 'client',
            name: 'ClientCode',
            style: {
              'min-width': '90px',
              'max-width': '120px'
            }
          },
          {
            title: 'AssignPickList.Employee',
            name: 'Employee',
            style: {
              'min-width': '160px'
            },
          },
          {
            title: 'AutoPickPack.PickListCode',
            name: 'PicklistCode',
            style: {
              'min-width': '120px'
            },
          },
          {
            title: 'Report.AutoProcess.ProcessBy',
            name: 'AssignBy',
            style: {
              'min-width': '160px'
            },
          },
          {
            title: 'Report.AutoProcess.ProcessDate',
            name: 'AssignDate',
            style: {
              'min-width': '120px'
            },
          },
          {
            title: 'AutoPickPack.PackedLocationPoint',
            name: 'GatheredPoints',
            render: (row: any, options: any) => {
              let txt = [];
              for (let item of (row.GatheredPoints || [])) {
                txt.push(item);
              }
              return txt.join(", ");
            }
          },
          {
            title: 'AutoPickPack.Status',
            name: 'Status',
            render: (row: any, options: any) => {
              return this.translate.instant(`PickListStatus.${row.Status}`);
            },
          },
          {
            title: 'AutoPickPack.SOCode',
            name: 'SOCode',
            style: {
              'min-width': '140px'
            },
            link: true,
            newpage: true,
            render: (row: any, options: any) => {
              let txt = [];
              for (let item of (row.SOCode || [])) {
                txt.push(item);
              }
              return txt[0];
            },
            onClick: (data: any) => {
              return `/${window.getRootPath()}/saleorder/details/${data.SOCode}`;
            }
          },
          {
            title: 'AutoPickPack.Qty',
            name: 'TotalQty',
            style: {
              'min-width': '80px',
              'max-width': '80px'
            },
          },
          {
            title: 'SOReturns.TotalSKU',
            name: 'CountSKU',
            style: {
              'min-width': '80px',
              'max-width': '80px'
            },
          },
        ]
      },
      remote: {
        url: this.service.getAPI('getAutoAssignPicklist'),
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
  autoAssignEmployee() {
    this.router.navigate([`/${window.getRootPath(true)}/saleorder/assign-picklist-auto`]);
  }
}
