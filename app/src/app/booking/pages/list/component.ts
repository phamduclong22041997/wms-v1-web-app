import { STATUS_BORDER_BOOKING} from '../../../shared/constant';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Service } from '../../service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../shared/toast.service';
// import { NotificationComponent } from '../../../components/notification/notification.component';
import * as moment from 'moment';
import { ConfirmBookingComponent } from '../confirm/component';


interface TableAction {
  icon: string;
  class?: string;
  name?: String;
  toolTip?: any;
  actionName?: any;
  disabledCondition?: any;
}
@Component({
  selector: 'app-list-sor',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})

export class ListBookingComponent implements OnInit, AfterViewInit {

  @ViewChild('fromDate', { static: false }) fromDate: any;
  @ViewChild('toDate', { static: false }) toDate: any;
  @ViewChild('inputContent', { static: false }) inputContent: ElementRef;
  @ViewChild('cbbStatus', { static: false }) cbbStatus: any;
  @ViewChild('ccbType', { static: false }) ccbType: any;
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('cbbClient', { static: false }) cbbClient: any;
  @ViewChild('cbbWHBranch', { static: false }) cbbWHBranch: any;
  @ViewChild('ccbStore', { static: false }) ccbStore: any;

  tableConfig: any;
  statusConfig: Object;
  clientConfig: Object;
  warehouseBrachConfig: any;
  typeConfig: Object;
  regionCode: string;
  wareHouseList: any = [];
  configDate: any;
  storeConfig: Object;
  
  filters: Object;

  constructor(
    private translate: TranslateService,
    private toast: ToastService,
    private service: Service,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    ) { }

  ngOnInit() {
    this.filters = {
      Content:  this.route.snapshot.queryParams.content ? this.route.snapshot.queryParams.content : '',
      WarehouseCode: window.localStorage.getItem('_warehouse') || window.getRootPath().toUpperCase(),
      WarehouseSiteId: '',
      FromDate: moment().subtract(7, 'day').format('YYYY-MM-DD'),
      ToDate: moment().format('YYYY-MM-DD'),
      RegionCode: '',
      ClientCode: '',
      Status: '',
      Type: '',
      SiteId:''
    };
    this.initTable();
    this.initData();
  }

