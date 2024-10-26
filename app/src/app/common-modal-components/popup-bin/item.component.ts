import { Component, OnInit, ViewChild, Inject, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Service } from '../service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastService } from '../../shared/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { AnonymousSubject } from 'rxjs/internal/Subject';

interface dataPopup {
  BinCode?: string;
  Level?: string;
  Bed?: string;
  LWH?: string;
  Weight?: Number;
  // WarehouseCode?: string;
  NumOfPackage?: Number;
  NumOfSO?: Number;
  Status?: string;
  StoreList?: any;
}

interface inputData {
  SKU: String;
  SKUName?: String;
  ClientId: String;
  WarehouseId: String;
  TotalSO: Number;
  TotalQty: Number;
  SOList: any;
  SelectedBins: any;
}
@Component({
  selector: 'app-popup-table-bin',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
})
export class CreateBinComponent implements OnInit, AfterViewInit {
  @ViewChild('tableWarehouseBins', { static: false }) tableWarehouseBins: ElementRef;
  @ViewChild('binCombo', { static: false }) binCombo: any;

  tableConfig: any;
  dataCreateBin: dataPopup = {};
  isUpdate: Boolean = false;
  availableBINQty: Number = 0;
  selectedBins: any = [];
  originalBinQty: any = {};
  binApplyForSO: any = {};
  binConfig: Object;
  binType: any;
  dataBin = [
    {
      Code: '',
      Name: 'Tất cả'
    },
    {
      Code: 1,
      Name: 'Khả dụng'
    },
    {
      Code: 0,
      Name: 'Không khả dụng'
    }
  ];

  constructor(
    public dialogRef: MatDialogRef<CreateBinComponent>,
    @Inject(MAT_DIALOG_DATA) public data: inputData,
    private service: Service,
    private toast: ToastService,
    private translate: TranslateService
  ) { }
  ngOnInit() {
    this.binConfig = {
      selectedFirst: true,
      type: 'combo',
      filterKey: 'Name',
      filters: {},
      val: (option: any) => {
        return option['Code'];
      },
      render: (data: any) => {
        return data['Name'];
      },
      data: this.dataBin,
    };
    this.initData();
  }

  initData() {
    this.initTable();
    this.getWarehouseBins();
  }

  initTable() {
    this.tableConfig = {
      style: {
        'overflow-x': 'hidden',
      },
      showFirstLastButton: true,
      enableCheckbox: true,
      columns: {
        headerActionCheckBox: true,
        disabledActionCondition: (row: any) => {
          if (row.BinType === 'Smart') {
            return false;
          }
          return row.BinType !== 'Pickable' || row.IsValidate === 0;
        },
        displayedColumns: [
          'index',
          'LocationLabel',
          // 'BarCode',
          'BinType',
          // 'ExpiredDate',
          'AvailableQty',
          'headerAction'
        ],
        options: [
          {
            title: 'AutoPackSO.TableWarehouseBin.LocationLabel',
            name: 'LocationLabel',
            style: {
              'min-width': '150px',
              'color': '#d0333a'
            },
            headerStyle: {
              'font-weight': 'bold',
              'font-size': '14px'
            },
          },
          // {
          //   title: 'AutoPackSO.TableWarehouseBin.BarCode',
          //   name: 'BarCode',
          //   headerStyle: {
          //     'font-weight': 'bold',
          //     'font-size': '14px'
          //   },
          //   style: {
          //     'min-width': '90px'
          //   },
          // },
          {
            title: 'AutoPackSO.TableWarehouseBin.BinType',
            name: 'BinType',
            headerStyle: {
              'font-weight': 'bold',
              'font-size': '14px'
            },
            style: {
              'min-width': '90px'
            },
          },
          // {
          //   title: 'AutoPackSO.TableWarehouseBin.ExpiredDate',
          //   name: 'ExpiredDate',
          //   headerStyle: {
          //     'font-weight': 'bold',
          //     'font-size': '14px'
          //   },
          //   style: {
          //     'min-width': '140px',
          //     'justify-content': 'center'
          //   },
          // },
          {
            title: 'AutoPackSO.TableWarehouseBin.AvailableQty',
            name: 'AvailableQty',
            headerStyle: {
              'font-weight': 'bold',
              'font-size': '14px'
            },
            style: {
              'min-width': '150px'
            },
          }
        ]
      },
      data: {
        rows: [],
        total: 0
      }
    };
  }

