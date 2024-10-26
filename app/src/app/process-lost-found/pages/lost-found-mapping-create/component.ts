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

import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationComponent } from '../../../components/notification/notification.component';
import { Service } from '../../service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../shared/toast.service';

interface TableAction {
  icon: string;
  class?: string;
  name?: String;
  toolTip?: any;
  actionName?: any;
  disabledCondition?: any;
}

@Component({
  selector: "app-lostfound-mapping-create",
  templateUrl: "./component.html",
  styleUrls: ["./component.css"],
})
export class MappingLostFoundCreateComponent implements OnInit, AfterViewInit {
  @ViewChild("lostTable", { static: false }) lostTable: ElementRef;
  @ViewChild("foundTable", { static: false }) foundTable: ElementRef;
  @ViewChild('content', { static: false }) matchingContent: ElementRef;


  code: string;
  lostTableConfig: any;
  foundTableConfig: any;
  filters: Object;
  configDate: any;
  data: any;
  allowCreate: boolean;

  constructor(
    private translate: TranslateService,
    private service: Service,
    private toast: ToastService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.initData();
    this.loadAutoMapping();
  }

  initData() {
    this.allowCreate = false;
    this.code = this.route.snapshot.params.code;
    this.data = {
      MatchQty: 1,
      FoundData: [],
      LostData: []
    }
    this.initTable();
  }

  initTableAction(): TableAction[] {
    return [
      {
        icon: "edit",
        name: 'edit',
        toolTip: {
          name: "Chỉnh sửa",
        },
        class: "ac-task",
        disabledCondition: (row: any) => {
          return true
        }
      }
    ];
  }

  initTable() {
    this.lostTableConfig = {
      columns: {
        isContextMenu: false,
        displayedColumns: [
          "index",
          "SKU",
          "SKUName",
          "Uom",
          "LocationLabel",
          "SubLocationLabel",
          "ExpiredDate",
          "LostQty",
          "MatchQty",
          "ProcessedQty",
          "LostPhysicallyQty",
          "RemainQty"
        ],
        options: [
          {
            title: "LostFound.SKU",
            name: "SKU",
            isEllipsis: true,
          },
          {
            title: "LostFound.SKUName",
            name: "SKUName",
            isEllipsis: true,
          },
          {
            title: "uom",
            name: "Uom",
          },
          {
            title: "LostFound.LocationLabel",
            name: "LocationLabel",
          },
          {
            title: "LostFound.SubLocationLabel",
            name: "SubLocationLabel",
          },
          {
            title: "LostFound.ExpiredDate",
            name: "ExpiredDate",
          },

          {
            title: "LostFound.LostQty",
            name: "LostQty",
          },
          {
            title: "LostFound.MatchQty",
            name: "MatchQty",
          },
          {
            title: "LostFound.ProcessedQty",
            name: "ProcessedQty",
          },
          {
            title: "LostFound.PhysicallyLostQty",
            name: "LostPhysicallyQty",
          },
          {
            title: "LostFound.RemainQty",
            name: "RemainQty",
          }
        ]
      },
      data: {
        rows: [],
        total: 0
      }
    };

    this.foundTableConfig = {
      columns: {
        isContextMenu: false,
        displayedColumns: [
          "index",
          "SKU",
          "SKUName",
          "Uom",
          "LocationLabel",
          "SubLocationLabel",
          "ExpiredDate",
          "FoundQty",
          "MatchQty",
          "ProcessedQty",
          "RemainQty"
        ],
        options: [
          {
            title: "LostFound.SKU",
            name: "SKU",
            isEllipsis: true,
          },
          {
            title: "LostFound.SKUName",
            name: "SKUName",
            isEllipsis: true,
          },
          {
            title: "uom",
            name: "Uom",
          },
          {
            title: "LostFound.LocationLabel",
            name: "LocationLabel",
          },
          {
            title: "LostFound.SubLocationLabel",
            name: "SubLocationLabel",
          },
          {
            title: "LostFound.ExpiredDate",
            name: "ExpiredDate",
          },

          {
            title: "LostFound.FoundQty",
            name: "FoundQty",
          },
          {
            title: "LostFound.MatchQty",
            name: "MatchQty",
          },
          {
            title: "LostFound.ProcessQty",
            name: "ProcessedQty",
          },
          {
            title: "LostFound.RemainQty",
            name: "RemainQty",
          }
        ]
      },
      data: {
        rows: [],
        total: 0
      }
    };
  }

