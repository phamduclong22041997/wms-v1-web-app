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

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../../shared/toast.service';
import { Service } from '../../service';
import { Router, ActivatedRoute } from '@angular/router';
import { PointsComponent } from './../../points/component';
import { NotificationComponent } from '../../../components/notification/notification.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-so-auto-pickpack-details',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class TaskProcessDetailComponent implements OnInit {
  @ViewChild('appTable', { static: false }) appTable: ElementRef;

  Code: string;
  TaskType: string;
  allowCancel: boolean = false;
  data: any;
  tableConfig: any;
  dataSourceGrid = {
    rows: <any>[],
    total: 0
  };

  constructor(
    public dialog: MatDialog,
    private service: Service,
    private activedRouter: ActivatedRoute,
    private translate: TranslateService,
    private router: Router,
    private toast: ToastService) { }

  ngOnInit() {
    this.Code = this.activedRouter.snapshot.params['code'];
    this.TaskType = this.activedRouter.snapshot.params['type'];
    this.allowCancel = false;
    this.data = {};
    this.initTable();
  }

  ngAfterViewInit() {
    this.loadDetails();
  }

  showConfirmCancel() {
    const dialogRef = this.dialog.open(NotificationComponent, {
      data: {
        message: `Bạn có chắc chắn muốn HỦY task ${this.Code}?`,
        type: 1
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cancelTaskProcess();
      }
    });
  }

  cancelTaskProcess() {
    this.service.cancelTaskProcess({
      "Code": this.Code
    })
      .subscribe((resp: any) => {
        if (resp.ErrorMessages && resp.ErrorMessages.length) {
          this.toast.error(resp.ErrorMessages[0], 'error_title');
        }
        else {
          this.loadDetails();
          this.toast.success(`Hủy task ${this.Code} thành công`, 'success_title');
        }
      })
  }

  loadDetails() {
    
    this.service.loadTaskProcessDetails(this.Code)
      .subscribe((resp: any) => {
        let data = [];
        if (resp.Status) {
          data = resp.Data;
        } else {
          this.toast.error(`ERR`, 'error_title');
        }
        this.makeData(data);
      })
  }


  makeData(data: any) {
    this.allowCancel = (data['Status'] == "New");
    this.data = data;
    this.appTable['renderData'](data.Details || []);
  }

  initTable() {
    this.tableConfig = {
      disablePagination: false,
      columns: {
        isContextMenu: false,
        displayedColumns: [
          "index", "ObjectCode", "ExternalCode", "SOStatus", "RefObjectCode", "ErrorMessages", "CreatedBy", "CreatedDate"],//, "UpdatedBy", "UpdatedDate"
        options: [
          {
            title: 'TaskProcess.ObjectCode',
            name: 'ObjectCode',
          },
          {
            title: 'TaskProcess.ObjectType',
            name: 'ObjectType'
          },
          {
            title: `TaskProcess.${this.TaskType === 'CreatePickList'? 'ZoneCode': 'EmployeeCode'}`,
            name: 'RefObjectCode'
          },
          {
            title: 'TaskProcess.ErrorMessages',
            name: 'ErrorMessages'
          },
          {
            title: 'TaskProcess.ExternalCode',
            name: 'ExternalCode'
          },
          {
            title: 'TaskProcess.SOStatus',
            name: 'SOStatus',
            render: (row: any, options: any) => {
              return this.translate.instant(`SOStatus.${row.SOStatus}`);
            },
          },
          {
            title: 'TaskProcess.CreatedBy',
            name: 'CreatedBy'
          },
          {
            title: 'TaskProcess.CreatedDate',
            name: 'CreatedDate'
          },
          {
            title: 'TaskProcess.UpdatedBy',
            name: 'UpdatedBy'
          },
          {
            title: 'TaskProcess.UpdatedDate',
            name: 'UpdatedDate'
          },
        ]
      },
      data: this.dataSourceGrid
    };
  }
  goToBack() {
    this.router.navigate([`/${window.getRootPath()}/saleorder/task-process`]);
  }
}
