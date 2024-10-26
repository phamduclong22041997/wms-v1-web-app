import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Service } from '../../service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../shared/toast.service';
import { ConfirmComponent } from '../../confirm/component';
import * as moment from 'moment';

@Component({
  selector: 'app-masan-po',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})

export class MasanPOComponent implements OnInit, AfterViewInit {
  tableConfig: any;
  statusConfig: Object;
  PoCode: Object;
  stores: Array<object> = [];
  fileUpload: any;
  nameFileUpload: string;
  checkFileExcel: boolean;
  valid: boolean;
  totalPO: number;
  BinCode: string = '';
  dataSourceGrid = {
    rows: <any>[],
    total: 0
  };
  whCode: string;
  whName: string;
  warehouseHandleConfig: Object;
  isChecking: boolean = true;
  regionCode: string;
  defaultSelectFileName: string;
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('inputFile', { static: false }) inputFile: ElementRef;
  @ViewChild('warehouseHandleCombo', { static: false }) warehouseHandleCombo: any;
  constructor(
    private translate: TranslateService,
    private service: Service,
    private toast: ToastService,
    public dialog: MatDialog,
    private router: Router) { }

  ngOnInit() {
    this.defaultSelectFileName = this.translate.instant(`FinishPo.SelectPOSet`);
    this.initData();
  }

