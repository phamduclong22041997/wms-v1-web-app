import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Service } from '../../service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../shared/toast.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationComponent } from '../../../components/notification/notification.component';

@Component({
  selector: 'app-found-detail',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class DetailTransferLostComponent implements OnInit, AfterViewInit {
  @ViewChild('appTable', { static: false }) appTable: any;

  appTableConfig: any;
  code: any;
  dataSourceGrid = {
    rows: <any>[],
    total: 0
  };
  data: any = {
    Code:'',
    LostCode:'',
    PhysicallyLostCode:'',
    WarehouseCode:'',
    WarehouseSiteId:'',
    ClientCode:'',
    SKU:'',
    Barcode:'',
    SKUName:'',
    TransferQty:'',
    Uom:'',
    ExpiredDate:'',
    ManufactureDate:'',
    LotNumber:'',
    LocationLabel:'',
    LocationType:'',
    SubLocLabel:'',
    NewLocationLabel:'',
    NewLocationType:'',
    NewSubLocLabel:'',
    ConditionType:'',
    CreatedBy:'',
    CreatedDate:'',
    UpdatedDate:'',
    Details : []
  }

  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private toast: ToastService,
    private service: Service,
    public dialog: MatDialog,
    private router: Router) {
    this.code = this.route.snapshot.params.code;
  }

  ngOnInit() {
    this.initData();
    this.initTable();
  }
  ngAfterViewInit() {
    this.initEvent();
    this.loadData(this.code);
  }

  initEvent() {

  }

  initData() {
    this.data = {
      Code:'',
        LostCode:'',
        PhysicallyLostCode:'',
        WarehouseCode:'',
        WarehouseSiteId:'',
        ClientCode:'',
        SKU:'',
        Barcode:'',
        SKUName:'',
        TransferQty:'',
        Uom:'',
        ExpiredDate:'',
        ManufactureDate:'',
        LotNumber:'',
        LocationLabel:'',
        LocationType:'',
        SubLocLabel:'',
        NewLocationLabel:'',
        NewLocationType:'',
        NewSubLocLabel:'',
        ConditionType:'',
        CreatedBy:'',
        CreatedDate:'',
        UpdatedDate:'',
        Details : []
    }
  }

  initTable() {
    this.appTableConfig = {
      style: {
        'overflow-x': 'hidden'
      },
      columns: {
        isContextMenu: false,
        displayedColumns: [
          'index',
          'SKU',
          'Barcode',
          'SKUName',
          'Uom',
          'TransferQty',
          'LotNumber',
          'ExpiredDate',
          'ManufactureDate',
        ],
        options: [
          {
            title: 'TransferLost.LotNumber',
            name: 'LotNumber',
          },
          {
            title: 'SKU',
            name: 'SKU',
          },
          {
            title: 'TransferLost.SKUName',
            name: 'SKUName',
          },
          {
            title: 'Barcode',
            name: 'Barcode',
          },
          {
            title: 'TransferLost.Uom',
            name: 'Uom'
          },
          {
            title: 'TransferLost.ExpiredDate',
            name: 'ExpiredDate'
          },
          {
            title: 'TransferLost.ManufactureDate',
            name: 'ManufactureDate'
          },
          {
            title: 'TransferLost.TransferQty',
            name: 'TransferQty'
          }
        ]
      },
      data: this.dataSourceGrid
    }
  }

  loadData(code: string) {
    this.service.getTransferDetails({
      Code: code
    }).subscribe((resp: any) => {
        if (resp.Status) {
          this.buildData(resp.Data);
        } else {
          this.toast.error(`Không tìm thấy mã thất lạc ${code}`, 'error_title');
          setTimeout(() => {
            this.router.navigate([`/${window.getRootPath()}/lost-found/transfer-lost`]);
          }, 300);
        }
      });
  }
  buildData(data) {
    this.data = {
      Code: data.Code,
      LostCode: data.LostCode,
      PhysicallyLostCode: data.PhysicallyLostCode,
      WarehouseCode: data.WarehouseCode,
      WarehouseSiteId: data.WarehouseSiteId,
      DCSite: data.DCSite,
      ClientCode: data.ClientCode,
      CreatedBy: data.CreatedBy,
      CreatedDate: data.CreatedDate,
      UpdatedDate: data.UpdatedDate,
      LotNumber: data.LotNumber,
      LocationLabel: data.LocationLabel,
      LocationType: data.LocationType,
      SubLocLabel: data.SubLocLabel,
      NewLocationLabel: data.NewLocationLabel,
      NewLocationType: data.NewLocationType,
      NewSubLocLabel: data.NewSubLocLabel,
      Details: data.Details
    }
    this.appTable['renderData'](this.data.Details || []);
  }

  onClickExit(event: any){
    this.router.navigate([`/${window.getRootPath()}/lost-found/transfer-lost`]);
  }
}
