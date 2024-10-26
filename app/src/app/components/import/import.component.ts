import { ElementRef, Directive, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { of } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators';
import { RequestService } from './../../shared/request.service';

@Directive({
  selector: '[importFile]',
})
export class ImportComponent implements OnInit {

  @Input() accept = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel';

  @Output() complete = new EventEmitter<any>();

  constructor(private el: ElementRef, private request: RequestService) {
    this.initElement();
    this.initEvent();
  }
  ngOnInit() { }
  ngAfterViewInit() { }
  initElement() {
    let _element = document.getElementById("importFile");
    if (_element === null) {
      let _inputElement: HTMLInputElement = document.createElement("input");
      _inputElement.id = "fileImport";
      _inputElement.name = "fileImport";
      _inputElement.type = "file";
      _inputElement.multiple = true;
      _inputElement.accept = this.accept;
      _inputElement.style.display = "none";
      document.body.appendChild(
        _inputElement
      );
    }
  }
  initEvent() {
    this.el.nativeElement.onclick = () => {
      const fileImport = document.getElementById('fileImport') as HTMLInputElement;
      fileImport.onchange = (event: any) => {
        this.selectFileHandle(event)
      }
      fileImport.click();
    }
  }

  reset() {
    let _element = document.getElementById("importFile") as HTMLInputElement;
    if(_element != null) {
      _element.value = "";
    }
  }

  selectFileHandle(event: any) {
    const fileImport = event.target as HTMLInputElement;
    let file: any = null;
    if (fileImport.files.length > 0) {
      for (let index = 0; index < fileImport.files.length; index++) {
        file = fileImport.files[index];
      }
      if (file != null) {
        this.uploadFile(file);
      }
    }
  }

  uploadFile(file: any) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('cols', "");

    this.request.upload("/api/file/import", formData)
      .pipe(
        catchError((error: any) => {
          this.complete.emit(null);
          this.reset();
          return of(`upload failed.`);
        })
      )
      .subscribe((res: any) => {
        if (res.Success) {
          this.complete.emit(res);
          this.reset();
        }
      })
  }
}
