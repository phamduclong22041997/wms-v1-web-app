import { Component, OnInit, Inject, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastService } from '../../../../shared/toast.service';
import * as moment from 'moment';

@Component({
  selector: 'app-po-receive-confirm',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class ConfirmCancelLostIssueComponent implements OnInit, AfterViewInit {
  info: any;
  cancelNote: String;

  @ViewChild('content', { static: false }) content: any;

  constructor(public dialogRef: MatDialogRef<ConfirmCancelLostIssueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toast: ToastService) {
    this.info = this.data['Data'];
  }

  ngOnInit() {
    this.init();
  }
  ngAfterViewInit() {
    this.initEvent();
  }

  init() {
    this.cancelNote = ''
    this.data.Data['CancelReason'] = '';
    this.data.Data['CancelNote'] = ''
  }

  initEvent() {
    setTimeout(() => {
      if (this.content) this.content.nativeElement.focus();
    }, 500)
  }
  onChange(event: any) {
    
  }

  onCancelClick() {
    this.dialogRef.close(false);
  }
  onOkClick() {
    if (this.data && this.data.Data) {
      this.data.Data['CancelNote'] = this.cancelNote;
      this.data.Data['CancelReason'] = '';
      
      this.dialogRef.close(this.data.Data);
    }
  }
  onEnter(event: any) {
    
  }
  onQtyEnter(event: any) {
    this.onOkClick();
  }
  
}
