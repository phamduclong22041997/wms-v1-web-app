import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../../shared/toast.service';
import { Service } from '../../service';
import { Router } from '@angular/router';
import { ConfirmExportComponent } from '../../confirm/component';
import { FormControl } from '@angular/forms';
import { TYPE } from './../../constant';
import * as _ from 'lodash';
import * as fs from 'file-saver';
import { Workbook } from 'exceljs';
import * as moment from 'moment';
@Component({
  selector: 'app-upload-po-promotion',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class UploadPOPromotionComponent implements OnInit, AfterViewInit {
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('inputFile', { static: false }) inputFile: ElementRef;

  selected = new FormControl(0);
  fileUpload: any;
  nameFileUpload: string;
  nameFileExport: string;
  tableConfig: any;
  checkFileExcel: boolean;
  checkFileExcelError = false;
  isExportHidden = true;
  type: string;
  client = '';
  strWarehouse: string;
  periodPromotionMonth = '';
  total = {
    TotalSKU: 0,
    Total: 0,
    SKUInActive: 0,
    SKUActive: 0,
    TotalSKUActive: 0,
    TotalSKUInActive: 0,
    PromotionMonth: '',
    Period: '',
    PromotionCode: '',
    StartDate: '',
    EndDate: '',
    CountPO: 0
  };
  dataImport: any;
  dataExport: any;
  DataError: any;
  dataSourceGrid = {
    rows: <any>[],
    total: 0
  };
  constructor(
    public dialog: MatDialog,
    private service: Service,
    private router: Router,
    private toast: ToastService,) { }
  ngOnInit() {
    this.checkFileExcel = false;
    this.nameFileUpload = 'Chọn File Upload';
    this.initTable();
  }

  initTable() {
    this.tableConfig = {
      enableCollapse: true,
      rowSelected: true,
      showFirstLastButton: true,
      style: {
        // 'overflow-x': 'hidden'
      },
      pageSize: 10,
      columns: {
        isContextMenu: false,
        displayedColumns: ['index', 'WarehouseName', 'SKU', 'SKUName', 'Qty', 'Uom', 'Note', 'PromotionCode'
          //  'Error'
        ],
        options: [
          {
            title: 'RocketPlanning.Warehouse',
            name: 'WarehouseName',
            style: {
              'max-width': '90px'
            },
          },
          {
            title: 'RocketPlanning.SKU',
            name: 'SKU',
            style: {
              'margin-left': '5px',
              'max-width': '120px'
            }
          },
          {
            title: 'RocketPlanning.SKUName',
            name: 'SKUName',
            style: {
              'min-width': '200px'
            },
          },
          {
            title: 'RocketPlanning.RequestQty',
            name: 'Qty',
            style: {
              'max-width': '130px'
            },
          },
          {
            title: 'RocketPlanning.BaseUOM',
            name: 'Uom',
            style: {
              'max-width': '100px'
            },
          },
          {
            title: 'RocketPlanning.Note',
            name: 'Note',
            style: {
              'min-width': '260px'
            },
          },
          {
            title: 'RocketPlanning.PromotionCode',
            name: 'PromotionCode',
            style: {
              'min-width': '260px'
            },
          }
        ]
      },
      data: this.dataSourceGrid
    };

  }

  confirm() {
    if (!this.checkFileExcel) {
      this.toast.error('RocketPlanning.ErrorFileExcel', 'error_title');
      return;
    }

    const dialogRef = this.dialog.open(ConfirmExportComponent, {
      data: {
        data: {
          type: TYPE[this.type],
          fileName: this.fileUpload.name,
          client: this.client
        }, message: 'Bạn có chắc muốn import file này?'
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.uploadFile();
      }
    });

  }

  uploadFile() {
    this.checkFileExcel = false;
    let formData = new FormData();
    formData.append('file', this.fileUpload);
    formData.append('IsChecking', '0');
    this.service.uploadPO(formData)
      .subscribe((resp: any) => {
        if (resp['Status']) {
          this.toast.success('RocketPlanning.SuccessImport', 'success_title');
          this.saveSession();
          setTimeout(() => {
            this.goToBackList();
          }, 500)
        } else {
          this.toast.error('RocketPlanning.ErrorUpload', 'error_title');
        }
        this.resetUploadForm();
      });
  }
  downloadTemplate() {
    this.service.downloadTemplate("PO_Demand_Template_16032022_1549.xlsx");
  }


  resetUploadForm() {
    this.nameFileUpload = 'Chọn File Upload';
    this.fileUpload = null;
    this.appTable['renderData']([]);
    if (this.inputFile && this.inputFile.nativeElement) {
      this.inputFile.nativeElement.value = null;
    }
    this.resetSummary();
    this.checkFileExcel = false;
  }

  checkUploadFile(files: any) {
    this.checkFileExcel = false;
    this.checkFileExcelError = false;
    this.nameFileUpload = files[0].name ? files[0].name : '';
    let ext = this.nameFileUpload.split('.').pop();
    console.log(this.nameFileUpload, "nameFileUpload")
    if (ext == 'xlsx' || ext == 'xls') {
      let formData = new FormData();
      formData.append('file', files[0]);
      formData.append('isChecking', '1');
      this.fileUpload = files[0];
      this.checkFileExcel = true;
      this.service.uploadPO(formData)
        .subscribe((resp: any) => {
          if (resp.Status && resp.Data && resp.Data.Data) {
            this.isExportHidden = true;
            this.dataImport = resp.Data.Data;
            this.total = resp.Data.Summary ? resp.Data.Summary : {};
            this.periodPromotionMonth = `${this.total.Period} / ${this.total.PromotionMonth}`;
            if (this.total.SKUInActive > 0) {
              this.checkFileExcelError = true;
            }
            this.appTable['renderData'](this.dataImport);
          } else {
            if (resp.ErrorMessages && resp.ErrorMessages.length) {
              this.toast.error(resp.ErrorMessages.join("\n"), 'error_title');
            }
            else if (resp.Data.ErrorList && resp.Data.ErrorList.length) {
              this.isExportHidden = false;
              this.nameFileExport =  resp.Data.xlData[0].Code,
              this.dataExport = resp.Data.xlData;
              this.DataError = resp.Data.ErrorList;
              this.toast.error(this.DataError.join("\n"), 'error_title');
            }
            this.resetUploadForm();
          }
        });
    } else {
      this.checkFileExcel = false;
      this.toast.error('RocketPlanning.ErrorFileExcel', 'error_title');
      this.resetUploadForm();
      this.appTable['renderData']([]);
      this.resetSummary();
    }
  }
  private resetSummary() {
    this.total = {
      TotalSKU: 0,
      Total: 0,
      SKUInActive: 0,
      SKUActive: 0,
      TotalSKUActive: 0,
      TotalSKUInActive: 0,
      PromotionMonth: '',
      Period: '',
      PromotionCode: '',
      StartDate: '',
      EndDate: '',
      CountPO: 0
    };
  }
  onShowError(value: boolean) {
    if (this.dataImport && this.dataImport.length) {
      if (value) {
        const _dataFilter = this.dataImport.filter(e => e.IsActived !== 'Active');
        this.appTable['renderData'](_dataFilter);
      } else {
        this.appTable['renderData'](this.dataImport);
      }
    }
  }

  GetDataFormatting(worksheet,arrayFottmat) {
    let dataFormatting = arrayFottmat
    for (let i = 0; i < dataFormatting.length; i++) {
      worksheet.getRow(1).font = { bold: true, color: { argb: "ffffff" } };
      worksheet.getColumn(dataFormatting[i]).eachCell(function (cell) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: {
            argb: 'DD2C00'
          }
        };
      });
    }
  }


  exportDataList() {
    if (this.DataError && this.DataError.length) {
      let workbook = new Workbook();
      let worksheet = workbook.addWorksheet("ErrorTrackingLine");
      let arrayFottmatSheet1 =  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
      let arrayFottmatSheet2 = [1]
      worksheet.addRow([
        'UPLOADER',
        'DATA_TYPE',
        'VERSION',
        'Mã Rocket',
        'Mã đối tác',	
        'Mã kho',	
        'Mã sản phẩm',	
        'Đơn vị tính',	
        'Số lượng',	
        'Tên liên hệ',	
        'Số điện thoại liên hệ',	
        'Ghi chú',
        'Ngày bắt đầu hiệu lực KM',
        'Ngày cuối cùng hiệu lực KM',
        'Nội dung KM',
        'Tháng KM',
        'Kỳ KM',
        'Mã CTKM',
        "Thông báo lỗi"
      ]);
      this.GetDataFormatting(worksheet,arrayFottmatSheet1)
      this.dataExport.forEach((item: any) => {
        worksheet.addRow([
          item['UPLOADER'] || '',
          item['DATA_TYPE'] || '',
          item['VERSION'] || '',
          item['Code'] || '',
          item['ClientCode'] || '',
          item['Warehouse'] || '',
          item['SKU'] || '',
          item['UOM'] || '',
          item['Qty'] || '',
          item['ContactName'] || '',
          item['ContactPhone'] || '',
          item['Note'] || '',
          item['StartDate'] || '',
          item['EndDate'] || '',
          item['PromotionNote'] || '',
          item['PromotionMonth'] || '',
          item['Period'] || '',
          item['PromotionCode'] || '',
          item['Error'] || '',
        ]);
      });
      worksheet.getColumn(1).width = 15;
      worksheet.getColumn(2).width = 15;
      worksheet.getColumn(3).width = 10;
      worksheet.getColumn(4).width = 15;
      worksheet.getColumn(5).width = 13;
      worksheet.getColumn(6).width = 10;
      worksheet.getColumn(7).width = 14;
      worksheet.getColumn(8).width = 15;
      worksheet.getColumn(9).width = 15;
      worksheet.getColumn(10).width = 15;
      worksheet.getColumn(11).width = 15;
      worksheet.getColumn(12).width = 11;
      worksheet.getColumn(13).width = 13;
      worksheet.getColumn(14).width = 15;
      worksheet.getColumn(15).width = 15;
      worksheet.getColumn(16).width = 15;
      worksheet.getColumn(17).width = 15;
      worksheet.getColumn(18).width = 14;
      worksheet.getColumn(19).width = 29;
      //Sheet2
      worksheet = workbook.addWorksheet("ErrorList");
      worksheet.addRow([
        "Thông báo lỗi"
      ]);
      this.GetDataFormatting(worksheet,arrayFottmatSheet2)
      this.DataError.forEach((item: any) => {
        worksheet.addRow([item])
      });
      worksheet.getColumn(1).width = 50;
      //
      workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        fs.saveAs(
          blob,
          `${this.nameFileExport}_ErrorList_${moment(new Date()).format(
            "YYYYMMDDHHmmss"
          )}.xlsx`
        );
      });
    } else {
      this.toast.error("ERROR.SPE020", "error_title");
    }
    ;
  }
  saveSession() {
    window.sessionStorage.setItem("ROCKET_SESSION", JSON.stringify({ Client: this.client, Type: this.type }));
  }
  goToBackList(event: any = null) {
    this.router.navigate([`/${window.getRootPath()}/rocket/planning-po-list`]);
  }
  ngAfterViewInit() { }
}
