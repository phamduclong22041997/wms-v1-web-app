import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../../shared/toast.service';
import { Service } from '../../service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { ConfirmTaskProcessListComponent } from './confirm/component';

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
export class TaskProcessListComponent implements OnInit {
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('fromDate', { static: false }) fromDate: any;
  @ViewChild('toDate', { static: false }) toDate: any;
  @ViewChild('content', { static: false }) contentInput: ElementRef;
  @ViewChild('type', { static: false }) type: any;
  @ViewChild('status', { static: false }) status: any;


  dataSourceGrid = {
    rows: <any>[],
    total: 0
  };

  tableConfig: any;
  configDate: any;
  typeConfig: Object;
  statusConfig: any;
  hashTag: string;
  allowAddSchedule: boolean;
  filters: any = {
    FromDate: "",
    ToDate: "",
    Content: "",
    TaskType: "",
    Status: "",
  };

  constructor(
    public dialog: MatDialog,
    private service: Service,
    private router: Router,
    private translate: TranslateService,
    private toast: ToastService) {

  }

  ngOnInit() {
    this.allowAddSchedule = false;
    this.filters['FromDate'] = moment().subtract(1, 'day').format('YYYY-MM-DD');
    this.filters['WarehouseCode'] = window.localStorage.getItem('_warehouse');
    this.changeHashtag();
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
        this.search(null);
      }
    }, 300)
  }

  changeHashtag() {
    var hash = window.location.hash;
    if (hash) {
      this.hashTag = hash.substring(1);
    }
    console.log(this.hashTag);
  }
  onEnter(event: any) {
    this.search(event);
  }
  search(event: any) {
    let filters = this.getFilter();
    this.service.getListTaskProcess(filters)
      .subscribe((resp: any) => {
        if (resp.Status) {
          this.makeData(resp.Data);
        } else {
          this.toast.error(resp.ErrorMessages.join("\n"), 'error_title');
        }
      })
  }

  getFilter() {
    let _filters = this.filters;
    if (this.hashTag) {
      _filters['TaskType'] = this.hashTag;
    }
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
    let filterType = {
      Collection: 'SFT.TaskProcess',
      Column: 'Type'
    };
    if (this.hashTag) {
      filterType['Codes'] = this.hashTag;
    }
    this.typeConfig = {
      selectedFirst: true,
      isSelectedAll: this.hashTag ? false : true,
      isSorting: false,
      clearValue: true,
      isSelectedAllValueIsEmpty: this.hashTag ? false : true,
      filters: filterType,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Description'];
      },
      type: 'combo',
      filter_key: 'Description',
      URL_CODE: 'SFT.enum'
    };
    this.statusConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      isSorting: false,
      isSelectedAllValueIsEmpty: true,
      clearValue: true,
      filters: {
        Collection: 'SFT.TaskProcess',
        Column: 'Status'
      },
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Description'];
      },
      type: 'combo',
      filter_key: 'Description',
      URL_CODE: 'SFT.enum'
    };
  }

  makeData(data: any) {
    let _data = [];
    _data = data.Rows;
    this.appTable['renderData'](_data);
    // this.appTable['selectedAllData']();
  }

  initTable() {
    this.tableConfig = {
      enableCheckbox: true,
      columns: {
        isContextMenu: false,
        headerActionCheckBox: true,
        actionTitle: this.translate.instant('action'),
        actions: this.initTableAction(),
        disabledActionCondition: (row: any) => {
          return !(row.Status === 'New' && row.TotalError < row.TotalSO);
        },
        displayedColumns: [
          'index','Code', 'TaskType', 'TotalSO', 'TotalError','Status', 'Note','actions' ,'headerAction',
        ],
        options: [
          {
            title: 'TaskProcess.Code',
            name: 'Code',
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/saleorder/task-process/${data.Code}/${data.TaskType}`;
            }
          },
          {
            title: 'TaskProcess.TaskType',
            name: 'TaskType',
            render: (row: any, options: any) => {
              return this.translate.instant(`TaskProcessType.${row.TaskType}`);
            },
          },
          {
            title: 'TaskProcess.Status',
            name: 'Status',
            render: (row: any, options: any) => {
              return this.translate.instant(`TaskProcessStatus.${row.Status}`);
            },
          },
          {
            title: 'TaskProcess.Note',
            name: 'Note'
          },
          {
            title: 'TaskProcess.TotalSO',
            name: 'TotalSO'
          },
          {
            title: 'TaskProcess.TotalError',
            name: 'TotalError'
          },
        ]
      },
      data: this.dataSourceGrid
    };

  }

  initTableAction(): TableAction[] {
    return [
      {
        name: "alarm_add",
        icon: "alarm_add",
        toolTip: {
          name: "Thêm vào lịch tự động",
        },
        class: "ac-task",
        disabledCondition: (row: any) => {
          return row.Status === 'New' && row.TotalError < row.TotalSO;
        }
      }
    ];
  }
  initEvent() {
    window.addEventListener("hashchange", function(e) {
      window.location.reload();
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

    this.type['change'].subscribe({
      next: (value: any) => {
        this.filters['TaskType'] = value ? value.Code : '';
      }
    });
    this.status['change'].subscribe({
      next: (data: any) => {
        this.filters['Status'] = data.Code || '';
      }
    });

    this.appTable['actionEvent'].subscribe({
      next: (event: any) => {
        if (!event) {
          return;
        }
        
        const action = event["action"];
        switch (action) {
          case 'alarm_add':
            if (event.data) {
              let saveData = {
                Data: [event.data.Code]
              }
              this.AddToSchedule(saveData);
            }
            break;
        }
      }
    });
    this.appTable['rowEvent'].subscribe({
      next: (event: any) => {
        let data = this.appTable['getData']()['data'];
        let _selected = false;
        for (let idx in data) {
          if (data[idx].selected && data[idx].Status === 'New' && data[idx].TotalError < data[idx].TotalSO) {
            _selected = true;
          }
        }
        this.allowAddSchedule = _selected;
      }
    })
  }
  AddToSchedule(data: any){
    this.service.ProcessTaskToSchedule(data).subscribe((resp: any) => {
      if (resp.Status) {
        this.toast.success('Thành công', 'success_title');
        setTimeout(() => {
          this.search(null);
        }, 1000);
      }
      else {
        this.toast.error(resp.ErrorMessages.join("\n"), 'error_title');
      }
    });
  }
  onClickCreate(event: any){
    let dialogRef = this.dialog.open(ConfirmTaskProcessListComponent, {
      data: {
        HashTag: this.hashTag || "",
        Title: this.translate.instant('TaskProcess.ImportFile')
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (this.hashTag) {
        let view = this.hashTag === "AssignPickList" ? "assign-picklist" : "auto-pickpack";
        window.location.href = `/${window.getRootPath()}/saleorder/${view}`;
      }
      else {
        this.search(null);
      }
    });
  }
  onClickAddSchedule(event: any){
    let data = this.appTable['getData']()['data'];
    if (!data.length) {
      return;
    }
    let saveData = {
      Data: []
    }
    for (let idx in data) {
      if (data[idx].selected && data[idx].Status === 'New' && data[idx].TotalError < data[idx].TotalSO) { 
        saveData.Data.push(data[idx].Code);
      }
    }
    this.AddToSchedule(saveData);
    this.allowAddSchedule = false;
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
