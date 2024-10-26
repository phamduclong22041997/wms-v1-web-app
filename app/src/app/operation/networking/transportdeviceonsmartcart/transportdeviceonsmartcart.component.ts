import { Component, OnInit, ViewChild, ViewContainerRef, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet, MatBottomSheetConfig } from '@angular/material/bottom-sheet';

import { ModalComponent } from '../../../components/modal/modal.component';
import { NotificationComponent } from '../../../components/notification/notification.component';
import { TransportDeviceOnSmartcartItemComponent } from './item/item.component';
import { OperationNetworkingService } from '../operation-networking.service';

@Component({
  selector: 'app-transportdeviceonsmartcart',
  templateUrl: './transportdeviceonsmartcart.component.html',
  styleUrls: ['./transportdeviceonsmartcart.component.scss']
})
export class TransportDeviceOnSmartcartComponent implements OnInit {
  @ViewChild('appAction', {static:true}) appAction: ElementRef;
  @ViewChild('appFilter', {static:true}) appFilter: ElementRef;
  @ViewChild('appTable', { static: true }) appTable: ElementRef;
  tableConfigs: any;

  filterConfigs: Object = {
    fields: [
      {name: 'keyword', title: "Mã xe"}
    ]
  }
  
  constructor(public dialog: MatDialog, private _bottomSheet: MatBottomSheet, private networkingService: OperationNetworkingService) { }

  ngOnInit() {
    this.tableConfigs = {
      autoResize: true,
      columns: {
        actions: ['notes', 'edit', 'delete'],
        displayedColumns: ['index', 'smartcartcode', 'bincode', 'transportdevicecode', 'actions'],
        options: [
          {
            title: "Mã bin",
            name: "bincode",
            style: ""
          },
          {
            title: "Mã xe",
            name: "smartcartcode",
            style: ""
          },
          {
            title: "Mã thiết bị vận chuyển",
            name: "transportdevicecode",
            style: ""
          }
        ]
      },
      remote: {
        url: "/api/transportdeviceonsmartcart/getlist"
      }
    }

    // this.tableheader['change'].subscribe(data => {
    //   if (data.type === 'new') {
    //     this.createNew();
    //   }
    // })
  }
  ngAfterViewInit() {
    this.initEvent();
  }
  createNew() {
    const _conf = new MatBottomSheetConfig();
    _conf.hasBackdrop = false;
    _conf.backdropClass = "model-full";
    _conf.panelClass = "model-panel"
    _conf.data = {
      component: TransportDeviceOnSmartcartItemComponent,
      title: `Tạo Mới Thiết bị vận chuyển trên xe đẩy`
    }
    this._bottomSheet.open(ModalComponent, _conf)
      .afterDismissed().subscribe(result => {
        if (result) {
          this.appTable['refresh']();
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
      component: TransportDeviceOnSmartcartItemComponent,
      title: "Chỉnh sửa",
      data: data
    }
    this._bottomSheet.open(ModalComponent, _conf)
      .afterDismissed().subscribe(result => {
        if (result) {
          this.appTable['refresh']();
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
      component: TransportDeviceOnSmartcartItemComponent,
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
        message: 'Bạn có chắc chắn muốn xoá thiết bị vận chuyển trên xe đẩy - "' + data['bincode'] + '" ?',
        ref: data['bincode']
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.networkingService.save('TransportDeviceOnSmartcart.save', { ref: data['bincode'], isdeleted: 1 })
          .subscribe(resp => {
            this.appTable['refresh']();
          })
      }
    });
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
    this.appTable['actionEvent'].subscribe({
      next: (event) => {
        if (event['action'] === 'edit') {
          this.editHandle(event.data);
        }
        if (event['action'] === 'view') {
          this.viewHandle(event.data);
        }
        if (event['action'] === 'delete') {
          this.removeHandle(event.data);
        }
      }
    });
  }
}
