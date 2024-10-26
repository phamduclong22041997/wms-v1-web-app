import { Component, OnInit, Inject, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationComponent } from '../../../../components/notification/notification.component';
import { ToastService } from '../../../../shared/toast.service';
import { Service } from '../../../service';

@Component({
  selector: 'app-print-modal',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})

export class confirmPrint implements OnInit, AfterViewInit {

  @ViewChild('scheduleCombo', { static: false }) scheduleCombo: any;
  scheduleConfig: any;
  schedule: any;

  constructor(public dialogRef: MatDialogRef<confirmPrint>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toast: ToastService,
    public dialog: MatDialog,
    private service: Service) {

  }
  
  ngOnInit() {
    this.init();
  }
  ngAfterViewInit() {
    this.initEvent();
  }
  initEvent() {
    this.scheduleCombo['change'].subscribe({
      next: (value: any) => {
        this.schedule = value;
      }
    });
  }
  formatDate() {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [day, month, year].join('/');
}
  init() {
    let defval = '';
    if (this.data && this.data.length) {
      let d = this.formatDate();
      for (let a of this.data) {
        if (a.ScheduleDate == d) {
          defval = d;
          break;
        }
      }
    }
    
    this.scheduleConfig = {
      selectedFirst: defval ? false : true,
      isSelectedAll: false,
      val: (option: any) => {
        return option['ScheduleDate'];
      },
      render: (option: any) => {
        return option['ScheduleDate'] ? `${option['ScheduleDate']} - ${option['Text']}` : option['ScheduleDate'];
      },
      type: 'autocomplete',
      filter_key: 'ScheduleDate',
      data: this.data,
      defaultValue: defval
    }
  }
  onCancelClick() {
    this.dialogRef.close(null);
  }
  onOkClick() {
    this.dialogRef.close(this.schedule);
  }
}