  makeupData(data: any) {
    this.data = {
      ClientCode: data.ClientCode,
      WarehouseCode: data.WarehouseCode,
      WarehouseSiteId: data.WarehouseSiteId,
      MatchQty: data.MatchQty,
      LostCode: data.LostCode,
      LostType: this.translate.instant(`LostFoundType.${data.LostType}`),
      LostStatus: this.translate.instant(`LostFoundStatus.${data.LostStatus}`),
      LostCreatedDate: data.LostDate,
      FoundCode: data.FoundCode,
      FoundType: this.translate.instant(`LostFoundType.${data.FoundType}`),
      FoundStatus: this.translate.instant(`LostFoundStatus.${data.FoundStatus}`),
      FoundCreatedDate: data.FoundDate,
      FoundCreatedBy: data.FoundCreatedBy,
      LostCreatedBy: data.LostCreatedBy,
      LostData: [{
        "SKU": data.SKU,
        "SKUName": data.SKUName,
        "Uom": data.Uom,
        "LocationLabel": data.LostLocationLabel,
        "SubLocationLabel": data.LostSubLocationLabel,
        "ExpiredDate": data.LostExpiredDate,
        "LostQty": data.LostQty,
        "MatchQty": data.MatchQty,
        "ProcessedQty": data.LostProcessedQty,
        "LostPhysicallyQty": data.LostPhysicallyQty,
        "RemainQty": data.LostRemainQty
      }],
      FoundData: [{
        "SKU": data.SKU,
        "SKUName": data.SKUName,
        "Uom": data.Uom,
        "LocationLabel": data.FoundLocationLabel,
        "SubLocationLabel": data.FoundSubLocationLabel,
        "ExpiredDate": data.FoundExpiredDate,
        "FoundQty": data.FoundQty,
        "MatchQty": data.MatchQty,
        "ProcessedQty": data.FoundProcessedQty,
        "RemainQty": data.FoundRemainQty
      }
      ]
    }
    this.allowCreate = true;
    this.lostTable['renderData'](this.data.LostData);
    this.foundTable['renderData'](this.data.FoundData);
  }

  loadAutoMapping() {
    this.service.loadAutoMapping({ SessionCode: this.code })
      .subscribe((resp: any) => {
        if (resp.Status) {
          this.makeupData(resp.Data || {})
        } else {
          this.toast.error(resp.ErrorMessages.join("<br/>"), 'error_title');
        }
      })
  }

  showConfirmCreateSession(data: any) {
    const dialogRef = this.dialog.open(NotificationComponent, {
      data: {
        message: `Bạn có chắc chắn muốn tạo bút toán xử lý hàng thất lạc và tìm thấy?`,
        type: 1
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createSession();
      }
    });
  }

  createSession() {
    if(this.data.MatchQty > this.data.LostData['LostQty'] || this.data.MatchQty > this.data.FoundData['FoundQty']) {
      this.toast.error(`Số lượng liên kết giữa bút toán hàng thất lạc và hàng tìm thấy không phù hợp. Vui lòng nhập lại số lượng khác.`, 'error_title')
      return;
    }
    let saveData = {
      "ClientCode": this.data.ClientCode,
      "WarehouseCode": this.data.WarehouseCode,
      "WarehouseSiteId": this.data.WarehouseSiteId,
      "SessionCode": this.code,
      "LostCode": this.data.LostCode,
      "FoundCode": this.data.FoundCode,
      "SKU": this.data.SKU,
      "MatchQty": this.data.MatchQty
    }
    this.service.createSession(saveData)
      .subscribe((resp: any) => {
        if (resp.Status) {
          this.toast.success("Tạo bút toán liên kết hàng thất lạc và hàng tìm thấy thành công!", "success_title");

          setTimeout(() => {
            if (resp.Data && resp.Data.SessionCode)
            {
              this.router.navigate([`/${window.getRootPath()}/lost-found/mapping-lost-found-session/${resp.Data.SessionCode}`]);
            }
            else {
              this.goToBack();
            }
          }, 500)
        } else {
          this.toast.error(resp.ErrorMessages.join("<br/>"), 'error_title');
        }
      })
  }

  ngAfterViewInit() {
    this.initEvent();
    setTimeout(() => {
      if (this.matchingContent) {
        this.matchingContent.nativeElement.focus();
      }
    }, 500)
  }

  initEvent() { }

  goToBack() {
    this.router.navigate([`/${window.getRootPath()}/lost-found/mapping-lost-found`]);
  }
}
