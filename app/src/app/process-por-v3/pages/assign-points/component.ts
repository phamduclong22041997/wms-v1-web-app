import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../../shared/toast.service';
import { Service } from '../../service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NotificationComponent } from '../../../components/notification/notification.component';
import { PointsComponent } from './../../points/component';
import { SO_STATUS } from '../../../shared/constant';

interface TableAction {
  name: string,
  icon: string;
  class?: string;
  toolTip?: any;
  actionName?: any;
  disabledCondition?: any;
}

@Component({
  selector: 'app-so-auto-pickpack',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class AssignPointComponent implements OnInit {
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('province', { static: false }) province: ElementRef;
  @ViewChild('district', { static: false }) district: ElementRef;
  @ViewChild('client', { static: false }) client: ElementRef;
  @ViewChild('vendor', { static: false }) vendor: ElementRef;
  @ViewChild('points', { static: false }) points: ElementRef;
  @ViewChild('promotion', { static: false }) promotion: ElementRef;
  @ViewChild('content', { static: false }) contentInput: ElementRef;
  @ViewChild('sostatus', { static: false }) sostatus: ElementRef;

  dataSourceGrid = {
    rows: <any>[],
    total: 0
  };

  tableConfig: any;
  clientConfig: any;
  vendorConfig: any;
  configDate: any;
  provinceConfig: any;
  districtConfig: any;
  promotionConfig: any;
  pointsConfig: any;
  soStatusConfig: any;
  allowCreatePickList: boolean;
  numOfSO: number;
  firstLoad: boolean;

  filters: object = {
    // Status: "Packed,PickedAfterPacked,PickingAfterPacked,PickedAfterPacked,StoredAfterPacked",
    IsGatheredPoint: 1,
    Province: "",
    District: "",
    Type: "",
    ConditionType: "",
    Content: "",
    LocationCode: "",
    ClientCode: "",
    WarehouseCode: "",
    Vendor:""
  }

  saveData: any = {
    LocationCode: "",
    SOList: []
  }

  constructor(
    public dialog: MatDialog,
    private service: Service,
    private router: Router,
    private toast: ToastService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.firstLoad = true;
    this.allowCreatePickList = false;
    this.numOfSO = 0;
    this.filters['WarehouseCode'] = window.localStorage.getItem('_warehouse') ||  window.getRootPath().toUpperCase();
    this.initTable();
    this.initCombo();
  }

  ngAfterViewInit() {
    this.initEvent();
    if (this.contentInput) {
      setTimeout(() => {
        this.contentInput.nativeElement.focus();
      }, 300)
    }
  }

  onEnter() {
    this.search();
  }
  search() {
    this.service.loadSOList(this.filters)
      .subscribe((resp: any) => {
        this.makeData(resp);
      });
  }

  private renderValueCombo(option: any) {
    return option['Code'] ? `${option['Code']} - ${option['Name']}` : option['Name'];
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
        return this.renderValueCombo(option);
      },
      type: 'autocomplete',
      filter_key: 'Name',
      URL_CODE: 'SFT.clientcombo'
    }
    this.pointsConfig = {
      selectedFirst: false,
      isSelectedAll: false,
      isSorting: false,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return `${option['Code']}`;
      },
      type: 'autocomplete',
      filter_key: 'Name',
      URL_CODE: 'SFT.pointscombo'
    }
    this.vendorConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      isSelectedAllValueIsEmpty: true,
      val: (option: any) => {
        return option['VendorId'];
      },
      render: (option: any) => {
        return option['VendorId'] ? `${option['VendorId']} - ${option['Name']}` : option['Name'];
      },
      type: 'autocomplete',
      filter_key: 'Name',
      URL_CODE: 'SFT.vendorcombo'
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
        WarehouseCode: this.filters['WarehouseCode']
      },
      type: 'autocomplete',
      filter_key: 'Name',
      URL_CODE: 'SFT.servicecombo'
    };

    this.soStatusConfig = {
      selectedFirst: true,
      isSelectedAll: false,
      filters: {
        Collection: 'INV.SO',
        Column: 'Status',
        Type: 'assign-point'
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

  makeData(data: any) {
    let _data = [];
    if (data.Status) {
      _data = data.Data;
    }
    this.appTable['renderData'](_data);
    this.numOfSO = _data.length;
    this.appTable['selectedAllData']();
  }

  removeRow(data: any) {
    this.appTable['removeRow'](data.index);
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
          return row.Status == SO_STATUS.AssignedPicker || row.Status == SO_STATUS.Packed;
        }
      }
    ];
  }

  confirmRemoveGartheredPoint(data: any) {
    const dialogRef = this.dialog.open(NotificationComponent, {
      data: {
        message: `Bạn có muốn loại bỏ điểm chứa hàng "${data.GatheredPoint}"?`,
        type: 1
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.removeGatheredPoint(data);
      }
    });
  }

  initTable() {
    this.tableConfig = {
      disablePagination: false,
      columns: {
        isContextMenu: false,
        actionTitle: this.translate.instant('FinishPo.Action'),
        actions: this.initTableAction(),
        displayedColumns: [
          'index', 'SiteId', 'SOCode', 'ExternalCode', "Status", "CreatedDate", "GatheredPoint", "actions"],
        options: [
          {
            title: 'HandoverDetail.SiteId',
            name: 'SiteId',
            style: {
              width: '90px',
              'max-width': '90px',
              'min-width': '90px',
            }
          },
          {
            title: 'AssignPointsPOR.SOCode',
            name: 'SOCode'
          },
          {
            title: 'AssignPointsPOR.ExternalCode',
            name: 'ExternalCode'
          },
          {
            title: 'AssignPointsPOR.Status',
            name: 'Status',
            render: (data: any) => {
              return this.translate.instant(`SOStatus.${data.Status}`);
            }
          },
          {
            title: 'AssignPointsPOR.CreatedDate',
            name: 'CreatedDate'
          },
          {
            title: 'AssignPointsPOR.PackedLocation',
            name: 'GatheredPoint'
          },
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

  showAssignGatheredPoint(data: any) {
    const dialogRef = this.dialog.open(PointsComponent, { 
      disableClose: true,
      minHeight: "80%",
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.search();
      }
    });
  }

  removeGatheredPoint(data: any) {
    this.service.removeGatheredPoint({
      "SOList": [data.SOCode],
      "LocationCode": data.GatheredPoint
    })
      .subscribe((resp: any) => {
        if (resp.Status === true) {
          this.toast.success('Loại bỏ điểm chứa hàng hàng thành công', 'success_title');
        } else if (resp.ErrorMessages && resp.ErrorMessages.length) {
          this.toast.error(resp.ErrorMessages[0], 'error_title');
        }
      })
  }

  initEvent() {

    this.appTable['actionEvent'].subscribe({
      next: (event: any) => {
        if (event) {
          switch (event['action']) {
            case 'remove-item':
              this.confirmRemoveGartheredPoint(event['data']);
              break
            case 'assign':
              this.showPoints(event["data"]);
              break;
          }
        }
      }
    });

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

    this.district['change'].subscribe({
      next: (value: any) => {
        this.filters['District'] = value ? value.Name : '';
      }
    });

    this.vendor['change'].subscribe({
      next: (value: any) => {
        this.filters['Vendor'] = value && value.VendorId  ? value.VendorId : '';
        if (this.filters['Vendor']) {
          this.search();
        }
      }
    });

    this.points['change'].subscribe({
      next: (value: any) => {
        this.filters['LocationCode'] = value ? value.Code : '';
      }
    });
    this.sostatus['change'].subscribe({
      next: (value: any) => {
        this.filters['Status'] = value && value.Code ? value.Code : '';
        if(this.firstLoad && this.filters['Status'] && this.filters['ClientCode']) {
          this.firstLoad = false;
          this.search();
        }
      }
    });

    this.client['change'].subscribe({
      next: (value: any) => {
        this.filters['ClientCode'] = value ? value.Code : '';
        if (this.vendor) {
          this.vendor['reload']({ ClientCode: this.filters['ClientCode'] });
        }

        if(this.firstLoad && this.filters['Status'] && this.filters['ClientCode']) {
          this.firstLoad = false;
          this.search();
        }
      }
    });
  }
  onChange(event:any) {
    let code = event.target['value'];
    this.filters['Content'] = code;
  }
  cancelPickList() {
    this.router.navigate([`/${window.getRootPath(true)}/por/auto-pickpack`]);
  }
  goPickList() {
    this.router.navigate([`/${window.getRootPath(true)}/por/auto-pickpack`])
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
}
