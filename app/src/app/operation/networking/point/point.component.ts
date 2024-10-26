import { Component, OnInit, ViewChild, ViewContainerRef, ElementRef} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatBottomSheet, MatBottomSheetConfig} from '@angular/material/bottom-sheet';

import { ModalComponent } from './../../../components/modal/modal.component';
import { NotificationComponent } from './../../../components/notification/notification.component';
import { PointItemComponent } from './item/item.component';
import { OperationNetworkingService } from './../operation-networking.service';

import { ToastService } from '../../../shared/toast.service';

@Component({
  selector: 'app-point',
  templateUrl: './point.component.html',
  styleUrls: ['./point.component.scss']
})
export class PointComponent implements OnInit {
  @ViewChild('container', { read: ViewContainerRef , static:true}) _vcr: ViewContainerRef;
  @ViewChild('theader', {static:true}) tableheader: ElementRef;
  @ViewChild('tablePoint',{static:true}) tablePoint: ElementRef;
  tablePointData: any = {data:{rows:[]}};
  tableConfigs : any;
  paginator:any;

  configs = {
    createTitle: "Tạo Mới Vị Trí",
    saveTitle: "Chỉnh Sửa Vị Trí",
    viewTitle: "Chi Tiết"
  };

  /**
   * Add List Input into Parent Header
   */
  headerInputs: any = [
    {
      type: "combo",
      info: {
        title: "Phòng",
        configData: {
          filter_key: "roomname",
          val: (option) => {
            return option['roomname'];
          },
          URL_CODE: "NetworkingCombo.roomcombo"
        }
      }
    },
    // {
    //   type: "combo",
    //   info: {
    //     title: "Tầng",
    //     configData: {
    //       filter_key: "floorname",
    //       val: (option) => {
    //         return option['floorname'];
    //       },
    //       URL_CODE: "NetworkingCombo.floorcombo"
    //     }
    //   }
    // }
  ];

  constructor(public dialog: MatDialog, private _bottomSheet: MatBottomSheet, private networkingService: OperationNetworkingService, private toast: ToastService) {}

  ngOnInit() {
    this.tableConfigs = {
      columns:{
        actions: ['notes', 'edit', 'delete'],
        displayedColumns: ['index', 'pointcode', 'roomname', 'floorname', 'pointtype', 'pointstatus','actions'],
        options: [
          {
            title: "Mã Vị Trí",
            name: "pointcode",
            style: ""
          },
          {
            title: "Phòng",
            name: "roomname",
            style: "",
            render: (row) => {
              return row['room']['roomname'];
            }
          },
          {
            title: "Tầng",
            name: "floorname",
            style: "",
            render: (row) => {
              return row['floor']['floorname'];
            }
          },
          {
            title: "Loại Vị Trí",
            name: "pointtype",
            style: "",
            render: (row) => {
              return row['pointtype']['propertyname'];
            }
          },
          {
            title: "Trạng Thái",
            name: "pointstatus",
            style: "",
            render: (row) => {
              return row['status']?'Active':'Inactive'
            }
          },
        ]
      },
      remote: {
        url: "/api/point/getlist"
      }
    }

    this.tableheader['change'].subscribe(cbData=>{
      // if(cbData.type === 'new') {
      //   this.createNew();
      // }

      if(cbData.type === 'FILTER') {
        /**
         * Check if callback data contain filter param
         */
        if (cbData.hasOwnProperty('filterdata')) {
          this.tableheader['filter'] = cbData.filterdata ? {
            'roomcode': cbData.filterdata.roomcode
          } : "";
        }
      }
    })
  }
  createNew() {
    const _conf = new MatBottomSheetConfig();
    _conf.hasBackdrop = false;
    _conf.backdropClass = "model-full";
    _conf.panelClass = "model-panel"
    _conf.data = {
      component: PointItemComponent,
      title: this.configs.createTitle,
      data: {total: this.paginator.length, action: 'create',
      lastrecord: this.tablePointData.data.rows[this.tablePointData.data.total - 1]}
    }
    this._bottomSheet.open(ModalComponent, _conf)
    .afterDismissed().subscribe(result=>{
      if(result === true) {
        this.paginator._changePageSize(this.paginator.pageSize);
      }
    });
  }
  editHandle(data) {

    const _conf = new MatBottomSheetConfig();
    _conf.hasBackdrop = false;
    _conf.backdropClass = "model-full";
    _conf.panelClass = "model-panel"

    data['action'] = 'edit';
    _conf.data = {
      component: PointItemComponent,
      title: this.configs.saveTitle,
      data: data
    }
    this._bottomSheet.open(ModalComponent, _conf)
    .afterDismissed().subscribe(result=>{
      if(result === true) {
        this.paginator._changePageSize(this.paginator.pageSize);
      }
    });
  }
  viewHandle(data) {
    const _conf = new MatBottomSheetConfig();
    _conf.hasBackdrop = false;
    _conf.backdropClass = "model-full";
    _conf.panelClass = "model-panel"

    data['action'] = 'view';
    _conf.data = {
      component: PointItemComponent,
      title: this.configs.viewTitle,
      data: data
    }
    this._bottomSheet.open(ModalComponent, _conf)
    .afterDismissed().subscribe(result=>{
      if(result === true) {
        // this.paginator._changePageSize(this.paginator.pageSize);
      }
    });
  }
  removeHandle(data) {
    const dialogRef = this.dialog.open(NotificationComponent, {
      data: {
        message: 'Bạn có chắc chắn muốn xoá vị trí - "'+data['pointcode']+'" ?',
        ref: data['areacode']
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.networkingService.save('Point.save', {ref: data['pointcode'], isdeleted: 1})
        .subscribe(resp => {
          if(resp['Success'] === true) {
            this.toast.success('Xoá thành công vị trí - "'+data['pointcode'] + '"', "Thành Công");
            this.paginator._changePageSize(this.paginator.pageSize);
          } else {
            this.toast.error(resp['Data'], "Lỗi")
          }
        })
      }
    });
  }
  onFirstChange(paginator) {
    this.paginator = paginator;
  }
  onActionHandle(event) {
    let action = event.action;
    if(action === 'add_new') {
      this.createNew();
    }
    if(action === 'edit') {
      this.editHandle(event.data);
    } else if(action === 'view') {
      this.viewHandle(event.data);
    } else if(action === 'delete') {
      this.removeHandle(event.data);
    }
  }

  ngAfterViewInit(){
    if(this.tablePoint){
      this.tablePointData = this.tablePoint;
    }
  }
}
