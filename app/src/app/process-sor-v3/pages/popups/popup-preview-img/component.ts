import { Component, OnInit, ViewChild, Inject, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Service } from '../../../service';
import { ToastService } from '../../../../shared/toast.service';

@Component({
  selector: 'popup-preview-image-product',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class PopupPreviewProductImageComponent implements OnInit, AfterViewInit {
  fileUpload: any;
  constructor(
    public dialogRef: MatDialogRef<PopupPreviewProductImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: Service,
    private toast: ToastService) {
  }
  ngOnInit() {
    this.initData();
  }

  initData() {
   
  }

  ngAfterViewInit() {

  }
}
