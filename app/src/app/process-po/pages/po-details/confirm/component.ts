import { Component, OnInit, Inject, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationComponent } from '../../../../components/notification/notification.component';
import { ToastService } from '../../../../shared/toast.service';
import { Service } from '../../../service';
interface TableAction {
  icon: string;
  class?: string;
  name?: String;
  toolTip?: any;
  actionName?: any;
  disabledCondition?: any;
}
@Component({
  selector: 'app-employee-modal',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})

export class confirmFinishPOSession implements OnInit, AfterViewInit {

  @ViewChild('appTable', { static: false }) appTable: ElementRef;

  constructor(public dialogRef: MatDialogRef<confirmFinishPOSession>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toast: ToastService,
    public dialog: MatDialog,
    private service: Service) {

    }
    dataSourceGrid = {
      rows: <any>[],
      total: 0
    };
  
    tableConfig: any;
  ngOnInit() {     
    this.init();
  }
  ngAfterViewInit() {
    this.initEvent();
    this.loadData();
  }
  initEvent(){

  }
  loadData(){
    this.service.getPODetailPromotion(this.data)
      .subscribe((resp: any) => {
        if (resp.ErrorMessages && resp.ErrorMessages.length) {
          this.toast.error(`POPallet.Error.${resp.ErrorMessages[0]}`, 'error_title');
        }
        else {
          if (resp.Data){
            this.appTable['renderData'](resp.Data);
          }
        }
      })
  }
  init() {
    this.initTable();
  }
  initTable() {
    this.tableConfig = {
      columns: {
        isContextMenu: false,
        disableTools: true,
        editable: true,
        rowSelected: true,
        displayedColumns: [
          'index', 'SKU', 'SKUName', 'Uom', 'POReceiveQty','Qty', 'ReceiveQty'
        ],
        options: [
          {
            title: 'SKU',
            name: 'SKU'
          },
          {
            title: 'POPallet.SKUName',
            name: 'SKUName'
          },
          {
            title: 'POPallet.Uom',
            name: 'Uom'
          },
          {
            title: 'POPallet.PromotionQty',
            name: 'Qty'
          },
          {
            title: 'POPallet.POReceiveQty',
            name: 'POReceiveQty'
          },
          {
            title: 'POPallet.PromotionReceiveQty',
            name: 'ReceiveQty',
            type: 'number'
          }
        ]
      },
      data: this.dataSourceGrid
    };

  }
  editReciveQty(data: any){
    console.log('edit', data);
    
  }
  onCancelClick() {
    this.dialogRef.close(null);
  }
  onOkClick() {
    let rowData = this.appTable['getData']();
    let details = rowData.data || [];
    for (const key in details) {
      const item = details[key];
      
      if(Number.isNaN(item.ReceiveQty) || item.ReceiveQty === null){
        this.toast.error(`Số lượng hàng khuyến mãi của SKU ${item.SKU} không hợp lí. Vui lòng kiểm tra lại!`, 'error_title');
        return;
      }
      if (!Number.isInteger(item.ReceiveQty)){
        this.toast.error(`Số lượng hàng khuyến mãi của SKU ${item.SKU} không hợp lí. Vui lòng kiểm tra lại!`, 'error_title');
        return;
      }
      if (item.ReceiveQty < 0 || item.ReceiveQty < item.ActualReceiveQty) {
        this.toast.error(`Số lượng hàng khuyến mãi của SKU ${item.SKU} phải lớn hơn hoặc bằng ${item.ActualReceiveQty}. Vui lòng kiểm tra lại!`, 'error_title');
        return;
      }
      if (item.ReceiveQty > item.Qty) {
        this.toast.error(`Số lượng hàng khuyến mãi của SKU ${item.SKU} lớn hơn số lượng khuyến mãi trên PO. Vui lòng kiểm tra lại!`, 'error_title');
        return;
      }
      if (item.ReceiveQty > item.MaxPromotionQty) {
        this.toast.error(`Số lượng hàng khuyến mãi của SKU ${item.SKU} lớn hơn số lượng nhận hàng của PO. Vui lòng kiểm tra lại!`, 'error_title');
        return;
      }
    }
    const dialogRef = this.dialog.open(NotificationComponent, {
      data: {
        message: `Bạn có chắc chắn muốn kết thúc Phiên nhận hàng: ${this.data.POSessionCode}?`,
        type: 1
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dialogRef.close(details);
      }
    });
    
  }
}
