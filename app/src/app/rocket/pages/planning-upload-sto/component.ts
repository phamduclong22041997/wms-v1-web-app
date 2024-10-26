import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../../shared/toast.service';
import { Service } from '../../service';
import { Router } from '@angular/router';
import { ConfirmExportComponent } from '../../confirm/component';
import { TYPE } from './../../constant';
import * as _ from 'lodash';
import * as fs from 'file-saver';
import { Workbook } from 'exceljs';
import * as moment from 'moment';
@Component({
  selector: 'app-upload-sto',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class UploadSTOComponent implements OnInit {
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('typeImportCombo', { static: false }) typeImportCombo: any;
  @ViewChild('inputFile', { static: false }) inputFile: ElementRef;
  @ViewChild('clientCombo', { static: false }) clientCombo: any;
  fileUpload: any;
  dataExport: any;

  nameFileUpload: string;
  nameFileExport: string
  tableConfig: any;
  checkFileExcel: boolean;
  type: string;
  isExportHidden = true;
  client = '';
  DataError: any;
  summaryImport = {
    TotalUnit: 0,
    StartDate: null,
    EndDate: null,
    PromotionCode: '',
    Period: '',
    PromotionMonth: '',
    FileName: '',
    SKUS: 0,
    Stores: 0
  };

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
      pageSize: 10,
      columns: {
        isContextMenu: false,
        displayedColumns: ['index', 'WarehouseName', 'StoreCode', 'StoreName','ExternalCode', 'SKU', 'SKUName',
          'FinalUnits', 'Uom', 'Note'],
        options: [
          {
            title: 'RocketPlanning.Warehouse',
            name: 'WarehouseName',
            style: {
              'min-width': '100px',
              'max-width': '150px'
            }
          },
          {
            title: 'RocketPlanning.StoreCode',
            name: 'StoreCode',
            style: {
              'min-width': '100px',
              'max-width': '120px'
            }
          },
          {
            title: 'RocketPlanning.StoreName',
            name: 'StoreName',
            style: {
              'min-width': '200px',
              'max-width': '220px'
            }
          },
          {
            title: 'STO.ExternalCode',
            name: 'ExternalCode',
            style: {
              'min-width': '100px',
              'max-width': '120px'
            }
          },
          {
            title: 'RocketPlanning.SKU',
            name: 'SKU',
            style: {
              'min-width': '100px',
              'max-width': '120px'
            }
          },
          {
            title: 'RocketPlanning.SKUName',
            name: 'SKUName',
            style: {
              'min-width': '200px',
              'max-width': '220px'
            },
          },
          {
            title: 'RocketPlanning.FinalUnit',
            name: 'FinalUnits',
            style: {
              'min-width': '100',
              'max-width': '120px'
            },
          },
          {
            title: 'RocketPlanning.UOM',
            name: 'Uom',
            style: {
              'min-width': '100',
              'max-width': '120px'
            },
          },
          {
            title: 'RocketPlanning.Note',
            name: 'Note',
            style: {
              'min-width': '200',
              'max-width': '220px'
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
          fileName: this.fileUpload.name
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
    let _data = this.appTable['getData']();
    if (!_data.total) {
      return;
    }
    this.checkFileExcel = false;
    this.service.uploadSTODemand({ FilePath: this.summaryImport['FilePath'] })
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
        this.appTable['renderData']([]);
      });
  }

  downloadTemplate() {
    this.service.downloadTemplate("SO_Demand_Template_10022022222.xlsx");
  }

  resetUploadForm() {
    this.nameFileUpload = 'Chọn File Upload';
    this.fileUpload = null;
    if (this.inputFile && this.inputFile.nativeElement) {
      this.inputFile.nativeElement.value = null;
    }
    this.resetSummery();
    this.checkFileExcel = false;
  }
  private validateParam() {
    return true;
  }

  checkUploadFile(files: any) {
    this.checkFileExcel = false;
    this.nameFileUpload = files[0].name ? files[0].name : '';
    let ext = this.nameFileUpload.split('.').pop();
    if (!this.validateParam()) return;
    if (ext == 'xlsx' || ext == 'xls') {
      let formData = new FormData();
      formData.append('file', files[0]);
      formData.append('isChecking', '1');
      this.fileUpload = files[0];
      this.checkFileExcel = true;
      this.service.uploadSTO(formData)
        .subscribe((resp: any) => {
          if (resp.Status && resp.Data && resp.Data.Data) {
            this.isExportHidden = true;
            this.appTable['renderData'](resp.Data['Data']);
            this.summaryImport = resp.Data['Summary'];
          } else {
            if (resp.ErrorMessages && resp.ErrorMessages.length) {
              this.toast.error(resp.ErrorMessages.join("\n"), 'error_title');
            }
            else if (resp.Data.ErrorList && resp.Data.ErrorList.length) {
              this.isExportHidden = false;
              this.nameFileExport = resp.Data.xlData[0].Code,
                this.DataError = resp.Data.ErrorList;
              this.dataExport = resp.Data.xlData;
              console.log(resp.Data, "resp.Data")
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
    }
  }

  private resetSummery() {
    this.summaryImport = {
      TotalUnit: 0,
      StartDate: null,
      EndDate: null,
      PromotionCode: '',
      Period: '',
      PromotionMonth: '',
      FileName: '',
      SKUS: 0,
      Stores: 0
    };

  }

  GetDataFormatting(worksheet, arrayFottmat) {
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
      let arrayFottmatSheet1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
      let arrayFottmatSheet2 = [1]
      worksheet.addRow([
        'UPLOADER',
        'DATA_TYPE',
        'VERSION',
        'Mã rocket',
        'Mã đối tác',
        'Mã kho',
        'Loại cửa hàng',
        'Mã cửa hàng',
        'Tên cửa hàng',
        'Mã sản phẩm',
        'Tên sản phẩm',
        'Số lượng',
        'Đơn vị tính',
        'Ngày bắt đầu hiệu lực KM',
        'Ngày cuối cùng hiệu lực KM',
        'Nội dung KM',
        'Tháng KM',
        'Kỳ KM',
        'Mã CTKM',
        'Thông báo lỗi'
      ]);
      this.GetDataFormatting(worksheet, arrayFottmatSheet1)
      this.dataExport.forEach((item: any) => {
        worksheet.addRow([
          item['UPLOADER'] || '',
          item['DATA_TYPE'] || '',
          item['VERSION'] || '',
          item['Code'] || '',
          item['ClientCode'] || '',
          item['Warehouse'] || '',
          item['Type'] || '',
          item['StoreCode'] || '',
          item['StoreName'] || '',
          item['SKU'] || '',
          item['SKUName'] || '',
          item['FinalUnits'] || '',
          item['UOM'] || '',
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
      worksheet.getColumn(19).width = 14;
      worksheet.getColumn(20).width = 29;
      //Sheet2
      worksheet = workbook.addWorksheet("ErrorList");
      worksheet.addRow([
        "Thông báo lỗi"
      ]);
      this.GetDataFormatting(worksheet, arrayFottmatSheet2)
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
  ngAfterViewInit() { }
  goToBackList(event: any = null) {
    this.router.navigate([`/${window.getRootPath()}/rocket/planning-sto-list`]);
  }

  saveSession() {
    // window.sessionStorage.setItem("ROCKET_SESSION", JSON.stringify({Client: this.client, Type: this.type}));
    const siteId = '';
    const warehouse = '';
    localStorage.setItem("ROCKET_SESSION_IMPORT", JSON.stringify({ Client: this.client, Type: this.type, SiteId: siteId, Warehouse: warehouse }));
  }
}
