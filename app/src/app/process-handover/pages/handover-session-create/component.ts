import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../../shared/toast.service';
import { Service } from '../../service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmExportComponent } from '../../confirm/component';

@Component({
  selector: 'app-create-handover-session',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class CreateHandoverSessionComponent implements OnInit {
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('province', { static: false }) province: ElementRef;
  @ViewChild('district', { static: false }) district: ElementRef;
  @ViewChild('client', { static: false }) client: ElementRef;
  @ViewChild('store', { static: false }) store: ElementRef;
  @ViewChild('productType', { static: false }) productType: ElementRef;
  @ViewChild('soType', { static: false }) soType: ElementRef;
  @ViewChild('promotion', { static: false }) promotion: ElementRef;
  @ViewChild('content', { static: false }) contentInput: ElementRef

  dataSourceGrid = {
    rows: <any>[],
    total: 0
  };

  tableConfig: any;
  clientConfig: any;
  storeConfig: any;
  configDate: any;
  provinceConfig: any;
  districtConfig: any;
  productTypeConfig: any;
  soTypeConfig: any;
  promotionConfig: any;
  allowHandoverSession: boolean;
  numOfSO: number;
  filters: any = {
    Province: "",
    District: "",
    Type: "",
    ConditionType: "",
    Store: "",
    Content: "",
    ClientCode: "",
    WarehouseCode:''
  }

  constructor(
    public dialog: MatDialog,
    private service: Service,
    private router: Router,
    private toast: ToastService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.allowHandoverSession = false;
    this.numOfSO = 0;
    this.filters['WarehouseCode'] = window.getRootPath().toUpperCase();
    this.initTable();
    this.initCombo();
  }

  ngAfterViewInit() {
    this.initEvent();
    if (this.contentInput) {
      setTimeout(() => {
        this.contentInput.nativeElement.focus();
      }, 500)
    }
  }
  sleepNow = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
  async createSession(event: any) {
    let data = this.appTable['getData']()['data'];
    if (!data.length) {
      return;
    }
    if (!this.allowHandoverSession) return;
    let saveData = {
      SOList: []
    };
    let block = [];
    let start = 1;
    for (let idx in data) {
      if (data[idx].selected) {
        block.push(idx);
        saveData.SOList.push(data[idx].SOCode);
      }

      if (block.length == 50) {
        let is_last = false;
        if (start === this.numOfSO) {
          is_last = true
        }
        await this.createHandoverSession(saveData, { is_last: is_last }, 10000);
        console.log('::block::', is_last);
        block = [];
        saveData = {
          SOList: []
        };
      }
      start++;
    }
    if (block.length) {
      await this.sleepNow(5000);
      await this.createHandoverSession(saveData, { is_last: true }, 3000);
    }
  }
  async createHandoverSession(data, options = {}, timesleep = 5000) {
    let $this = this;
    await this.service.createHandoverSession(data)
      .subscribe((resp: any) => {
        if (resp.Status) {
          $this.toast.success("Handover.CreateSessionSuccessful", "success_title");
          if (options && options['is_last']) {
            setTimeout(() => {
              $this.goHandover();
            }, 500)
          }
        } else {
          if (resp.ErrorMessages && resp.ErrorMessages.length) {
            $this.toast.error(`${resp.ErrorMessages[0]}`, 'error_title');
          }
        }
      });
    await $this.sleepNow(timesleep);
  }

  onEnter() {
    this.search(null);
  }
  search(event: any) {
    this.service.loadSOList(this.filters)
      .subscribe((resp: any) => {
        this.makeData(resp);
      })
  }

  initCombo() {
    this.clientConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      isSorting: false,
      isSelectedAllValueIsEmpty: true,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return `${option['Code']} - ${option['Name']}`;
      },
      type: 'autocomplete',
      filter_key: 'Name',
      URL_CODE: 'SFT.clientcombo'
    }
    this.storeConfig = {
      selectedFirst: false,
      isSelectedAll: false,
      isSorting: false,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return `${option['Code']} - ${option['Name']}`;
      },
      type: 'autocomplete',
      filter_key: 'Name',
      URL_CODE: 'SFT.storecombo'
    }
    this.provinceConfig = {
      selectedFirst: false,
      isSelectedAll: false,
      isSorting: false,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return `${option['Name']}`;
      },
      type: 'autocomplete',
      filter_key: 'Name',
      URL_CODE: 'SFT.provincescombo'
    };
    this.districtConfig = {
      selectedFirst: false,
      isSelectedAll: false,
      isSorting: false,
      disableAutoload: true,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return `${option['Name']}`;
      },
      type: 'autocomplete',
      filter_key: 'Name',
      URL_CODE: 'SFT.districtscombo'
    };
    this.productTypeConfig = {
      selectedFirst: true,
      isSelectedAll: false,
      isSorting: false,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return this.translate.instant(`POConditionType.${option['Name']}`);
      },
      filters: {
        WarehouseCode: this.filters['WarehouseCode'],
      },
      type: 'autocomplete',
      filter_key: 'Name',
      URL_CODE: 'SFT.producttypecombo'
    };

    this.soTypeConfig = {
      selectedFirst: true,
      isSelectedAll: false,
      isSorting: false,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return this.translate.instant(`AutoPickPack.SOTypes.${option['Name']}`);
      },
      filters: {
        WarehouseCode: this.filters['WarehouseCode'],
      },
      type: 'autocomplete',
      filter_key: 'Name',
      URL_CODE: 'SFT.sotypecombo'
    };

    this.promotionConfig = {
      selectedFirst: true,
      isSelectedAll: false,
      isSorting: false,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return `${option['Code']}`;
      },
      filters: {
        WarehouseCode:this.filters['WarehouseCode']
      },
      type: 'autocomplete',
      filter_key: 'Name',
      URL_CODE: 'SFT.servicecombo'
    };
  }

  makeData(data: any) {
    let _data = [];
    if (data.Status) {
      _data = data.Data;
    }
    this.appTable['renderData'](_data);
    this.appTable['selectedAllData']();
  }

  removeRow(data: any) {
    this.appTable['removeRow'](data.index);
  }

  initTable() {
    this.tableConfig = {
      disablePagination: false,
      pageSize: 10,
      enableCheckbox: true,
      columns: {
        isContextMenu: false,
        headerActionCheckBox: true,
        displayedColumns: [
          'index', 'ClientCode','SOCode', 'DOID', "TotalPackage", "CreatedDate", "headerAction"],
        options: [
          {
            title: 'client',
            name: 'ClientCode',
            style: {
              'min-width': '100px',
              'max-width': '100px'
            }
          },
          {
            title: 'AutoPickPack.SOCode',
            name: 'SOCode'
          },
          {
            title: 'AutoPickPack.DOID',
            name: 'DOID'
          },
          {
            title: 'AutoPickPack.TotalPackage',
            name: 'TotalPackage'
          },
          {
            title: 'AutoPickPack.CreatedDate',
            name: 'CreatedDate'
          }
        ]
      },
      data: this.dataSourceGrid
    };

  }

  loadDistrict(provice: string) {
    if (this.district) {
      this.district['reload']({ Province: provice });
    }
  }

  initEvent() {
    this.appTable['actionEvent'].subscribe({
      next: (event: any) => {
        if (event) {
          this.removeRow(event);
        }
      }
    });
    this.appTable['rowEvent'].subscribe({
      next: (event: any) => {
        let data = this.appTable['getData']()['data'];
        let _selected = false;
        let _totalSelected = 0;
        for (let idx in data) {
          if (data[idx].selected) {
            _totalSelected += 1;
            _selected = true;
          }
        }
        this.numOfSO = _totalSelected;
        this.allowHandoverSession = _selected;
      }
    })
    this.province['change'].subscribe({
      next: (value: any) => {
        this.filters['Province'] = value ? value.Name : '';
        this.loadDistrict(this.filters['Province']);
      }
    });

    this.district['change'].subscribe({
      next: (value: any) => {
        this.filters['District'] = value ? value.Name : '';
      }
    });

    this.soType['change'].subscribe({
      next: (value: any) => {
        this.filters['Type'] = value ? value.Code : '';
      }
    });

    this.store['change'].subscribe({
      next: (value: any) => {
        this.filters['Store'] = value ? value.Code : '';
      }
    });

    this.productType['change'].subscribe({
      next: (value: any) => {
        this.filters['ConditionType'] = value ? value.Code : '';
      }
    });

    this.client['change'].subscribe({
      next: (value: any) => {
        this.filters['ClientCode'] = value ? value.Code : '';
      }
    });
  }
  cancelHandoverSession() {
    this.router.navigate([`/${window.getRootPath()}/handover/handover-sessions`]);
  }
  goHandover() {
    this.router.navigate([`/${window.getRootPath()}/handover/handover-sessions`])
  }

  onShowConfirm(type: number) {
    const messageConfirmCreate = { message: `Bạn có chắc chắn muốn Tạo phiên bàn giao này?`, type: type };
    if (type === 0) {
      this.showConfirm(messageConfirmCreate, type);
    }
  }
  showConfirm(data: any, type) {
    const dialogRef = this.dialog.open(ConfirmExportComponent, {
      data: data

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (type === 0) {
          this.createSession(result)
        }
      }
    });
  }

}
