import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Service } from '../../../service';
import { ToastService } from '../../../../shared/toast.service';
import * as _ from 'lodash';
import * as fs from 'file-saver';
import { Workbook } from 'exceljs';
import * as moment from 'moment';
import { NotificationComponent } from '../../../../components/notification/notification.component';
@Component({
  selector: 'app-rocket-plainning-create-po',
  templateUrl: './component.html',
  styleUrls: ['./component.css']

})
export class CreateSTOComponent implements OnInit {
  @ViewChild('appTable', { static: false }) appTable: ElementRef;

  render: any;
  tableConfig: any;
  dataList: any;
  dataDetail = {};
  rocketCode: String;
  whCode: String;
  warehouseName: string;
  DataError: any;
  allowCreatePO: Boolean;
  isExportHidden = true;
  totalWH: Number;
  dataSourceGrid = {
    rows: <any>[],
    total: 0
  };
  isCreateSTO = true;
  constructor(
    public dialogRef: MatDialogRef<CreateSTOComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: Service,
    private toast: ToastService
  ) {
    this.whCode = "";
    this.allowCreatePO = false;
    this.initTable();
    this.isCreateSTO = data.isCreateSTO || false;
  }

  ngOnInit() {
    this.loadData();
  }
  ngAfterViewInit() { }

  parseWHData(whData: any) {
    const data = {};
    for (const wh of whData) {
      const key = wh['WarehouseCode'];
      if (!data[key]) {
        data[key] = {
          Code: wh['WarehouseCode'],
          Name: wh['WarehouseName']
        };
      }
    }
    return Object.values(data);
  }

  parseDataGrid(data: any) {
    let resp = {};
    let Details = [];
    let soIndex = 0;
    let idx = 0;
    for (let item of data) {
      this.rocketCode = item.Code
      let key = item.StoreCode;
      if (item.ExternalCode) {
        key += `_${item.ExternalCode}`
      }
      if (!resp[key]) {
        idx = 0;
        soIndex += 1;
        let _soIndex = `${soIndex}`;
        if (soIndex < 10) _soIndex = `0${soIndex}`;
        resp[key] = {
          index: _soIndex,
          Code: `SO-${_soIndex}`,
          StoreCode: item.StoreCode,
          ExternalCode: item.ExternalCode,
          SKU: "",
          SKUName: "",
          FinalUnits: 0,
          Uom: "",
          Message: '',
          Error: '',
          Details: [],
          Note: item.Note
        };
      }


      resp[key].FinalUnits += item.FinalUnits;
      const STORE_SKU = `${key}_${item.SKU}`;
      let message = '';
      let error = '';
      if (this.dataDetail && this.dataDetail[STORE_SKU] && !this.dataDetail[STORE_SKU].Valid) {
        message = this.dataDetail[STORE_SKU].Message;
        error = 'Lỗi';
        resp[key].Error = error;
      }

      resp[key].Details.push({
        index: ++idx,
        StoreCode: item.StoreCode,
        SKU: item.SKU,
        SKUName: item.SKUName,
        FinalUnits: item.FinalUnits,
        Uom: item.Uom,
        Message: message,
        Error: error,
      });
      Details.push({
        index: ++idx,
        Uploader: item.RequestBy,
        DataType: item.RequestType,
        Version: item.Version || '',
        RocketCode: item.Code,
        ClientCode: item.ClientCode,
        WarehouseSiteId: item.WarehouseSiteId,
        StoreCode: item.StoreCode,
        StoreName: item.StoreName,
        SKU: item.SKU,
        SKUName: item.SKUName,
        FinalUnits: item.FinalUnits,
        Uom: item.Uom,
        Message: message,
      })
    }
    console.log(Object.values(resp), "Object.values(resp)")
    return {
      dataRender: Object.values(resp),
      dataExport: Object.values(Details)
    }
  }

  setWHData(data: any) {
    const whData = this.parseWHData(data);
    if (whData.length) {
      this.setDataGrid(whData[0]);
    }
  }

  setDataGrid(wh: any) {
    if (wh) {
      let _data = []
      for (let doc of this.dataList) {
        if (doc['WarehouseCode'] === wh['Code']) {
          _data.push(doc);
        }
      }
      this.whCode = wh['Code'];
      this.warehouseName = wh['Name'];
      this.appTable['renderData'](this.parseDataGrid(_data).dataRender);
      this.allowCreatePO = wh && _data.length > 0;
    } else {
      this.allowCreatePO = false;
    }
  }

  onOkClick() {
    this.dialogRef.close(true);
  }

