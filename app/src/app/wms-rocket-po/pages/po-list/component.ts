import { STATUS_BORDER_MASANSTORE, PO_STATUS, PO_SOURCE, PO_CONDITIONTYPE } from '../../../shared/constant';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Service } from '../../service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../shared/toast.service';
import { NotificationComponent } from '../../../components/notification/notification.component';
import * as moment from 'moment';
import * as CryptoJS from 'crypto-js';

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

export class POListComponent implements OnInit, AfterViewInit {
  tableConfig: any;
  statusConfig: Object;
  filters: Object;
  // warehouseHandleConfig: Object;
  regionCode: string;
  configDate: any;
  wareHouseList: any = [];
  poStatusConfig: Object;
  poTypeConfig: Object;
  clientConfig: Object;
  promotionConfig: Object;
  vendorConfig: Object;

  @ViewChild('Content', { static: false }) contentInput: ElementRef;
  @ViewChild('fromDate', { static: false }) fromDate: any;
  @ViewChild('toDate', { static: false }) toDate: any;
  // @ViewChild('whCode', { static: false }) whCode: any;
  @ViewChild('status', { static: false }) status: any;
  @ViewChild('content', { static: false }) content: any;
  @ViewChild('potype', { static: false }) potype: any;
  @ViewChild('client', { static: false }) client: any;
  @ViewChild('vendor', { static: false }) vendor: any;
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
      Client: '',
      Status: '',
      Type: ''
    };

    this.initData();
  }

  onEnter(event: any) {
    let code = event.target['value'];
    this.filters['Content'] = code;
    this.search(null);
  }
  onChange(event: any){
    let code = event.target['value'];
    this.filters['Content'] = code;
  }
  initData() {
    this.initTable();

    let region = window.localStorage.getItem('region') || 'none';
    if (region != 'none') {
      this.regionCode = JSON.parse(region)['Code'];
      this.filters['RegionCode'] = this.regionCode;
    }

    this.filters['WhCode'] = window.localStorage.getItem('_warehouse') || 'CCH';
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
        { Code: "Standard", Name: "Nhập hàng từ NCC" }
      ]
    };

    this.vendorConfig = {
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
      URL_CODE: 'SFT.vendorcombo'
    };

    this.clientConfig = {
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
      URL_CODE: 'SFT.clientcombo'
    };

    let poStatus = [
      { Code: PO_STATUS.New, Name: 'Mới' },
      { Code: PO_STATUS.Processing, Name: 'Đang xử lý' },
      { Code: PO_STATUS.Finished, Name: 'Hoàn thành' },
      { Code: PO_STATUS.Canceled, Name: 'Đã hủy' }
    ];
    this.poStatusConfig = {
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
      data: poStatus
    };
  }

  initTableAction(): TableAction[] {
    return [
      // {
      //   icon: "post_add",
      //   name: 'pallet-receive',
      //   toolTip: {
      //     name: "Nhận hàng pallet",
      //   },
      //   class: "ac-task",
      //   disabledCondition: (row:any) => {
      //     return (row.Status === PO_STATUS.New);
      //   }
      // },
      // {
      //   icon: "local_shipping",
      //   name: 'finish-receiving',
      //   class: 'ac-finish-second',
      //   toolTip: {
      //     name: this.translate.instant('POPallet.BtnFinishReceive')
      //   },
      //   disabledCondition: (row:any) => {
      //     return !row.ReceivedDate && row.ReceivingDate && !row.FinishedDate;
      //   }
      // },
      // {
      //   icon: "check_circle",
      //   name: 'finish-po',
      //   class: 'ac-finish',
      //   toolTip: {
      //     name: "Hoàn thành",
      //   },
      //   disabledCondition: (row:any) => {
      //     return (row.Status === PO_STATUS.Processing && row.ReceivedDate);
      //   }
      // },
      {
        icon: "remove_circle",
        class: 'ac-remove',
        name: 'cancel-po',
        toolTip: {
          name: "Hủy",
        },
        disabledCondition: (row:any) => {          
          return [PO_STATUS.New].indexOf(row.Status) != -1;
        }
      },
      // {
      //   icon: "upload_file",
      //   name: 'upload-doc',
      //   class: 'ac-finish',
      //   toolTip: {
      //     name: "Upload chứng từ",
      //   },
      //   disabledCondition: (row:any) => {
      //     return (row.Status === PO_STATUS.Finished);
      //   }
      // },
      // {
      //   icon: "print",
      //   name: 'print-doc',
      //   class: 'ac-task',
      //   toolTip: {
      //     name: "In phiếu nhập hàng",
      //   },
      //   disabledCondition: (row:any) => {
      //     return (row.Status === PO_STATUS.Finished);
      //   }
      // }
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
          'POCode',
          'ExternalCode',
          'VendorName',
          "PoStatus",
          'POType',
          'PODate',
          'FinishedDate',
          'Promotion',
          "actions",
        ],
        options: [
          {
            title: 'FinishPo.PoCode',
            name: 'POCode',
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/purchaseorder/details/${data.POCode}`;
            },
            style: {
              'min-width': '160px',
              'max-width': '160px'
            }
          },
          {
            title: 'FinishPo.ExternalCode',
            name: 'ExternalCode',
          },
          {
            title: 'FinishPo.CreatedDate',
            name: 'PODate',
          },
          {
            title: 'FinishPo.VendorName',
            name: 'VendorName'
          },
          {
            title: 'FinishPo.FinishedDate',
            name: 'FinishedDate'
          },
          {
            title: 'FinishPo.POType',
            name: 'POType',
            render: (data: any) => {
              return this.translate.instant(`POType.${data.POType}`);
            }
          },
          {
            title: 'FinishPo.Status',
            name: 'PoStatus',
            render: (data: any) => {
              return this.translate.instant(`POStatus.${data.Status}`);
            }
          },
          {
            title: 'FinishPo.PromotionCode',
            name: 'Promotion'
          },
          {
            title: 'FinishPo.Action',
            name: 'Action',
            link: true,
            newpage: true,
            render: (row: any, options: any) => {
              if (row.Status == PO_STATUS.New) {
                return this.translate.instant(`FinishPo.PalletReceive`);
              }
              else if (row.Status == PO_STATUS.Processing) {
                return this.translate.instant(`FinishPo.FinishPO`);
              }
            },
            onClick: (row: any) => {
              if (row.Status == PO_STATUS.New) {
                return `/${window.getRootPath()}/purchaseorder/receive-pallet/${row.POCode}`;
              }
            },
            showConfirm: (row: any) => {
              if (row.Status == PO_STATUS.Processing) {
                return this.translate.instant(`FinishPo.FinishPO`);
              }
            }
          }
        ]
      },
      remote: {
        url: this.service.getAPI('list'),
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

    setTimeout(() => {
      if(this.contentInput) this.contentInput.nativeElement.focus();
    }, 200)

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
          case 'cancel-po':
            this.showConfirm(event.data, event.index);
            break;
        }
      }
    });


    this.status['change'].subscribe({
      next: (value: any) => {
        this.filters['Status'] = value ? [value.Code] : '';
      }
    });
    this.client['change'].subscribe({
      next: (value: any) => {
        this.filters['Client'] = value ? [value.Code] : '';
      }
    });
    this.potype['change'].subscribe({
      next: (value: any) => {
        this.filters['Type'] = value ? [value.Code] : '';
      }
    });
    this.vendor['change'].subscribe({
      next: (value: any) => {
        this.filters['Vendor'] = value ? [value.Code] : '';
      }
    });
  }


  showConfirm(data: any, index: any) {
    const dialogRef = this.dialog.open(NotificationComponent, {
      data: {
        message: `Bạn có chắc chắn muốn HỦY PO ${data.POCode}?`,
        type: 1
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cancelPO(data.POCode);
      }
    });
  }




  cancelPO(code: String) {
    this.service.cancelPO({
      "POCode": code
    })
      .subscribe((resp: any) => {
        if (resp.ErrorMessages && resp.ErrorMessages.length) {
          this.toast.error(`POPallet.Error.${resp.ErrorMessages[0]}`, 'error_title');
        }
        else {
          this.toast.success(`Hủy PO ${code} thành công`, '');
        }
      })
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

  importNewPO() {
    this.router.navigate([`/${window.getRootPath()}/rocket/planning-po-list`]);
  }

  importSTO() {
    window.open("/app/fresh-product/sto-process", '_blank');
  }

  exportExcel(data: any = {}) {
    return this.service.exportPO(this.filters);
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
