import { Component, OnInit, Inject, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-confirm-skip-modal',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class ConfirmSkipComponent implements OnInit, AfterViewInit {

  title: string = '';
  content: string = '';

  constructor(
    private translate: TranslateService,
    public dialogRef: MatDialogRef<ConfirmSkipComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }
  ngOnInit() {
    this.init();
  }
  init() {
    let isAllowSkipped = this.data.isAllowSkipped;
    this.title = this.translate.instant(`PickListConfirmSkip.${isAllowSkipped ? 'ConfirmPickAgain' : 'ConfirmDone'}`)
    this.content = this.translate.instant(`PickListConfirmSkip.${isAllowSkipped ? 'ContentConfirmPickAgain' : 'ContentConfirmDone'}`);
  }
  onCancelClick() {
    this.dialogRef.close(null);
  }
  onConfirmClick() {
    if (this.data) {
      this.dialogRef.close(this.data);
    }
  }
  initEvent() {
  }
  ngAfterViewInit() {
    this.initEvent();
  }
}
