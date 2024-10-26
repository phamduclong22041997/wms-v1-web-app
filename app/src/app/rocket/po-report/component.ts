import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ToastService } from '../../shared/toast.service';
import { Service } from '../service';

@Component({
  selector: 'app-po-report',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class POReportComponent implements OnInit, AfterViewInit {
  @ViewChild('appTableTK', { static: false }) appTableTK: ElementRef;
  @ViewChild('typeComboTK', { static: false }) typeComboTK: any;
  @ViewChild('ctkmComboTK', { static: false }) ctkmComboTK: any;
  @ViewChild('clientCombo', { static: false }) clientCombo: any;
  tableConfigTK: any;
  typeConfigTK: object;
  ctkmComboConfigTK: object;
  clientConfig: object;
  filters = {
    type: '',
    fileName: ''
  };
  dataSourceGrid = {
    rows: <any>[],
    total: 0
  };
  dataComboCTKMTK: any;

  constructor(
    public dialog: MatDialog,
    private service: Service,
    private toast: ToastService) { }

  ngOnInit() {
    this.initCombo();
    this.initTable();
  }

  getCTKMDemandSet() {
    this.service.getDemandSets({ 
      name: 'PO', 
    type: this.filters['type'], 
  client: this.filters['client']
  })
      .subscribe((resp: any) => {
        if (resp['Status'] && resp['Data']['CTKM']) {
          this.dataComboCTKMTK = resp['Data']['CTKM'];
          this.reloadComboCTKMTK();
        }else {
          // this.resetData();
          this.resetCTKMCombo();
        }
      });
  }

  initCombo() {
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
        // { Code: '', Name: 'Chọn khách hàng' },
        { Code: 'WKT', Name: 'WKT' },
        { Code: 'WIN', Name: 'WIN' },
      ],
    };

    // combobox PO TK
    this.typeConfigTK = {
      selectedFirst: true,
      isSelectedAll: false,
      isSorting: false,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Name'];
      },
      type: 'combo',
      data: [
        // { Code: '', Name: 'Chọn nhánh cửa hàng' },
        { Code: 'WMP', Name: 'WIN Mart +' },
        { Code: 'WMT', Name: 'WIN Mart' },
      ],
    };
    this.ctkmComboConfigTK = {
      selectedFirst: true,
      isSelectedAll: false,
      isFilter: true,
      val: (option: any) => {
        return option['Name'];
      },
      render: (option: any) => {
        return option['Name'];
      },
      type: 'autocomplete',
      data: []
    };
  }
  initTable() {
    this.tableConfigTK = {
      enableCollapse: false,
      rowSelected: true,
      showFirstLastButton: true,
      disablePagination: true,
      enableTools: { 'refresh': true },
      style: {
        // 'overflow-x': 'hidden'
      },
      pageSize: 10,
      columns: {
        isContextMenu: false,
        displayedColumns: ['Warehouse', 'PO', 'Qty', 'ExpQty', 'ActualQty', 'Available', 'POPending', 'QtyPending'],
        options: [
          {
            title: 'RocketPlanning.Warehouse',
            name: 'Warehouse',
            style: {
              'padding-left': '20px',
            },
          },
          {
            title: 'RocketPlanning.NumberPO',
            name: 'PO'
          },
          {
            title: 'RocketPlanning.Units',
            name: 'Qty'
          },
          {
            title: 'RocketPlanning.ExpQty',
            name: 'ExpQty'
          },
          {
            title: 'RocketPlanning.ActualUnits',
            name: 'ActualQty'
          },
          {
            title: 'RocketPlanning.Available',
            name: 'Available'
          },
          {
            title: 'RocketPlanning.POPending',
            name: 'POPending'
          },
          {
            title: 'RocketPlanning.QtyPending',
            name: 'QtyPending',
          }
        ]
      },
      data: this.dataSourceGrid
    };
  }
  initEvent() {
    // POTK
    this.typeComboTK['change'].subscribe({
      next: (data: any) => {
        if (data && data.Code) {
          this.filters['type'] = data.Code;
          this.getCTKMDemandSet();
        } else {
          this.filters['type'] = '';
        }
      }
    });


    this.ctkmComboTK['change'].subscribe({
      next: (data: any) => {
        if (data) {
          this.filters['promotionCode'] = data.Name;
          this.onSearchTK();
        } else {
          this.filters['promotionCode'] = '';
        }
      }
    });

    this.clientCombo['change'].subscribe({
      next: (data: any) => {
        if (data) {
          this.filters['client'] = data.Code;
          // this.reloadComboCTKM();
          this.getCTKMDemandSet();
        } else {
          this.filters['client'] = '';
        }
      }
    });
  }

  referenceDataCombox(data, key) {
    if (data && key) {
      return data[key];
    }
    let result = [];
    for (const k in data) {
      for (const item of data[k]) {
        result.push({
          Code: item.Code,
          Name: item.Name
        });
      }
    }
    return result;
  }


  onSearchTK() {
    this.service.getPOStatistical(this.filters).subscribe((resp: any) => {
      if (resp.Status && resp.Data) {
        this.appTableTK['renderData'](resp.Data || []);
      } else {
        const msgError = resp.ErrorMessages.Message;
        this.toast.error(msgError, 'error_title');
        this.appTableTK['renderData']([]);
      }
    });
  }
  // Begin PO TK
  
  getCTKMFirstValue(listCTKM) {
    let value = '';
    if (listCTKM && listCTKM.length) {
      value = listCTKM[0]['Name'];
    }
    return value;
  }
  reloadComboCTKMTK() {
    const type = this.filters['type'];
    this.ctkmComboConfigTK['data'] = this.referenceDataCombox(this.dataComboCTKMTK, type);
    const comboType = this.dataComboCTKMTK && this.dataComboCTKMTK[type] ? this.dataComboCTKMTK[type] : '';
    if (comboType) {
      const getCTKMDefaultValue = this.getCTKMFirstValue(comboType);
      this.ctkmComboTK.clear();
      this.ctkmComboTK.reload();
      this.ctkmComboTK.setDefaultValue(getCTKMDefaultValue);
      this.filters['promotionCode'] = getCTKMDefaultValue;
      this.onSearchTK();
    }else {
      this.resetCTKMCombo();
    }
  }
  private resetCTKMCombo(){
    this.ctkmComboConfigTK['data']=[];
    this.ctkmComboTK.clear();
    this.ctkmComboTK.reload();
    this.ctkmComboTK.setDefaultValue('Chọn mã CTKM');  
  }
  ngAfterViewInit(): void {
    this.initEvent();
  }

}
