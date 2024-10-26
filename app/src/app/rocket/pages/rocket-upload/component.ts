import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from './../../../shared/toast.service';
import { Service } from '../../service';
import { Router } from '@angular/router';
import { ConfirmRocketUploadSTOComponent } from './confirm/component';
@Component({
  selector: 'app-rocket-upload',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class RocketUploadComponent implements OnInit, AfterViewInit {
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('inputFile', { static: false }) inputFile: ElementRef;

  fileUpload: any;
  nameFileUpload: string;
  dataDIOPostDownload: object;
  DIO: string;
  tableConfig: any;
  checkFileExcel: boolean;
  whId: string;
  whCode: string;
  stoType: string;
  stoTypeName: string;
  promotionSet: string;
  whName: string;
  valid: boolean;
  totalSTO: number;
  totalUnits: Number;
  totalSKU: Number;
  totalStore: Number;
  IsMDL: boolean;
  filters: Object;

  dataSourceGrid = {
    rows: <any>[],
    total: 0
  };
  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private service: Service,
    private router: Router,
    private toast: ToastService,) { }
  ngOnInit() {
    this.valid = false;
    this.whId = '';
    this.whCode = '';
    this.whName = '';
    this.stoType = '';
    this.stoTypeName = '';
    this.checkFileExcel = false;
    this.nameFileUpload = 'Chọn file chia chọn STO';
    this.promotionSet = '';
    this.totalSTO = 0;
    this.totalUnits = 0;
    this.totalSKU = 0;
    this.totalStore = 0;

    this.filters = {
      Content: ""
    }

    this.initTable();
  }

  ngAfterViewInit() { }

  parseData(data: any) {
    let renderData = [];
    let skuList = [];
    let storeList = [];
    for (let idx in data) {
      let item = data[idx];
      if (!this.promotionSet) {
        this.promotionSet = item.PromationSet;
      }
      if (skuList.indexOf(item.SKU) == -1) {
        skuList.push(item.SKU);
      }
      if (storeList.indexOf(item.SupraCode) == -1) {
        storeList.push(item.SupraCode);
      }
      renderData.push({
        SupraCode: item.SupraCode,
        SKU: item.SKU,
        UOM: item.UOM,
        FinalUnits: item.FinalUnits,
        FromPO: item.FromPO.map(po => po.SupraCode).join(", "),
        BIN: item.FromPO.map(po => po.BIN).join(", ")
      });
      this.totalUnits += item.FinalUnits;
    }
    this.totalStore = storeList.length;
    this.totalSKU = skuList.length;

    return renderData;
  }

  borderColorByStatus(status: string) {
    if (status != "DONE") {
      return {
        'color': 'red',
      };
    }
    return "";
  }
  initTable() {
    this.tableConfig = {
      enableCollapse: false,
      rowSelected: true,
      disablePagination: true,
      style: {
        'overflow-x': 'hidden',
        'height': '400px'
      },
      columns: {
        actionTitle: 'SoPool.AssignStorage',
        isContextMenu: false,
        displayedColumns: ['index', 'ClientCode', 'StoreCode', 'SKU', 'FinalUnits', 'UOM', 'PO'],
        options: [
          {
            title: 'Rocket.ClientCode',
            name: 'ClientCode'
          },
          {
            title: 'Rocket.StoreCode',
            name: 'StoreCode'
          },
          {
            title: 'Rocket.SKU',
            name: 'SKU',
          },
          {
            title: 'Rocket.FinalUnits',
            name: 'FinalUnits',

          },
          {
            title: 'Rocket.Uom',
            name: 'UOM',

          },
          {
            title: 'Rocket.FromPO',
            name: 'PO',
            borderStyle: (data: any) => {
              return this.borderColorByStatus(data.Status);
            },
          }
        ]
      },
      data: this.dataSourceGrid
    };
  }

  confirm(event: any) {
    if (!this.whCode || !this.checkFileExcel) {
      let msg = 'UploadSTO.InvalidWH';
      if (!this.checkFileExcel) {
        msg = 'UploadSTO.InvalidUploadAutoProcessSet';

      }
      this.toast.error(msg, 'error_title');
      return;
    }

    const dialogRef = this.dialog.open(ConfirmRocketUploadSTOComponent, {
      data: {
        message: '',
        ref: '',
        Warehouse: this.whName,
        STOSet: this.nameFileUpload,
        STOTypeName: this.stoTypeName
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.uploadFile();
      }
    });
  }

  uploadFile() {
    if (this.checkFileExcel == true) {
      this.checkFileExcel = false;
      let formData = new FormData();
      formData.append('file', this.fileUpload);
      formData.append('IsChecking', '0');

      this.service.uploadRocketSTO(formData)
        .subscribe((resp: any) => {
          if (resp['Status']) {
            this.toast.success('Rocket.UploadASuccess', 'Thành công');
            this.fileUpload = null;
            if (this.inputFile && this.inputFile.nativeElement) {
              this.inputFile.nativeElement.value = null;
            }
            setTimeout(() => {
              this.backToList();
            }, 500)
          } else {
            this.toast.error(resp.ErrorMessages.Data, 'error_title');
          }
        });

    } else {
      this.toast.error('Rocket.ValidateChooseFile', 'error_title');
    }
  }
  resetUploadForm() {
    this.nameFileUpload = 'Chọn danh sách tote';
    this.fileUpload = null;
    if (this.inputFile && this.inputFile.nativeElement) {
      this.inputFile.nativeElement.value = null;
    }
  }

  backToList(event: any = null) {
    this.router.navigate(['/app/rocket/rocket-list']);
  }

  preUploadFile(files: any) {
    if (!this.whCode) {
      this.toast.error('UploadSTO.ERROR_WH', 'error_title');
      return;
    }
    this.checkFileExcel = false;
    this.nameFileUpload = files[0].name ? files[0].name : '';
    let ext = this.nameFileUpload.split('.').pop();

    if (ext == 'xlsx' || ext == 'xls') {
      this.fileUpload = files[0];
      this.checkFileExcel = true;
    } else {
      this.checkFileExcel = false;
      this.resetUploadForm();
      this.toast.error('UploadSTO.ValidateFile', 'error_title');
    }
  }

  checkUploadFile(files: any) {
    if (!this.whCode) {
      this.toast.error('UploadSTO.ERROR_WH', 'error_title');
      return;
    }
    this.checkFileExcel = false;
    this.nameFileUpload = files[0].name ? files[0].name : '';
    let ext = this.nameFileUpload.split('.').pop();

    if (ext == 'xlsx' || ext == 'xls') {
      let formData = new FormData();
      formData.append('file', files[0]);
      formData.append('IsChecking', '1');

      this.fileUpload = files[0];
      this.checkFileExcel = true;
      this.service.uploadRocketSTO(formData)
        .subscribe((resp: any) => {
          let data = [];
          if (resp.Status) {
            data = resp.Data['Data'];
          } else {
            this.resetUploadForm();
            this.toast.error(resp.ErrorMessages.Data, 'error_title');
          }
          this.appTable['renderData'](this.parseData(data));
        });
    } else {
      this.checkFileExcel = false;
      this.resetUploadForm();
      this.toast.error('UploadSTO.ValidateFile', 'error_title');
    }
  }
}
