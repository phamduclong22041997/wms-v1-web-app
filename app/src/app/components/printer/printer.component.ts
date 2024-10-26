import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComboService } from './../combo.service';

@Component({
  selector: 'app-printer-modal',
  templateUrl: './printer.component.html',
  styleUrls: ['./printer.component.css']
})
export class PrinterComponent implements OnInit {
  @ViewChild('printer', { static: false }) printer: ElementRef;
  printerConfig: any;
  dataPrinters: any;
  selectedPrinter: string;
  selectePrinter: string;
  allowSave: boolean;

  constructor(
    public dialogRef: MatDialogRef<PrinterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: ComboService
  ) { }

  ngOnInit() {
    this.selectedPrinter = "";
    this.allowSave = false;
    this.dataPrinters = [];
    this.initCombo();
  }

  ngAfterViewInit() {
    this.loadData();
    this.initEvent();
  }

  setData(data: any) {
    let defaultPrinter = window.localStorage.getItem("_printer");
    if (this.printer) {
      this.printer['setData'](data);
      this.printer['resetInput']();

      if (defaultPrinter) {
        setTimeout(() => {
          this.selectedPrinter = defaultPrinter;
          this.printer['setValue'](defaultPrinter);
        }, 200)
      }
    }
  }

  loadData() {
    this.service.getPrinterList()
      .subscribe((resp: any) => {
        let _data = []
        if (resp.Status) {
          for (let idx in resp.Data) {
            _data.push({
              Name: resp.Data[idx].Name,
              Code: resp.Data[idx].Name,
              Status: resp.Data[idx].Status
            })
          }
        }
        this.setData(_data);
      })
  }

  initCombo() {
    this.printerConfig = {
      selectedFirst: false,
      isSelectedAll: false,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return `${option['Name']} (${option.Status})`;
      },
      type: 'autocomplete',
      filter_key: 'Name',
      data: []
    };
  }

  onSelect() {
    if (this.selectePrinter) {
      window.localStorage.setItem("_printer", this.selectePrinter);
      this.onOkClick();
    }
  }
  initEvent() {

    this.printer['change'].subscribe({
      next: (data: any) => {
        if (data) {
          this.allowSave = this.selectedPrinter !== data.Code;
          this.selectePrinter = data.Code;
        }
      }
    });
  }

  onCancelClick() {
    this.dialogRef.close(false);
  }
  onOkClick() {
    this.dialogRef.close(true);
  }
}
