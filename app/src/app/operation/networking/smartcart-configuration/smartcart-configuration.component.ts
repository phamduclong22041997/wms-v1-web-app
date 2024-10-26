import { Component, OnInit, ViewChild, ViewContainerRef, ElementRef} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatBottomSheet, MatBottomSheetConfig} from '@angular/material/bottom-sheet';
import {SmartcartConfigurationPopupComponent} from './smartcart-configuration-popup/smartcart-configuration-popup.component';
import { ModalComponent } from './../../../components/modal/modal.component';
import { NotificationComponent } from './../../../components/notification/notification.component';
import { OperationNetworkingService } from './../operation-networking.service';

@Component({
  selector: 'app-smartcartconfiguration',
  templateUrl: './smartcart-configuration.component.html',
  styleUrls: ['./smartcart-configuration.component.css']
})
export class SmartcartConfigurationComponent implements OnInit {
  @ViewChild('appAction', {static:true}) appAction: ElementRef;
  @ViewChild('appFilter', {static:true}) appFilter: ElementRef;
  @ViewChild('appTable', { static: true }) appTable: ElementRef;
  tableConfigs : any;

  configs:Object = {
    createTitle: "Tạo Mới Cấu Hình Xe Đẩy",
    saveTitle: "Chỉnh Sửa Cấu Hình Xe Đẩy",
    viewTitle: "Chi Tiết"
  }

  filterConfigs: Object = {
    fields: [
      {name: 'keyword', title: "Mã cấu hình"}
    ]
  }

  constructor(public dialog: MatDialog, private _bottomSheet: MatBottomSheet, private networkingService: OperationNetworkingService) {}

  ngOnInit() {
    this.tableConfigs = {
      columns:{
        actions: ['notes', 'edit', 'delete'],
        displayedColumns: ['index', 'configurationcode', 'configdescription', 'numoflevel', 'dimension', 'actions'],
        options: [
          {
            title: "Mã cấu hình",
            name: "configurationcode",
            style: ""
          },
          {
            title: "Mô tả",
            name: "configdescription",
            style: ""
          },
          {
            title: "Số tầng",
            name: "numoflevel",
            style: ""
          },
          {
            title: "Kích thước",
            name: "dimension",
            style: ""
          }
        ]
      },
      remote: {
        url: 'api/smartcartconfiguration/getlist'
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
      component: SmartcartConfigurationPopupComponent,
      title: this.configs['createTitle']
    }
    this._bottomSheet.open(ModalComponent, _conf)
    .afterDismissed().subscribe(result=>{
      if(result === true) {
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
      component: SmartcartConfigurationPopupComponent,
      title: this.configs['saveTitle'],
      data: data
    }
    this._bottomSheet.open(ModalComponent, _conf)
    .afterDismissed().subscribe(result=>{
      if(result === true) {
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
      component: SmartcartConfigurationPopupComponent,
      title: this.configs['viewTitle'],
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
        message: 'Bạn có chắc chắn muốn xoá khu vực - "'+data['configurationcode']+'" ?',
        ref: data['configurationcode']
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.networkingService.save('SmartcartConfiguration.save', {ref: data['configurationcode'], isdeleted: 1})
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
    //Row event
    this.appTable['actionEvent'].subscribe({
      next: (event:any) => {
        if (event['action'] === 'edit') {
          this.editHandle(event['data']);
        }
        if(event['action'] === 'view') {
          this.viewHandle(event.data);
        }
        if(event['action'] === 'delete') {
          this.removeHandle(event['data']);
        }
      }
    });
  }
  ngAfterViewInit() {
    this.initEvent();
  }
}
