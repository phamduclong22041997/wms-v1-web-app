import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../../shared/toast.service';
import { Service } from '../../service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationComponent } from '../../../components/notification/notification.component';
import { PrintService } from '../../../shared/printService';
import { Utils } from '../../../shared/utils';
import { Hotkeys } from '../../../shared/hotkeys.service';
import * as moment from 'moment';
import { ConfirmAdjustProductExpiredDateComponent } from './confirm/component';

interface TableAction {
  icon: string;
  class?: string;
  name?: String;
  toolTip?: any;
  actionName?: any;
  style?: any;
  disabledCondition?: any;
}

@Component({
  selector: 'app-so-AdjustProduct',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class CreateProductListComponent implements OnInit, AfterViewInit {
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('code', { static: false }) inputScan: ElementRef;
  code: string;
  SOCode: string;
  tableConfig: any;
  tableAdjustConfig: any;
  type: string;
  inputPlaceholder: string = 'AdjustProduct.ContentHolder';
  IsFinish: boolean = false;
  scanStep: string;
  data: any = {
    LocationLabel: "",
    SubLocationLabel: "",
    ClientCode: "",
    DCSite: "",
    TotalSKU: 0,
    TotalUnit: 0,
    Details: [],
    DetailScan: []
  }
  dataSourceGrid = {
    rows: <any>[],
    total: 0
  };

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
    this.inputPlaceholder = 'AdjustProduct.ScanLocation';
    this.data = {
      LocationLabel: "",
      SubLocationLabel: "",
      ClientCode: "",
      DCSite: "",
      TotalSKU: 0,
      TotalUnit: 0,
      Details: [],
      DetailScan: []
    }
    this.initTable();
  }

  ngAfterViewInit() {
    this.initEvent();
  }
  onEnter(event: any) {
    let code = event.target['value'];
    code = code.trim();
    this.scanAdjustProduct({ Code: code });
  }
  scanAdjustProduct(data:any){
    this.service.scanAdjustProduct(data)
      .subscribe((resp: any) => {
        if (resp.Status == false) {
          this.toast.error(resp.ErrorMessages.join("\n"), 'error_title');
        } else {
          this.makeData(resp.Data);
        }
      })
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
      Details: [],
    }
    this.appTable['renderData']([]);
    this.clearInput();
  }
  makeData(data: any) {
    let _data = {
      ClientCode: data.ClientCode,
      WarehouseSiteId: data.WarehouseSiteId,
      DCSite: data.DCSite,
      LocationLabel: data.LocationLabel,
      SubLocationLabel: data.SubLocationLabel,
      TotalSKU: data.TotalSKU,
      TotalUnits: data.TotalUnits,
      Details: data.Details
    }
    this.data = _data;
    this.appTable['renderData'](_data.Details);
    this.clearInput();
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
        icon: "date_range",
        name: 'edit-date',
        toolTip: {
          name: "Thay đổi hạn sử dụng sản phẩm",
        },
        class: "ac-task",
        disabledCondition: (row: any) => {
          return ((row.ExpiredDate || (!row.ExpiredDate && row.ExpirationType == "Day")) && row.PendingOutQty <= 0);
        }
      }
    ];
  }
  initTable() {
    this.tableConfig = {
      hoverContentText: "Chưa có sản phẩm nào đã quét",
      columns: {
        isContextMenu: false,
        actionTitle: this.translate.instant('action'),
        actions: this.initTableAction(),
        displayedColumns: [
          'index', 'SKU', 'SKUName', 'Uom', 'LotNumber', 'Qty', 'ManufactureDate', 'ExpiredDate', 'actions'],
        options: [
          {
            title: 'AdjustProduct.SKU',
            name: 'SKU',
            style: {
              "min-width": "75px",
              "max-width": "100px",
            }
          },
          {
            title: 'AdjustProduct.SKUName',
            name: 'SKUName',
            style: {
              "min-width": "175px",
              "max-width": "250px",
            }
          },
          {
            title: 'AdjustProduct.Uom',
            name: 'Uom',
            style: {
              'text-align': 'center',
              'display': 'inline-grid',
              'margin-right': '30px'
            }
          },
          {
            title: 'AdjustProduct.LotNumber',
            name: 'LotNumber',
          },
          {
            title: 'AdjustProduct.Qty',
            name: 'Qty',
            style: {
              'text-align': 'center',
              'display': 'inline-grid',
              'margin-right': '30px'
            }
          }, 
          {
            title: 'AdjustProduct.ExpiredDate',
            name: 'ExpiredDate'
          },  
          {
            title: 'AdjustProduct.ManufactureDate',
            name: 'ManufactureDate'
          },
        ]
      },
      data: this.dataSourceGrid
    };
  }
  initEvent() {
    this.appTable['actionEvent'].subscribe({
      next: (event: any) => {
        if (!event) {
          return;
        }
        const action = event["action"];
        switch (action) {
          case 'edit-date':
            this.updateExpiredDate(event.data)
            break;
        }
      }
    });
  }
  removeItemAdjust(data: any) {
    if (data.LotNumber) {
      const _dialogRef = this.dialog.open(NotificationComponent, {
        data: {
          message: `Sản phầm có quản lý Lot/ Batch. Thao tác sẽ thay đổi tất cả các sản phẩm chung Lot/ Batch với sản phẩm này ? (Yes/ No)`,
          type: 1
        }
      });
      _dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let _data = {
            JobCode: this.data.JobCode,
            Item: data
          };
          this.service.removeAdjustItem(_data).subscribe((resp: any) => {
            if (resp.Status == false) {
              this.toast.error(resp.ErrorMessages.join("\n"), 'error_title');
            } else {
              this.makeData(resp.Data);
            }
          })
        }
      });
    }
  }
  confirmAdjustItem(data: any){
    const dialogRef = this.dialog.open(ConfirmAdjustProductExpiredDateComponent, {
      disableClose: true,
      data: {
        title: this.translate.instant('AdjustProduct.AdjustProductExpiredDate'),
        data: data
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.AdjustExpiredDate == result.data.ExpiredDate && result.AdjustManufactureDate == result.data.ManufactureDate) {
          this.toast.error(`SKU ${result.data.SKU} không thay đổi HSD so với dữ liệu cũ. Vui lòng kiểm tra lại!`, 'error_title');
          return;
        }
        let _data = result.data;
        _data['ClientCode'] = this.data.ClientCode;
        _data['WarehouseSiteId'] = this.data.WarehouseSiteId;
        _data['ExpiredDate'] = result.ExpiredDate;
        _data['ManufactureDate'] = result.ManufactureDate;
        _data['AdjustExpiredDate'] = result.AdjustExpiredDate;
        _data['AdjustManufactureDate'] = result.AdjustManufactureDate;
        this.service.adjustItem(_data).subscribe((resp: any) => {
          if (resp.Status == false) {
            this.toast.error(resp.ErrorMessages.join("\n"), 'error_title');
          } else {
            this.toast.success(`Đã update thành công HSD của sản phẩm!`, "success_title")
            this.makeData(resp.Data);
          }
        })
      }
    });
  }
  updateExpiredDate(data: any) {
    if (data.LotNumber) {
      const _dialogRef = this.dialog.open(NotificationComponent, {
        data: {
          message: `Sản phầm có quản lý Lot/ Batch. Hệ thống sẽ thay đổi tất cả các sản phẩm chung Lot/ Batch với sản phẩm này ? (Yes/ No)`,
          type: 1
        }
      });
      _dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.confirmAdjustItem(data);
        }
      });
    } else {
      this.confirmAdjustItem(data);
    }
  }
  exit() {
    window.location.reload();
  }
}
