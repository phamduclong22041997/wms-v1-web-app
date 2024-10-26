import { Component, OnInit, Inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastService } from '../../../../shared/toast.service';
import { Service } from '../../../service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-xdock-receive-confirm',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class ConfirmHandoverXDockComponent implements OnInit, AfterViewInit {

  @ViewChild('warehouse', { static: false }) warehouse: ElementRef;
  info: any;
  warehouseConfig: Object;
  warehouse_data: any = [];
  warehouse_confirm: any = {
    Name: "",
    Code: "",
    ContactName: "",
    ContactPhone: "",
    Address: {}
  };

  constructor(public dialogRef: MatDialogRef<ConfirmHandoverXDockComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private service: Service,
    private router: Router,
    private toast: ToastService,
    private translate: TranslateService) {
    this.info = this.data['Data'];
  }

  ngOnInit() {
    this.initData();
  }

  ngAfterViewInit() {
    this.warehouse['change'].subscribe({
      next: (value: any) => {
        if (value) {
          this.warehouse_confirm = value;
        }
      }
    });
  }

  initData() {
    this.warehouseConfig = {
      selectedFirst: true,
      isSelectedAll: false,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Name'];
      },
      type: 'combo',
      data: this.warehouse_data
    };

    this.service.getWarehouse({})
      .subscribe((resp: any) => {
        if (resp.Status && resp.Data && resp.Data.length) {
          let data = [];
          resp.Data.forEach(item => {
            if (this.data.WarehouseCode != item.Code) {
              data.push(item)
            }
          });
        
          this.warehouse_data = data;
          this.warehouse['clear'](false, true);
          this.warehouse['setData'](this.warehouse_data);
        }
      })
  }

  onCancelClick() {
    this.dialogRef.close(false);
  }
  onOkClick() {
    if(!this.warehouse_confirm["Code"]){
      this.toast.warning('Chưa chọn kho nhận hàng.',"warning_title");
      return;
    }
    let obj = {
      IsConfirm: true,
      Results: this.warehouse_confirm
    };
    this.dialogRef.close(obj);
  }
}
