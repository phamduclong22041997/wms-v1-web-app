import { Component, OnInit, ViewChild, Inject, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Service } from '../service';
import { ToastService } from '../../shared/toast.service';
import * as XLSX from 'xlsx';
import * as _ from 'lodash';
import * as fs from 'file-saver';
import { Workbook } from 'exceljs';
import * as moment from 'moment';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'confirm-import-store',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ImportStoreComponent implements OnInit, AfterViewInit {
  dataImportStore: object = {};
  nameFile = '';
  isConfirm: boolean = true;
  constructor(
    public dialogRef: MatDialogRef<ImportStoreComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: Service,
    private toast: ToastService,) {
  }
  ngOnInit() {
    this.initData();
  }

  initData() {
  }

  uploadSTOFile(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      let isValid = true;
      const fileName = file.name.toLowerCase(),
        regex = new RegExp('(.*?)\.(xlsx|xls)$');
      this.nameFile = fileName
      if (!(regex.test(fileName))) {
        isValid = false;
        this.toast.error('Vui lòng chọn file excel', 'error_title');
      }
      if (isValid) {
        const reader = new FileReader();
        reader.readAsBinaryString(file);
        const _this = this;
        reader.onload = function (e: any) {
          const data = e.target.result;
          _this.dataImportStore = _this.parseExcelToObj(data)
          if (_this.dataImportStore) {
            _this.service.checkFinish(
              _this.dataImportStore
            ).subscribe((resp: any) => {
              if (resp.Status && resp.Data.Status) {
                _this.toast.success('File hợp lệ', 'Success');
                _this.isConfirm = !resp.Data.Status
              } else {
                _this.toast.error(resp.Data.Data, 'error_title');
                // _this.isConfirm = resp.Data.Status
              }
            });
          } else {
            _this.isConfirm = true;
            _this.toast.error('File dữ liệu không hợp lệ vui lòng chọn file khác', 'error_title');
          }
          event.target.value = null;
        }
      }
    }
  }

  parseExcelToObj(dataXLSX: any) {
    const wb = XLSX.read(dataXLSX, {
      type: 'binary'
    });
    const _region = window.localStorage.getItem("region");
    const account = window.localStorage.getItem("accountInfo");
    let area = null
    let modifiedBy = ''
    if (_region) {
      let obj = JSON.parse(_region);
      area = obj.Name
    }
    if (account) {
      let obj = JSON.parse(account);
      modifiedBy = obj.DisplayName
    }
    let arr = []

    const dataJson = XLSX.utils.sheet_to_json(wb.Sheets['ListStore'], { header: 'A' });
    if (dataJson.length > 0) {
      dataJson.shift()
    } else {
      return null
    }
    _.each(dataJson, (obj, key) => {
      let objImport = {
        StoreCode: obj['A'] ? obj['A'].toString() : null,
        SiteId: obj['B'] ? obj['B'].toString() : null,
        StoreName: obj['C'],
        Type: obj['D'],
        Status: obj['E'],
        ContactName: obj['F'],
        ContactPhone: obj['G'],
        Hotline: obj['H'].toString(),
        ReceivingStaffName: obj['I'],
        ReceivingStaffPhone: obj['J'],
        Street: obj['K'],
        Ward: obj['L'],
        District: obj['M'],
        Province: obj['N'],
        Region: obj['O'],
        FullAddress: obj['P'],
        Country: obj['Q'],
        Long: obj['R'],
        Lat: obj['S'],
        ClientCode: obj['T'],
        LeadTime: obj['U']
      }
      arr.push(objImport)
    })
    return arr
  }

  exportExcel(event: any) {
    //Excel Title, Header, Data
    const title = 'Car Sell Report';
    const header = ["Year", "Month", "Make", "Model", "Quantity", "Pct"]
    const data = [
      [2007, 1, "Volkswagen ", "Volkswagen Passat", 1267, 10],
      [2007, 1, "Toyota ", "Toyota Rav4", 819, 6.5],
      [2007, 1, "Toyota ", "Toyota Avensis", 787, 6.2],
      [2007, 1, "Volkswagen ", "Volkswagen Golf", 720, 5.7],
      [2007, 1, "Toyota ", "Toyota Corolla", 691, 5.4],
      [2007, 1, "Peugeot ", "Peugeot 307", 481, 3.8],
      [2008, 1, "Toyota ", "Toyota Prius", 217, 2.2],
      [2008, 1, "Skoda ", "Skoda Octavia", 216, 2.2],
      [2008, 1, "Peugeot ", "Peugeot 308", 135, 1.4],
      [2008, 2, "Ford ", "Ford Mondeo", 624, 5.9],
      [2008, 2, "Volkswagen ", "Volkswagen Passat", 551, 5.2],
      [2008, 2, "Volkswagen ", "Volkswagen Golf", 488, 4.6],
      [2008, 2, "Volvo ", "Volvo V70", 392, 3.7],
      [2008, 2, "Toyota ", "Toyota Auris", 342, 3.2],
      [2008, 2, "Volkswagen ", "Volkswagen Tiguan", 340, 3.2],
      [2008, 2, "Toyota ", "Toyota Avensis", 315, 3],
      [2008, 2, "Nissan ", "Nissan Qashqai", 272, 2.6],
      [2008, 2, "Nissan ", "Nissan X-Trail", 271, 2.6],
      [2008, 2, "Mitsubishi ", "Mitsubishi Outlander", 257, 2.4],
      [2008, 2, "Toyota ", "Toyota Rav4", 250, 2.4],
      [2008, 2, "Ford ", "Ford Focus", 235, 2.2],
      [2008, 2, "Skoda ", "Skoda Octavia", 225, 2.1],
      [2008, 2, "Toyota ", "Toyota Yaris", 222, 2.1],
      [2008, 2, "Honda ", "Honda CR-V", 219, 2.1],
      [2008, 2, "Audi ", "Audi A4", 200, 1.9],
      [2008, 2, "BMW ", "BMW 3-serie", 184, 1.7],
      [2008, 2, "Toyota ", "Toyota Prius", 165, 1.6],
      [2008, 2, "Peugeot ", "Peugeot 207", 144, 1.4]
    ];
    //Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Car Data');
    //Add Row and formatting
    let headerRow = worksheet.addRow(header);
    // Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF00' },
        bgColor: { argb: 'FF0000FF' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })
    // worksheet.addRows(data);
    // Add Data and Conditional Formatting
    data.forEach(d => {
      let row = worksheet.addRow(d);
      let qty = row.getCell(5);
      let color = 'FF99FF99';
      if (+qty.value < 500) {
        color = 'FF9999'
      }
      qty.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color }
      }
    }
    );
    worksheet.getColumn(3).width = 30;
    worksheet.getColumn(4).width = 30;
    worksheet.addRow([]);
    //Footer Row
    let footerRow = worksheet.addRow(['This is system generated excel sheet.']);
    footerRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFCCFFE5' }
    };
    footerRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    //Merge Cells
    worksheet.mergeCells(`A${footerRow.number}:F${footerRow.number}`);
    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'CarData.xlsx');
    })
  }
  GetDataFormatting(worksheet) {
    let dataFormatting = [1, 2, 3, 4, 5, 6, 7, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

    for (let i = 0; i < dataFormatting.length; i++) {
      console.log(dataFormatting[i])
      worksheet.getColumn(dataFormatting[i]).eachCell(function (cell) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF0000' }
        };
      });
    }
  }
  exportStoreExcel(event: any) {
    this.service
      .exportTemplateStore({})
      .subscribe((value: any) => {
        if (value.Status && value.Data) {
          const store: any = [];

          let workbook = new Workbook();
          let worksheet = workbook.addWorksheet("ListStore");
          worksheet.addRow([
            "StoreCode",
            "StoreName",
            "Type",
            "Status",
            "ContactName",
            "ContactPhone",
            "Hotline",
            "ReceivingStaffName",
            "ReceivingStaffPhone",
            "Street",
            "Ward",
            "District",
            "Province",
            "Region",
            "FullAddress",
            "Country",
            "Long",
            "Lat",
            "ClientCode",
            "LeadTime",
          ]);
          this.GetDataFormatting(worksheet)
          worksheet.addRow([
            "6270",
            "WM+ PTO Phú Lộc, Phù Ninh",
            "WMP",
            "ACTIVED",
            "Nguyễn Hoàng Nhật",
            "0933723236",
            "18001090",
            "Phạm Minh Khang",
            "0913854784",
            "Khu 5",
            "Xã Phú Lộc",
            "Huyện Phù Ninh",
            "Tỉnh Phú Thọ",
            "Miền Bắc",
            "Khu 5, Xã Phú Lộc, Huyện Phù Ninh, Tỉnh Phú Thọ",
            "Việt Nam",
            "105.2926415",
            "21.4308392",
            "WIN",
            "12",
          ]);
          worksheet.addRow([
            "6270",
            "WM+ PTO Phú Lộc, Phù Ninh",
            "WMP",
            "ACTIVED",
            "Nguyễn Hoàng Nhật",
            "0933723236",
            "18001090",
            "Phạm Minh Khang",
            "0913854784",
            "Khu 5",
            "Xã Phú Lộc",
            "Huyện Phù Ninh",
            "Tỉnh Phú Thọ",
            "Miền Bắc",
            "Khu 5, Xã Phú Lộc, Huyện Phù Ninh, Tỉnh Phú Thọ",
            "Việt Nam",
            "105.2926415",
            "21.4308392",
            "WIN",
            "12",
          ]);
          worksheet.getColumn(1).width = 10;
          worksheet.getColumn(2).width = 30;
          worksheet.getColumn(3).width = 8;
          worksheet.getColumn(4).width = 10;
          worksheet.getColumn(5).width = 18;
          worksheet.getColumn(6).width = 14;
          worksheet.getColumn(7).width = 12;
          worksheet.getColumn(8).width = 18;
          worksheet.getColumn(9).width = 18;
          worksheet.getColumn(10).width = 12;
          worksheet.getColumn(11).width = 12;
          worksheet.getColumn(12).width = 16;
          worksheet.getColumn(13).width = 16;
          worksheet.getColumn(14).width = 12;
          worksheet.getColumn(15).width = 42;
          worksheet.getColumn(16).width = 12;
          worksheet.getColumn(17).width = 12;
          worksheet.getColumn(18).width = 12;
          worksheet.getColumn(19).width = 10;
          worksheet.getColumn(20).width = 10;


          for (let i in value.Data.Wards) {
            let temp = [];
            value.Data.Wards[i]
              ? temp.push(value.Data.Wards[i].Name)
              : "";
            value.Data.Districts[i]
              ? temp.push(value.Data.Districts[i].Name)
              : "";
            value.Data.Provinces[i] ? temp.push(value.Data.Provinces[i].Name) : "";
            store.push(temp);
          }

          worksheet = workbook.addWorksheet("Address");
          worksheet.addRow([
            "Wards",
            "Districts",
            "Provinces",
          ]);

          store.forEach((d: any) => {
            worksheet.addRow(d);
          });

          worksheet.getColumn(1).width = 30;
          worksheet.getColumn(2).width = 30;
          worksheet.getColumn(3).width = 30;

          // format color
          worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'ffeee6' }
          }
          workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            fs.saveAs(
              blob,
              `Template_Import_Store_${moment(new Date()).format(
                "YYYYMMDDHHmmss"
              )}.xlsx`
            );
          });
        } else {
          this.toast.error("ERROR.SPE020", "error_title");
        }
      });
  }

  ngAfterViewInit() {
    this.initEvent();
  }

  initEvent() {
  }

  confirm(event: any) {
    this.service.importStore(
      this.dataImportStore
    ).subscribe((resp: any) => {
      if (resp.Status) {
        this.toast.success('Import store thành công', 'Success');
      } else {
        this.toast.error('Import store bị lỗi', 'error_title');
      }
    });
  }
}
