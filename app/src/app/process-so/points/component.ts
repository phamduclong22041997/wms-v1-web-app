import { SO_STATUS } from '../../shared/constant';
import { Component, OnInit, Inject, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastService } from './../../shared/toast.service';
import { Service } from './../service';

interface TableAction {
  name: string,
  icon: string;
  class?: string;
  toolTip?: any;
  actionName?: any;
  disabledCondition?: any;
}
@Component({
  selector: 'app-points-modal',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class PointsComponent implements OnInit, AfterViewInit {
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('points', { static: false }) points: ElementRef;
  @ViewChild('content', { static: false }) content: ElementRef;
  
  constructor(
    public dialogRef: MatDialogRef<PointsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: Service,
    private toast: ToastService,
  ) { }
  isShowGrid: Boolean;
  pointsConfig: any;
  locationCode: String;
  soCode: String;
  allowSave: boolean;
  dataSourceGrid = {
    rows: <any>[],
    total: 0
  };

  tableConfig: any;

  ngOnInit() {
    this.init();
    this.initTable();
  }

  ngAfterViewInit() {
    this.initEvent();
    if(this.soCode){
      this.content.nativeElement.value = this.soCode;
    }
  }

  init() {
    this.allowSave = false;
    this.soCode = this.data['SOCode'] || "";
    this.isShowGrid = !this.soCode;
    this.pointsConfig = {
      selectedFirst: false,
      isSelectedAll: false,
      isSorting: false,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return `${option['Code']}`;
      },
      type: 'autocomplete',
      filter_key: 'Name',
      URL_CODE: 'SFT.pointscombo'
    }
  }

  initTableAction(): TableAction[] {
    return [
      {
        icon: "clear",
        name: 'remove-item',
        class: 'ac-remove',
        toolTip: {
          name: "Loại bỏ đơn hàng xuất",
        },
        disabledCondition: (row: any) => {
          return true;
        }
      }
    ];
  }

  assignGatheredPoint() {
    if(!this.locationCode) {
      this.toast.error('AssignPoints.ErrorLocationCode', 'error_title');
      return;
    }
    let selectedList = [];
    if(this.soCode === "") {
      let data = this.appTable['getData']()['data'];
      
      for(let item of data) {
        selectedList.push(item.SOCode);
      }
    } else {
      selectedList = [this.soCode];
    }
    if(!selectedList.length) {
      this.toast.error('AssignPoints.ErrorSOList', 'error_title');
      return;
    }
    this.service.assignGatheredPoint({
      "SOList": selectedList,
      "LocationCode": this.locationCode
    })
      .subscribe((resp: any) => {
        if (resp.Status === true) {
          this.toast.success('Chỉ định điểm tập kết hàng thành công', 'success_title');
          this.onOkClick();
        } else if (resp.ErrorMessages && resp.ErrorMessages.length) {
          this.toast.error(resp.ErrorMessages[0], 'error_title');
        }
      })
  }

  search(event: any) {
    let val = event.target.value;
    if(val) {
      let filters = {
        Status: SO_STATUS.Packed,
        Content: val,
        IsFilterList: true
      }
      this.service.loadSOList(filters)
        .subscribe((resp: any) => {
          let data = null;
          if(resp.Status && resp.Data && resp.Data.length) {
            data = resp.Data;
          }
          if(data) {
            this.makeData(data);
          }
        })
    }
    event.target.value = "";
  }

  makeData(data: any) {
    let allowAdd = false;
    let dataRows = this.appTable['getData']()['data'];
    if(data && data.length){
      for(let p of data){
        let t = dataRows.find(x=>x.SOCode == p.SOCode);
        if(!t){
          allowAdd = true;
          this.appTable['addRow'](p);
        }
      }
    }
    if(allowAdd) {
      this.allowSave = true;
    }
  }


  initTable() {
    this.tableConfig = {
      disablePagination: false,
      enableCollapse: false,
      rowSelected: false,
      style: {},
      pageSize: 10,
      columns: {
        actionTitle: "Thao tác",
        actions: this.initTableAction(),
        isContextMenu: false,
        displayedColumns: [
          'index', 'SiteId', 'SOCode', 'ExternalCode', 'actions'
        ],
        options: [
          {
            title: 'HandoverDetail.SiteId',
            name: 'SiteId',
            style: {
              width: '70px',
              'max-width': '70px',
              'min-width': '70px',
            }
          },
          {
            title: 'AssignPoints.SOCode',
            name: 'SOCode'
          },
          {
            title: 'AssignPoints.ExternalCode',
            name: 'ExternalCode',
            style: {
              width: '120px',
              'max-width': '120px',
              'min-width': '120px',
            }
          }
        ]
      },
      data: this.dataSourceGrid
    };

  }

  removeRow(data: any) {
    this.appTable['removeRow'](data.index - 1);
    this.allowSave = this.appTable['getData']()['total'] > 0;
  }

  initEvent() {
    if(this.isShowGrid){
      this.appTable['actionEvent'].subscribe({
        next: (event: any) => {
          if (event) {
            switch (event['action']) {
              case 'remove-item':
                this.removeRow(event['data']);
                break
            }
          }
        }
      });
    }
    this.points['change'].subscribe({
      next: (value: any) => {
        this.locationCode = value ? value.Code : '';
        if(this.locationCode && this.soCode){
          this.allowSave = true;
        }
      }
    });
  }

  onCancelClick() {
    this.dialogRef.close(false);
  }
  onOkClick() {
    this.dialogRef.close(true);
  }
}
