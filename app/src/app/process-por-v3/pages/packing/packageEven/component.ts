import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastService } from '../../../../shared/toast.service';
import { Utils } from '../../../../shared/utils';

@Component({
  selector: 'app-confirm-update',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class PackageEvenComponent implements OnInit {
  render: any;
  qtyEven: number;
  qtyOdd: string;
  info: any;
  tableConfig: any;
  dataSourceGrid = {
    rows: <any>[],
    total: 0
  };
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('totalPackageOdd', { static: false }) totalPackageOdd: ElementRef;
  @ViewChild('totalPackageEven', { static: false }) totalPackageEven: ElementRef;
  
  constructor(
    public dialogRef: MatDialogRef<PackageEvenComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toast: ToastService
  ) { }
  ngOnInit() {    
      this.info = {
        SOCode: this.data.info.SOCode,
        TotalPackage: this.data.info.TotalPackage,
        TotalPackageOdd: this.data.info.TotalPackageOdd,
        TotalPackageEven: this.data.info.TotalPackageEven,
        DetailPacking: this.data.info.DetailPacking
      };
      this.initTable();
  }
  initTable(){
    this.tableConfig = {
      hoverContentText: "Không có sản phẩm nào",
      // disablePagination: true,
      columns: {
        isContextMenu: false,
        displayedColumns: [
          'index', 'SKU', 'Name','Qty', 'QtyPerCase'],
        options: [
          {
            title: 'SOPacking.SKU',
            name: 'SKU',
            style: {
              "max-width": "100px",
            }
          },
          {
            title: 'SOPacking.SKUName',
            name: 'Name',
            class: 'text-center',
          },
          {
            title: 'SOPacking.Qty',
            name: 'Qty'
          },
          {
            title: 'SOPacking.Package',
            name: 'QtyPerCase',
            render: (row: any) => {
              return Utils.formatNumber(row.QtyPerCase, 2);
            }
          }
        ]
      },
      data: this.dataSourceGrid
    };
  }
  ngAfterViewInit() {
    let _data = [];
    this.info.TotalPackageEven = 0;
    let totalPackage = 0;
    for (let index = 0; index < this.info.DetailPacking.length; index++) {
      let doc = this.info.DetailPacking[index];
      totalPackage += doc.QtyPerCase ? doc.QtyPerCase : 1;
      _data.push(doc);
    }
    this.info.TotalPackageEven = Utils.formatNumber(totalPackage, 2);
    this.info.TotalPackage =  Utils.formatNumber(totalPackage, 0);
    this.qtyEven = this.info.TotalPackage;
    this.appTable['renderData'](_data);
  }
  onChangeEven(event: any) {
    let val = event.target['value'];
    this.qtyEven = val;
    if (val) {
      val = val * 1;
      this.qtyEven = val;
    } else {
      this.toast.error(`Vui lòng nhập số kiện!`, 'error_title');
      event.target.focus();
    }
  }
  onQtyEnter(event: any) {
    this.onOkClick();
  }
  onCancelClick() {
    this.dialogRef.close(false);
  }
  onOkClick() {
    this.info.TotalPackage = this.qtyEven;
    if (this.info.TotalPackage % 1 != 0) {
      this.toast.error(`Số kiện [${this.info.TotalPackage}] là số lẻ. Vui lòng kiểm tra lại!`, 'error_title');
      return;
    }
    console.log(this.info.TotalPackage);
    
    if (this.info.TotalPackage <= 0) {
      this.toast.error(`Số kiện [${this.info.TotalPackage}] phải lớn hơn 0. Vui lòng kiểm tra lại!`, 'error_title');
      return;
    }
    this.dialogRef.close(this.data.type === 1 ? this.info : true);
  }
}
