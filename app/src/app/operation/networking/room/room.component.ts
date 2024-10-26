import { Component, OnInit, ViewChild, ViewContainerRef, ElementRef} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatBottomSheet, MatBottomSheetConfig} from '@angular/material/bottom-sheet';

import { ModalComponent } from './../../../components/modal/modal.component';
import { NotificationComponent } from './../../../components/notification/notification.component';
import { OperationNetworkingService } from './../operation-networking.service';
import { RoomPopupComponent } from './room-popup/room-popup.component';

import { ToastService } from '../../../shared/toast.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  @ViewChild('container', { read: ViewContainerRef , static:true}) _vcr: ViewContainerRef;
  @ViewChild('theader', {static:true}) tableheader: ElementRef;
  tableConfigs : any;
  paginator:any;

  configs = {
    createTitle: "Tạo Phòng",
    saveTitle: "Chỉnh Sửa Phòng",
    viewTitle: "Chi Tiết"
  }

  constructor(public dialog: MatDialog, private _bottomSheet: MatBottomSheet, private networkingService: OperationNetworkingService, private toast: ToastService) {}

  ngOnInit() {
    this.tableConfigs = {
      columns:{
        actions: ['notes', 'edit', 'delete'],
        displayedColumns: ['index', 'roomcode', 'roomname', 'roomtype', 'status' ,'actions'],
        options: [
          {
            title: "Mã Phòng",
            name: "roomcode",
            style: ""
          },
          {
            title: "Tên Phòng",
            name: "roomname",
            style: ""
          },
          {
            title: "Loại Phòng",
            name: "roomtype",
            style: "",
            render: (row) => {
              return row['roomtype']['propertyname'];
            }
          },
          {
            title: "Trạng Thái",
            name: "status",
            style: "",
            render: (row) => {
              return row['status']?'Active':'Inactive';
            }
          }
        ]
      },
      remote: {
        url: "/api/room/getlist",
        params: {
          sort: {
            'roomcode': 'asc'
          }
        }
      }
    }

    // this.tableheader['change'].subscribe(data=>{
    //   if(data.type === 'new') {
    //     this.createNew();
    //   }
    // })
  }
  createNew() {
    const _conf = new MatBottomSheetConfig();
    _conf.hasBackdrop = false;
    _conf.backdropClass = "model-full";
    _conf.panelClass = "model-panel"
    _conf.data = {
      component: RoomPopupComponent,
      title: this.configs.createTitle,
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
      component: RoomPopupComponent,
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
      component: RoomPopupComponent,
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
        message: 'Bạn có chắc chắn muốn xoá phòng - "' + data['roomcode'] + '"?',//'Are you sure to delete this room - "'+data['roomcode']+'" ?',
        ref: data['roomcode']
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.networkingService.save('Room.save', {ref: data['roomcode'], isdeleted: 1})
        .subscribe(resp => {
          if(resp['Success'] === true) {
            this.toast.success('Xoá thành công phòng - "'+data['roomcode'] + '"', "Thành Công");
            this.paginator._changePageSize(this.paginator.pageSize);
          } else {
            this.toast.error(resp['Data'], "Lỗi");
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

}
