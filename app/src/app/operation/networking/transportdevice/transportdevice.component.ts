import { Component, OnInit, ViewChild, ViewContainerRef, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet, MatBottomSheetConfig } from '@angular/material/bottom-sheet';

import { ModalComponent } from '../../../components/modal/modal.component';
import { NotificationComponent } from '../../../components/notification/notification.component';
import { TransportDeviceItemComponent } from './item/item.component';
import { OperationNetworkingService } from '../operation-networking.service';
import { ToastService } from '../../../shared/toast.service';

@Component({
  selector: 'app-transportdevice',
  templateUrl: './transportdevice.component.html',
  styleUrls: ['./transportdevice.component.scss']
})
export class TransportDeviceComponent implements OnInit {
  @ViewChild('appAction', {static:true}) appAction: ElementRef;
  @ViewChild('appFilter', {static:true}) appFilter: ElementRef;
  @ViewChild('appTable', { static: true }) appTable: ElementRef;
  tableConfigs: any;
  paginator: any;

  filterConfigs: Object = {
    fields: [
      {name: 'keyword', title: "Mã thiết bị vận chuyển"}
    ]
  }

  constructor(private toast: ToastService, public dialog: MatDialog, private _bottomSheet: MatBottomSheet, private networkingService: OperationNetworkingService) { }

  ngOnInit() {
    this.tableConfigs = {
      autoResize: true,
      columns: {
        actions: ['notes', 'edit', 'delete'],
        displayedColumns: ['index', 'transportdevicecode', 'description', 'descriptioneng',
          'transportdevicetype', 'usingforsmartcart', 'status', 'usingstatus', 'numberoftransports', 'actions'],
        options: [
          {
            // Mã thiết bị vận chuyển
            title: "Mã thiết bị vận chuyển",
            name: "transportdevicecode",
            style: ""
          },
          {
            // Mô tả
            title: "Mô tả",
            name: "description",
            style: ""
          },
          {
            // Mô tả(English)
            title: "Mô tả(English)",
            name: "descriptioneng",
            style: ""
          },
          {
            // Loại thiết bị vận chuyển
            title: "Loại thiết bị vận chuyển",
            name: "transportdevicetype",
            style: "",
            render: (row) => {
              return row['transportdevicetype']['type'];
            }
          },
          {
            // Sử dụng trên Smart cart
            title: "Sử dụng trên Smart cart",
            name: "usingforsmartcart",
            style: ""
          },
          {
            // Trạng thái 
            title: "Trạng thái",
            name: "status",
            style: "",
            render: (row) => {
              return row['status']?'Active':'Inactive';
            }
          },
          {
            // Tình trạng sử dụng 
            title: "Tình trạng sử dụng ",
            name: "usingstatus",
            style: "",
            render: (row) => {
              return row['usingstatus']['name'];
            }
          },
          {
            // Số lượng thiết bị vận chuyển cần tạo
            title: "Số lượng thiết bị vận chuyển cần tạo",
            name: "numberoftransports",
            style: "",
            // render: (row) => {
            //   return row['room']['roomname'];
            // }
          }
        ]
      },
      remote: {
        url: "/api/transportdevice/getlist"
      }
    }

    // this.tableheader['change'].subscribe(data => {
    //   if (data.type === 'new') {
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
      component: TransportDeviceItemComponent,
      title: "Tạo Mới Thiết bị vận chuyển"
    }
    this._bottomSheet.open(ModalComponent, _conf)
      .afterDismissed().subscribe(result => {
        if (result) {
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
      component: TransportDeviceItemComponent,
      title: "Chỉnh sửa",
      data: data
    }
    this._bottomSheet.open(ModalComponent, _conf)
      .afterDismissed().subscribe(result => {
        if (result) {
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
      component: TransportDeviceItemComponent,
      title: "Chi tiết",
      data: data
    }
    this._bottomSheet.open(ModalComponent, _conf)
      .afterDismissed().subscribe(result => {
        if (result === true) {
          // this.paginator._changePageSize(this.paginator.pageSize);
        }
      });
  }
  removeHandle(data) {
    const dialogRef = this.dialog.open(NotificationComponent, {
      data: {
        message: 'Bạn có chắc chắn muốn xoá thiết bị vận chuyển - "' + data['transportdevicecode'] + '" ?',//'Are you sure to delete this transportdevice - "' + data['transportdevicecode'] + '" ?',
        ref: data['transportdevicecode']
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.networkingService.save('TransportDevice.save', { ref: data['transportdevicecode'], isdeleted: 1 })
          .subscribe(resp => {
            if(!resp['Success']){
              this.toast.error(resp['Data'],'Lỗi');
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
    if (action === 'edit') {
      this.editHandle(event.data);
    } else if (action === 'view') {
      this.viewHandle(event.data);
    } else if (action === 'delete') {
      this.removeHandle(event.data);
    }
  }
  reloadData() {
    this.appTable['refresh']();
    this.appFilter['reset']();
  }
  initEvent() {
    //Filter Event
    this.appFilter['change'].subscribe({
      next: (data: Object) =>{
        this.appTable['search'](data);
      }
    });
    //Action Event
    this.appAction['change'].subscribe({
      next: (action:string) => {
        if(action === 'add_new') {
          this.createNew();
        }
        if(action === 'reload') {
          this.reloadData();
        }
      }
    });
    //Row event
    this.appTable['actionEvent'].subscribe({
      next: (event:any) => {
        if(event['action'] === 'view') {
          this.viewHandle(event.data);
        }
      }
    });
  }
  ngAfterViewInit() {
    this.initEvent();
  }
}