  setOriginalBinQty(data: any) {
    const content = {};
    for (const bin of data) {
      const key = `${bin.LocationLabel}` || '';
      if (!content[key]) {
        content[key] = bin.AvailableQty || 0;
      }
    }
    return content;
  }

  revertSortBin() {
    return function (itemA: any, itemB: any) {
      return -1;
    };
  }

  setCheckedBin(tableData) {
    this.selectedBins = tableData.filter((item: any) => {
      const key = `${item.LocationLabel}` || '';
      item.AvailableQty = this.originalBinQty[key] || 0;
      return item.selected === true && (item.IsValidate === 1 || item.BinType === 'Smart');
    });
    this.availableBINQty = 0;
    // this.selectedBins = this.selectedBins.sort(this.revertSortBin());
    this.binApplyForSO = this.applyAvailableQty(this.selectedBins, this.data.SOList);
  }

  reloadSelectedBin(tableData) {
    for (const row of tableData) {
      const key = `${row.LocationLabel}` || '';
      if (this.data.SelectedBins.indexOf(key) !== -1) {
        row.selected = true;
      }
    }
    this.setCheckedBin(tableData);
  }

  getWarehouseBins(available = '') {
    const sku = this.data.SKU || '';
    if (!sku) {
      this.toast.error('AutoPackSO.BinDetail.Message_Error_Empty_SKU', 'error_title');
      return;
    }
    const _this = this;
    this.service.getWarehouseBins({
      SKU: sku,
      ClientId: this.data.ClientId,
      WarehouseId: this.data.WarehouseId,
      IsAvailable: available
    }).subscribe((resp: any) => {
      if (resp.Data && resp.Data['Rows']) {
        const tableData = resp.Data['Rows'] || [];
        this.data.SKUName = resp.Data.SKUName || '';
        this.originalBinQty = this.setOriginalBinQty(tableData);
        this.tableWarehouseBins['renderData'](tableData);
        this.reloadSelectedBin(tableData);
      }
    });
  }

  confirm(event: any) {
    if (!this.selectedBins.length || !this.data.SOList.length) {
      this.toast.error('AutoPackSO.BinDetail.Message_Error_Empty_Bin_Or_SO', 'error_title');
      return null;
    }
    if (this.data && this.data.TotalQty && this.data.TotalQty !== this.availableBINQty) {
      this.toast.error('AutoPackSO.BinDetail.Message_Error_Qty_Bin_SO_Not_Enough', 'error_title');
      return null;
    }
    this.dialogRef.close(this.binApplyForSO);
  }

  applyAvailableQty(binData: any, soData: any) {
    const applyBinforSO = {};
    for (const so of soData) {
      let soUnits = so.Qty || 0;
      if (!applyBinforSO[so.SupraCode]) {
        applyBinforSO[so.SupraCode] = [];
      }
      if (soUnits) {
        for (const bin of binData) {
          const binCode = bin.LocationLabel || '';
          applyBinforSO[so.SupraCode].push(binCode);
          
          const binQty = bin.AvailableQty || 0;
          if (binQty === 0) {
            continue;
          }

          if (binQty >= soUnits) {
            this.availableBINQty += soUnits;
            bin.AvailableQty = binQty - soUnits;
            soUnits = 0;
          }
          if (binQty <= soUnits) {
            this.availableBINQty += binQty;
            soUnits = soUnits - binQty;
            bin.AvailableQty = 0;
          }
        }
      }
    }
    return applyBinforSO;
  }

  initEvent() {
    this.binCombo['change'].subscribe({
      next: (data: any) => {
        if (data) {
          this.binType = data['Code'];
        } else {
          this.binType = '';
        }
        this.getWarehouseBins(this.binType);
      },
    });
    const _this = this;
    this.tableWarehouseBins['rowEvent'].subscribe({
      next: (data: any) => {
        if (data && data.length) {
          _this.setCheckedBin(data);
        }
      }
    });
  }

  ngAfterViewInit() {
    this.initEvent();
  }
}
