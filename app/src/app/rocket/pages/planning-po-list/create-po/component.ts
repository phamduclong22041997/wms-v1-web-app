import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Service } from '../../../service';
import { ToastService } from '../../../../shared/toast.service';
import { NotificationComponent } from '../../../../components/notification/notification.component';

@Component({
  selector: 'app-rocket-plainning-create-po',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class CreatePOComponent implements OnInit {
  @ViewChild('appTable', { static: false }) appTable: ElementRef;

  render: any;
  tableConfig: any;
  dataList: any;
  whCode: String;
  warehouseName: string;
  allowCreatePO: Boolean;
  totalWH: Number;
  dataSourceGrid = {
    rows: <any>[],
    total: 0
  };
  constructor(
    public dialogRef: MatDialogRef<CreatePOComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private service: Service,
    private toast: ToastService
  ) {
    this.whCode = "";
    this.allowCreatePO = false;
    this.initTable()
  }

  ngOnInit() {
    this.loadData();
  }
  ngAfterViewInit() { }

  parseWHData(whData: any) {
    const data = {};
    for (const wh of whData) {
      let key = wh['WarehouseCode'];
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
    let poIndex = 0;
    let idx = 0;
    for (let item of data) {
      let key = item.POCode;
      if (!resp[key]) {
        idx = 0;
        poIndex += 1;
        let _poIndex = `${poIndex}`;
        if (poIndex < 10) _poIndex = `0${poIndex}`;
        resp[key] = {
          index: _poIndex,
          POCode: `PO-${_poIndex}`,
          VendorName: item.VendorName,
          SKU: "",
          SKUName: "",
          Qty: 0,
          Uom: "",
          Details: []
        };
      }
      resp[key].Qty += item.Qty;
      resp[key].Details.push({
        index: ++idx,
        SKU: item.SKU,
        SKUName: item.SKUName,
        Qty: item.Qty,
        Uom: item.Uom
      })
    }
    return Object.values(resp);
  }

  setWHData(data: any) {
    let whData = this.parseWHData(data);
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
      this.appTable['renderData'](this.parseDataGrid(_data));
      this.allowCreatePO = wh && _data.length > 0;
    } else {
      this.allowCreatePO = false;
    }
  }

  onOkClick() {
    this.dialogRef.close(true);
  }

  createPO() {
    if (this.data && this.whCode) {
      let filters = {
        client: this.data['client'],
        promotionCode: this.data['promotionCode'],
        code: this.data['code'],
        type: this.data['type'],
        warehouseCode: this.whCode
      }
      this.service.createPO(filters)
        .subscribe((resp: any) => {
          if (resp['Status']) {
            this.toast.success('RocketPlanning.SuccessCreatePO', 'success_title');
            setTimeout(() => {
              this.onOkClick();
            }, 1500)
          } else {
            if (resp['ErrorMessages'] && resp['ErrorMessages'].length) {
              this.toast.error(resp['ErrorMessages'].join("\n"), 'error_title');
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
    this.service.analyzePO(this.data)
      .subscribe((resp: any) => {
        let _data = []
        if (resp.Status && resp.Data) {
          _data = resp.Data;
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
          'POCode',
          'VendorName',
          'SKU',
          'SKUName',
          'Qty',
          'Uom'
        ],
        options: [
          {
            title: 'RocketPlanning.PONumber',
            name: 'POCode',
            style: {
              'min-width': '90px',
              'max-width': '90px'
            }
          },
          {
            title: 'RocketPlanning.VendorName',
            name: 'VendorName',
          },
          {
            title: 'RocketPlanning.SKU',
            name: 'SKU',
            style: {
              'min-width': '90px',
              'max-width': '90px'
            }
          },
          {
            title: 'RocketPlanning.SKUName',
            name: 'SKUName',
            style: {
              'min-width': '200px'
            }
          },
          {
            title: 'RocketPlanning.RequestQty',
            name: 'Qty',
            style: {
              'min-width': '70px',
              'max-width': '70px'
            }
          },
          {
            title: 'RocketPlanning.Unit',
            name: 'Uom',
            style: {
              'min-width': '60px',
              'max-width': '60px'
            }
          }
        ]
      },
      data: this.dataSourceGrid
    };
  }
  confirmCreatePO(data: any) {
    const dialogRef = this.dialog.open(NotificationComponent, {
      data: {
        title: `TẠO PO`,
        message: 'Bạn có muốn tạo PO?',
        type: 1,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createPO();
      }
    });
  }
}
