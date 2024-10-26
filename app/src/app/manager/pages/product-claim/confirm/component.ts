import { Component, OnInit, ViewChild, Inject, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Service } from '../../../service';
import { ToastService } from '../../../../shared/toast.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'confirm-import-store',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class UploadProductClaimComponent implements OnInit, AfterViewInit {
  @ViewChild('uploadfile', { static: false }) uploadfile: any;
  @ViewChild('note', { static: false }) note: any;
  @ViewChild('type', { static: false }) type: ElementRef;

  typeConfig: any;
  Note: string = '';
  TaskType: String = '';
  dataImport: any = {};
  fileName = 'Chọn File Upload';
  fileUpload: any;
  isConfirm: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<UploadProductClaimComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: Service,
    private toast: ToastService,) {
  }
  ngOnInit() {
    this.initData();
  }

  initData() {
    this.dataImport = {};
    this.fileName = 'Chọn File Upload';
    this.Note = '';
    this.initCombo();
  }

  uploadFile(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      let isValid = true;
      const fileName = file.name.toLowerCase(),
        regex = new RegExp('(.*?)\.(xlsx|xls)$');
      this.fileName = fileName
      if (!(regex.test(fileName))) {
        isValid = false;
        this.toast.error('Vui lòng chọn file excel', 'error_title');
      }
      if (isValid) {
        let formData = new FormData();
        formData.append('file', file);
        this.fileUpload = file;
        this.service.importProductClaim(formData, this.TaskType)
          .subscribe((resp: any) => {
            if (resp.Status && resp.Data) {
              console.log(resp.Data);
              this.dataImport = resp.Data;
              this.isConfirm = true;
            } else {
              this.isConfirm = false;
              if (resp.ErrorMessages && resp.ErrorMessages.length) {
                this.toast.error(resp.ErrorMessages.join("\n"), 'error_title');
              }
              this.resetUploadForm();
            }
          });
      }
      else {
        this.resetUploadForm();
      }
    }
  }
  resetUploadForm() {
    this.fileName = 'Chọn File Upload';
    this.fileUpload = null;
    this.dataImport = null;
    if (this.uploadfile && this.uploadfile.nativeElement) {
      this.uploadfile.nativeElement.value = null;
    }

  }
  ngAfterViewInit() {
    this.initEvent();
  }

  initEvent() {

  }
  initCombo() {

  }

  confirm(event: any) {
    if (this.dataImport) {
      console.log('confirm', this.dataImport);
      let data = this.dataImport;
      this.service.saveProductClaim(data).subscribe((resp: any) => {
        this.dialogRef.close(resp);
        if (resp.Status) {
          this.toast.success('Thành công', 'success_title');
        }
        else {
          this.toast.error(resp.ErrorMessages.join("\n"), 'error_title');
        }
      });
    }
    else {
      this.toast.error('Không có dữ liệu!', 'error_title');
    }
  }
  downloadTemplate(event: any) {
    this.service.downloadTemplate(`template_upload_product_claim_ver01.xlsx`);
  }
}
