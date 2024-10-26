import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../../shared/toast.service';
import { Service } from '../../service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationComponent } from '../../../components/notification/notification.component';
import { PrintService } from '../../../shared/printService';
import { Hotkeys } from '../../../shared/hotkeys.service';
import { TableAction } from '../../../interfaces/tableAction';

@Component({
  selector: 'app-so-POAdjust',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class POAdjustComponent implements OnInit, AfterViewInit {
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('appTableAdjust', { static: false }) appTableAdjust: ElementRef;
  @ViewChild('appTableTotalAdjust', { static: false }) appTableTotalAdjust: ElementRef;
  @ViewChild('code', { static: false }) inputScan: ElementRef;
  code: string;
  SOCode: string;
  tableConfig: any;
  tableAdjustConfig: any;
  tableTotalAdjustConfig: any;
  type: string;
  inputPlaceholder: string = 'POAdjust.ContentHolder';
  IsFinish: boolean = false;
  IsFinishPO: boolean = false;
  IsFinishPallet: boolean = false;
  scanStep: string;
  data: any = {
    JobCode: "",
    POCode: "",
    ExternalCode: "",
    POStatus: "",
    POSessionCode: "",
    POSessionStatus: "",
    Details: [],
    PalletCode: "",
    PalletStatus: "",
    DetailScan:  []
  }

  dataSourceGrid = {
    rows: <any>[],
    total: 0
  };
  rootPath =`${window.getRootPath()}`;
  constructor(
    public dialog: MatDialog,
    private service: Service,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private printService: PrintService,
    private toast: ToastService,
    private hotkeys: Hotkeys) {
    this.code = this.route.snapshot.params.code;
  }

  ngOnInit() {
    this.scanStep = "1";
    this.IsFinish = false;
    this.IsFinishPO = false;
    this.IsFinishPallet = false;
    this.inputPlaceholder = 'POAdjust.ScanPO';
    this.initTable();
    this.GetCurrentTaskPOAdjust();
  }

  ngAfterViewInit() {
    this.initEvent();
  }
  onEnter(event: any) {
    let code = event.target['value'];
    code = code.trim();
    if (!this.data['POCode']) {
      this.scanPOAdjust({ Code: code });
    }
    else if (!this.data.PalletCode) {
      this.scanPalletAdjustPO({Code: code, JobCode: this.data['JobCode']});
    } else {
      if (code) {
        this.scanBarcode({ 
          Code: code,
          JobCode: this.data['JobCode'],
          POCode: this.data['POCode'],
          PalletCode: this.data['PalletCode'],
          SessionCode: this.data['POSessionCode']
        });
      }
    }
  }
  scanBarcode(data: any) {
    this.service.adjustItem(data).subscribe(res => {
      if (res.Status) {
        if (res.Data) {
          this.makeData(res.Data);
          this.clearInput();
        }
      }
      else {
        this.toast.error(res.ErrorMessages ? res.ErrorMessages[0] : "Lỗi không xác định!", this.translate.instant('Error'));
      }
    });
  }
  scanPOAdjust(data:any){
    this.service.scanPOAdjust(data).subscribe(res => {
      if (res.Status) {
        if (res.Data) {
          this.makeData(res.Data);
          this.scanStep = 'pallet';
          this.clearInput();
        }
        else {
          this.toast.error(res.ErrorMessages ? res.ErrorMessages[0] : "Lỗi không xác định!", this.translate.instant('Error'));
        }
      } else {
        this.toast.error(res.ErrorMessages ? res.ErrorMessages[0] : "Lỗi không xác định!", this.translate.instant('Error'));
      }
    });
  }
  resetPage() {
    window.location.reload();
  }

  clearInput() {
    if (this.inputScan) {
      this.inputScan.nativeElement.value = "";
    }
  }

  resetData() {
    this.data = {
      JobCode: "",
      POCode: "",
      ExternalCode: "",
      POStatus: "",
      POSessionCode: "",
      POSessionStatus: "",
      Details: [],
      PalletCode: "",
      PalletStatus: "",
      DetailScan:  []
    }
    this.appTable['renderData']([]);
    this.clearInput();
  }
  makeData(data: any) {
    let _data = {
      JobCode: data.JobCode,
      POCode: data.POCode,
      POLink: `/${this.rootPath}/purchaseorder/details/${data.POCode}`,
      ExternalCode: data.ExternalCode,
      POStatus: data.POStatus ? this.translate.instant(`POStatus.${data.POStatus}`) : "",
      POSessionCode: data.POSessionCode,
      POSessionStatus: data.POSessionStatus ? this.translate.instant(`POStatus.${data.POSessionStatus}`) : "",
      PalletCode: data.PalletCode,
      PalletLink: `/${this.rootPath}/transport-device/${data.PalletCode}`,
      PalletStatus: data.PalletStatus ? this.translate.instant(`DeviceStatus.${data.PalletStatus}`) : "",
      TotalSKU: data.TotalSKU,
      TotalUnit: data.TotalUnit,
      TotalAdjustSKU: data.TotalAdjustSKU,
      TotalAdjustUnit: data.TotalAdjustUnit,
      Details: data.Details,
      DetailScan: data.DetailScan,
      DetailAdjust: data.DetailAdjust
    }
    if (!_data.POCode) {
      this.scanStep = 'PO';
      this.inputPlaceholder = 'POAdjust.ScanPO';
    }
    else if (!_data.POSessionCode) {
      this.inputPlaceholder = 'POAdjust.ScanPOSessionCode';
    }
    else if (!_data.PalletCode) {
      this.inputPlaceholder = 'POAdjust.ScanPalletCode';
    } else {
      this.inputPlaceholder = 'POAdjust.ScanBarcode';
    }
    this.data = _data;
    this.IsFinish = _data.DetailAdjust && _data.DetailAdjust.length > 0 ? true : false;
    this.IsFinishPallet = !_data.PalletCode;
    this.IsFinishPO = this.IsFinish && !_data.PalletCode;
    
    this.appTable['renderData'](_data.Details);
    this.appTableAdjust['renderData'](_data.DetailScan);
    this.appTableTotalAdjust['renderData'](_data.DetailAdjust);
    this.clearInput();
  }

  GetCurrentTaskPOAdjust() {
    this.service.getCurrentTask({}).subscribe(res => {
      if (res.Status) {
        if (res.Data) {
          this.makeData(res.Data);
        }
      }
    });
    
  }
  scanPalletAdjustPO(data: any) {
    this.service.scanPalletAdjustPO(data).subscribe(res => {
      if (res.Status) {
        if (res.Data) {
          this.inputPlaceholder = 'POAdjust.ScanBarcode';
          this.makeData(res.Data);
          this.clearInput();
        }
      }
      else {
        this.toast.error(res.ErrorMessages ? res.ErrorMessages[0] : "Lỗi không xác định!", this.translate.instant('Error'));
      }
    });
  }
  scanAdjustItem(data: any) {
    this.service.adjustItem(data).subscribe(res => {
      if (res.Status) {
        if (res.Data) {
          this.makeData(res.Data);
          this.clearInput();
        }
        else {
          this.toast.error(res.ErrorMessages ? res.ErrorMessages[0] : "Lỗi không xác định!", this.translate.instant('Error'));
        }
      } else {
        this.toast.error(res.ErrorMessages ? res.ErrorMessages[0] : "Lỗi không xác định!", this.translate.instant('Error'));
      }
    });
  }
  callDates(date: any) {
    var current = new Date();
    // To calculate the time difference of two dates
    var diffTime = date.getTime() - current.getTime();

    // To calculate the no. of days between two dates
    return diffTime / (1000 * 3600 * 24);
  }
  initTableAction(): TableAction[] {
    return [
      {
        icon: "remove_circle",
        class: 'ac-remove',
        name: 'remove-item',
        toolTip: {
          name: "Xoá",
        },
        disabledCondition: (row: any) => {
          return true;
        }
      }
    ];
  }
  initTable() {
    this.tableAdjustConfig = {
      hoverContentText: "Chưa có sản phẩm nào đã quét",
      columns: {
        isContextMenu: false,
        actionTitle: this.translate.instant('action'),
        actions: this.initTableAction(),
        displayedColumns: [
          'index', 
          'SKU', 
          'SKUName', 
          'Barcode',
          // 'BaseBarcode', 
          'Uom', 
          'Qty',
          'BaseUom', 
          'BaseQty', 
          'actions'],
        options: [
          {
            title: 'POAdjust.SKU',
            name: 'SKU',
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${this.rootPath}/product/${data.ClientCode}/${data.WarehouseSiteId}/${data.SKU}`;
            }
          },
          {
            title: 'POAdjust.SKUName',
            name: 'SKUName',
            style: {
              "min-width": "180px"
            },
            showPrefix: 1
          },
          {
            title: 'Barcode',
            name: 'Barcode',
            style: {
              "min-width": "130px"
            }
          },
          {
            title: 'POAdjust.BaseBarcode',
            name: 'BaseBarcode'
          },
          {
            title: 'POAdjust.Uom',
            name: 'Uom',
            align: "center",
            style: {
              "min-width": "80px"
            }
          },
          {
            title: 'POAdjust.BaseUom',
            name: 'BaseUom',
            style: {
              'text-align': 'center',
              'display': 'inline-grid',
              'margin-right': '30px'
            }
          },
          {
            title: 'POAdjust.Qty',
            name: 'Qty',
            style: {
              'text-align': 'center',
              'display': 'inline-grid',
              'margin-right': '30px'
            }
          }, 
          {
            title: 'POAdjust.BaseQty',
            name: 'BaseQty',
            style: {
              'text-align': 'center',
              'display': 'inline-grid',
              'margin-right': '30px'
            }
          },
        ]
      },
      data: this.dataSourceGrid
    };
    this.tableConfig = {
      hoverContentText: "Chưa có sản phẩm nào đã quét",
      columns: {
        isContextMenu: false,
        displayedColumns: [
          'index', 'SKU', 'SKUName', 'Barcode', 'BaseUom', 'BaseQty', 'AdjustBaseQty', 'ActualBaseQty'],
        options: [
          {
            title: 'POAdjust.SKU',
            name: 'SKU',
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${this.rootPath}/product/${data.ClientCode}/${data.WarehouseSiteId}/${data.SKU}`;
            }
          },
          {
            title: 'POAdjust.SKUName',
            name: 'SKUName',
            showPrefix: 1
          },
          {
            title: 'Barcode',
            name: 'Barcode'
          },
          {
            title: 'POAdjust.BaseUom',
            name: 'BaseUom',
            style: {
              'text-align': 'center',
              'display': 'inline-grid',
              'margin-right': '30px'
            }
          },
          {
            title: 'POAdjust.ReceiveQty',
            name: 'BaseQty',
            style: {
              'text-align': 'center',
              'display': 'inline-grid',
              'margin-right': '30px'
            }
          },
          {
            title: 'POAdjust.QtyAdjust',
            name: 'AdjustBaseQty' ,
            style: {
              'text-align': 'center',
              'display': 'inline-grid',
              'margin-right': '30px'
            }
          },
          {
            title: 'POAdjust.ActualQty',
            name: 'ActualBaseQty',
            style: {
              'text-align': 'center',
              'display': 'inline-grid',
              'margin-right': '30px'
            }
          }
        ]
      },
      data: this.dataSourceGrid
    };
    this.tableTotalAdjustConfig = {
      hoverContentText: "Chưa có sản phẩm nào đã quét",
      columns: {
        isContextMenu: false,
        displayedColumns: [
          'index', 'TransportDeviceCode', 'SKU', 'SKUName', 'Barcode', 'BaseUom', 'BaseQty', 'AdjustBaseQty', 'ActualBaseQty'],
        options: [
          {
            title: 'POAdjust.PalletCode',
            name: 'TransportDeviceCode'
          },
          {
            title: 'POAdjust.SKU',
            name: 'SKU',
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${this.rootPath}/product/${data.ClientCode}/${data.WarehouseSiteId}/${data.SKU}`;
            }
          },
          {
            title: 'POAdjust.SKUName',
            name: 'SKUName',
            showPrefix: 1
          },
          {
            title: 'Barcode',
            name: 'Barcode'
          },
          {
            title: 'POAdjust.BaseUom',
            name: 'BaseUom',
            style: {
              'text-align': 'center',
              'display': 'inline-grid',
              'margin-right': '30px'
            }
          },
          {
            title: 'POAdjust.ReceiveQty',
            name: 'BaseQty',
            style: {
              'text-align': 'center',
              'display': 'inline-grid',
              'margin-right': '30px'
            }
          },
          {
            title: 'POAdjust.QtyAdjust',
            name: 'AdjustBaseQty' ,
            style: {
              'text-align': 'center',
              'display': 'inline-grid',
              'margin-right': '30px'
            }
          },
          {
            title: 'POAdjust.ActualQty',
            name: 'ActualBaseQty',
            style: {
              'text-align': 'center',
              'display': 'inline-grid',
              'margin-right': '30px'
            }
          }
        ]
      },
      data: this.dataSourceGrid
    };
  }
  initEvent() {
    this.appTableAdjust['actionEvent'].subscribe({
      next: (event: any) => {
        if (!event) {
          return;
        }
        const action = event["action"];
        switch (action) {
          case 'remove-item':
            this.confirmRemoveItem(event.data)
            break;
        }
      }
    });
  }
  confirmRemoveItem(row: any) {
    if (this.data.POCode && this.data.PalletCode) {
      const dialogRef = this.dialog.open(NotificationComponent, {
        data: {
          message: `Bạn có muốn xóa dòng SKU [${row.SKU}] - Barcode [${row.Barcode}]?`,
          type: 1
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          row['JobCode'] = this.data.JobCode;
          row['POCode'] = this.data.POCode;
          row['PalletCode'] = this.data.PalletCode;
          this.removeItem(row);
        }
      });
    }
  }
  removeItem(data: any) {
    if (this.data.POCode && this.data.PalletCode) {
      this.service.removeAdjustItem(data).subscribe(res => {
        if (res.Status) {
          if (res.Data) {
            this.inputPlaceholder = 'POAdjust.ScanBarcode';
            this.makeData(res.Data);
            this.clearInput();
          }
        }
        else {
          this.toast.error(res.ErrorMessages ? res.ErrorMessages[0] : "Lỗi không xác định!", this.translate.instant('Error'));
        }
      });
    }
  }
  finishPOAdjust() {
    if (this.data.POCode) {
      const dialogRef = this.dialog.open(NotificationComponent, {
        data: {
          message: `Bạn chắc chắn muốn kết thúc điều chỉnh PO ${this.data.POCode}?`,
          type: 1
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let data = {
            JobCode: this.data.JobCode,
            POCode: this.data.POCode,
            SessionCode: this.data.POSessionCode,
            PalletCode: this.data.PalletCode,
            IsAdjust: this.data.TotalAdjustUnit > 0
          };
          this.service.finishPOAdjust(data).subscribe((res: any) => {
            if (res.Status) {
              this.toast.success(`Kết thúc điều chỉnh thành công`, 'success_title');
              location.reload();
            }
            else {
              this.toast.error(res.ErrorMessages ? res.ErrorMessages[0] : "Lỗi không xác định!", this.translate.instant('Error'));
            }
          });
        }
      });
    }
  }
  finishPalletAdjust() {
    if (this.data.PalletCode) {
      const dialogRef = this.dialog.open(NotificationComponent, {
        data: {
          message: `Bạn chắc chắn muốn hoàn thành điều chỉnh Pallet ${this.data.PalletCode}?`,
          type: 1
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let data = {
            JobCode: this.data.JobCode,
            POCode: this.data.POCode,
            SessionCode: this.data.POSessionCode,
            PalletCode: this.data.PalletCode
          };
          this.service.finishPalletAdjust(data).subscribe((res: any) => {
            if (res.Status) {
              this.makeData(res.Data);
              this.scanStep = 'pallet';
              this.clearInput();
              this.toast.success(`Hoàn thành Pallet thành công`, 'success_title');
            }
            else {
              this.toast.error(res.ErrorMessages ? res.ErrorMessages[0] : "Lỗi không xác định!", this.translate.instant('Error'));
            }
          });
        }
      });
    }
  }
  backToPO(){
    if (this.data.POCode) {
      const dialogRef = this.dialog.open(NotificationComponent, {
        data: {
          message: `Bạn chắc chắn muốn kết thúc điều chỉnh PO ${this.data.POCode}?`,
          type: 1
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let data = {
            JobCode: this.data.JobCode,
            POCode: this.data.POCode,
            SessionCode: this.data.POSessionCode,
            PalletCode: this.data.PalletCode,
            IsAdjust: this.data.TotalAdjustUnit > 0
          };
          this.service.finishPOAdjust(data).subscribe((res: any) => {
            if (res.Status) {
              location.reload();
            }
            else {
              this.toast.error(res.ErrorMessages ? res.ErrorMessages[0] : "Lỗi không xác định!", this.translate.instant('Error'));
            }
          });
        }
      });
    }
  }
}