  initData() {
    let region = window.localStorage.getItem('region') || 'none';
    if (region != 'none') {
      this.regionCode = JSON.parse(region)['Code'];
      this.filters['RegionCode'] = this.regionCode;
    }
    this.statusConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      isSelectedAllValueIsEmpty: true,
      filters: {
        Collection: 'INV.DailyBookings',
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
        name: 'cancel-po',
        toolTip: {
          name: "Hủy",
        },
        disabledCondition: (row:any) => {          
          return ['New'].indexOf(row.Status) != -1;
        }
      },
      // {
      //   icon: "edit",
      //   class: 'edit',
      //   name: 'cancel-po',
      //   toolTip: {
      //     name: "Hủy",
      //   },
      //   disabledCondition: (row:any) => {          
      //     return false
      //   }
      // },
    ];
  }
  initTable() {
    this.tableConfig = {
      style: {
        'overflow-x': 'hidden'
      },
      // enableFirstLoad: false,
      columns: {
        actionTitle: this.translate.instant('FinishPo.Action'),
        actions: this.initTableAction(),
        isContextMenu: false,
        displayedColumns: [
          'index',
          'FileName',
          'WarehouseCode',
          'WarehouseSiteId',
          'MustBeReceivedPO',
          "MustBeReceivedUnits",
          'StartDate',
          'Status',
          'CreatedDate',
          'CreatedBy',
          'CanceledDate',
          'CanceledBy',
          "actions",
        ],
        options: [
          {
            title: 'Booking.FileName',
            name: 'FileName',
            // style: {
            //   'min-width': '90px',
            //   'max-width': '90px'
            // }
          },
          {
            title: 'Booking.WarehouseCode',
            name: 'WarehouseCode',
            style: {
              'min-width': '80px',
              'max-width': '80px'
            }
          },
          {
            title: 'Booking.WarehouseSiteId',
            name: 'WarehouseSiteId',
            style: {
              'min-width': '70px',
              'max-width': '70px'
            }
          },
          {
            title: 'Booking.MustBeReceivedPO',
            name: 'MustBeReceivedPO',
            style: {
              'min-width': '70px',
              'max-width': '70px'
            }
          },
          {
            title: 'Booking.MustBeReceivedUnits',
            name: 'MustBeReceivedUnits',

            style: {
              'min-width': '70px',
              'max-width': '70px'
            }
          },
          {
            title: 'Booking.StartDate',
            name: 'StartDate',
            style: {
              'min-width': '100px',
              'max-width': '100px'
            }
          },
          {
            title: 'Booking.BookingStatus',
            name: 'Status',
            borderStyle: (data: any) => {
              return this.borderColorByStatus(data.Status);
            },
            render: (data: any) => {
              return data.Status ? this.translate.instant(`Booking.Status.${data.Status}`) : "";
            },
            style: {
              'min-width': '100px',
              'max-width': '100px',
            }
          },
          {
            title: 'Booking.CreatedDate',
            name: 'CreatedDate',
            style: {
              'min-width': '120px',
              'max-width': '120px'
            }
          },
          {
            title: 'Booking.CreatedBy',
            name: 'CreatedBy',
            style: {
              'min-width': '100px',
              'max-width': '100px'
            }
          },
          {
            title: 'Booking.CanceledDate',
            name: 'CanceledDate',
            style: {
              'min-width': '120px',
              'max-width': '120px'
            }
          },
          {
            title: 'Booking.CanceledBy',
            name: 'CanceledBy',
            style: {
              'min-width': '100px',
              'max-width': '100px'
            }
          },
          {
            title: 'FinishPo.Action',
            name: 'Action'
          }
        ]
      },
      remote: {
        url: this.service.getAPI("list"),
        params: {
          filter: JSON.stringify(this.filters)
        }
      }
    };
  }

  borderColorByStatus(status: string) {
    if (status != "") {
      return {
        'color': STATUS_BORDER_BOOKING[status],
        'border': `2px solid ${STATUS_BORDER_BOOKING[status]}`,
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

    // let region = window.localStorage.getItem('region') || 'none';
    // if (region != 'none') {
    //   this.regionCode = JSON.parse(region)['Code'];
    //   this.filters['RegionCode'] = JSON.parse(region)['Code'];
    // }
    // this.search();
  }

  showConfirm(data: any, index: any) {
    const dialogRef = this.dialog.open(ConfirmBookingComponent, {
      data: {
        title: `HỦY BOOKING`,
        message: `Bạn có chắc hủy Booking ${data.WarehouseCode} - ${data.WarehouseSiteId}`,
        type: 1
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cancelBooking({
          Note: result,
          id: data.id
        });
      }
    });
  }
  cancelBooking(data: any) {
    this.service.cancelBooking(data)
      .subscribe((resp: any) => {
        if (resp.ErrorMessages && resp.ErrorMessages.length) {
          this.toast.error(`${resp.ErrorMessages[0]}`, 'error_title');
        }
        else {
          this.toast.success(`Hủy Booking thành công`,'success_title');
          this.search()
        }
      })
  }

  initEvent() {
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

    this.cbbStatus['change'].subscribe({
      next: (value: any) => {
        this.filters['Status'] = this.renderValue(value);
      }
    });


  }


  onEnter(event: any) {
    const code = event.target['value'];
    if (code) {
      this.filters['Content'] = code;
      this.search();
    } else {
      this.toast.warning("warning_message", "warning_title");
      this.inputContent.nativeElement.focus();
    }
  }
  search() {
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
  exportExcel() {
    return this.service.exportBooking(this.filters);
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

  private renderValueCombo(option: any) {
    return option['Code'] ? `${option['Code']} - ${option['Name']}` : option['Name'];
  }

  private renderValue(value: any, isName = false) {
    return value ? isName ? value.Name : value.Code : '';
  }

  goToPageUpload() {
    this.router.navigate([`/${window.getRootPath(true)}/booking/upload`],{});
  }
}
