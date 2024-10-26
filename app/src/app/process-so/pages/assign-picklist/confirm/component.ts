import { Component, OnInit, Inject, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastService } from '../../../../shared/toast.service';
@Component({
  selector: 'app-employee-modal',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class ConfirmEmployeeComponent implements OnInit, AfterViewInit {

  @ViewChild('employee', { static: false }) employee: ElementRef;

  allowSave: boolean = false;
  constructor(public dialogRef: MatDialogRef<ConfirmEmployeeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toast: ToastService) {
    }
    employeeConfig: any;
    employeeCode: string;
  ngOnInit() { 
    this.init();
  }
  ngAfterViewInit() {
    this.initEvent();
  }
  init() {
    this.employeeCode = '';
    this.employeeConfig = {
      selectedFirst: false,
      isSelectedAll: false,
      isSorting: false,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Name']? option['Name'] : option['Code'];
      },
      type: 'autocomplete',
      filter_key: 'Name',
      URL_CODE: 'SFT.employee',
      filters: {
        WarehouseCode: window.localStorage.getItem('_warehouse') ||  window.getRootPath().toUpperCase()
      },
    };
  }
  initEvent() {
    this.employee['change'].subscribe({
      next: (value: any) => {
        this.employeeCode = value ? value.Code : '';
        this.allowSave = this.employeeCode ? true : false;
      }
    });
  }
  onCancelClick() {
    this.dialogRef.close(null);
  }
  onConfirmClick() {
    if (this.employeeCode){
      this.dialogRef.close(this.employeeCode);
    }
  }
}