  createSO() {
    if (this.data && this.whCode) {
      const filters = {
        client: this.data['client'],
        promotionCode: this.data['promotionCode'],
        code: this.data['code'],
        type: this.data['type'],
        warehouseCode: this.whCode
      };
      this.isCreateSTO = true;
      this.service.createSO(filters)
        .subscribe((resp: any) => {
          if (resp['Status']) {
            this.toast.success('RocketPlanningSO.SuccessCreateSO', 'success_title');
            setTimeout(() => {
              this.isCreateSTO = false;
              this.onOkClick();
            }, 1500);

          } else {
            if (resp['ErrorMessages'] && resp['ErrorMessages'].length) {
              this.toast.error(resp['ErrorMessages'].join("\n"), 'error_title');

              setTimeout(() => {
                this.isCreateSTO = false;
              }, 50000);
            }
          }
        });
    }
  }

  exportPO() {
    if (this.data && this.whCode) {
      let filters = {
        client: this.data['client'],
        promotionCode: this.data['promotionCode'],
        type: this.data['type'],
        warehouseCode: this.whCode
      }
      this.service.exportPO(filters);
    }
  }

  loadData() {
    this.service.analyzeSTO(this.data)
      .subscribe((resp: any) => {
        let _data = [];
        this.isCreateSTO = false;
        if (resp.Status && resp.Data) {
          if (resp.Data.Message && resp.Data.Message.length > 0) {
            this.toast.error(resp.Data.Message, 'error_title');
            this.isCreateSTO = true;
          }
          else if (!resp.Data.AuditData.Valid) {
            this.toast.error('Không đủ tồn kho, vui lòng kiểm tra lại!', 'error_title');
            this.isExportHidden = false;
            this.isCreateSTO = true;
            this.dataDetail = resp.Data.AuditData.Data;
            console.log(this.DataError, "err");
          }

          _data = resp.Data.Data;
        }
        this.dataList = _data;
        this.setWHData(_data);
      });
  }

  initTable() {
    this.tableConfig = {
      disablePagination: true,
      enableCollapse: true,
      rowSelected: false,
      style: {
        // height: '300px'
        // 'overflow-x': 'hidden'
      },
      pageSize: 10,
      columns: {
        isContextMenu: false,
        displayedColumns: [
          'index',
          'Code',
          "ExternalCode",
          'StoreCode',
          'SKU',
          'SKUName',
          'FinalUnits',
          'Uom',
          'Error',
          'Message'
        ],
        options: [
          {
            title: 'RocketPlanningSO.SONumber',
            name: 'Code',
          },
          {
            title: 'STO.ExternalCode',
            name: 'ExternalCode',
          },
          {
            title: 'RocketPlanningSO.StoreCode',
            name: 'StoreCode',
          },
          {
            title: 'RocketPlanningSO.SKU',
            name: 'SKU',
            style: {
              'min-width': '90px',
              'max-width': '90px'
            }
          },
          {
            title: 'RocketPlanningSO.SKUName',
            name: 'SKUName',
            style: {
              'min-width': '250px',
              'max-width': '260px'
            }
          },
          {
            title: 'RocketPlanningSO.RequestQty',
            name: 'FinalUnits',
          },
          {
            title: 'RocketPlanningSO.BaseUOM',
            name: 'Uom',
          },
          {
            title: 'RocketPlanningSO.IsError',
            name: 'Error',
          },
          {
            title: 'RocketPlanningSO.MessageError',
            name: 'Message',
          }
        ]
      },
      data: this.dataSourceGrid
    };
  }
  confirmCreateSO(data: any) {
    const dialogRef = this.dialog.open(NotificationComponent, {
      data: {
        title: `TẠO SO`,
        message: 'Bạn có muốn tạo SO?',
        type: 1,
        // Data: {
        //   Name: this.warehouseName
        // }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createSO();
      }
    });
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

  exportDataError() {
    if (this.dataDetail && this.dataList) {
      let workbook = new Workbook();
      let worksheet = workbook.addWorksheet("ErrorTrackingLine");
      let arrayFottmat = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,15,16,17,18,19,20]
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
      let dataError = this.parseDataGrid(this.dataList).dataExport.sort((a, b) => b.StoreCode - a.StoreCode);
      this.GetDataFormatting(worksheet, arrayFottmat)
      dataError.forEach((item: any) => {
        worksheet.addRow([
          item['Uploader'] || '',
          item['DataType'] || '',
          item['Version'] || '',
          item['RocketCode'] || '',
          item['ClientCode'] || '',
          item['WarehouseSiteId'] || '',
          item['Type'] == "DEFAULT" ? '' : item['Type'],
          item['StoreCode'],
          item['StoreName'] || '',
          item['SKU'] || '',
          item['SKUName'] || '',
          item['FinalUnits'] || '',
          item['Uom'] || '',
          item['StartDate'] || '',
          item['EndDate'] || '',
          item['PromotionNote'] || '',
          item['PromotionMonth'] || '',
          item['Period']  || '',
          item['PromotionCode']  || '',
          item['Message']  || '',
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
      workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        fs.saveAs(
          blob,
          `${this.rocketCode}_ErrorTracking_${moment(new Date()).format(
            "YYYYMMDDHHmmss"
          )}.xlsx`
        );
      });
    } else {
      this.toast.error("ERROR.SPE020", "error_title");
    }
    ;
  }
}
