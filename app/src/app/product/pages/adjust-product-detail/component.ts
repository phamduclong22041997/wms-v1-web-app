import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../../shared/toast.service';
import { Service } from '../../service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationComponent } from '../../../components/notification/notification.component';
import { PrintService } from '../../../shared/printService';
import { Utils } from '../../../shared/utils';
import { Hotkeys } from '../../../shared/hotkeys.service';
import * as moment from 'moment';

interface TableAction {
  icon: string;
  class?: string;
  name?: String;
  toolTip?: any;
  actionName?: any;
  style?: any;
  disabledCondition?: any;
}

@Component({
  selector: 'app-AdjustProduct-detail',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class AdjustProductDetailComponent implements OnInit, AfterViewInit {
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  code: string;
  tableConfig: any;
  data: any = {
    Code: "",
    LocationLabel: "",
    SubLocationLabel: "",
    ClientCode: "",
    DCSite: "",
    TotalUnit: 0,
    TotalLocation: 0,
    CreatedDate: "",
    Employee: "",
    Details: []
  }
  dataSourceGrid = {
    rows: <any>[],
    total: 0
  };

  constructor(
    public dialog: MatDialog,
    private service: Service,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private printService: PrintService,
    private toast: ToastService,
    private hotkeys: Hotkeys) {
    this.code = this.route.snapshot.params.code;
  }

  ngOnInit() {
    this.data = {
      LocationLabel: "",
      SubLocationLabel: "",
      ClientCode: "",
      DCSite: "",
      TotalSKU: 0,
      TotalUnit: 0,
      Details: [],
      DetailScan: []
    }
    this.initTable();
  }

  ngAfterViewInit() {
    this.loadData(this.code);
  }
  loadData(code: string){
    this.service.getAdjustProductDetail({ Code: code })
      .subscribe((resp: any) => {
        if (resp.Status) {
          this.makeData(resp.Data);
        }
      });
  }
  makeData(data: any) {
    let _data = {
      Code: data.Code,
      WarehouseCode: data.WarehouseCode,
      WarehouseSiteId:  data.WarehouseSiteId,
      DCSite: data.DCSite,
      ClientCode:  data.ClientCode,
      LocationLabel:  data.LocationLabel,
      LocationType:  data.LocationType,
      SubLocationLabel:  data.SubLocationLabel,
      Location: data.SubLocationLabel ? `${data.LocationLabel} - ${data.SubLocationLabel}` : data.LocationLabel,
      SKU: data.SKU,
      SKUName: data.SKUName,
      LotNumber: data.LotNumber,
      Employee:  data.Employee,
      Status:  data.Status,
      CreatedDate:  data.CreatedDate,
      TotalLocation: data.TotalLocation,
      TotalUnits: data.TotalUnits,
      Details:  data.Details
    }
    this.data = _data;
    this.appTable['renderData'](_data.Details);
  }
  resetPage() {
    window.location.reload();
  }
  initTable() {
    this.tableConfig = {
      hoverContentText: "Chưa có sản phẩm nào đã quét",
      columns: {
        isContextMenu: false,
        displayedColumns: [
          'index', 'LocationLabel', 'SubLocationLabel', 'SKU', 'Uom', 'Qty', 'ManufactureDate', 'AdjustManufactureDate', 'ExpiredDate', 'AdjustExpiredDate'],
        options: [
          {
            title: 'AdjustProduct.LocationLabel',
            name: 'LocationLabel'
          },
          {
            title: 'AdjustProduct.SubLocationLabel',
            name: 'SubLocationLabel'
          },
          {
            title: 'AdjustProduct.SKU',
            name: 'SKU'
          },
          {
            title: 'AdjustProduct.SKUName',
            name: 'SKUName'
          },
          {
            title: 'AdjustProduct.Uom',
            name: 'Uom',
            style: {
              'text-align': 'center',
              'display': 'inline-grid',
              'margin-right': '30px'
            }
          },
          {
            title: 'AdjustProduct.LotNumber',
            name: 'LotNumber',
          },
          {
            title: 'AdjustProduct.Qty',
            name: 'Qty',
            style: {
              'text-align': 'center',
              'display': 'inline-grid',
              'margin-right': '30px'
            }
          }, 
          {
            title: 'AdjustProduct.ExpiredDate',
            name: 'ExpiredDate',
            render: (data: any) => {
              return moment(data.ExpiredDate).format("DD/MM/YYYY")
            }
          },  
          {
            title: 'AdjustProduct.ManufactureDate',
            name: 'ManufactureDate',
            render: (data: any) => {
              return moment(data.ManufactureDate).format("DD/MM/YYYY")
            }
          },
          {
            title: 'AdjustProduct.AdjustExpiredDate',
            name: 'AdjustExpiredDate',
            render: (data: any) => {
              return moment(data.AdjustExpiredDate).format("DD/MM/YYYY")
            }
          },  
          {
            title: 'AdjustProduct.AdjustManufactureDate',
            name: 'AdjustManufactureDate',
            render: (data: any) => {
              return moment(data.AdjustManufactureDate).format("DD/MM/YYYY")
            }
          },
        ]
      },
      data: this.dataSourceGrid
    };
  }
  exit() {
    this.router.navigate([`/${window.getRootPath()}/product/adjust-product`]);
  }
}
