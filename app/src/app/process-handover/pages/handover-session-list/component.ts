import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../../shared/toast.service';
import { Service } from '../../service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmExportComponent } from '../../confirm/component';
// import { PointsComponent } from './../../points/component';
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
  selector: 'app-so-auto-pickpack-list',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class HandoverListComponent implements OnInit {
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('fromDate', { static: false }) fromDate: any;
  @ViewChild('toDate', { static: false }) toDate: any;

  dataSourceGrid = {
    rows: <any>[],
    total: 0
  };

  tableConfig: any;
  configDate: any;
  provinceConfig: any;
  service3PLConfig: any;
  soTypeConfig: any;
  allowCreatePickList: boolean;
  filters: any = {
    FromDate: "",
    ToDate: "",
    Content: ""
  }

  constructor(
    public dialog: MatDialog,
    private service: Service,
    private router: Router,
    private translate: TranslateService,
    private toast: ToastService) { }

  ngOnInit() {
    this.allowCreatePickList = false;
    this.filters['FromDate'] = moment().subtract(1, 'day').format('YYYY-MM-DD');

    this.initTable();
    this.initCombo();
  }

  ngAfterViewInit() {
    this.initEvent();
    const sevenDayBefore = moment().subtract(1, 'day').toDate();
    this.fromDate.setValue(sevenDayBefore);
  }
  search(event: any) {
    this.appTable['search'](this.getFilter());
  }

  addNew(event: any) {
    this.router.navigate([`/${window.getRootPath()}/handover/create-handover-session`]);
  }
  addNewXDock(event: any) {
    this.router.navigate([`/${window.getRootPath()}/handover/create-handover-session-xdock`]);
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
    this.provinceConfig = {
      selectedFirst: false,
      isSelectedAll: false,
      isSorting: false,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return `${option['Name']}`;
      },
      type: 'autocomplete',
      filter_key: 'Name',
      URL_CODE: 'SFT.provincescombo'
    };
    this.service3PLConfig = {
      selectedFirst: false,
      isSelectedAll: false,
      isSorting: false,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return `${option['Code']}`;
      },
      filters: {
        WarehouseCode: window.getRootPath().toUpperCase()
      },
      type: 'autocomplete',
      filter_key: 'Name',
      URL_CODE: 'SFT.servicecombo'
    };
    this.soTypeConfig = {
      selectedFirst: false,
      isSelectedAll: false,
      isSorting: false,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return `${option['Name']}`;
      },
      data: [
        { Code: "EvenCase", Name: "Chẵn thùng" },
        { Code: "OddCase", Name: "Lẻ thùng" }
      ]
    };
  }

  makeData(data: any) {
    let _data = [];
    if (data.Status) {
      _data = data.Data;
    }
    this.appTable['renderData'](_data);
  }

  initTable() {
    this.tableConfig = {
      disablePagination: false,
      columns: {
        isContextMenu: false,
        actionTitle: this.translate.instant('action'),
        actions: this.initTableAction(),
        displayedColumns: [
          'index', 'Code', 'TotalSO','TotalPackage', 'Status', "Type", "CreatedDate", "actions"],
        options: [
          {
            title: 'Handover.Code',
            name: 'Code',
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/handover/handover-details/${data.Code}/view`;
            }
          },
          {
            title: 'AutoPickPack.TotalSO',
            name: 'TotalSO'
          },
          {
            title: 'AutoPickPack.TotalPackage',
            name: 'TotalPackage'
          },
          {
            title: 'Handover.Status',
            name: 'Status',
            render: (row: any, options: any) => {
              return this.translate.instant(`HandoverStatus.${row.Status}`);
            },
          },
          {
            title: 'Loại chuyển giao',
            name: 'Type'
          },
          {
            title: 'Pickingwave.CreatedDate',
            name: 'CreatedDate'
          }
        ]
      },
      remote: {
        url: this.service.getAPI('handOverLists'),
        params: {
          filter: JSON.stringify(this.filters)
        }
      }
    };

  }

  initTableAction(): TableAction[] {
    return [
      {
        icon: "view_list",
        name: 'view',
        toolTip: {
          name: "Xem",
        },
        class: "ac-task",
        disabledCondition: (row: any) => {
          return (row.Status === "New" || row.Status === "Processing" || row.Status === "Completed" || row.Status === "Canceled");
        }
      },
      {
        icon: "local_shipping",
        name: 'transfer',
        toolTip: {
          name: "Bàn Giao",
        },
        class: "ac-task",
        disabledCondition: (row: any) => {
          return (row.Status === "New" || row.Status === "Processing");
        }
      },
      {
        icon: "remove_circle",
        class: 'ac-remove',
        name: 'cancel',
        toolTip: {
          name: "Hủy Phiên",
        },
        disabledCondition: (row: any) => {
          return row.Status === "New";
        }
      }
    ];
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

    this.appTable['actionEvent'].subscribe({
      next: (event: any) => {
        if (!event) {
          return;
        }
        const action = event["action"];
        const data = event.data;
        console.log('ssssss', data, action);


        switch (action) {
          case 'view':
            this.router.navigate([`/${window.getRootPath()}/handover/handover-details/${data.Code}/${action}`]);
            break;
          case 'cancel':
            if (data.Status === 'New') {
              this.router.navigate([`/${window.getRootPath()}/handover/handover-details/${data.Code}/${action}`]);
            }
            break;
          case 'transfer':
            if (data.Status === 'New') {
              this.service.updateStatusTransfer(data.Code).subscribe((res) => {
                this.router.navigate([`/${window.getRootPath()}/handover/handover-details/${data.Code}/${action}`]);
              });
            } else {
              this.router.navigate([`/${window.getRootPath()}/handover/handover-details/${data.Code}/${action}`]);
            }
            break;
          // default:
          // this.showPoints(event["data"]);
          // break;
        }

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
