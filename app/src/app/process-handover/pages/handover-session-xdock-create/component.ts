import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../../shared/toast.service';
import { Service } from '../../service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmHandoverXDockComponent } from './confirm/component';

@Component({
  selector: 'app-create-handover-session-xdoc',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class CreateHandoverSessionXDockComponent implements OnInit {
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('province', { static: false }) province: ElementRef;
  @ViewChild('client', { static: false }) client: ElementRef;
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
  allowHandoverSession: boolean;
  numOfStore: number;
  numOfSO: number;
  filters: any = {
    Province: "",
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
    this.numOfStore = 0;
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
    let deliveryAttributes = {
      Address: event.Address || {},
      ClientCode: event.ClientCode  || '',
      Code: event.Code || '',
      Name: event.Name || '',
      ContactEmail: event.ContactEmail || '',
      ContactName: event.ContactName || '',
      ContactPhone: event.ContactPhone || ''
    }
    let saveData = {
      DeliveryAttributes:  deliveryAttributes,
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
        await this.createHandoverSession(saveData, { is_last: is_last });
        block = [];
        saveData.SOList = [];
      }
      start++;
    }
    if (block.length) {
      await this.createHandoverSession(saveData, { is_last: true });
    }
  }
  async createHandoverSession(data, options = {}) {
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
    await $this.sleepNow(5000);
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
    this.provinceConfig = {
      selectedFirst: false,
      isSelectedAll: false,
      isSorting: false,
      val: (option: any) => {
        return option['Name'];
      },
      render: (option: any) => {
        return `${option['Name']}`;
      },
      type: 'autocomplete',
      filter_key: 'Name',
      URL_CODE: 'SFT.provincescombo'
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
          'index', 'ClientCode','SOCode', 'DOID', "SiteId", "Province", "TotalPackage", "CreatedDate", "headerAction"],
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
            name: 'SOCode',
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/saleorder/details/${data.SOCode}`;
            },
          },
          {
            title: 'AutoPickPack.DOID',
            name: 'DOID',
            style: {
              'min-width': '120px',
              'max-width': '120px'
            }
          },
          {
            title: 'STO.Store',
            name: 'SiteId',
            style: {
              'min-width': '100px',
              'max-width': '100px'
            }
          },
          {
            title: 'province',
            name: 'Province',
            style: {
              'min-width': '200px',
              'max-width': '200px'
            },
            render: (data: any) => {
              return data.ShippingAddress ? data.ShippingAddress.Province : '';
            }
          },
          {
            title: 'AutoPickPack.TotalPackage',
            name: 'TotalPackage',
            style: {
              'min-width': '100px',
              'max-width': '100px'
            }
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
        let stores = {};
        for (let idx in data) {
          if (data[idx].selected) {
            if (!stores[data[idx].SiteId]) {
              stores[data[idx].SiteId] = data[idx].SiteId;
            }
            _totalSelected += 1;
            _selected = true;
          }
        }
        this.numOfSO = _totalSelected;
        this.numOfStore = Object.keys(stores).length;
        this.allowHandoverSession = _selected;
      }
    })
    this.province['change'].subscribe({
      next: (value: any) => {
        this.filters['Province'] = value && value.length ? value : "";
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
    const messageConfirmCreate = { 
      message: `Bạn có chắc chắn muốn Tạo phiên bàn giao này?`,
      WarehouseCode: this.filters['WarehouseCode'],
      NumOfSO: this.numOfSO,
      NumOfStore: this.numOfStore
   };
    this.showConfirm(messageConfirmCreate);
  }
  showConfirm(data: any) {
    const dialogRef = this.dialog.open(ConfirmHandoverXDockComponent, {
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.IsConfirm) {
        console.log('::close confirm::', result);
        this.createSession(result.Results);
      }
    });
  }

}
