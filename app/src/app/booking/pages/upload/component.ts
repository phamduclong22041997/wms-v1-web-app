/*
 * @copyright
 * Copyright (c) 2022 OVTeam
 *
 * All Rights Reserved
 *
 * Licensed under the MIT License;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://choosealicense.com/licenses/mit/
 *
 */

import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../../shared/toast.service';
import { Service } from '../../service';
import { Router } from '@angular/router';
// import { ConfirmExportComponent } from '../../confirm/component';
import { FormControl } from '@angular/forms';
// import { TYPE } from './../../constant';
import * as _ from 'lodash';
import * as fs from 'file-saver';
import { Workbook } from 'exceljs';
import * as moment from 'moment';
import { ConfirmBookingComponent } from '../confirm/component';

@Component({
  selector: 'app-upload-po-promotion',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class UploadBookingComponent implements OnInit, AfterViewInit {
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('inputFile', { static: false }) inputFile: ElementRef;

  selected = new FormControl(0);
  fileUpload: any;
  nameFileUpload: string;
  tableConfig: any;
  checkFileExcel: boolean;
  checkFileExcelError = false;
  type: string;
  client = '';
  strWarehouse: string;
  periodPromotionMonth = '';
  summary = {
    FileName: "",
    TotalPO: 0,
    TotalQty: 0
};
  dataImport: any;
  dataSourceGrid = {
    rows: <any>[],
    total: 0
  };
  isExportHidden = true;
  nameFileExport: string;
  dataExport: any;
  IsError: any;
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
        displayedColumns: ['index','WarehouseCode', 'WarehouseSiteId','MustBeReceivedPO', 'MustBeReceivedUnits', 'StartDate'],
        options: [
          {
            title: 'Booking.WarehouseCode',
            name: 'WarehouseCode',
            style: {
              'margin-left': '5px',
              'max-width': '90px'
            }
          },
          {
            title: 'Booking.WarehouseSiteId',
            name: 'WarehouseSiteId',
            style: {
              'margin-left': '5px',
              'max-width': '90px'
            }
          },
          {
            title: 'Booking.MustBeReceivedPO',
            name: 'MustBeReceivedPO',
            style: {
              'min-width': '90px',
              'max-width': '90px'
            },
          },
          {
            title: 'Booking.MustBeReceivedUnits',
            name: 'MustBeReceivedUnits',
            style: {
              'max-width': '90px',
              'min-width': '90px'
            },
          },
          {
            title: 'Booking.StartDate',
            name: 'StartDate',
            // style: {
            //   'max-width': '120px'
            // },
          }
        ]
      },
      data: this.dataSourceGrid
    };

  }

  confirm() {
    if (!this.checkFileExcel) {
      this.toast.error('Booking.ErrorFileExcel', 'error_title');
      return;
    }

    const dialogRef = this.dialog.open(ConfirmBookingComponent, {
      data: {
        data: {
          fileName: this.fileUpload.name,
          client: this.client
        }, 
        message: `Bạn có chắc muốn import file:`,
        title: "IMPORT FILE",
          type :2 
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
    this.service.uploadBooking(formData)
      .subscribe((resp: any) => {
        if (resp['Status']) {
          this.toast.success('Booking.SuccessImport', 'success_title');
          setTimeout(() => {
            this.goToBackList();
          }, 500)
        } else {
          this.toast.error('Booking.ErrorUpload', 'error_title');
        }
        this.resetUploadForm();
      });
  }

  downloadTemplate() {
    this.service.downloadTemplate("Dashboard_PO_BOOKING_Template_Ver1.xlsx");
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
    if (ext == 'xlsx' || ext == 'xls') {
      let formData = new FormData();
      formData.append('file', files[0]);
      formData.append('', '1');
      this.fileUpload = files[0];
      this.checkFileExcel = true;
      this.service.uploadBooking(formData)
        .subscribe((resp: any) => {
          if (resp.Status && resp.Data && resp.Data.Data) {
            this.isExportHidden = true;
            this.dataImport = resp.Data.Data;
            this.summary = {
              FileName: resp.Data.Summary['FileName'],
              TotalPO: resp.Data.Summary['TotalPO'],
              TotalQty: resp.Data.Summary['TotalQty'],
            };
            this.nameFileExport = resp.Data.Summary['FileName']
            resp.Data.Summary ? resp.Data.Summary : {};
            this.appTable['renderData'](this.dataImport);
          } else {
            if (resp.ErrorMessages && resp.ErrorMessages.length) {
              this.toast.error(resp.ErrorMessages.join("\n"), 'error_title');
            }
            else if (resp.Data && resp.Data.IsError) {
              this.isExportHidden = false;
              this.nameFileExport = resp.Data.FileName,
                this.dataExport = resp.Data.xlData;
              this.IsError = resp.Data.IsError;
              this.toast.error('Import thất bại vui lòng xuất file để kiểm tra', 'error_title');
            }
            this.resetUploadForm();
          }
        });
    } else {
      this.checkFileExcel = false;
      this.toast.error('Booking.ErrorFileExcel', 'error_title');
      this.resetUploadForm();
      this.appTable['renderData']([]);
      this.resetSummary();
    }
  }

  private resetSummary() {
    this.summary = {
      FileName: "",
      TotalPO: 0,
      TotalQty: 0
    };
  }

  GetDataFormatting(worksheet: any, arrayFottmat: any) {
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
    if (this.IsError) {
      let workbook = new Workbook();
      let worksheet = workbook.addWorksheet("ErrorTrackingLine");
      let arrayFottmatSheet1 = [1, 2, 3, 4, 5,6]
      // let arrayFottmatSheet2 = [1]
      worksheet.addRow([
        'Warehouse',
        'DCSite',
        'Số PO',
        'Số Units',
        'Ngày thực hiện',
        'Thông báo lỗi'
      ]);
      this.GetDataFormatting(worksheet, arrayFottmatSheet1)
      this.dataExport.forEach((item: any) => {
        worksheet.addRow([
          item["WarehouseCode"],
          item["WarehouseSiteId"],
          item["StartDate"],
          item["MustBeReceivedPO"], 
          item["MustBeReceivedUnits"],
          item["Error"] 
        ]);
      });
      worksheet.getColumn(1).width = 15;
      worksheet.getColumn(2).width = 15;
      worksheet.getColumn(3).width = 10;
      worksheet.getColumn(4).width = 15;
      worksheet.getColumn(5).width = 13;
      worksheet.getColumn(6).width = 30;
      workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        fs.saveAs(
          blob,
          `${this.nameFileExport}_ERROR_${moment(new Date()).format(
            "YYYYMMDDHHmmss"
          )}.xlsx`
        );
      });
    } else {
      this.toast.error("ERROR.SPE020", "error_title");
    }
    ;
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

  goToBackList(event: any = null) {
    // this.router.navigate([`${window.getRootPath(true)}/booking/list?content=${this.summary['FileName']}`]);
    window.open(`${window.getRootPath(true)}/booking/list?content=${this.nameFileExport}`, '_blank')
  }
  
  ngAfterViewInit() { }
}
