import { Component, OnInit, Inject, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastService } from '../../../../shared/toast.service';
import { Service } from '../../../service';
import * as moment from 'moment';

interface TableAction {
  name: string,
  icon: string;
  class?: string;
  toolTip?: any;
  actionName?: any;
  disabledCondition?: any;
}
@Component({
  selector: 'app-adjust-product-confirm',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class ConfirmAdjustProductExpiredDateComponent implements OnInit, AfterViewInit {
  info: any;
  expiredDateConfig: any;
  manufactureDateConfig: any;
  effectiveDateConfig: any;
  expiredPercents: number;
  tableConfig: any;
  isLotNumber: boolean = false;
  dataSourceGrid = {
    rows: <any>[],
    total: 0
  };

  @ViewChild('expiredDate', { static: false }) expiredDate: any;
  @ViewChild('manufactureDate', { static: false }) manufactureDate: any;
  @ViewChild('effectiveDate', { static: false }) effectiveDate: any;
  @ViewChild('appTable', { static: false }) appTable: ElementRef;

  constructor(public dialogRef: MatDialogRef<ConfirmAdjustProductExpiredDateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toast: ToastService,
    private service: Service,) {
    this.info = this.data['data'];
  }

  ngOnInit() {
    this.isLotNumber = false;
    this.init();
    this.initTable();
  }
  ngAfterViewInit() {
    this.initEvent();
    this.setDefaultDate();

    if (this.info.LotNumber) {
      this.isLotNumber = true;
      this.service.scanItemAdjustProduct(this.info)
      .subscribe((resp: any) => {
        if (resp.Status == false) {
          this.toast.error(resp.ErrorMessages.join("\n"), 'error_title');
        } else {
          this.makeData(resp.Data);
        }
    })
    }
  }
  makeData(data: any) {
    this.appTable['renderData'](data || []);
  }
  init() {
    this.expiredPercents = 0;
    this.expiredDateConfig = {
      // setDefaultDate: false,
      setDefaultDate: false,
      setMaxDate: true,
      setMinDate: true,
      // minDate: new Date()
    };
    this.manufactureDateConfig = {
      setDefaultDate: false,
      setMaxDate: false
    }
    this.effectiveDateConfig = {
      setDefaultDate: false,
      setMaxDate: true,
      setMinDate: true,
      minDate: new Date()
    }
  }
  initTable(){
    this.tableConfig = {
      enableFirstLoad: false,
      style: {},
      pageSize: 5,
      columns: {
        isContextMenu: false,
        displayedColumns: [
          'index', 'LocationLabel', 'SubLocationLabel', 'Qty', 'ExpiredDate', 'ManufactureDate'],
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
            name: 'ExpiredDate'
          },  
          {
            title: 'AdjustProduct.ManufactureDate',
            name: 'ManufactureDate'
          }
        ]
      },
      data: this.dataSourceGrid
    };
  }
  setDefaultDate() {
    if (this.info && this.info['ExpiredDate']) {
      setTimeout(() => {
        if (this.info['ExpiredDate'] && this.expiredDate) {
          this.expiredDate.setValue(moment(this.info['ExpiredDate'], "YYYY-MM-DD").toDate())
        }
        if (this.info['ManufactureDate'] && this.manufactureDate) {
          this.manufactureDate.setValue(moment(this.info['ManufactureDate'], "YYYY-MM-DD").toDate())
        }
        if (this.info['BestBeforeDate'] && this.effectiveDate) {
          this.effectiveDate.setValue(moment(this.info['BestBeforeDate'], "YYYY-MM-DD").toDate())
        }
      }, 500)
    }
  }

  initEvent() {
    this.expiredDate['change'].subscribe({
      next: (value: any) => {
        setTimeout(() => {
          this.calcPercent();
        }, 500)
      }
    });
    this.manufactureDate['change'].subscribe({
      next: (value: any) => {
        setTimeout(() => {
          this.calcPercent();
        }, 500)
      }
    });
  }

  onCancelClick() {
    this.dialogRef.close(false);
  }
  onOkClick() {
    let data = this.getData();
    if (data) {
      data['data'] = this.info || null;
      this.dialogRef.close(data);
    }
  }
  onEnter(event: any) {
    let name = event.target.name;
    if (name == "expiredDate") {
      let val = this.expiredDate.getValue();
      if (val) {
        if (this.manufactureDate.ref && this.manufactureDate.ref.nativeElement) {
          this.manufactureDate.ref.nativeElement.focus();
        }
      }
    }
    if (name == "manufactureDate") {
      let val = this.manufactureDate.getValue();
      if (val) {
        if (this.effectiveDate.ref && this.effectiveDate.ref.nativeElement) {
          this.effectiveDate.ref.nativeElement.focus();
        }
      }
    }
    if (name == "effectiveDate") {

      let val = this.expiredDate.getValue();
      if (!val) {
        if (this.expiredDate.ref && this.expiredDate.ref.nativeElement) {
          this.expiredDate.ref.nativeElement.focus();
        }
      } else {
        let val = this.manufactureDate.getValue();
        if (!val) {
          if (this.manufactureDate.ref && this.manufactureDate.ref.nativeElement) {
            this.manufactureDate.ref.nativeElement.focus();
          }
        }
      }

    }
  }
  getData() {
    const expiredVal = this.expiredDate.getValue();
    const manufactureVal = this.manufactureDate.getValue();
    // const effectiveVal = this.effectiveDate.getValue();
    if (!expiredVal && this.info.ExpirationType && this.info.ExpirationType !='None') {
      this.toast.error('AdjustProduct.EmptyExpiredDate', 'error_title');
      return;
    }
    if (!manufactureVal) {
      this.toast.error('AdjustProduct.EmptyManufactureDate', 'error_title');
      return;
    }

    if ((expiredVal || (this.info.ExpirationType == 'None' && !expiredVal)) && manufactureVal) {
      if (expiredVal) {
        const expiredDate = moment(expiredVal);
        const manufactureDate = moment(manufactureVal);
        // const effectiveDate = effectiveVal ? moment(effectiveVal) : ""
        const totalDays = expiredDate.diff(manufactureDate, 'days');
        if (totalDays <= 0) {
          this.toast.error('AdjustProduct.ErrorExpiredDate', 'error_title');
          return;
        }
      }
      return {
        ExpiredDate: this.info['ExpiredDate'],
        ManufactureDate: this.info['ManufactureDate'],
        AdjustExpiredDate: expiredVal ? moment(expiredVal).format("YYYY-MM-DD") : '',
        AdjustManufactureDate: manufactureVal ? moment(manufactureVal).format("YYYY-MM-DD") : ''
      }
    }
    return null;
  }

  calcPercent() {
    const expiredVal = this.expiredDate.getValue();
    const manufactureVal = this.manufactureDate.getValue();

    if (expiredVal && manufactureVal) {
      const expiredDate = moment(expiredVal);
      const manufactureDate = moment(manufactureVal)
      const totalDays = expiredDate.diff(manufactureDate, 'days');
      const remainTotalDays = expiredDate.diff(moment(), 'days');
      this.expiredPercents = parseFloat(((remainTotalDays / totalDays) * 100).toFixed(2));
    }
  }
}