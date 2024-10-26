import { Component, OnInit, ViewChild, ViewContainerRef, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet, MatBottomSheetConfig } from '@angular/material/bottom-sheet';

import { ModalComponent } from '../../../components/modal/modal.component';
import { NotificationComponent } from '../../../components/notification/notification.component';
import { FloorItemComponent } from './item/item.component';
import { OperationNetworkingService } from '../operation-networking.service';

import { ToastService } from '../../../shared/toast.service';

@Component({
  selector: 'app-floor',
  templateUrl: './floor.component.html',
  styleUrls: ['./floor.component.scss']
})
export class FloorComponent implements OnInit {
  @ViewChild('container', { read: ViewContainerRef, static: true }) _vcr: ViewContainerRef;
  @ViewChild('theader', { static: true }) tableheader: ElementRef;
  tableConfigs: any;
  paginator: any;

  configs = {
    title: "Tầng",
    createTitle: "Tạo Tầng",
    saveTitle: "Chỉnh Sửa Tầng",
    viewTitle: "Chi Tiết",
    searchTitle: "Nhập mã tầng để tìm kiếm"
  }

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
    }
  ];

  constructor(public dialog: MatDialog, private _bottomSheet: MatBottomSheet, private networkingService: OperationNetworkingService, private toast: ToastService) { }

  ngOnInit() {
    this.tableConfigs = {
      columns: {
        actions: ['notes', 'edit', 'delete'],
        displayedColumns: ['index', 'floorcode', 'floorname', 'room', 'flooracreage', 'floorheight', 'status', 'actions'],
        options: [
          {
            title: "Mã Tầng",
            name: "floorcode",
            style: ""
          },
          {
            title: "Tên Tầng",
            name: "floorname",
            style: ""
          },
          {
            title: "Phòng",
            name: "room",
            style: "",
            render: (row) => {
              return row['room']['roomname'];
            }
          },
          {
            title: "Diện Tích Sàn (m2)",
            name: "flooracreage",
            style: ""
          },
          {
            title: "Chiều cao tầng tính từ mặt đất (m)",
            name: "floorheight",
            style: ""
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
        url: "/api/floor/getlist",
        params: {
          sort: {
            'floorcode': 'asc'
          }
        }
      }
    }

    this.tableheader['change'].subscribe(cbData => {
      // if (cbData.type === 'new') {
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
      component: FloorItemComponent,
      title: this.configs.createTitle
    }
    this._bottomSheet.open(ModalComponent, _conf)
      .afterDismissed().subscribe(result => {
        if (result === true) {
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
      component: FloorItemComponent,
      title: this.configs.saveTitle,
      data: data
    }
    this._bottomSheet.open(ModalComponent, _conf)
      .afterDismissed().subscribe(result => {
        if (result === true) {
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
      component: FloorItemComponent,
      title: this.configs.viewTitle,
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
        message: 'Bạn có chắc chắn muốn xáo tầng - "' + data['floorcode'] + '" ?',//'Are you sure to delete this floor - "' + data['floorcode'] + '" ?',
        ref: data['floorcode']
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.networkingService.save('Floor.save', { 
          ref: data['floorcode'], 
          room: data['room'],
          isdeleted: 1 
        }).subscribe(resp => {
            if(resp['Success'] === true) {
              this.toast.success('Xoá thành công tầng - "' + data['floorcode'] + '"', "Thành Công");
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
    if (action === 'edit') {
      this.editHandle(event.data);
    } else if (action === 'view') {
      this.viewHandle(event.data);
    } else if (action === 'delete') {
      this.removeHandle(event.data);
    }
  }
}
