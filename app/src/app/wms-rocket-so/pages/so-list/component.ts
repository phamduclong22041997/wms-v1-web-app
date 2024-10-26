import { STATUS_BORDER_MASANSTORE, SO_STATUS, SO_CANCELED_STATUS } from '../../../shared/constant';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Service } from '../../service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../shared/toast.service';
import { NotificationComponent } from '../../../components/notification/notification.component';
import * as moment from 'moment';

interface TableAction {
  icon: string;
  class?: string;
  name?: String;
  toolTip?: any;
  actionName?: any;
  disabledCondition?: any;
}

@Component({
  selector: 'app-list-po',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})

export class ListSOComponent implements OnInit, AfterViewInit {
  tableConfig: any;
  statusConfig: Object;
  filters: Object;
  warehouseHandleConfig: Object;
  regionCode: string;
  configDate: any;
  wareHouseList: any = [];
  soStatusConfig: Object;
  poTypeConfig: Object;
  storeConfig: Object;
  promotionConfig: Object;

  @ViewChild('fromDate', { static: false }) fromDate: any;
  @ViewChild('toDate', { static: false }) toDate: any;
  @ViewChild('whCode', { static: false }) whCode: any;
  @ViewChild('status', { static: false }) status: any;
  @ViewChild('potype', { static: false }) potype: any;
  @ViewChild('store', { static: false }) store: any;
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('inputFile', { static: false }) inputFile: ElementRef;

  constructor(
    private translate: TranslateService,
    private toast: ToastService,
    private service: Service,
    public dialog: MatDialog,
    private router: Router) { }

  ngOnInit() {
    this.filters = {
      Content: '',
      WhCode: [],
      FromDate: moment().subtract(7, 'day').format('YYYY-MM-DD'),
      ToDate: moment().format('YYYY-MM-DD'),
      RegionCode: '',
      Promotion: '',
      Vendor: '',
      Store: '',
      ClientCode: '',
      Status: '',
      Type: ''
    };

    this.initData();
  }

