import { Component, OnInit, ViewChild, Inject, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Service } from '../service';
import { ToastService } from '../../shared/toast.service';

interface dataPopup {
  SKU?: string;
  Status?: number;
}
@Component({
  selector: 'confirm-create-store',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class EditProductComponent implements OnInit, AfterViewInit {

  WarehouseConfig: Object;
  dataEditProduct: dataPopup = {};
  constructor(
    public dialogRef: MatDialogRef<EditProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: Service,
    private toast: ToastService
  ) {
  }
  ngOnInit() {
    console.log(this.data);
    this.dataEditProduct['SKU'] = this.data.SKU
    this.dataEditProduct['Status'] = this.checkActive(this.data.Status)
  }
  checkActive(status: any) {
    if (status === "ACTIVE")
      return 1
    else return 0
  }

  ngAfterViewInit() {
  }

  confirm(event: any) {
    this.checkFinish()
  }

  checkFinish() {
    const _info = window.localStorage.getItem('_info');
    if (_info) {
      const userInfo = JSON.parse(_info);
    }
    this.service.editProduct(
      {
        SKU: this.dataEditProduct['SKU'],
        Status: this.dataEditProduct.Status ? "ACTIVE" : "INACTIVE"
      }
    ).subscribe((resp: any) => {
      if (resp.Status == true) {
        this.toast.success('Cập nhật thành công', 'Success');
        this.dialogRef.close({ Status: true });
      } else {
        this.toast.error(resp.Data, 'error_title');
      }
    });
  }

}
