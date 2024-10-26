import { Component, OnInit, ViewChild, Inject, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Service } from '../../../service';
import { ToastService } from '../../../../shared/toast.service';
import * as _ from 'lodash';

@Component({
  selector: 'confirm-import-store',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class ConfirmTaskProcessListComponent implements OnInit, AfterViewInit {
  @ViewChild('uploadfile', { static: false }) uploadfile: any;
  @ViewChild('note', { static: false }) note: any;
  @ViewChild('type', { static: false }) type: ElementRef;

  typeConfig: any;
  Note: string = '';
  TaskType: String = '';
  dataImportSO : any;
  nameFile = 'Chọn File Upload';
  fileUpload: any;
  isConfirm: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<ConfirmTaskProcessListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: Service,
    private toast: ToastService,) {
  }
  ngOnInit() {
    this.initData();
  }

  initData() {
    this.dataImportSO = {};
    this.nameFile = 'Chọn File Upload';
    this.Note = '';
    this.initCombo();
  }

  uploadFile(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      let isValid = true;
      const fileName = file.name.toLowerCase(),
        regex = new RegExp('(.*?)\.(xlsx|xls)$');
      this.nameFile = fileName
      if (!(regex.test(fileName))) {
        isValid = false;
        this.toast.error('Vui lòng chọn file excel', 'error_title');
      }
      if (isValid) {
        let formData = new FormData();
        formData.append('file', file);
        this.fileUpload = file;
        this.service.importProcessSO(formData, this.TaskType)
          .subscribe((resp: any) => {
            if (resp.Status && resp.Data) {
              console.log(resp.Data);
              this.dataImportSO = resp.Data;
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
  resetUploadForm(){
    this.nameFile = 'Chọn File Upload';
    this.fileUpload = null;
    if (this.uploadfile && this.uploadfile.nativeElement) {
      this.uploadfile.nativeElement.value = null;
    }

  }
  ngAfterViewInit() {
    this.initEvent();
  }

  initEvent() {
    this.type['change'].subscribe({
      next: (value: any) => {
        this.TaskType = value ? value.Code : "";
      }
    });
  }
  initCombo(){
    let filterType = {
      Collection: 'SFT.TaskProcess',
      Column: 'Type'
    };
    if (this.data.HashTag) {
      filterType['Codes'] = this.data.HashTag;
    }
    this.typeConfig = {
      selectedFirst: true,
      isSelectedAll: false,
      isSorting: false,
      clearValue: true,
      filters: filterType,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Description'];
      },
      type: 'combo',
      filter_key: 'Description',
      URL_CODE: 'SFT.enum'
    };
  }

  confirm(event: any) {
    let data = {
      FileName: this.nameFile,
      Details: this.dataImportSO ? this.dataImportSO.Data : [],
      Note: this.note.nativeElement.value,
      Type: this.TaskType || ''
    }
    this.service.saveDataImport(data).subscribe((resp: any) => {
      this.dialogRef.close(resp);
      if (resp.Status) {
        this.toast.success('Thành công', 'success_title');
      }
      else {
        this.toast.error(resp.ErrorMessages.join("\n"), 'error_title');
      }
    });
    
  }
  downloadTemplate(event: any){
    if (this.TaskType) {
        this.service.downloadTemplate(`Import_${this.TaskType}.xlsx`);
    } else {
        this.toast.error('Vui lòng chọn loại công việc', 'error_title');
    }
  }
}