  initData() {
    this.initTable();

    let region = window.localStorage.getItem('region') || 'none';
    if (region != 'none') {
      this.regionCode = JSON.parse(region)['Code'];
      this.filters['RegionCode'] = this.regionCode;
    }

    this.filters['WhCode'] = window.localStorage.getItem('_warehouse') ;

    this.warehouseHandleConfig = {
      selectedFirst: false,
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
      URL_CODE: 'SFT.warehousecombo'
    };

    this.poTypeConfig = {
      selectedFirst: false,
      isSelectedAll: false,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Name'];
      },
      type: 'autocomplete',
      filter_key: 'Name',
      data: [
        { Code: "New", Name: "Mới" }
      ]
    };

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
      filter_key: 'Code',
      URL_CODE: 'SFT.storecombo'
    };

    this.soStatusConfig = {
      selectedFirst: false,
      isSelectedAll: true,
      filters: {
        Collection: 'INV.SO',
        Column: 'Status'
      },
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Description'];
      },
      type: 'autocomplete',
      filter_key: 'Description',
      URL_CODE: 'SFT.enum'
    };
  }

  initTableAction(): TableAction[] {
    return [
      {
        icon: "remove_circle",
        class: 'ac-remove',
        name: 'cancel-so',
        toolTip: {
          name: this.translate.instant('STO.CancelSO'),
        },
        disabledCondition: (row) => {
          return (SO_CANCELED_STATUS.indexOf(row.Status) != -1);
        }
      }
    ];
  }

  initTable() {
    this.tableConfig = {
      style: {
        'overflow-x': 'hidden'
      },
      columns: {
        isContextMenu: false,
        actionTitle: this.translate.instant('FinishPo.Action'),
        actions: this.initTableAction(),
        displayedColumns: [
          'index',
          'SOCode',
          'ExternalCode',
          'SiteId',
          'ContactPhone',
          'WarehouseCode',
          'ConditionType',
          'Status',
          'CreatedDate',
          'actions',
        ],
        options: [
          {
            title: 'STO.SOCode',
            name: 'SOCode',
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/saleorder/details/${data.SOCode}`;
            },
            style: {
              'min-width': '180px',
              'max-width': '180px'
            }
          },
          {
            title: 'STO.ExternalCode',
            name: 'ExternalCode',
          },
          {
            title: 'STO.ConditionType',
            name: 'ConditionType',
            render: (data: any) => {
              return this.translate.instant(`SOStatus.${data.ConditionType}`);
            }
          },
          {
            title: 'STO.Store',
            name: 'SiteId'
          },
          {
            title: 'STO.STOStatus',
            name: 'Status',
            render: (data: any) => {
              return this.translate.instant(`SOStatus.${data.Status}`);
            }
          },
          {
            title: 'STO.WarehouseCode',
            name: 'WarehouseCode'
          },
          {
            title: 'STO.Phone',
            name: 'ContactPhone',
          },
          {
            title: 'STO.SODate',
            name: 'CreatedDate'
          }
        ]
      },
      remote: {
        url: this.service.getSOList(),
        params: {
          filter: JSON.stringify(this.filters)
        }
      }
    };
  }

  borderColorByStatus(status: string) {
    if (status != "") {
      return {
        'color': STATUS_BORDER_MASANSTORE[status],
        'border': `2px solid ${STATUS_BORDER_MASANSTORE[status]}`,
        'border-radius': '2px',
        'padding': '5px 10px',
        'font-weight': '500'
      };
    }
    return "";
  }

  ngAfterViewInit() {
    this.initEvent();

    const sevenDayBefore = moment().subtract(7, 'day').toDate();
    this.fromDate.setValue(sevenDayBefore);

    let region = window.localStorage.getItem('region') || 'none';
    if (region != 'none') {
      this.regionCode = JSON.parse(region)['Code'];
      this.filters['RegionCode'] = JSON.parse(region)['Code'];
    }
    this.appTable['search'](this.filters);
  }

  initEvent() {
    this.fromDate['change'].subscribe({
      next: (value: any) => {
        this.compareDate();
      }
    });

    this.toDate['change'].subscribe({
      next: (value: any) => {
        this.compareDate();
      }
    });

    this.appTable['actionEvent'].subscribe({
      next: (event: any) => {
        if (!event) {
          return;
        }
        const action = event["action"];
        switch (action) {
          case 'cancel-so':
            this.showConfirm(event.data, event.index);
            break;
        }
      }
    });

    this.whCode['change'].subscribe({
      next: (value: any) => {
        this.filters['WhCode'] = value ? [value.Code] : '';
      }
    });

    this.status['change'].subscribe({
      next: (value: any) => {
        this.filters['Status'] = value ? [value.Code] : '';
      }
    });
    this.store['change'].subscribe({
      next: (value: any) => {
        this.filters['Store'] = value ? [value.Code] : '';
      }
    });
  }

  showConfirm(data: any, index: any) {
    const dialogRef = this.dialog.open(NotificationComponent, {
      data: {
        message: `Bạn có chắc chắn muốn HỦY SO ${data.SOCode}?`,
        type: 1
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cancelSO(data.SOCode);
      }
    });
  }
  cancelSO(code: String) {
    this.service.cancelSO({
      "SOCode": code
    })
      .subscribe((resp: any) => {
        if(resp.Status){
          let tmp = this.appTable['data']['rows'];
          let index = -1;
          for (let i = 0; i < tmp.length; i++) {
            if (tmp[i].SOCode == code) {
              index = i;
              break;
            }
          }
          if(index != -1){
            this.appTable['data']['rows'][index].Status = 'Canceled';
            this.appTable['updateRow'](index, 7);
          }

          this.toast.success(`Hủy SO ${code} thành công`, 'success_title');
        }
        else if (resp.ErrorMessages && resp.ErrorMessages.length) {
          this.toast.error(`SOErrors.${resp.ErrorMessages[0]}`, 'error_title');
        }
        else {
          this.toast.success(`Hủy SO ${code} không thành công`, 'error_title');
        }
      })
  }
  onEnter(event: any) {
    let code = event.target['value'];
    this.filters['Content'] = code;
    this.search(null);
  }
  search(event: any) {
    const fromDate = this.fromDate.getValue();
    const toDate = this.toDate.getValue();
    if (fromDate) {
      const _date = moment(fromDate);
      this.filters['FromDate'] = _date.format('YYYY-MM-DD');
    } else {
      this.filters['FromDate'] = '';
    }
    if (toDate) {
      const _date = moment(toDate);
      this.filters['ToDate'] = _date.format('YYYY-MM-DD');
    } else {
      this.filters['ToDate'] = '';
    }
    this.appTable['search'](this.filters);
  }

  exportExcel(data: any = {}) {
    return this.service.exportSO(this.filters);
  }
  compareDate() {
    const createdFromDate = this.fromDate.getValue();
    const createdToDate = this.toDate.getValue();
    if (createdFromDate && createdToDate) {
      const formatCreatedFromDate = new Date(createdFromDate.getFullYear(), createdFromDate.getMonth(), createdFromDate.getDate());
      const formatCreatedToDate = new Date(createdToDate.getFullYear(), createdToDate.getMonth(), createdToDate.getDate());
      if (formatCreatedFromDate > formatCreatedToDate) {
        this.toast.error('invalid_date_range', 'error_title');
        this.toDate.setValue(new Date());
      }
    }
  }
}
