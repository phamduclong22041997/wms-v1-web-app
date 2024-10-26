import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastService } from '../../../../shared/toast.service';
import { Service } from '../../../service';

@Component({
  selector: 'app-station-modal',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.css']
})
export class StationComponent implements OnInit {
  @ViewChild('code', { static: false }) inputEle: ElementRef;
  stationCode: string;
  allowSave: boolean;

  constructor(
    public dialogRef: MatDialogRef<StationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: Service,
    private toast: ToastService
  ) { }

  ngOnInit() {
    this.allowSave = false;
  }

  ngAfterViewInit() {
    if(this.data['Code']) {
      setTimeout(() => {
        this.inputEle.nativeElement.value = this.data['Code'];
        this.allowSave = true;
      }, 400)
    }
  }

  getPackingStation(code: string) {
    this.service.getPackingStation({ Code: code })
      .subscribe((resp: any) => {
        if (resp['Status'] == false) {
          this.toast.error(resp['ErrorMessages'].join("<br/>"), 'error_title');
        } else {
          if (!resp.Data) {
            this.toast.error("SOPacking.ErrorPackingStationNotFound", 'error_title');
          } else {
            window.localStorage.setItem("STATION_CODE", code);
            this.onClose();
          }
        }
      })
  }

  onEnter() {
    this.stationCode = `${this.inputEle.nativeElement['value']}`.trim();
    this.getPackingStation(this.stationCode);
  }
  onChange(event:any) {
    let resp = event['target'].value;
    this.allowSave = resp?true:false;
  }

  onClose() {
    if (this.stationCode) {
      setTimeout(() => {
        this.dialogRef.close(true);
      }, 100)
    }
  }
}
