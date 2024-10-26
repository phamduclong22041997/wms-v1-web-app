import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Service } from '../../../service';

const DEFAULT_WAREHOUSE = 'Q7';

@Component({
  selector: 'app-rocket-plainning-create-sto',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class AnalyzeSTOComponent implements OnInit {
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('whCombo', { static: false }) whCombo: any;
  render: any;
  tableConfig: any;
  whConfig: object;
  filters: object = {
    whCode: ''
  };
  dataSourceGrid = {
    rows: <any>[],
    total: 0
  };
  stoList: any = [];
  warehouse: String;
  totalSO: number;
  totalUnits: number;

  constructor(
    public dialogRef: MatDialogRef<AnalyzeSTOComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: Service
  ) { 
    this.warehouse = "";
    this.totalSO = 0;
    this.totalUnits = 0;
    this.initComboConfig();
    this.initTable();
  }

  ngOnInit() {
    this.loadData();
  }

  initComboConfig() {
    this.whConfig = {
      selectedFirst: true,
      isSelectedAll: false,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Name'];
      },
      type: 'combo',
      data: []
    };
  }

  onCancelClick() {
    this.dialogRef.close(false);
  }
  onOkClick() {
    this.dialogRef.close(true);
  }

  importRocket() {
    this.service.importRocket(this.data)
      .subscribe((resp: any) => {
        console.log(resp);
      });
  }

  exportSTO() {
    this.service.exportSTO(this.data);
  }

  parseWHData(whData: any) {
    const data = [];
    for (const wh of whData) {
      data.push({
        Code: wh,
        Name: wh
      });
    }
    return data;
  }

  initWHCombo(whData: any): void {
    const parseWH = this.parseWHData(whData) || [];
    this.whCombo['setData'](parseWH);
    this.whCombo['setDefaultData'](DEFAULT_WAREHOUSE);
    this.filterSTOByWarehouse(DEFAULT_WAREHOUSE);
  }

  getWarehouses(data) {
    const warehouses = [];
    for (const item of data) {
      if (item.Warehouse && warehouses.indexOf(item.Warehouse) === -1) {
        warehouses.push(item.Warehouse);
      }
    }
    return warehouses;
  }

  loadData() {
    if(this.data) {
      this.service.analyzeRocketSTO(this.data)
        .subscribe((resp: any) => {
          if (resp.Status && resp.Data) {
            this.parseData(resp.Data);
            // const warehouses = this.getWarehouses(this.stoList);
            // this.initWHCombo(warehouses);
          }
        });
    }
  }

  filterSTOByWarehouse(warehouseName: string) {
    const dataFilter = this.stoList.filter((item) => {
      if (warehouseName) {
        return item.Warehouse === warehouseName;
      }
      return item;
    });
    this.appTable['renderData'](dataFilter);
  }

  onChangeWHCombo(data:any) {
    if (data) {
      this.filters['whCode'] = data.Code;
    } else {
      this.filters['whCode'] = '';
    }
    this.filterSTOByWarehouse(this.filters['whCode']);
  }

  parseData(data:any) {
    let _data = {};
    for(let doc of data) {
      let key = doc['STOGroup'];
      if(!this.warehouse) {
        this.warehouse = doc['Warehouse'];
      }
      if(!_data[key]) {
        this.totalSO += 1;
        _data[key] = {
          SupraCode: doc.SupraCode,
          StoreCode: doc.StoreCode,
          StoreName: doc.StoreName,
          FinalUnits: 0,
          Details: []
        }
        this.totalUnits += doc.FinalUnits;
        _data[key].FinalUnits += doc.FinalUnits;
        _data[key].Details.push({
          SKU: doc.SKU,
          FinalUnits: doc.FinalUnits,
          UOM: doc.UOM,
          PO: (doc.PO || []).map(item=>item.POCode).join(", ")
        })
      }
    }
    this.appTable['renderData'](Object.values(_data));
  }

  initEvent() {
    this.whCombo['change'].subscribe({
      next: (data: any) => {
        this.onChangeWHCombo(data);
      }
    });
  }

  initTable() {
    this.tableConfig = {
      enableCollapse: true,
      disablePagination: true,
      showFirstLastButton: true,
      style: {
        // height: '300px'
        // 'overflow-x': 'hidden'
      },
      pageSize: 10,
      columns: {
        isContextMenu: false,
        displayedColumns: [
          'index',
          'SupraCode',
          'SKU',
          'FinalUnits',
          'UOM'
        ],
        options: [
          {
            title: 'Rocket.SKU',
            name: 'SKU',
          },
          {
            title: 'Rocket.StoreCode',
            name: 'SupraCode'
          },
          {
            title: 'Rocket.FinalUnits',
            name: 'FinalUnits',
            style: {
              'min-width': '80px'
            }
          },
          {
            title: 'Rocket.Uom',
            name: 'UOM',
          }
        ]
      },
      data: this.dataSourceGrid
    };
  }
  ngAfterViewInit() {
    this.initEvent();
  }
}
