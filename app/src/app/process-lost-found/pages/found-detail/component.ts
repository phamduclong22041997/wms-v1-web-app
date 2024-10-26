import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Service } from '../../service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../shared/toast.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationComponent } from '../../../components/notification/notification.component';
import { ConfirmCancelFoundIssueComponent } from './confirm/component';

@Component({
  selector: 'app-found-detail',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class FoundDetailComponent implements OnInit, AfterViewInit {
  @ViewChild('foundIssueTable', { static: false }) foundIssueTable: any;

  foundIssueConfig: any;
  code: any;
  isEnableCancel: boolean;

  data: any = {
    Code: '',
    Type: '',
    IssueType: '',
    WarehouseCode: '',
    WarehouseSiteId: '',
    ClientCode: '',
    SKU: '',
    Barcode: '',
    LocationLabel: '',
    LocationType: '',
    SubLocLabel: '',
    Qty: '',
    Uom: '',
    BaseQty: '',
    BaseUom: '',
    MappingQty: '',
    ProcessedQty: '',
    RemainingQty: '',
    ReceiveDate: '',
    ExpiredDate: '',
    BestBeforeDate: '',
    ManufactureDate: '',
    ConditionType: '',
    LostLocationLabel: '',
    LostLocationType: '',
    LostSubLocLabel: '',
    POCode: '',
    Note: '',
    RefEmployee: '',
    RefJobCode: '',
    RefJobType: '',
    Status: '',
    CanceledBy: '',
    CanceledDate: '',
    CanceledReason: '',
    CanceledNote: '',
    CompletedBy: '',
    CompletedDate: '',
    CreatedDate: '',
    Details: []
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
    this.isEnableCancel = false;
    this.data = {
      Code: '',
      Type: '',
      IssueType: '',
      WarehouseCode: '',
      WarehouseSiteId: '',
      ClientCode: '',
      SKU: '',
      Barcode: '',
      LocationLabel: '',
      LocationType: '',
      SubLocLabel: '',
      Qty: '',
      Uom: '',
      BaseQty: '',
      BaseUom: '',
      MappingQty: '',
      ProcessedQty: '',
      RemainingQty: '',
      ReceiveDate: '',
      ExpiredDate: '',
      BestBeforeDate: '',
      ManufactureDate: '',
      ConditionType: '',
      IssueLocationLabel: '',
      IssueLocationType: '',
      IssueSubLocLabel: '',
      POCode: '',
      Note: '',
      RefEmployee: '',
      RefJobCode: '',
      RefJobType: '',
      Status: '',
      CanceledBy: '',
      CanceledDate: '',
      CanceledReason: '',
      CanceledNote: '',
      CompletedBy: '',
      CompletedDate: '',
      CreatedDate: ''
    }
  }

  initTable() {
    this.foundIssueConfig = {
      style: {
        'overflow-x': 'hidden'
      },
      columns: {
        actionTitle: 'action',
        isContextMenu: false,
        displayedColumns: [
          'index',
          'SKU',
          'Barcode',
          'BaseBarcode',
          'SKUName',
          'BaseUom',
          'ExpiredDate',
          'ManufactureDate',
          'BaseQty',
          'MappingQty',
          'CompletedQty',
          'RemainingQty'
        ],
        options: [
          {
            title: 'SKU',
            name: 'SKU',
          },
          {
            title: 'LostFound.Grid.ProductName',
            name: 'SKUName',
          },
          {
            title: 'Barcode',
            name: 'Barcode',
          },
          {
            title: 'LostFound.Grid.BaseBarcode',
            name: 'BaseBarcode',
          },
          {
            title: 'LostFound.Grid.BaseUnit',
            name: 'BaseUom'
          },
          {
            title: 'LostFound.Grid.ExpiredDate',
            name: 'ExpiredDate'
          },
          {
            title: 'LostFound.Grid.ManufactureDate',
            name: 'ManufactureDate'
          },
          {
            title: 'LostFound.FoundQty',
            name: 'BaseQty'
          },
          {
            title: 'LostFound.MatchQty',
            name: 'MappingQty'
          },
          {
            title: 'LostFound.ProcessQty',
            name: 'CompletedQty'
          },
          {
            title: 'LostFound.RemainQty',
            name: 'RemainingQty'
          }
        ]
      },
      data: {
        rows: [],
        total: 0
      }
    }
  }

  loadData(code: string) {
    this.service.getFoundDetail(code)
      .subscribe((resp: any) => {
        console.log(1,resp);
        
        if (resp.Data && resp.Status) {
          this.buildData(resp.Data);
        }
      });
  }
  buildData(data) {
    this.data = {
      Code: data.Code,
      Type: data.Type,
      IssueType: data.IssueType,
      WarehouseCode: data.WarehouseCode,
      WarehouseSiteId: data.WarehouseSiteId,
      ClientCode: data.ClientCode,
      SKU: data.SKU,
      Barcode: data.Barcode,
      LocationLabel: data.LocationLabel,
      LocationType: data.LocationType,
      SubLocLabel: data.SubLocLabel,
      Qty: data.Qty,
      Uom: data.Uom,
      BaseQty: data.BaseQty,
      BaseUom: data.BaseUom,
      MappingQty: data.MappingQty,
      ProcessedQty: data.ProcessedQty,
      RemainingQty: data.RemainingQty,
      ReceiveDate: data.ReceiveDate,
      ExpiredDate: data.ExpiredDate,
      BestBeforeDate: data.BestBeforeDate,
      ManufactureDate: data.ManufactureDate,
      ConditionType: data.ConditionType,
      IssueLocationLabel: data.IssueLocationLabel,
      IssueLocationType: data.IssueLocationType,
      IssueSubLocLabel: data.IssueSubLocLabel,
      POCode: data.POCode,
      Note: data.Note,
      RefEmployee: data.RefEmployee,
      RefJobCode: data.RefJobCode,
      RefJobType: data.RefJobType,
      Status: data.Status,
      CanceledBy: data.CanceledBy,
      CanceledDate: data.CanceledDate,
      CanceledReason: data.CanceledReason,
      CanceledNote: data.CanceledNote,
      CompletedBy: data.CompletedBy,
      CompletedDate: data.CompletedDate,
      CreatedDate: data.CreatedDate,
      Details: data.Details
    }
    this.foundIssueTable['renderData'](this.data.Details || []);

    if(data.Status == 'New'){
      this.isEnableCancel = true;
    }
  }

  cancelIssue(event: any){
    const dialogRef = this.dialog.open(ConfirmCancelFoundIssueComponent, {
      data: {
        title: 'Huỷ bút toán hàng tìm thấy',
        Data: this.data
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cancelFoundIssue(result);
      }
    });
  }

  cancelFoundIssue(data){
    const dialogRef = this.dialog.open(NotificationComponent, {
      data: {
        message: `Bạn chắc chắn muốn HUỶ Mã tìm thấy: ${data.Code}?`,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.execCancelIssue(data);
      }
    });
  }

  execCancelIssue(data){
    this.service.cancelFound({Code: data.Code, Note: data.CancelNote, Reason: data.CancelReason})
      .subscribe((resp: any) => {
        if(resp.Status) {
          this.toast.success(`Hủy mã tìm thấy: ${data.Code} thành công`, 'success_title');
          window.location.reload();
        }
        else{
          this.toast.error(`Hủy mã tìm thấy: ${data.Code} không thành công`, 'error_title');
        }
      })
  }
  onClickExit(event: any){
    this.router.navigate([`/${window.getRootPath()}/lost-found/found-list`]);
  }
}
