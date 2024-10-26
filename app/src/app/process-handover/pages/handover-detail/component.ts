import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Service } from '../../service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../shared/toast.service';
import { MatDialog } from '@angular/material/dialog';
import { PrintService } from '../../../shared/printService';
// import { NotificationComponent } from '../../../components/notification/notification.component';
import { ConfirmExportComponent } from '../../confirm/component';
import * as moment from 'moment-timezone';


const timezone = "Asia/Ho_Chi_Minh";
interface TableAction {
  name: string,
  icon: string;
  class?: string;
  toolTip?: any;
  actionName?: any;
  disabledCondition?: any;
}
@Component({
  selector: 'app-so-details',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})

export class HandoverDetailsComponent implements OnInit, AfterViewInit {
  Code: string;
  statusConfig: Object;
  packageConfig: Object;
  receiveSKUConfig: Object;
  documentConfig: Object;
  productsDataSource: any;
  checkFileExtention: boolean;
  checkFileExtentionError: false;
  fileUpload: any;
  nameFileUpload: string;
  receiveRowUpload: any;
  listSODetail: any[];
  data: any = {
    Type: '',
    Code: '',
    Status: '',
    ReceiveSessions: [],
    Details: [],
    HandCode: '',
    WarehouseName: ''
  }
  isdisabled = false;
  isCreateHidden = true;
  isCancelHidden = true;
  Action = '';
  @ViewChild('packageTable', { static: false }) packageTable: ElementRef;
  @ViewChild('SHOListSKUTable', { static: false }) SHOListSKUTable: ElementRef;
  @ViewChild('documentTable', { static: false }) documentTable: ElementRef;
  @ViewChild('inputFile', { static: false }) inputFile: ElementRef;

  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private toast: ToastService,
    private service: Service,
    public dialog: MatDialog,
    private printService: PrintService,
    private router: Router) {
    this.Code = this.route.snapshot.params.Code;
    this.Action = this.route.snapshot.params.Action;
    this.checkAction();
  }



  ngOnInit() {


    this.initTable();
    this.loadData();
    this.getPackageList();

  }
  ngAfterViewInit() {
    console.log('viewinit');
    this.initEvent();
  }
  initTable() {
    this.packageConfig = {
      style: {
        'overflow-x': 'hidden'
      },
      columns: {
        isContextMenu: false,
        actionTitle: this.translate.instant('action'),
        actions: this.initTableAction(),
        displayedColumns: [
          'index',
          'SOCode',
          'SiteId',
          'Status',
          'actions'
        ],
        options: [
          {
            title: 'HandoverDetail.SOCode',
            name: 'SOCode',

            onClick: (data: any) => {
              this.loadSession(data);

            },
            style: {
              'min-width': '150px',
            },
          },
          {
            // da đây
            title: 'HandoverDetail.SiteId',
            name: 'SiteId'
          },
          {
            title: 'HandoverDetail.SOStatus',
            name: 'Status',
            render: (data: any) => {
              return this.translate.instant(`SOStatus.${data.Status}`);
            }
          }
        ]
      },
      data: {
        rows: this.data.ReceiveSessions || [],
        total: this.data.ReceiveSessions.length
      }
    }

    this.receiveSKUConfig = {
      style: {
        'overflow-x': 'hidden'
      },
      columns: {
        actionTitle: 'action',
        isContextMenu: false,
        displayedColumns: [
          'index',
          'PackageNo',
          'TrackingCode',
        ],
        options: [
          {
            title: 'HandoverDetail.PackageNo',
            name: 'PackageNo',
            style: {
              'min-width': '150px',
            },
          },
          {
            title: 'HandoverDetail.SHO',
            name: 'TrackingCode',
            style: {
              'min-width': '90px',
            },
          },

        ]
      },
      data: {
        rows: [],
        total: 0
      }
    };
  }


  loadDocBySession(data) {
    this.service.getTrackingCode(data.SOCode)
      .subscribe((resp: any) => {
        let _tmp = [];
        if (resp.Status) {
          _tmp.push(resp.Data);
        }
        this.SHOListSKUTable['renderData'](_tmp);
      })
  }

  private checkAction() {
    if (this.Action && this.Action.toUpperCase() === 'VIEW') {
      this.isCreateHidden = true
      this.isCancelHidden = true
    }
  }

  private updateStatus() {
    if (this.data.Status === 'New') {
      this.isCreateHidden = true
      this.isCancelHidden = false
    }
    if (this.data.Status === 'Completed') {
      this.isdisabled = true;
      this.isCreateHidden = true
      this.isCancelHidden = true
    }
    if (this.data.Status === 'Processing') {
      this.isCreateHidden = false
      this.isCancelHidden = true
    }

  }

  loadData() {
    let whcode = window.localStorage.getItem('_warehouse') || '';
    this.service.gethandoverDetails(this.Code, whcode)
      .subscribe((resp: any) => {
        if (resp.Data) {
          this.data = {
            HandCode: resp.Data.HandCode || '',
            ClientCode: resp.Data.ClientCode,
            CreatedDate: resp.Data.CreatedDate,
            TransferedDate: resp.Data.TransferedDate,
            Status:  resp.Data.Status,//this.translate.instant(`HandoverStatus.${resp.Data.Status}`),
            CanceledNote: resp.Data.CanceledNote,
            WarehouseName: resp.Data.WarehouseName,
            PackageDetails: resp.Data.PackageDetails,
            TotalPackageTransfered: resp.Data.TotalPackageTransfered,
            TotalSOTransfered: resp.Data.TotalSOTransfered,
            TotalSO: resp.Data.TotalSO,
            TotalPackage: resp.Data.TotalPackage,
            TotalStore: resp.Data.TotalStore,
            TotalStoreTransfered: resp.Data.TotalStoreTransfered,
            Type: resp.Data.Type
          };
          this.updateStatus();
          this.checkAction();
        }

      });
  }

  getPackageList() {
    this.service.getPackageList(this.Code)
      .subscribe((resp) => {
        if (resp.Status) {
          this.packageTable['renderData'](resp.Data || []);
          this.listSODetail =  resp.Data;
        }
      })
  }

  repairDataInventoryDelivery(dataSession: any) {
    const dataPrint = {
      "label": "Phiếu xuất kho",
      "printer_name": "PrinterPaper",
      "printer": 'PrinterPaper',
      "printerDefault": "InventoryDelivery",
      "template": 'InventoryDelivery',
      "options": { "Orientation": "portrait" },
      "data": null,
      "url": ""
    }
    const printDate = moment(new Date()).tz(timezone);
    const data = Object.assign({}, this.data);
    let SumQty = 0;
    let SumBoxQty = 0;
    for (let detail of data.Details) {
      SumQty += detail.RawQty;
      SumBoxQty += detail.RequestQty;
    }
    data.StrPrintDate = `Ngày ${printDate.format("DD")}, tháng ${printDate.format("MM")}, năm ${printDate.format("YYYY")}`;
    data['SumQty'] = SumQty;
    data['SumBoxQty'] = SumBoxQty;
    dataPrint.data = data;
    return dataPrint;
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
          return true;
        }
      },

    ];
  }
  private loadSession(data) {
    if (data.Status === 'TransportHandon') {
      this.isdisabled = true;
      this.isCancelHidden = true;
      this.isCreateHidden = true;
    }
    this.loadDocBySession(data);
  }
  initEvent() {
    this.packageTable['actionEvent'].subscribe({
      next: (event: any) => {

        if (!event) {
          return;
        }
        const action = event["action"];
        const data = event.data;
        this.loadSession(data);


        // switch (action) {
        //   case 'view':
        //     this.router.navigate([`/${window.getRootPath()}/process/handover-details/${data.Code}/${action}`]);
        //     break;
        //   case 'cancel':
        //     if (data.Status === 'New') {
        //       this.router.navigate([`/${window.getRootPath()}/process/handover-details/${data.Code}/${action}`]);
        //     }
        //     break;
        //   case 'transfer':
        //     if (data.Status === 'New') {
        //       this.service.updateStatusTransfer(data.Code).subscribe((res) => {
        //         this.router.navigate([`/${window.getRootPath()}/process/handover-details/${data.Code}/${action}`]);
        //       });
        //     } else {
        //       this.router.navigate([`/${window.getRootPath()}/process/handover-details/${data.Code}/${action}`]);
        //     }
        //     break;
        //   // default:
        //   // this.showPoints(event["data"]);
        //   // break;
        // }

      }
    });
  }
  cancel() {
    this.router.navigate([`/${window.getRootPath()}/handover/handover-sessions`, {}]);
  }
  resetUpload() {
    this.receiveRowUpload = null;
    this.checkFileExtention = false;
    this.checkFileExtentionError = false;
    this.inputFile = null;
    this.fileUpload = null;
  }

  createTransport() {
    this.isdisabled = true;
    this.isCreateHidden = true;
    this.isCancelHidden = false;


    this.service.createtransfertransport(this.Code).subscribe((res) => {
      if (res.Status) {
        // thanh cong
        this.isCreateHidden = true;
        this.isCancelHidden = true;
        this.toast.success('BÀN GIAO THÀNH CÔNG', 'Thành Công');
        this.loadData();
        this.getPackageList();

      } else {
        this.toast.error(res.ErrorMessages.join(','), 'LỖI');
        this.isCreateHidden = true;
        this.isdisabled = true;
        this.isCancelHidden = true;
      }
    });
  }
  cancelTransport(note) {
    this.isCreateHidden = true;
    this.isCancelHidden = false;
    this.service.cancelCreateSession(this.Code, note).subscribe((res) => {
      if (res.Status) {
        this.isCreateHidden = true;
        this.isCancelHidden = true;
        this.toast.success('HỦY PHIÊN BÀN GIAO THÀNH CÔNG', 'Thành Công');
        this.loadData();
        this.getPackageList();
      } else {
        this.toast.error(res.ErrorMessages.join(','), 'Lỗi');
        this.isdisabled = false;
        this.isCancelHidden = true;
      }
    });
  }


  // confirm() {
  //   // if (!this.checkFileExcel) {
  //   //   this.toast.error('RocketPlanning.ErrorFileExcel', 'error_title');
  //   //   return;
  //   // }
  //   const dialogRef = this.dialog.open(ConfirmExportComponent, {
  //     data: {
  //       data: {

  //         // fileName: this.fileUpload.name
  //       }, message: 'Bạn có chắc '
  //     },
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       // this.cancelTransport();
  //     }
  //   });
  // }
  onShowConfirm(type: number,data: any) {

    const messageConfirmCancel = { message: `Bạn có chắc chắn Hủy  phiên bàn giao này`, type: type };
    const messageConfirmCreate = { message: 'Bạn có chắc chắn bàn giao phiên này', type: type }
    console.log(data)
    if (type === 1) {
      this.showConfirm(messageConfirmCancel,type);
    }
    else {
      this.showConfirm(messageConfirmCreate, type);
    }
  }
  showConfirm(data: any, type) {
    console.log(data)
    const dialogRef = this.dialog.open(ConfirmExportComponent, {
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('rrrr', result);
        if (type === 0) {
          this.createTransport();
          // alert('tao transport');
        } else {
          this.cancelTransport(result);
          // alert('huy');
        }
      }
    });
  }
  printSummaryInventory() {
    if (this.listSODetail.length > 0) {
      const listSOCode = this.listSODetail.map(detail => detail.SOCode)
      return this.service.exportSODelivery(listSOCode);
    }
  }

}
