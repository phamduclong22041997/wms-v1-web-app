import { Component, OnInit, Inject, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastService } from '../../../../shared/toast.service';
@Component({
  selector: 'app-employee-modal',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class DialogCreateTransferLost implements OnInit, AfterViewInit {

  @ViewChild('appTable', { static: false }) appTable: ElementRef;

  constructor(public dialogRef: MatDialogRef<DialogCreateTransferLost>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toast: ToastService) {

    }
    dataSourceGrid = {
      rows: <any>[],
      total: 0
    };
  
    tableConfig: any;
  ngOnInit() { 
    this.init();
  }
  ngAfterViewInit() {
    this.initEvent();
  }
  init() {
    this.initTable();
  }
  initTable() {
    this.tableConfig = {
      columns: {
        isContextMenu: false,
        displayedColumns: [
          'index', 'SKU', 'SKUName', 'Barcode', 'Uom', 'ExpiredDate', 'ManufactureDate', 'LotNumber', 'Qty', 'MappingQty','ProcessedQty', 'RemainingQty'
        ],
        options: [
          {
            title: 'SKU',
            name: 'SKU',
            style: {
              'min-width': '80px',
              'max-width': '80px',
            }
          },
          {
            title: 'TransferLost.SKUName',
            name: 'SKUName'
          },
          {
            title: 'Barcode',
            name: 'Barcode'
          },
          {
            title: 'TransferLost.Uom',
            name: 'Uom'
          },
          {
            title: 'TransferLost.ExpiredDate',
            name: 'ExpiredDate'
          },
          {
            title: 'TransferLost.ManufactureDate',
            name: 'ManufactureDate'
          },
          {
            title: 'TransferLost.LotNumber',
            name: 'LotNumber'
          },

          {
            title: 'TransferLost.Qty',
            name: 'Qty',
            style: {
              'min-width': '70px',
              'max-width': '70px'
            },
          },
          {
            title: 'TransferLost.MappingQty',
            name: 'MappingQty',
            style: {
              'min-width': '70px',
              'max-width': '70px'
            },
          },
          {
            title: 'TransferLost.ProcessedQty',
            name: 'ProcessedQty',
            style: {
              'min-width': '70px',
              'max-width': '70px'
            },
          },
          {
            title: 'TransferLost.RemainingQty',
            name: 'RemainingQty',
            style: {
              'min-width': '70px',
              'max-width': '70px'
            },
          },
        ]
      },
      data: this.dataSourceGrid
    };

  }
  initEvent() {
    
  }
  onCancelClick() {
    this.dialogRef.close(null);
  }
  onConfirmClick() {
    this.dialogRef.close();
  }
}
