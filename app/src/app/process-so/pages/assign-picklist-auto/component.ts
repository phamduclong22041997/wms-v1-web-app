/*
 * @copyright
 * Copyright (c) 2022 OVTeam
 *
 * All Rights Reserved
 *
 * Licensed under the MIT License;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://choosealicense.com/licenses/mit/
 *
 */

import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../../shared/toast.service';
import { Service } from '../../service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NotificationComponent } from "../../../components/notification/notification.component";

interface TableAction {
  name: string,
  icon: string;
  class?: string;
  toolTip?: any;
  actionName?: any;
  disabledCondition?: any;
}
@Component({
  selector: 'app-so-auto-pickpack-list',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class AssignPickListAutoComponent implements OnInit, AfterViewInit  {
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('uploadfile', { static: false }) uploadfile: any;

  dataSourceGrid = {
    rows: <any>[],
    total: 0
  };

  tableConfig: any;
  nameFile = 'Chọn File Upload';
  note: ''
  fileUpload: any;
  enableUpload: boolean = false;
  enableAssign: boolean = false;
  data: []

  constructor(
    public dialog: MatDialog,
    private service: Service,
    private router: Router,
    private translate: TranslateService,
    private toast: ToastService) {

  }

  ngOnInit() {
    this.nameFile = 'Chọn File Upload';
    this.note = '';
    this.initTable();
  }

  ngAfterViewInit() {
    this.initEvent();
  }

  initTable() {
    this.tableConfig = {
      enableCheckbox: true,
      columns: {
        isContextMenu: false,
        headerActionCheckBox: true,
        actionTitle: this.translate.instant('action'),
        actions: this.initTableAction(),
        displayedColumns: [
          'index','ClientCode', 'Employee', 'Message', 'actions'
        ],
        options: [
          {
            title: 'client',
            name: 'ClientCode',
            style: {
              'min-width': '90px',
              'max-width': '120px'
            }
          },
          {
            title: 'AssignPickList.Employee',
            name: 'Employee',
            style: {
              'min-width': '160px'
            },
          },
          {
            title: 'note',
            name: 'Message',
            style: {
              'min-width': '200px'
            },
          }
        ]
      },
      data: this.dataSourceGrid
    };
  }

  initTableAction(): TableAction[] {
    return [
      {
        name: "remove-employee",
        icon: "remove_circle",
        class: 'ac-remove',
        toolTip: {
          name: "Xoá nhân viên lấy hàng",
        },
        disabledCondition: (row: any) => {
          return true;
        }
      }
    ];
  }

  initEvent() {
    this.appTable['actionEvent'].subscribe({
      next: (event: any) => {
        if (!event) {
          return;
        }
        
        const action = event["action"];
        switch (action) {
          case 'remove-employee':
            this.removeRow(event);
            break;
        }
      }
    });
  }

  validateFileUpload(event: any) {
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
        this.fileUpload = file;
        this.enableUpload = true;
      }
      else {
        this.resetUploadForm();
      }
    }
  }
  resetUploadForm(){
    this.nameFile = 'Chọn File Upload';
    this.fileUpload = null;
    this.enableUpload = false;
    this.enableAssign = false;
    if (this.uploadfile && this.uploadfile.nativeElement) {
      this.uploadfile.nativeElement.value = null;
    }
  }
  downloadTemplate(event: any){
    this.service.downloadTemplate(`Import_Auto_Assign_Employee_PickList.xlsx`);
  }

  uploadFile(event) {
    if (this.enableUpload) {
      this.enableAssign = false;
      let formData = new FormData();
      formData.append('file', this.fileUpload);
      this.service.importEmployeeAssignPicklist(formData)
        .subscribe((resp: any) => {
          this.resetUploadForm();
          if (resp.Status && resp.Data) {
            this.data = resp.Data.Data;
            this.appTable['renderData'](this.data);
            if (this.data.length) {
              for (let i of this.data) {
                if (!i['IsError']) {
                  this.enableAssign = true;
                  break;
                }
              }
            }
          } else {
            if (resp.ErrorMessages && resp.ErrorMessages.length) {
              this.toast.error(resp.ErrorMessages.join("\n"), 'error_title');
            }
          }
        });
    }
  }
  confirmAssignEmployee(event: any) {
    let data = this.appTable['getData']()['data'];
    if (!data.length) {
      this.toast.error('Nhân viên có trạng thái không hợp lệ để Phân công lấy hàng tự động!', 'error_title');
      return;
    }

    const dialogRef = this.dialog.open(NotificationComponent, {
      data: {
        message: `Bạn có muốn tự động phân công lấy hàng cho Nhân viên?`,
        type: 1
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.assignEmployee(data);
      }
    });
  }
  clearEmployee(){
    this.appTable['clearData']();
  }
  assignEmployee(data) {
    let saveData = [];
    for (let idx in data) {
      if (!data[idx].IsError) {
        saveData.push(
          {
            ClientCode: data[idx]['ClientCode'],
            Employee: data[idx]['Employee']
          });
      }
    }
    if (!saveData.length) {
      this.toast.error('Nhân viên có trạng thái không hợp lệ để Phân công lấy hàng tự động!(2)', 'error_title');
      return;
    };
    this.service.autoAssignEmployeePickList({ WarehouseCode: window.getRootPath().toUpperCase(), Data: saveData })
      .subscribe((resp: any) => {
        if (resp.Status) {
          this.toast.success('Phân công lấy hàng tự động thành công!', 'success_title');
          this.appTable['renderData'](resp.Data);
        }
        else {
          if (resp.ErrorMessages && resp.ErrorMessages.length) {
            this.toast.error(resp.ErrorMessages.join("\n"), 'error_title');
          }
          else {
            this.toast.error('Phân công lấy hàng tự động Không thành công!', 'error_title');
          }
        }
      })
  }
  downloadPicker(event: any) {
    return this.service.exportEmployee({});
  }
  getAutoAssignEmployee() {
    this.service.getAutoAssignEmployee({})
      .subscribe((resp: any) => {
        if (resp.Status) {
          this.appTable['renderData'](resp.Data);
          this.enableAssign = true;
        }
        else {
          this.enableAssign = false;
        }
      })
  }

  removeRow(data: any) {
    this.appTable['removeRow'](data.index);
  }
}
