import { Component, OnInit, Inject, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastService } from '../../../../shared/toast.service';
import * as moment from 'moment';


interface TableAction {
  icon: string;
  class?: string;
  name?: String;
  toolTip?: any;
  actionName?: any;
  disabledCondition?: any;
}
@Component({
  selector: 'app-so-packing-confirm',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class ShowListErrorFoundComponent implements OnInit, AfterViewInit {
  tableConfig: any;
  @ViewChild('appTable', { static: false }) appTable: ElementRef;

  IsShowOK: boolean;
  constructor(public dialogRef: MatDialogRef<ShowListErrorFoundComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toast: ToastService) {
      
  }

  ngOnInit() {
    this.IsShowOK = this.data.isShowOK == true;
    this.initData();
  }
  ngAfterViewInit() {
    this.appTable['renderData'](this.data.ListErrrors);
  }

  initData() {
    this.initTable();
  }
  initTable() {
    this.tableConfig = {
      style: {
        'overflow-x': 'hidden'
      },
      enableFirstLoad: false,
      columns: {
        isContextMenu: false,
        displayedColumns: [
          'index',
          'Column',
          'ErrorMessage'
        ],
        options: [
          {
            title: 'LostFound.Column',
            name: 'Column',
          },
          {
            title: 'LostFound.ErrorMessage',
            name: 'ErrorMessage',
          }
        ]
      },
      data: {
        tota: 0,
        rows: []
      }
    };
  }

  onOkClick(){
    this.dialogRef.close(true); 
  }
  onCancelClick() {
    this.dialogRef.close(false);
  }
}
