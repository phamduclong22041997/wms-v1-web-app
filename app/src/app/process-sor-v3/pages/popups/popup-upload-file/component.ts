import { Component, OnInit, ViewChild, Inject, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Service } from '../../../service';
import { ToastService } from '../../../../shared/toast.service';
import * as _ from 'lodash';

@Component({
  selector: 'popup-upload-product',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class PopupUploadProductImageComponent implements OnInit, AfterViewInit {
  @ViewChild('uploadfile', { static: false }) uploadfile: any;
  @ViewChild('note', { static: false }) note: any;
  @ViewChild('type', { static: false }) type: ElementRef;

  typeConfig: any;
  Note: string = '';
  fileName = 'Chọn File Upload';
  fileUpload: any;
  isConfirm: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<PopupUploadProductImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: Service,
    private toast: ToastService) {
  }
  ngOnInit() {
    this.initData();
  }

  initData() {
    this.fileName = 'Chọn File Upload';
    this.Note = '';
  }

  uploadFile(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      let isValid = true;
      const fileName = file.name.toLowerCase();
      const regex = new RegExp('(.*?)\.(png|jpeg|jpg)$');
      this.fileName = fileName
      if (!(regex.test(fileName))) {
        isValid = false;
        this.toast.error('Vui lòng chọn file hình ảnh sản phẩm có định dạng: png|jpeg|jpg', 'error_title');
      }
      // checking file size 2MB before upload
      if (file.size > 2097152) {
        isValid = false;
        this.toast.error(`File có dung lượng lớn hơn 2MB vui lòng kiểm tra lại !`, 'error_title')
      }

      if (isValid) {
        this.isConfirm = true;
        this.fileUpload = file;
      }
      else {
        this.resetUploadForm();
      }
    }
  }
  resetUploadForm() {
    this.fileName = 'Chọn File Upload';
    this.fileUpload = null;
    this.isConfirm = false;
    if (this.uploadfile && this.uploadfile.nativeElement) {
      this.uploadfile.nativeElement.value = null;
    }
  }
  ngAfterViewInit() {

  }

  confirmUpload(event: any) {
    if (this.fileUpload) {
      let formData = new FormData();
      formData.append('file', this.fileUpload);
      formData.append('WarehouseSiteId', this.data.Data.WarehouseSiteId);
      formData.append('SKU', this.data.Data.SKU);
      this.service.uploadProductImage(formData)
        .subscribe((resp: any) => {
          if (resp.Status && resp.Data) {
            this.dialogRef.close(resp);
            this.toast.success('Thành công', 'success_title');
          } else {
            if (resp.ErrorMessages && resp.ErrorMessages.length) {
              this.toast.error(resp.ErrorMessages.join("\n"), 'error_title');
            }
          }
        });
    }
    else {
      this.toast.error('Không có dữ liệu!', 'error_title');
    }
  }
}