  initData() {
    this.valid = false;
    this.whCode = '';
    this.whName = '';
    this.checkFileExcel = false;
    this.nameFileUpload = 'Chọn bộ PO'
    this.totalPO = 0;
    this.initTable();

    this.regionCode = "";
    let region = window.localStorage.getItem('region') || 'none';
    if (region != 'none') {
      this.regionCode = JSON.parse(region)['Code'];
    }

    this.warehouseHandleConfig = {
      selectedFirst: true,
      isSelectedAll: false,
      isSorting: false,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return `${option['Code']} - ${option['Name']}`;
      },
      type: 'combo',
      filter_key: 'Name',
      URL_CODE: 'EFT.wms_warehouse_combo'
    };
  }

  initTable() {
    this.tableConfig = {
      style: {
        'overflow-x': 'hidden'
      },
      columns: {
        actionTitle: 'action',
        isContextMenu: false,
        displayedColumns: [
          'index',
          'EtonCode',
          'PoCode',
          'SKU',
          'ProductName',
          'RequestQty',
          'ReceiptQty',
          'Weight',
          'BaseUnit',
          'ManufactureDate',
          'ExpiredDate',
        ],
        options: [
          {
            title: 'FinishPo.PoCode',
            name: 'EtonCode',
            style: {
              'min-width': '100px',
              'max-width': '100px',
            },
          },
          {
            title: 'FinishPo.DocumentNumber',
            name: 'PoCode',
            style: {
              'min-width': '80px',
              'max-width': '80px',
            },
          },
          {
            title: 'FinishPo.SKU',
            name: 'SKU',
            style: {
              'min-width': '150px',
              'max-width': '130px',
            },
          },
          {
            title: 'FinishPo.ProductName',
            name: 'ProductName',
            style: {
              'min-width': '150px',
              'max-width': '200px',
            },
          },
          {
            title: 'FinishPo.RequestQty',
            name: 'RequestQty',
            style: {
              'min-width': '100px',
            }
          },
          {
            title: 'FinishPo.ReceiptQty',
            name: 'ReceiptQty',
            style: {
              'min-width': '100px',
            }
          },
          {
            title: 'FinishPo.Weight',
            name: 'Weight',
            style: {
              'min-width': '130px',
            }
          },
          {
            title: 'FinishPo.BaseUnit',
            name: 'BaseUnit',
            style: {
              'min-width': '80px',
            },
          },
          {
            title: 'FinishPo.ManufactureDate',
            name: 'ManufactureDate',
            style: {
              'min-width': '150px',
            },
          },
          {
            title: 'FinishPo.ExpiredDate',
            name: 'ExpiredDate',
            style: {
              'min-width': '150px',
            },
          }
        ]
      },
      data: this.dataSourceGrid
    };
  }

  confirm() {

    if (!this.whCode || !this.checkFileExcel) {
      let msg = 'FinishPo.InvalidWH';
      if (!this.checkFileExcel) {
        msg = 'FinishPo.InvalidSPOSet';
      }
      this.toast.error(msg, 'error_title');
      return;
    }

    if (this.isChecking) {
      this.uploadFile();
    }
    else {
      const dialogRef = this.dialog.open(ConfirmComponent, {
        data: {
          message: '',
          ref: '',
          Warehouse: this.whCode,
          WarehouseName: this.whName,
          POSet: this.nameFileUpload
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.uploadFile();
        }
      });
    }
  }

  ngAfterViewInit() {
    this.initEvent();
  }

  initEvent() {
    this.warehouseHandleCombo['change'].subscribe({
      next: (data: any) => {
        if (data) {
          this.whCode = data.Code;
          this.whName = data.Name;

        } else {
          this.whCode = '';
          this.whName = '';
        }
        this.isChecking = true;
      }
    });
  }

  checkUploadFile(files: any) {
    let valid = true;
    this.isChecking = true;
    if (!this.whCode) {
      this.toast.error('FinishPo.InvalidWH', 'error_title');
      valid = false;
    }

    if (!this.BinCode) {
      this.toast.error('FinishPo.InvalidBinCode', 'error_title');
      valid = false;
    }

    this.nameFileUpload = files[0].name ? files[0].name : '';
    let ext = this.nameFileUpload.split('.').pop();

    if (ext.toLowerCase() == 'xlsx' || ext.toLowerCase() == 'xls') {
      this.nameFileUpload = files[0].name ? files[0].name : '';
      this.fileUpload = files[0];
      this.checkFileExcel = true;
    } else {
      valid = false;
      this.checkFileExcel = false;
      this.inputFile.nativeElement.value = '';
      this.toast.error('FinishPo.ValidateFile', 'error_title');
    }

    if (!valid) {
      this.fileUpload = null;
      this.nameFileUpload = 'Chọn bộ PO';
      if (this.inputFile && this.inputFile.nativeElement) {
        this.inputFile.nativeElement.value = null;
      }
      return;
    }

    let formData = new FormData();
    formData.append('file', files[0]);
    formData.append('IsChecking', '1');
    formData.append('WarehouseCode', this.whCode);
    formData.append('Region', this.regionCode);
    formData.append('BinCode', this.BinCode.trim());

    // this.service.finishPO(formData)
    //   .subscribe((resp: any) => {
    //     if (resp['Status']) {
    //       this.appTable['renderData'](this.parseData(resp));
    //       this.isChecking = false;
    //     } else {
    //       this.toast.exception(resp['ErrorMessages']['Data'], 'error_title');
    //       this.fileUpload = null;
    //       this.nameFileUpload = 'Chọn bộ PO';
    //       if (this.inputFile && this.inputFile.nativeElement) {
    //         this.inputFile.nativeElement.value = null;
    //       }
    //     }
    //   });

  }

  parseData(data: any) {
    let renderData = [];
    let Idx = 1;
    for (let key in data['Data']['Data']) {
      var poList = data['Data']['Data'][key]['Data'];
      let poCode = data['Data']['Data'][key]['EtonCode'];
      for (let i = 0; i < poList.length; i++) {
        const object = {
          Idx: 1,
          EtonCode: poCode,
          PoCode: key,
          SKU: '',
          ProductName: '',
          ReceiptQty: 0,
          RequestQty: 0,
          ExceptQty: 0,
          TaskType: 0,
          ManufactureDate: '',
          ExpiredDate: '',
          BestBeforeDate: '',
          CodeMML: '',
          SpecificationSku: 0,
          ReceiptVolume: 0,
          RequestVolume: 0,
          BaseUnit: "",
          Weight: 0
        };

        let po = poList[i];
        object.Idx = Idx++;
        object.SKU = po.SKU
        object.ProductName = po.ProductName;
        object.ReceiptQty = po.ReceiptQty;
        object.RequestQty = po.RequestQty;
        object.ExceptQty = po.ExceptQty;
        object.TaskType = po.TaskType;
        object.ManufactureDate = moment(po.ManufactureDate).format('DD-MM-YYYY');
        object.ExpiredDate = moment(po.ExpiredDate).format('DD-MM-YYYY');
        object.BestBeforeDate = po.BestBeforeDate;
        object.CodeMML = po.CodeMML;
        object.SpecificationSku = po.SpecificationSku;
        object.ReceiptVolume = po.ReceiptVolume;
        object.RequestVolume = po.RequestVolume;
        object.BaseUnit = po.BaseUnit;
        object.Weight = po.Weight;

        renderData.push(object);
      }
    }

    return renderData;
  }

  uploadFile() {
    if (!this.whCode) {
      this.toast.error('FinishPo.InvalidWH', 'error_title');
      return;
    }

    if (!this.BinCode) {
      this.toast.error('FinishPo.InvalidBinCode', 'error_title');
      return;
    }
    if (this.checkFileExcel == true) {
      let formData = new FormData();
      formData.append('file', this.fileUpload);
      formData.append('IsChecking', this.isChecking ? "1" : "0");
      formData.append('WarehouseCode', this.whCode);
      formData.append('Region', this.regionCode);
      formData.append('BinCode', this.BinCode);

      // this.service.finishPO(formData)
      //   .subscribe((resp: any) => {
      //     if (resp['Status']) {
      //       this.appTable['renderData'](this.parseData(resp));
      //       if (this.isChecking) {
      //         this.isChecking = false
      //         this.toast.info('FinishPo.CheckingPOMessage', 'FinishPo.CheckingPOMessage');

      //       } else {
      //         this.fileUpload = null;
      //         if (this.inputFile && this.inputFile.nativeElement) {
      //           this.inputFile.nativeElement.value = null;
      //         }
      //         this.nameFileUpload = this.defaultSelectFileName;
      //         this.toast.success('FinishPo.Success', 'FinishPo.Success');
      //         this.isChecking = false;

      //         setTimeout(() => {
      //           this.cancel()
      //         }, 500)
      //       }

      //     } else {
      //       this.toast.exception(resp['ErrorMessages']['Data'], 'FinishPo.Failure');
      //     }
      //   });

    } else {
      this.toast.error('FinishPo.Failure', 'error_title');
    }
  }

  cancel() {
    this.router.navigate(['/app/fresh-product/po-process', {}]);
  }
}
