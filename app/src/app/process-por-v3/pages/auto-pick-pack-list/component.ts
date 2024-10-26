import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../../shared/toast.service';
import { Service } from '../../service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PointsComponent } from './../../points/component';
import * as moment from 'moment';
import { TableAction } from '../../../interfaces/tableAction';

@Component({
  selector: 'app-so-auto-pickpack-list',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class SOAutoPickPackListComponent implements OnInit {
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('fromDate', { static: false }) fromDate: any;
  @ViewChild('toDate', { static: false }) toDate: any;
  @ViewChild('status', { static: false }) statusCombo: ElementRef;
  // @ViewChild('vendor', { static: false }) vendor: ElementRef;
  @ViewChild('content', { static: false }) contentInput: ElementRef;
  @ViewChild('client', { static: false }) client: any;

  dataSourceGrid = {
    rows: <any>[],
    total: 0
  };

  tableConfig: any;
  configDate: any;
  provinceConfig: any;
  service3PLConfig: any;
  statusConfig: any;
  // vendorConfig: any;
  clientConfig: Object;

  allowCreatePickList: boolean;
  filters: any = {
    WarehouseCode: "",
    ClientCode:"",
    FromDate: "",
    ToDate: "",
    Content: "",
    Status: "",
    Store: "",
    FromPOR: 1,
    Vendor:""
  };

  constructor(
    public dialog: MatDialog,
    private service: Service,
    private router: Router,
    private translate: TranslateService,
    private toast: ToastService) {

  }

  ngOnInit() {
    this.allowCreatePickList = false;
    this.filters['FromDate'] = moment().subtract(1, 'day').format('YYYY-MM-DD');
    this.filters['WarehouseCode'] = window.localStorage.getItem('_warehouse') || window.getRootPath().toUpperCase();

    this.initTable();
    this.initCombo();

    setTimeout(() => {
      this.search()
    }, 500);
  }

  ngAfterViewInit() {
    this.initEvent();
    const sevenDayBefore = moment().subtract(1, 'day').toDate();
    this.fromDate.setValue(sevenDayBefore);

    setTimeout(() => {
      if (this.contentInput) {
        this.contentInput.nativeElement.focus();
      }
    }, 300)
  }

  showPoints(data: any) {
    const dialogRef = this.dialog.open(PointsComponent, {
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.search();
      }
    });
  }

  createPickList(event: any) {
    let data = this.appTable['getData']()['data'];
    if (!data.length) {
      return;
    }
    let saveData = {
      SOList: data.map((item: any) => item.SOCode)
    }
    this.service.createPickList(saveData)
      .subscribe((resp) => {
        if (resp.Status) {
          this.toast.success("AutoPickPack.CreatePickListSuccessful", "success_title");
        } else {
          if (resp.ErrorMessages && resp.ErrorMessages.length) {
            this.toast.error(`${resp.ErrorMessages[0]}`, 'error_title');
          }
        }
      })
  }

  onEnter(event: any) {
    this.search();
  }
  search() {
    this.appTable['search'](this.getFilter());
  }

  addNew(event: any) {
    this.router.navigate([`/${window.getRootPath(true)}/por/create-auto-pickpack`]); 
  }

  getFilter() {
    let _filters = this.filters;
    const fromDate = this.fromDate.getValue();
    if (fromDate) {
      _filters['FromDate'] = moment(fromDate).format('YYYY-MM-DD');
    }
    const toDate = this.toDate.getValue();
    if (toDate) {
      _filters['ToDate'] = moment(toDate).format('YYYY-MM-DD');
    }
    return _filters;
  }

  exportExcel(event: any = {}) {
    this.getFilter();
    this.filters["isExport"] = true;
    return this.service.exportAutoPickPack(this.filters);
  }
  initCombo() {
    this.clientConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      isSelectedAllValueIsEmpty: true,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return this.renderValueCombo(option);
      },
      type: 'combo',
      filter_key: 'Name',
      URL_CODE: 'SFT.clientcombo'
    };

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
    this.service3PLConfig = {
      selectedFirst: false,
      isSelectedAll: false,
      isSorting: false,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return `${option['Code']}`;
      },
      filters: {
        WarehouseCode: this.filters['WarehouseCode']
      },
      type: 'autocomplete',
      filter_key: 'Name',
      URL_CODE: 'SFT.servicecombo'
    };

    this.statusConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      filters: {
        Collection: 'INV.PickList',
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
    // this.vendorConfig = {
    //   selectedFirst: true,
    //   isSelectedAll: true,
    //   isSorting: false,
    //   isSelectedAllValueIsEmpty: true,
    //   val: (option: any) => {
    //     return option['VendorId'];
    //   },
    //   render: (option: any) => {
    //     return option['VendorId'] ? `${option['VendorId']} - ${option['Name']}` : option['Name'];
    //   },
    //   type: 'autocomplete',
    //   filter_key: 'Name',
    //   URL_CODE: 'SFT.vendorcombo'
    // };


  }

  makeData(data: any) {
    let _data = [];
    if (data.Status) {
      _data = data.Data;
    }
    this.appTable['renderData'](_data);
  }

  initTable() {
    this.tableConfig = {
      disablePagination: false,
      enableFirstLoad: false,
      columns: {
        isContextMenu: false,
        actionTitle: this.translate.instant('action'),
        actions: this.initTableAction(),
        displayedColumns: [
          'index',
          // 'ClientCode', 
          'PickwaveCode', 
          'Code', 
          'SOCode', 
          'Status', 
          'Qty', 
          'PickedQty',
          "CreatedDate",
          'Employee',
          'PickedTime',
          'PackedTime'
        ],
        options: [
          {
            title: 'client',
            name: 'ClientCode',
            style: {
              'min-width': '60px',
              'max-width': '60px'
            }
          },
          {
            title: 'Pickingwave.Code',
            name: 'PickwaveCode',
            style: {
              'min-width': '110px'
            },
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/por/pw-detail/${data.PickwaveCode}`;
            }
          },
          {
            title: 'AutoPickPackPOR.PickListCode',
            name: 'Code',
            style: {
              'min-width': '110px'
            },
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/por/auto-pickpack/${data.Code}`;
            }
          },
          {
            title: 'AutoPickPackPOR.Vendor',
            name: 'Store'
          },
          {
            title: 'AutoPickPackPOR.SOCode',
            name: 'SOCode',
            style: {
              'min-width': '150px'
            },
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/por/details/${data.SOCode}`;
            }
          },
          {
            title: 'AutoPickPack.Qty',
            name: 'Qty',
            style: {
              'min-width': '80px',
              'max-width': '80px'
            },
          },
          {
            title: 'AutoPickPack.Employee',
            name: 'Employee',
            style: {
              'min-width': '85px'
            },
          },
          {
            title: 'AutoPickPack.PackedLocationPoint',
            name: 'GatheredPoints',
            render: (row: any, options: any) => {
              let txt = [];
              for (let item of (row.GatheredPoints || [])) {
                txt.push(item);
              }
              return txt.join(", ");
            }
          },
          {
            title: 'AutoPickPack.Status',
            name: 'Status',
            render: (row: any, options: any) => {
              return this.translate.instant(`PickListStatus.${row.Status}`);
            },
          },
          {
            title: 'AutoPickPack.CreatedDate',
            name: 'CreatedDate',
            style: {
              'min-width': '85px'
            },
          },
          {
            title: 'AutoPickPack.PickedQty',
            name: 'PickedQty',
            style: {
              'min-width': '80px',
              'max-width': '80px'
            },
          },
          {
            title: 'AutoPickPack.PickedTime',
            name: 'PickedTime',
            style: {
              'min-width': '120px',
              'max-width': '120px'
            },
            render(row: any) {
              if(!row["StartTimePicked"]) {
                return ""
              }
              return`${row["StartTimePicked"]} ${row["EndTimePicked"] || "N/A"}`;
            }
          },
          {
            title: 'AutoPickPack.PackedTime',
            name: 'PackedTime',
            style: {
              'min-width': '85px'
            },
            render(row: any) {
              if(!row["StartTimePacked"]) {
                return ""
              }
              return`${row["StartTimePacked"]} ${row["EndTimePacked"] || "N/A"}`;
            }
          },
          {
            title: 'AutoPickPack.StartTimePicked',
            name: 'StartTimePicked',
            style: {
              'min-width': '85px'
            },
          },
          {
            title: 'AutoPickPack.EndTimePicked',
            name: 'EndTimePicked',
            style: {
              'min-width': '85px'
            },
          },
          {
            title: 'AutoPickPack.StartTimePacked',
            name: 'StartTimePacked',
            style: {
              'min-width': '85px'
            },
          },
          {
            title: 'AutoPickPack.EndTimePacked',
            name: 'EndTimePacked',
            style: {
              'min-width': '85px'
            },
          }
        ]
      },
      remote: {
        url: this.service.getAPI('pickLists'),
        params: {
          filter: JSON.stringify(this.filters)
        }
      }
    };

  }

  initTableAction(): TableAction[] {
    return [
      {
        name: "assign",
        icon: "location_searching",
        toolTip: {
          name: "Xác định vị trí tập kết hàng hoá",
        },
        class: "ac-task",
        disabledCondition: (row: any) => {
          return true;
        }
      }
    ];
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

    this.statusCombo['change'].subscribe({
      next: (value: any) => {
        this.filters['Status'] = this.renderValue(value);
      }
    });
    // this.vendor['change'].subscribe({
    //   next: (value: any) => {
    //     console.log("vvv", value);
    //     this.filters['Vendor'] =value? value.VendorId:"";
    //   }
    // });

    this.client['change'].subscribe({
      next: (value: any) => {
        this.filters['ClientCode'] = this.renderValue(value); 
        // if(this.vendor) {
        //   this.vendor['reload']({ClientCode: this.filters['ClientCode']});
        // }
      }
    });

    this.appTable['actionEvent'].subscribe({
      next: (event: any) => {
        if (!event) {
          return;
        }
        const action = event["action"];
        switch (action) {
          case 'assign':
            this.showPoints(event["data"]);
            break;
        }
      }
    });
  }
  ImportCreatePickList(event: any){
    window.location.href =  `/${window.getRootPath()}/por/task-process#CreatePickList`;
  }
  cancelPickList(event: any){
    window.location.href =  `/${window.getRootPath()}/por/cancel-picklist`;
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
  private renderValue(value: any, isName = false){
    return value ? isName ? value.Name: value.Code : '';
  }

  printPickingList(event: any = {}) {
    //return this.service.exportAutoPickPack(this.filters);
  }
}
