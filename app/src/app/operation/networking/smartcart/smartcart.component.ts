import { Component, OnInit, ViewChild, ViewContainerRef, ElementRef, ChangeDetectorRef} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatBottomSheet, MatBottomSheetConfig} from '@angular/material/bottom-sheet';

import { ModalComponent } from './../../../components/modal/modal.component';
import { NotificationComponent } from './../../../components/notification/notification.component';
import { OperationNetworkingService } from './../operation-networking.service';
import { SmartcartPopupComponent } from './smartcart-popup/smartcart-popup.component';
import { ToastService } from './../../../shared/toast.service';

@Component({
  selector: 'app-smartcart',
  templateUrl: './smartcart.component.html',
  styleUrls: ['./smartcart.component.css']
})
export class SmartcartComponent implements OnInit {

  @ViewChild('container', { read: ViewContainerRef , static:true}) _vcr: ViewContainerRef;
  @ViewChild('theader', {static:true}) tableheader: ElementRef;
  @ViewChild('binContainer', { read: ViewContainerRef , static:true}) _binContainervcr: ViewContainerRef;
  @ViewChild('binTableheader', {static:true}) binTableheader: ElementRef;
  @ViewChild('binTable', {static:true}) binTable: ElementRef;
  @ViewChild('smartcartTable', {static:true}) smartcartTable: ElementRef;  
  
  binTableConfigs : any;
  tableConfigs : any;
  paginator:any;
  constructor(public dialog: MatDialog, private _bottomSheet: MatBottomSheet, private networkingService: OperationNetworkingService
    ,private toast: ToastService, private changeDetectorRefs: ChangeDetectorRef) {}

  ngOnInit() {
    this.binTableConfigs = {
      autoResize: true,
      columns: {
        displayedColumns: ['index','bincode','level','transportdevice'],
        options: [
          {
            title: "Mã bin",
            name: "bincode",
            style: ""
          },
          {
            title: "Tầng",
            name: "level",
            style: ""
          },
          {
            title: "Thiết bị vận chuyển",
            name: "transportdevice",
            style: ""
          }
        ]
      },
      data:{
        rows: []
      }
    };

    this.tableConfigs = {
      columns:{
        actions: ['notes', 'edit', 'delete'],
        displayedColumns: ['index', 'smartcartcode', 'configuration', 'purposeusing', 'numofbin', 
        'currentpoint' ,'status' ,'actions'],
        options: [
          {
            title: "Mã xe",
            name: "smartcartcode",
            style: ""
          },
          {
            title: "Cấu hình xe",
            name: "configuration",
            style: ""
          },
          {
            title: "Mục đích sử dụng",
            name: "purposeusing",
            style: ""
          },
          {
            title: "Số lượng bin",
            name: "numofbin",
            style: ""
          },
          {
            title: "Vị trí hiện tại",
            name: "currentpoint",
            style: ""
          },
          {
            title: "Trạng thái",
            name: "status",
            style: "",
            render: (row) => {
              return row['status']?'Active':'Inactive';
            }
          }
        ]
      },
      remote: {
        url: "/api/smartcart/getlist"
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
      component: SmartcartPopupComponent,
      title: "Tạo mới Xe đẩy"
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
      component: SmartcartPopupComponent,
      title: "Chỉnh sửa",
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
      component: SmartcartPopupComponent,
      title: "Chi tiết",
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
        message: 'Bạn có chắc chắn muốn xoá Smart cart - "'+data['smartcartcode']+'" ?',
        ref: data['smartcartcode']
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.networkingService.save('Smartcart.save', {ref: data['smartcartcode'], isdeleted: 1})
        .subscribe(resp => {
          if(resp['Success']){
            this.toast.success('Đã xóa xe đẩy ' + data['smartcartcode'], "Thành Công");
          } else {
            this.toast.error(resp['Data'], 'Lỗi');
          }
          this.paginator._changePageSize(this.paginator.pageSize);
        })
      }
    });
  }
  onFirstChange(paginator) {
    this.paginator = paginator;
  }
  onActionHandle(event:any) {
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

  onSelectRow(event){
    let selectedRow = event.selectedRow;
    this.binTable['data']['rows'] = selectedRow['bininfo']['binlist'];
    this.changeDetectorRefs.detectChanges();
  }

}
