import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../../shared/toast.service';
import { Service } from '../../service';
import { ActivatedRoute } from '@angular/router';
import { NotificationComponent } from '../../../components/notification/notification.component';
import { StationComponent } from './station/station.component';
import { PackageEvenComponent } from './packageEven/component';
import { PrintService } from '../../../shared/printService';
import { Utils } from '../../../shared/utils';
import { Hotkeys } from '../../../shared/hotkeys.service';
import { CONFIRMQTY, NUMBERIC } from '../../../shared/constant';
import { ConfirmPackingPrintLabelComponent } from './confirm-print/component';
import * as moment from 'moment';
import { ConfirmQtyComponent } from './confirmQty/component';
const timezone = "Asia/Ho_Chi_Minh";

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
  selector: 'app-so-packing',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class SOPackingComponent implements OnInit, AfterViewInit {
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('appTableSO', { static: false }) appTableSO: ElementRef;
  @ViewChild('appTablePackage', { static: false }) appTablePackage: ElementRef;
  @ViewChild('code', { static: false }) inputScan: ElementRef;
  IsReady: boolean = false;
  code: string;
  SOCode: string;
  tableConfig: any;
  tableSOConfig: any;
  tablePackageConfig: any;
  type: string;
  inputPlaceholder: string = 'SOPacking.ContentHolder';
  client = '';
  showScan: boolean;
  IsFinishPacking: boolean;
  scanStep: string;
  IsCountingGoods: boolean;
  IsPacking: boolean;
  IsPackingEven: boolean = false;
  AllowPacking: boolean;
  IsScanBarcode: boolean;
  IsConformQty: boolean;
  StationCode: string;
  data: any = {
    JobCode: "",
    TransportCode: "",
    PickListCode: "",
    Status: "",
    Type: "",
    SOType: "",
    SOCode: "",
    ClientCode: "",
    CreatedDate: "",
    DOCode: "",
    SOStatus: "",
    SOCreatedDate: "",
    PointCode: "",
    StoreName: "",
    TotalSOPacked: 0,
    TotalSKU: 0,
    TotalQty: 0,
    TotalPackage: 0,
    TotalUnitPackage: 0,
    TotalSOPackedScan: 0,
    TotalSKUScan: 0,
    TotalQtyScan: 0,
    PickListDetailPacking: [],
    PickListDetailPackage: [],
    Packages: [],
    SortCode: ""
  }

  dataSourceGrid = {
    rows: <any>[],
    total: 0
  };
  dataSOSourceGrid = {
    rows: <any>[],
    total: 0
  };
  dataSOPackageSourceGrid = {
    rows: <any>[],
    total: 0
  };

  constructor(
    public dialog: MatDialog,
    private service: Service,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private printService: PrintService,
    private toast: ToastService,
    private hotkeys: Hotkeys) {
    this.code = this.route.snapshot.params.code;
  }

  ngOnInit() {
    this.scanStep = "";
    this.IsScanBarcode = false;
    this.IsPacking = true;
    this.IsPackingEven = true;
    this.IsConformQty = CONFIRMQTY;
    this.initTable();
    this.getCurrentTaskPacking();
  }

  ngAfterViewInit() {
    this.initEvent();
    this.hotkeys.addShortcut({ keys: 'alt.a'}).subscribe(()=>{
      this.printPointSummary(null);
    });
    this.hotkeys.addShortcut({ keys: 'alt.d'}).subscribe(()=> {
      this.onClickPrintInventoryDeliveryByPacking(0);
    });
    this.hotkeys.addShortcut({ keys: 'alt.g'}).subscribe(()=> {
      this.createPackage();
    });
    this.hotkeys.addShortcut({ keys: 'alt.f'}).subscribe(()=> {
      this.finishPacking();
    });
  }
  onEnter(event: any) {
    let code = event.target['value'];
    code = code.trim();
    if (!this.data['PickListCode']) {
      this.scanTote({ TransportCode: code });
    } else if (this.IsConformQty) {
      this.service.scanCodePacking({Code: code, JobCode: this.data.JobCode, ClientCode: this.data.ClientCode}).subscribe(res => {
        if (res.Status) {
          let data = res.Data;
          data.SOCode = this.data.SOCode;
          data.ToteCode = this.data.TransportCode;
          data.title = this.translate.instant('SOPacking.InputQtyScan');
          const dialogRef = this.dialog.open(ConfirmQtyComponent, {
            disableClose: true,
            data: data
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.ConfirmScanBarCode(result)
            }
          });
        } else {
          this.toast.error(res.ErrorMessages ? res.ErrorMessages[0] : "Lỗi không xác định!", this.translate.instant('Error'));
        }
      });
    }
    else {
      this.ConfirmScanBarCode(code);
    }
  }
  ConfirmScanBarCode(code:any){
    let data = {
      JobCode: this.data.JobCode,
      Code: code,
      PickListCode: this.data.PickListCode,
      TransportDeviceCode: this.data.TransportCode,
      SOCode: this.data.SOCode,
      PointCode: this.data.PointCode,
      ClientCode: this.data.ClientCode
    };
    this.scanBarcode(data);
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
      TransportCode: "",
      PickListCode: "",
      Status: "",
      StoreName: "",
      StatusCode: "",
      SiteId: "",
      Type: "",
      SOCode: "",
      ClientCode: "",
      CreatedDate: "",
      DOCode: "",
      SOStatus: "",
      SOCreatedDate: "",
      PointCode: "",
      TotalSOPacked: 0,
      TotalSKU: 0,
      TotalQty: 0,
      TotalPackage: 0,
      TotalUnitPackage: 0,
      TotalSOPackedScan: 0,
      TotalSKUScan: 0,
      TotalQtyScan: 0,
      PickListDetailPacking: [],
      PickListDetailPackage: [],
      Packages: [],
      SortCode: ""
    }
    this.appTable['renderData']([]);
    this.appTableSO['renderData']([]);
    this.appTablePackage['renderData']([]);
    this.clearInput();
  }
  makeData(data: any) {
    let _data = {
      JobCode: data.JobCode,
      TransportCode: data.TransportCode || "",
      PickListCode: data.PickListCode || "",
      Status: this.translate.instant(`PickListStatus.${data.Status}`),
      StatusCode: data.SOStatus,
      SiteId: data.SiteId,
      Type: data.Type || "",
      SOType: data.SOType ? this.translate.instant(`SOType.${data.SOType}`) : "",
      SOTypeClass: data.SOType,
      SOCode: data.SOCode || "",
      ClientCode: data.ClientCode || "",
      CreatedDate: data.CreatedDate || "",
      DOCode: data.DOCode || "",
      SOStatus: this.translate.instant(`PickListStatus.${data.SOStatus}`),
      PackedType: data.PackedType || "",
      SOCreatedDate: data.SOCreatedDate || "",
      PointCode: data.PointCode || "",
      StoreName: data.StoreName || "",
      TotalSOPacked: data.TotalSOPacked || 0,
      TotalSKU: data.TotalSKU || 0,
      TotalQty: data.TotalQty || 0,
      TotalPackage: data.TotalPackage || 0,
      TotalUnitPackage: data.TotalUnitPackage || 0,
      TotalSOPackedScan: data.TotalSOPackedScan || 0,
      TotalSKUScan: data.TotalSKUScan || 0,
      TotalQtyScan: data.TotalQtyScan || 0,
      PickListDetailPacking: data.PickListDetailPacking,
      PickListDetailPackage: data.PickListDetailPackage,
      Packages: data.Packages,
      Address: data.Address,
      IsPackingEven: data.IsPackingEven || 1,
      SortCode: data.SortCode || "",
      WarehouseSiteId: data.WarehouseSiteId || "",
      PackingStation: data.PackingStation || ''
    }    
    if (data.SOType == 'Even') {
      this.IsPackingEven = false;
    } else {
      this.IsPackingEven = true;
    }
    if (!_data.PackedType && _data.PickListDetailPackage.length <= 0) {
      this.IsCountingGoods = false;
    }
    this.data = _data;
    this.appTable['renderData'](_data.PickListDetailPackage);
    this.appTableSO['renderData'](_data.PickListDetailPacking);
    this.appTablePackage['renderData'](_data.Packages);

    this.clearInput();
    if (_data.TotalQty > 0 && _data.TotalUnitPackage > 0 && _data.TotalQty === _data.TotalUnitPackage) {
      this.IsFinishPacking = true;
    }

    if (_data.TotalSKUScan == 0) {
      this.inputPlaceholder = 'SOPacking.SelectType';
      this.IsPacking = false;
      this.IsPackingEven = false;
    } else {
      this.IsPacking = true;
      this.IsPackingEven = true;
    }

    let allowPacking = false;
    for (let idx in _data.PickListDetailPackage || {}) {
      if (!_data.PickListDetailPackage[idx].PackageNo) {
        allowPacking = true;
      }
      break;
    }
    this.AllowPacking = allowPacking;

    let stationCode = window.localStorage.getItem("STATION_CODE");
    if (!stationCode || (_data.PackingStation && stationCode != _data.PackingStation)) {
      window.localStorage.setItem("STATION_CODE", _data.PackingStation);
      this.StationCode = _data.PackingStation;
    }
  }

  getCurrentTaskPacking() {
    this.service.getCurrentPackingTask().subscribe(res => {
      if (res.Status) {
        if (res.Data) {
          this.inputPlaceholder = 'SOPacking.ScanBarcode';
          this.scanStep = 'barcode';
          this.IsScanBarcode = true;
          this.makeData(res.Data);
        }
        else if (this.code) {
          this.scanTote({ TransportCode: this.code });
        }
        else {
          this.StationCode = this.showScanStationCode();
        }
      }
      this.IsReady = true;
    });
  }
  scanTote(data: any) {
    let stationCode = this.showScanStationCode();
    if (!stationCode) {
      return;
    }
    data['StationCode'] = stationCode;
    this.service.scanTote(data).subscribe(res => {
      if (res.Status) {
        if (res.Data) {
          this.inputPlaceholder = 'SOPacking.ScanBarcode';
          this.scanStep = 'barcode';
          this.IsScanBarcode = true;
          this.makeData(res.Data);
          this.clearInput();
        }
      }
      else {
        this.toast.error(res.ErrorMessages ? res.ErrorMessages[0] : "Lỗi không xác định!", this.translate.instant('Error'));
      }
    });
  }
  scanBarcode(data: any) {
    let stationCode = this.showScanStationCode();
    if (!stationCode) {
      return;
    }
    data['StationCode'] = stationCode;
    this.service.Packingitem(data).subscribe(res => {
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
          return (row.IsCancel);
        }
      }
    ];
  }
  initTablePackageAction(): TableAction[] {
    return [
      {
        icon: "print",
        name: 'print-label',
        class: 'ac-task',
        style: {
          "max-width": "80px",
        },
        toolTip: {
          name: this.translate.instant(`SODetails.PrintLable`),
        },
        disabledCondition: (row: any) => {
          return row.PackageNo;
        }
      }
    ];
  }
  initTable() {
    this.tableConfig = {
      hoverContentText: "Chưa có sản phẩm nào đã quét",
      // disablePagination: true,
      columns: {
        isContextMenu: false,
        actionTitle: this.translate.instant('SOPacking.Action'),
        actions: this.initTableAction(),
        displayedColumns: [
          'index', 'SKU', 'Name', 'ScanBarcode', 'ScanQty', 'ScanUomName', 'BaseQty', 'BaseUomName', 'PackageNo', 'actions'],
        options: [
          {
            title: 'SOPacking.SKU',
            name: 'SKU',
            style: {
              "max-width": "100px",
            }
          },
          {
            title: 'SOPacking.SKUName',
            name: 'Name'
          },
          {
            title: 'Barcode',
            name: 'ScanBarcode',
            style: {
              "max-width": "150px",
            }
          },
          {
            title: 'SOPacking.QtyUnit',
            name: 'ScanQty',
            style: {
              "max-width": "80px",
            }
          },
          {
            title: 'SOPacking.RequestUom',
            name: 'ScanUomName',
            style: {
              "max-width": "80px",
            },
            render: (data: any) => {
              return data.ScanUomName ? data.ScanUomName : data.ScanUom;
            },
          },
          {
            title: 'SOPacking.Qty',
            name: 'BaseQty',
            style: {
              "max-width": "80px",
            }
          },
          {
            title: 'SOPacking.BaseUom',
            name: 'BaseUomName',
            style: {
              "max-width": "80px",
            },
            render: (data: any) => {
              return data.BaseUomName ? data.BaseUomName : data.BaseUom;
            },
          },
          {
            title: 'SOPacking.PackageNo',
            name: 'PackageNo',
            style: {
              "max-width": "150px",
            }
          }
        ]
      },
      data: this.dataSourceGrid
    };

    this.tableSOConfig = {
      hoverContentText: "Không có sản phẩm nào",
      // disablePagination: true,
      columns: {
        isContextMenu: false,
        displayedColumns: [
          'index', 'SKU', 'Name', /*'Barcode',*/ 'Qty', 'UomName', 'PackedQty'],
        options: [
          {
            title: 'SOPacking.SKU',
            name: 'SKU',
            style: {
              "max-width": "100px",
            }
          },
          {
            title: 'SOPacking.SKUName',
            name: 'Name',
            class: 'text-center',
          },
          {
            title: 'SOPacking.Qty',
            name: 'Qty',
            align: "center",
            style: {
              "max-width": "80px",
            }
          },
          {
            title: 'SOPacking.BaseUom',
            name: 'UomName',
            align: "center",
            style: {
              "max-width": "80px",
            }
          },
          {
            title: 'SOPacking.QtyPacking',
            name: 'PackedQty',
            align: "center",
            style: {
              "max-width": "100px",
            }
          }
        ]
      },
      data: this.dataSOSourceGrid
    };

    this.tablePackageConfig = {
      hoverContentText: "Không có kiện nào",
      // disablePagination: true,
      columns: {
        isContextMenu: false,
        actionTitle: this.translate.instant('SOPacking.Action'),
        actions: this.initTablePackageAction(),
        displayedColumns: [
          'index', 'DOCode', 'PackageNo', 'Qty', 'actions'],
        options: [
          {
            title: 'SOPacking.DOCode',
            name: 'DOCode',
            class: 'text-center',
          },
          {
            title: 'SOPacking.PackageNo',
            name: 'PackageNo',
            class: 'text-center',
            style: {
              "min-width": "100px",
              "max-width": "100px"
            }
          },
          {
            title: 'SOPacking.QtyPackage',
            name: 'Qty',
            class: 'text-center',
            align: "center"
          }
        ]
      },
      data: this.dataSOPackageSourceGrid
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
          case 'remove-item':
            this.confirmRemoveItem(event.data)
            break;
        }
      }
    });
    this.appTablePackage['actionEvent'].subscribe({
      next: (event: any) => {
        if (!event) {
          return;
        }
        const action = event["action"];
        switch (action) {
          case 'print-label':
            this.printSOLabelForPackage(event)
            break;
        }
      }
    });
  }
  async printSOLabelForPackage(event: any) {
    const labelData = JSON.parse(JSON.stringify(event.data))
    const printer = window.localStorage.getItem("_printer");
    if (!printer) {
      this.toast.error(`Vui lòng chọn máy in`, 'error_title');
      return;
    }
    if(this.data.TotalPackage == this.data.Packages.length) {
      await this.doPrintPackageOdd(labelData, printer);
    } else {
      labelData['TotalPackage'] = this.data.TotalPackage;
      const dialogRef = this.dialog.open(ConfirmPackingPrintLabelComponent, { 
        disableClose: true,
        data: {
          title: this.translate.instant('Print.PrintLabelOption'),
          info: labelData,
          type: 1
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if(result.EndPackage - result.StartPackage > 100) {
            this.toast.error(`Vui lòng không in quá 100 nhãn 1 lần`, 'error_title');
            return;
          }
          this.doPrintPackageEven(labelData, result, printer);
        }
      });
    }
  }
  async doPrintPackageEven(dataLabel: any, result: any, printer: string) {
    const listLabel = [];
    const WarehouseCode = window.localStorage.getItem('_warehouse');
    const StrPrintDate = moment(new Date()).tz(timezone).format("DD.MM.YYYY");
    for(let i  = parseInt(result.StartPackage); i<= parseInt(result.EndPackage); i ++) {
      let label = Object.assign({}, dataLabel)
      label['PackageGroup'] = i;
      label['WarehouseCode'] = WarehouseCode || "";
      label['TotalPackage'] = this.data.TotalPackage.toString() || "";
      label['DeliveryOrder'] = this.data.ExternalCode || label.DOCode;
      label['GatheredPoint'] = this.data.PackedLocationLabel || this.data.PointCode;
      label['SiteId'] = this.data.SiteId || "";
      label['StoreName'] = this.data.StoreName || "";
      label['StatusCode'] = this.data.StatusCode || "";
      label['StrPrintDate'] = StrPrintDate;
      label['QrCodeText'] = `${label.SiteId}|${label.DeliveryOrder}|${label.SOCode}|${label.PackageNo}|${label.GatheredPoint}|${i}/${this.data.TotalPackage}`;
      label['SortCode'] = this.data.SortCode
      listLabel.push(label);
    }
    const dataPrint = this.printService.repairMultiDataLabel50mm_100mm(listLabel);
    let resultPrint = {
      success: 0,
      fail: 0
    }
    let printRS = null;
    if (printer == 'InTrucTiep') {
      printRS = await this.printService.sendToSmartPrintV1(dataPrint);
    } else {
      printRS = await this.printService.sendToSmartPrintV2(dataPrint, dataPrint.keygen, printer);
    }
    printRS ? resultPrint.success++ : resultPrint.fail++
    if (resultPrint.success > 0) {
      this.toast.success(`In label: thành công !`, 'success_title');
    } else {
      this.toast.error(`In label thất bại: ${resultPrint.fail} !`, 'error_title');
    }
  }
  async doPrintPackageOdd(data: any, printer: string) {
    const dataLabel = JSON.parse(JSON.stringify(data));
    const listLabel = [];
    listLabel.push(dataLabel);
    const WarehouseCode = window.localStorage.getItem('_warehouse');
    const printTotalPackage = ['StoredAfterPacked', 'StoringAfterPacked', 'CountedAndEnclosed'];
    const StrPrintDate = moment(new Date()).tz(timezone).format("DD.MM.YYYY");
    for (let label of listLabel) {
      label['WarehouseCode'] = WarehouseCode || "";
      label['TotalPackage'] = this.IsFinishPacking ? this.data.TotalPackage.toString() : "";
      label['DeliveryOrder'] = this.data.ExternalCode || label.DOCode;
      label['GatheredPoint'] = this.data.PackedLocationLabel || this.data.PointCode;
      label['SiteId'] = this.data.SiteId || "";
      label['StoreName'] = this.data.StoreName || "";
      label['StatusCode'] = this.data.StatusCode || "";
      label['StrPrintDate'] = StrPrintDate;
      label['QrCodeText'] = `${label.SiteId}|${label.DeliveryOrder}|${label.SOCode}|${label.PackageNo}|${label.GatheredPoint}|1/${this.data.TotalPackage}`;
      label['SortCode'] = this.data.SortCode
    }
    const dataPrint = this.printService.repairMultiDataLabel50mm_100mm(listLabel);
    let resultPrint = {
      success: 0,
      fail: 0
    }
    let printRS = null;
    if (printer == 'InTrucTiep') {
      printRS = await this.printService.sendToSmartPrintV1(dataPrint);
    } else {
      printRS = await this.printService.sendToSmartPrintV2(dataPrint, dataPrint.keygen, printer);
    }
    printRS ? resultPrint.success++ : resultPrint.fail++
    if (resultPrint.success > 0) {
      this.toast.success(`In label: thành công !`, 'success_title');
    } else {
      this.toast.error(`In label thất bại: ${resultPrint.fail} !`, 'error_title');
    }
  }
  confirmRemoveItem(row: any) {
    if (this.data.PickListCode) {
      const dialogRef = this.dialog.open(NotificationComponent, {
        data: {
          message: `Bạn có muốn xóa dòng SKU [${row.SKU}] - Barcode [${row.ScanBarcode}]?`,
          type: 1
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.removeItem(row);
        }
      });
    }
  }
  showScanStationCode() {
    let stationCode = window.localStorage.getItem("STATION_CODE");
    if (!stationCode) {
      const dialogRef = this.dialog.open(StationComponent, {
        disableClose: true,
        data: {}
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.StationCode = window.localStorage.getItem("STATION_CODE");
        }
      });
    }
    return stationCode;
  }
  showInputStation() {
    let stationCode = window.localStorage.getItem("STATION_CODE");
    let current_station = this.StationCode;
    const dialogRef = this.dialog.open(StationComponent, {
      disableClose: true,
      data: {
        Code: stationCode
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let new_station = window.localStorage.getItem("STATION_CODE");
        if (current_station && new_station && current_station != new_station) {
          //revert zone to packing station
          window.localStorage.setItem("STATION_CODE", current_station);
          this.toast.error(`Vui lòng nhập đúng Zone đóng gói [${current_station}]`, 'error_title');
        }
      }
    });
  }
  removeItem(data: any) {
    let stationCode = this.showScanStationCode();
    if (!stationCode) {
      return;
    }
    if (this.data.PickListCode && this.data.JobCode && this.data.SOCode) {
      let req = {
        JobCode: this.data.JobCode,
        PickListCode: this.data.PickListCode,
        TransportDeviceCode: this.data.TransportCode,
        SOCode: this.data.SOCode,
        PointCode: this.data.PointCode,
        SKU: data.SKU,
        Name: data.Name,
        BaseQty: data.BaseQty,
        ScanQty: data.ScanQty,
        ScanBarcode: data.ScanBarcode,
        BaseBarcode: data.BaseBarcode,
        BaseUom: data.BaseUom,
        ScanUom: data.ScanUom,
        PackageNo: data.PackageNo || "",
        PackageGroup: data.PackageGroup || null,
        ConditionType: data.ConditionType,
        StationCode: stationCode
      }
      this.service.removeItem(req).subscribe(res => {
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
  }
  createPackage() {
    let stationCode = this.showScanStationCode();
    if (!stationCode) {
      return;
    }
    if (this.data.PickListCode) {
      let data = {
        JobCode: this.data.JobCode,
        PickListCode: this.data.PickListCode,
        TransportDeviceCode: this.data.TransportCode,
        SOCode: this.data.SOCode,
        StationCode: stationCode
      };
      this.service.createPackage(data).subscribe((res: any) => {
        if (res.Status) {
          if (res.Data) {
            this.makeData(res.Data);
            let currentPackage = this.data.Packages[0];
            this.printSOLabelForPackage({data: currentPackage});
            this.clearInput();
          }
        }
        else {
          this.toast.error(res.ErrorMessages ? res.ErrorMessages[0] : "Lỗi không xác định!", this.translate.instant('Error'));
        }
      });
    }
  }
  finishPacking() {
    let stationCode = this.showScanStationCode();
    if (!stationCode) {
      return;
    }
    if (this.data.PickListCode) {
      const dialogRef = this.dialog.open(NotificationComponent, {
        data: {
          message: `Bạn chắc chắn muốn kết thúc đóng gói SO ${this.data.SOCode}?`,
          type: 1
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let data = {
            JobCode: this.data.JobCode,
            PickListCode: this.data.PickListCode,
            TransportDeviceCode: this.data.TransportCode,
            SOCode: this.data.SOCode,
            PointCode: this.data.PointCode,
            StationCode: stationCode
          };
          this.service.finishPacking(data).subscribe((res: any) => {
            if (res.Status) {
              this.toast.success('Hoàn thành kiểm đếm/đóng gói thành công', "success_title");
              const dialogPrintRef = this.dialog.open(NotificationComponent, {
                data: {
                  message: `Bạn có muốn in phiếu xuất kho cho SO ${this.data.SOCode}?`,
                  type: 1
                }
              });
              dialogPrintRef.afterClosed().subscribe(result => {
                if (result) {
                  this.onClickPrintInventoryDeliveryByPacking(1);
                }
                else
                {
                  this.resetPage();
                }
              });
            }
            else {
              this.toast.error(res.ErrorMessages ? res.ErrorMessages[0] : "Lỗi không xác định!", this.translate.instant('Error'));
            }
          });
        }
      });
    }
  }
  PrintInventoryDelivery(){
    this.loadDataSOForInventoryDelivery(this.data.SOCode);
  }
  async printInventoryDelivery(data: any) {
    const printer = window.localStorage.getItem("_printer");
    if (!printer) {
      this.toast.error(`Vui lòng chọn máy in`, 'error_title');
      return;
    }
    const listData = [];
    listData.push(data);
    if (!Array.isArray(listData) || listData.length === 0) {
      this.toast.error(`Lỗi dữ liệu, vui lòng tìm kiếm lại`, 'error_title');
      return;
    }
    const dataPrint = this.printService.repairMultiInventoryDelivery(listData);
    const rsPrint = await this.printService.sendToSmartPrintV2(dataPrint, dataPrint.keygen, printer);
    if (rsPrint) {
      this.toast.success(`In ${dataPrint.label} cho ${listData.length} đơn hàng thành công`, 'success_title');
    } else {
      this.toast.error(`In ${dataPrint.label} thất bại`, 'error_title');
    }
    setTimeout(() => {
      this.resetPage();
    }, 300)
  }
  async loadDataSOForInventoryDelivery(SOCode: string) {
    this.service.getSODetails(SOCode)
      .subscribe((resp: any) => {
        
        if (resp.Data) {
          let dataSO = {
            SOCode: resp.Data.SOCode,
            SiteId: resp.Data.SiteId,
            ExternalCode: resp.Data.ExternalCode,
            StoreName: resp.Data.StoreName,
            ExternalCode2: resp.Data.ExternalCode2,
            Address: resp.Data.Address,
            ExternalCode3: resp.Data.ExternalCode3,
            ReceivingStaffName: resp.Data.ReceivingStaffName,
            ReceivingStaffPhone: resp.Data.ReceivingStaffPhone,
            WarehouseName: resp.Data.WarehouseName,
            WarehouseSiteId: resp.Data.WarehouseSiteId,
            WarehouseSiteName: resp.Data.WarehouseSiteName,
            ContactName: resp.Data.ContactName,
            ContactPhone: resp.Data.ContactPhone,
            ConditionType: this.translate.instant(`POConditionType.${resp.Data.ConditionType}`),
            Type: this.translate.instant(`SODetails.${resp.Data.Type}`),
            Status: this.translate.instant(`SOStatus.${resp.Data.Status}`),
            StatusCode: resp.Data.Status,
            CreatedDate: resp.Data.CreatedDate,
            CreatedBy: resp.Data.CreatedBy,
            CanceledBy: resp.Data.CanceledBy,
            CanceledNote: resp.Data.CanceledNote,
            CanceledReason: resp.Data.CanceledReason,
            Note: resp.Data.Note,
            PromotionCode: resp.Data.PromotionCode,
            ReceiveSessions: [],
            Details: resp.Data.Details,
            TotalVolume: resp.Data.TotalVolume ? Utils.formatNumberFixed(resp.Data.TotalVolume * NUMBERIC.CM3ToM3, 6) : '',
            TotalWeight: resp.Data.TotalWeight ? Utils.formatNumberFixed(resp.Data.TotalWeight / NUMBERIC.N1000, 4) : '',
            TotalPackage: resp.Data.TotalPackage,
            TotalPackageEven: resp.Data.TotalPackageEven,
            TotalPackageOdd: resp.Data.TotalPackageOdd,
            PickedToteCode: resp.Data.PickedToteCode || "",
            EstDeliveryDate: resp.Data.EstDeliveryDate,
            PackedLocationLabel: resp.Data.PackedLocationLabel,
            TotalSKU: resp.Data.TotalSKU,
            TotalUnit: resp.Data.TotalUnit,
            GIStatus: resp.Data.GIStatus
          };
          this.printInventoryDelivery(dataSO);
        }
      });
  }
  onPackingEven() {
    this.IsPacking = true;
    this.IsPackingEven = true;
    this.inputPlaceholder = 'SOPacking.ScanBarcode';
    this.inputScan.nativeElement.focus();
  }
  repaireDataSumDelivery(data: any, printer: any) {
    const dataPrint = {
      "label": "Phiếu Kiểm Xuất Hàng",
      "printer_name": "PrinterPaper",
      "printer": 'PrinterPaper',
      "printerDefault": "SummaryInventoryDelivery",
      "template": 'SummaryInventoryDelivery',
      "options": { "Orientation": "portrait" },
      "data": null,
      "url": ""
    }
    const _dataPrint = {}
    _dataPrint['PointCode'] = data[0]['GatheredPoint'] || "";
    for (let saleorder of data) {
      saleorder['SumQty'] = 0;
      saleorder['SumQtyByCase'] = 0;
      for (let detail of saleorder.Details) {
        saleorder['SumQty'] += (parseInt(detail.Qty) > 0) ? parseInt(detail.Qty) : 0;
        saleorder['SumQtyByCase'] += detail.QtyByCase > 0 ? Math.ceil(detail.QtyByCase) : 0;
        detail.Qty = this.printService.formatNumber(detail.Qty, 1, ".", ",");
        detail.QtyByCase = this.printService.formatNumber(Math.ceil(detail.QtyByCase), 1, ".", ",");
        detail.QtyPerCase = this.printService.formatNumber(Math.ceil(detail.QtyPerCase), 1, ".", ",");
      }
      saleorder['SumQty'] = saleorder['SumQty'] > 0 ? this.printService.formatNumber(saleorder['SumQty'], 1, ".", ",") : null;
      saleorder['SumQtyByCase'] = saleorder['SumQtyByCase'] > 0 ? this.printService.formatNumber(saleorder['SumQtyByCase'], 1, ".", ",") : null;
    }
    _dataPrint['ListSO'] = data;
    dataPrint.data = _dataPrint;
    return dataPrint;
  }
  async printSummaryInventoryDelivery(data: any) {
    const printer = window.localStorage.getItem("_printer");
    if (!printer) {
      this.toast.error(`Vui lòng chọn máy in`, 'error_title');
      return;
    }
    await this.doPrintSummaryInventoryDelivery(data, printer);
  }
  async doPrintSummaryInventoryDelivery(data: any, printer) {
    const dataPrint = this.repaireDataSumDelivery(data, printer);
    let rsPrint = null;
    if (printer == 'InTrucTiep') {
      rsPrint = await this.printService.sendToSmartPrintV1(dataPrint);
    } else {
      rsPrint = await this.printService.sendToSmartPrintV2(dataPrint, dataPrint.data.PointCode, printer);
    }
    if (rsPrint) {
      this.toast.success(`In ${dataPrint.label} : ${this.data.SOCode} thành công`, 'success_title');
    } else {
      this.toast.error(`In ${dataPrint.label} ${this.data.SOCode} thất bại`, 'error_title');
    }
  }
  async printPointSummary(event: any) {
    const printer = window.localStorage.getItem("_printer");
    if (!printer) {
      this.toast.error(`Vui lòng chọn máy in`, 'error_title');
      return;
    }
    const data = JSON.parse(JSON.stringify(this.data));
    await this.doPrintPointSummary([data], printer);
  }
  async doPrintPointSummary(data: any, printer: String) {
    const dataPrint = this.repairdataPointSummary(data);
    let rsPrint = null;
    if (printer == 'InTrucTiep') {
      rsPrint = await this.printService.sendToSmartPrintV1(dataPrint);
    } else {
      rsPrint = await this.printService.sendToSmartPrintV2(dataPrint, dataPrint.data.PointCode, printer);
    }
    if (rsPrint) {
      this.toast.success(`In ${dataPrint.label} : ${dataPrint.data.PointCode} thành công`, 'success_title');
    } else {
      this.toast.error(`In ${dataPrint.label} ${dataPrint.data.PointCode} thất bại`, 'error_title');
    }
  }
  repairdataPointSummary(data: any) {
    const dataPrint = {
      "label": "danh sách đơn hàng kiểm ",
      "printer_name": "PrinterPaper",
      "printer": 'PrinterPaper',
      "printerDefault": "PrinterPointSummary",
      "template": 'PointSummary_V2',
      "options": { "Orientation": "portrait" },
      "data": null,
      "url": ""
    }
    const _dataPrint = {}
    _dataPrint['PointCode'] = data[0]['SOCode'] || "";
    for (let saleorder of data) {
      saleorder['SumQty'] = 0;
      saleorder['SumQtyByCase'] = 0;
      saleorder['Details'] = saleorder.PickListDetailPacking;
      saleorder['ExternalCode'] = saleorder.DOCode;
      for (let detail of saleorder.Details) {
        if(saleorder.TotalUnitPackage == 0) {
          detail.QtyPerCase = detail.PackQtyPerCase;
        }
        detail['ProductName'] = detail.Name || "";
        saleorder['SumQty'] += (parseInt(detail.Qty) > 0) ? parseInt(detail.Qty) : 0;
        saleorder['SumQtyByCase'] += detail.QtyPerCase > 0 ? Math.round(detail.QtyPerCase * 100) / 100 : 0;
        detail.Qty = this.printService.formatNumber(detail.Qty, 1, ".", ",");
        detail.QtyByCase = detail.QtyByCase > 0 ? Math.round(detail.QtyByCase * 100) / 100 : "";
        detail.QtyPerCase = detail.QtyPerCase > 0 ? Math.round(detail.QtyPerCase * 100) / 100 : "";
      }
      saleorder['SumQty'] = saleorder['SumQty'] > 0 ? this.printService.formatNumber(saleorder['SumQty'], 2, ".", ",") : null;
      saleorder['SumQtyByCase'] = saleorder['SumQtyByCase'] > 0 ? this.printService.formatNumber(saleorder['SumQtyByCase'], 2, ".", ",") : null;
    }
    const warehouseInfor = JSON.parse(window.localStorage.getItem('_info'));
    _dataPrint['AccountId'] = warehouseInfor && warehouseInfor.Id ? warehouseInfor.Id : "";
    _dataPrint['WarehouseName'] = warehouseInfor && warehouseInfor.SiteInfo && warehouseInfor.SiteInfo.Name || "";
    _dataPrint['WarehouseAddress'] = warehouseInfor && warehouseInfor.SiteInfo && warehouseInfor.SiteInfo.Contact.Address || "";
    _dataPrint['WarehouseContact'] = warehouseInfor && warehouseInfor.SiteInfo && warehouseInfor.SiteInfo.Contact.ContactName || "";
    _dataPrint['WarehousePhone'] = warehouseInfor && warehouseInfor.SiteInfo && warehouseInfor.SiteInfo.Contact.ContactPhone || "";
    _dataPrint['ListSO'] = data;
    dataPrint.data = _dataPrint;
    return dataPrint;
  }
  async onClickPrintInventoryDeliveryByPacking(isResetPage = 0){
    const printer = window.localStorage.getItem("_printer");
    if (!printer) {
      this.onPackingEven();
      return;
    }
    if(this.data.Packages.length == 0) {
      this.toast.error(`Đơn hàng chưa tạo kiện`, 'error_title');
      return;
    }
    const data = JSON.parse(JSON.stringify(this.data))
    this.mappingSKUForPackage(data);
    const dataPrint = this.printService.repairMultiInventoryDeliveryPacking([data],  "Odd")
    const rsPrint = await this.printService.sendToSmartPrintV2(dataPrint, dataPrint.data.PointCode, printer);
    if (rsPrint) {
      this.toast.success(`In ${dataPrint.label} : ${this.data.SOCode} thành công`, 'success_title');
    } else {
      this.toast.error(`In ${dataPrint.label} ${this.data.SOCode} thất bại`, 'error_title');
    }
    if (isResetPage === 1)
    {
      this.resetPage();
    }
  }
  mappingSKUForPackage(data: any) {
    const details = [];
    let Packages = data.Packages;
    Packages.sort((a, b) => {
      return parseInt(a.PackageGroup) - parseInt(b.PackageGroup)
    })
    for (const pkg of Packages) {
      pkg['PackageDetail'] = data.PickListDetailPackage.filter(sku => sku.PackageNo == pkg.PackageNo);
      details.push(pkg);
    }
    data['Details'] = details
  }
  autoPackingItemEven() {
    if (!this.data.PickListCode) {
      return;
    }
    // let dataodd = this.data.PickListDetailPacking.filter(x => x.QtyPerCase % 1 != 0);
    
    // if (dataodd.length > 0) {
    //   this.toast.error("Tồn tại SKU lẻ không thể đóng gói chẵn! Vui lòng kiểm tra lại!", 'error_title')
    //   return;
    // }
    
    const dialogRef = this.dialog.open(PackageEvenComponent, {
      disableClose: true,
      data: {
        title: this.translate.instant('SOPacking.CoutingEven'),
        info: {
          SOCode: this.data.SOCode,
          TotalPackage: this.data.TotalPackage,
          TotalPackageOdd: this.data.TotalPackageOdd,
          TotalPackageEven: this.data.TotalPackageEven,
          DetailPacking: this.data.PickListDetailPacking
        },
        type: 1
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.confirmAutoPackingItemEven(result);
      }
    });
  }

  confirmAutoPackingItemEven(data: any) {
    // console.log(data);
    
    // if (data.TotalPackage != data.TotalPackageEven) {
    //   this.onPackingEven();
    //   this.toast.info('Số lượng kiện khác số lượng thùng. Vui lòng scan đóng gói để xác nhận', "success_title");
    //   return;
    // }
    if (data.TotalPackage > 0) {
      const dialogRef = this.dialog.open(NotificationComponent, {
        data: {
          message: `Bạn chắc chắn muốn cập nhật dữ liệu kiểm đếm?`,
          type: 1
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && this.data.PickListCode) {
          let stationCode = this.showScanStationCode();
          let req = {
            JobCode: this.data.JobCode,
            PickListCode: this.data.PickListCode,
            TransportDeviceCode: this.data.TransportCode,
            SOCode: this.data.SOCode,
            PointCode: this.data.PointCode,
            StationCode: stationCode,
            TotalPackage: data.TotalPackage,
            TotalPackageEven: data.TotalPackage
          }
          this.service.autoPackingItems(req).subscribe(res => {
            if (res.Status) {
              this.toast.success('Cập nhập kiểm đếm thành công', "success_title");
              this.makeData(res.Data);
            } else {
              this.toast.error(res.ErrorMessages.join("<br/>"), 'error_title')
            }
          });
        }
      });
    }
    else {
      this.toast.error(this.translate.instant('Print.TotalPackageOddAndTotalPackageEvenNotZero'), 'error_title');
      return;
    }
  }
}
