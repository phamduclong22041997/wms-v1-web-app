import { Component, OnInit, EventEmitter, Input, Output, ChangeDetectorRef } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { of } from 'rxjs/observable/of';
import { catchError} from 'rxjs/operators';

import { RequestService } from './../../shared/request.service';

export class FileUploadModel {
  data: File;
  state: string;
  inProgress: boolean;
  progress: number;
  canRetry: boolean;
  canCancel: boolean;
}

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 100 })),
      transition('* => void', [
        animate(300, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class UploadComponent implements OnInit {
  file: FileUploadModel = null;
  showProgress: boolean = false;
  progressValue: number = 0;
 
  @Input() readOnly = false;
  @Input() disabled = false;
  @Input() ref = 'default';
  @Input() thumbnail:string = "";
  @Input() type = '';
  @Input() accept = 'image/*';
  @Input() value = '';
  @Input() showImage = 'on';
  @Input() description = '';

  @Output() complete = new EventEmitter<string>();
  selectedFile: string = "upload_file_title";
  fileId: string = "";

  constructor(private request: RequestService, private changeDetector: ChangeDetectorRef) {
    this.onClick = this.onClick.bind(this);
    this.selectFileHandle = this.selectFileHandle.bind(this);
  }
  ngOnInit() {
    
    if(this.value) {
      this.fileId = this.value;
    }
  }
  ngAfterViewInit() { console.log(this)}
  onClick() {
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    fileUpload.onchange = (event: any) => {
      this.selectFileHandle(event)
    }
    fileUpload.click();
  }

  selectFileHandle(event: any) {
    const fileUpload = event.target as HTMLInputElement;
    if (fileUpload.files.length > 0) {
      for (let index = 0; index < fileUpload.files.length; index++) {
        const _fileModel = new FileUploadModel();
        _fileModel.data = fileUpload.files[index];
        _fileModel.state = 'in';
        _fileModel.inProgress = false;
        _fileModel.canCancel = true;
        _fileModel.canRetry = false;
        _fileModel.progress = 0;
        this.file = _fileModel;
      }
      if (this.file != null) {
        this.showProgress = true;
        this.selectedFile = this.file.data.name;
        this.changeDetector.detectChanges();
        this.uploadFile(this.file);
      }
    }
  }

  uploadFile(file: FileUploadModel) {
    const formData = new FormData();
    formData.append('file', file.data);
    formData.append('ref', this.ref);
    formData.append('type', this.type);
    formData.append('thumbnail', this.thumbnail);

    this.request.upload("/api/file/upload", formData)
      .pipe(
        catchError((error: any) => {
          setTimeout(() => {
            this.showProgress = false;
            this.changeDetector.detectChanges();
          }, 300);
          return of(`upload failed.`);
        })
      )
      .subscribe((res: any) => {
        setTimeout(() => {
          this.showProgress = false;
          if (res.Success) {
            this.fileId = res.Data;
            this.complete.emit(this.fileId);
          }
          this.changeDetector.detectChanges();
        }, 300)
      })
  }
}
