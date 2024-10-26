import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from './../../../shared/toast.service';
import { Service } from '../../service';
import { Router } from '@angular/router';
import { AnalyzeSTOComponent } from './analyze-sto/component';

@Component({
  selector: 'app-rocket',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class RocketComponent implements OnInit, AfterViewInit {
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('inputFile', { static: false }) inputFile: ElementRef;
  @ViewChild('whCombo', { static: false }) whCombo: any;
  @ViewChild('typeCombo', { static: false }) typeCombo: any;

  fileUpload: any;
  nameFileUpload: string;
  dataDIOPostDownload: object;
  DIO: string;
  tableConfig: any;
  whConfig: object;
  typeConfig: object;
  clientConfig: object;
  checkFileExcel: boolean;

  whCode: string;
  stoType: string;
  whName: string;
  clientCode: string;
  valid: boolean;
  totalSTO: number;
  IsMDL: boolean;
  content: String;
  totalStore: number;
  totalSKU: number;
  totalUnits: number;
  allowAnalyzeSto: boolean;

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
    this.whCode = '';
    this.whName = '';
    this.stoType = '';
    this.clientCode = '';
    this.checkFileExcel = false;
    this.nameFileUpload = 'Chọn STO SET';
    this.totalSTO = 0;
    this.totalUnits = 0;
    this.totalSKU = 0;
    this.allowAnalyzeSto = true;

    this.initTable();
    this.whConfig = {
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

    this.typeConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      isSorting: true,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Name'];
      },
      type: 'autocomplete',
      filter_key: 'Name',
      data: [
        { Code: "DEFAULT", Name: "Mặc định" },
        { Code: 'WMP', Name: 'Winmart+' },
        { Code: "WMT", Name: 'Winmart' }
      ]
    };

    this.clientConfig = {
      selectedFirst: true,
      isSelectedAll: false,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Name'];
      },
      type: 'combo',
      data: [
        { Code: 'WKT', Name: 'WKT' },
        { Code: 'WIN', Name: 'WIN' },
      ],
    };
  }

  ngAfterViewInit() {
    this.initEvent();

    // this.loadData();
  }

  showAnalyzeSTO() {
    let _data = { WarehouseCode: this.whCode, Type: this.stoType, Client: this.clientCode, Content: this.content };

    if (_data && _data['WarehouseCode'] && _data['Type'] && _data['Client']) {
      const dialogRef = this.dialog.open(AnalyzeSTOComponent, {
        data: _data,
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) { }
      });
    }
  }

  initEvent() {
    this.whCombo['change'].subscribe({
      next: (data: any) => {
        if (data) {
          this.whCode = data['Code'];
          this.whName = data['Name'];
        } else {
          this.whCode = '';
          this.whName = '';
        }

        if (this.whCode) {
          this.loadData();
        }
      }
    });

    this.typeCombo['change'].subscribe({
      next: (data: any) => {
        if (data) {
          this.stoType = data['Code'];
        } else {
          this.stoType = '';
        }
        if (this.whCode) {
          this.loadData();
        }
      }
    });
  }

  parseData(data: any) {
    let renderData = [];
    let skuList = [];
    let Idx = 0;
    for (let key in data) {
      renderData.push({
        Idx: ++Idx,
        SupraCode: data[key].SupraCode,
        Province: data[key].Province,
        District: data[key].District,
        TotalSKU: data[key].SKUs.length,
        TotalWeight: data[key].TotalWeight.toFixed(3),
        TotalUnits: data[key].TotalUnits
      });
      this.totalUnits += data[key].TotalUnits;
      for (let sku of data[key].SKUs) {
        if (skuList.indexOf(sku) == -1) {
          skuList.push(sku);
        }
      }
    }
    this.totalSTO = renderData.length;
    this.totalSKU = skuList.length;

    return renderData;
  }

  loadData() {
    this.service.rocketSTOList({ WarehouseCode: this.whCode, Type: this.stoType, Client: this.clientCode, Content: this.content })
      .subscribe((resp: any) => {
        let data = [];
        if (resp['Status'] && resp['Data']) {
          data = resp['Data'] || {}
        }
        this.appTable['renderData'](this.parseData(data));
      })
  }

  exportSTOSet() {
    this.service.exportRocketSTO({
      WarehouseCode: this.whCode,
      Type: this.stoType,
      Client: this.clientCode,
      Content: this.content
    });
  }

  search() {
    this.loadData();
  }
  importSTO() {
    this.router.navigate(['/app/rocket/upload']);
  }

  initTable() {
    this.tableConfig = {
      enableCollapse: false,
      rowSelected: false,
      enableCheckbox: false,
      columns: {
        headerActionCheckBox: false,
        isContextMenu: false,
        displayedColumns: ['index', 'SupraCode', 'Province', 'District', 'TotalSKU', 'TotalUnits', 'TotalWeight'],
        options: [
          {
            title: 'Rocket.StoreCode',
            name: 'SupraCode',
          },
          {
            title: 'Rocket.Province',
            name: 'Province',
          },
          {
            title: 'Rocket.District',
            name: 'District',
          },
          {
            title: 'Rocket.TotalSKU',
            name: 'TotalSKU',
          },
          {
            title: 'Rocket.TotalUnits',
            name: 'TotalUnits',
          },
          {
            title: 'Rocket.TotalWeight',
            name: 'TotalWeight',
          }
        ]
      },
      data: this.dataSourceGrid
    };
  }
}
