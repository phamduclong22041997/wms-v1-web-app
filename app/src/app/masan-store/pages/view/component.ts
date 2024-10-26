
/**
 * Copyright (c) 2019 OVTeam
 * Modified by: Duy Huynh, Huy Nghiem
 * Modified date: 2020/08
 */

import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Service } from '../../service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../shared/toast.service';
import { STATUS_BORDER_MASANSTORE } from '../../../shared/constant';
import { PrintService } from '../../../shared/printService';
import * as fs from 'file-saver';
import { ViewDetailsComponent } from '../../popup-viewDetails/item.component';
interface TableAction {
  icon: string;
  class?: string;
  name?: String;
  toolTip?: any;
  actionName?: any;
  disabledCondition?: any;
}

@Component({
  selector: "app-masan-store",
  templateUrl: "./component.html",
  styleUrls: ["./component.css"],
})
export class MasanStoreViewComponent implements OnInit, AfterViewInit {
  @ViewChild("appTable", { static: false }) appTable: ElementRef;
  @ViewChild("status", { static: false }) statusCombo: any;
  @ViewChild('client', { static: false }) client: any;

  tableConfig: any;
  // regionHandleConfig: Object;
  statusConfig: Object;
  filters: Object;
  stores: Array<object> = [];
  clientConfig: Object;

  constructor(
    private translate: TranslateService,
    private service: Service,
    private toast: ToastService,
    public dialog: MatDialog,
    private router: Router,
    private printService: PrintService,
  ) { }

  ngOnInit() {
    this.initData();
  }

  initData() {
    this.statusConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      val: (option: any) => {
        return option["Code"];
      },
      render: (option: any) => {
        return option["Name"];
      },
      type: "autocomplete",
      filter_key: "Name",
      data: [
        { Code: '', Name: 'Tất cả' },
        { Code: '0', Name: 'Ngưng hoạt động' },
        { Code: '1', Name: 'Đang hoạt động' },
      ]
    };

    this.clientConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      isSorting: false,
      isSelectedAllValueIsEmpty: true,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return this.renderValueCombo(option);
      },
      type: 'combo',
      filter_key: 'Name',
      URL_CODE: 'SFT.clientcombo'
    };

    this.initTable();
    this.filters = {
      Status: "",
      Content: "",
    };
  }

  initTableAction(): TableAction[] {
    return [
      {
        icon: "view_list",
        name: 'view',
        toolTip: {
          name: "Xem chi tiết",
        },
        class: "ac-task",
        disabledCondition: (row: any) => {
          return true
        }
      },
      {
        icon: "print",
        name: 'print-label',
        class: 'ac-task',
        toolTip: {
          name: this.translate.instant(`SODetails.PrintLable`),
        },
        disabledCondition: (row: any) => {
          return true
        }
      },
    ];
  }

  initTable() {
    this.tableConfig = {
      style: {
        "overflow-x": "hidden",
      },
      columns: {
        actionTitle: "action",
        isContextMenu: false,
        actions: this.initTableAction(),
        displayedColumns: [
          "index",
          "ClientCode",
          "Code",
          "Name",
          "FullAddress",
          "ContactName",
          "ContactPhone",
          "Status",
          "actions",
        ],
        options: [
          {
            title: "MasanStore.Code",
            name: "Code",
            style: {
              "min-width": "80px",
              "max-width": "130px",
            },
          },
          {
            title: "client",
            name: "ClientCode",
            style: {
              "min-width": "70px",
              "max-width": "70px",
            }
          },
          {
            title: "MasanStore.Name",
            name: "Name",
            isEllipsis: true,
            style: {
              "min-width": "100px",
            },
          },
          {
            title: "MasanStore.FullAddress",
            name: "FullAddress",
            isEllipsis: true,
            style: {
              "min-width": "200px",
              "max-width": "350px",
            },
          },
          {
            title: "MasanStore.ContactName",
            name: "ContactName",
            style: {
              "min-width": "150px",
              "max-width": "200px",
            },
          },
          {
            title: "MasanStore.ContactPhone",
            name: "ContactPhone",
            style: {
              "min-width": "80px",
              "max-width": "150px",
            },
          },
          {
            title: "MasanStore.Status",
            name: "Status",
            style: {
              "min-width": "150px",
            },
            borderStyle: (data: any) => {
              return this.borderColorByStatus(data.Status);
            },
            render: (data: any) => {
              return this.translate.instant(`MasanStore.Status_${data.Status}`);
            },
          },
        ],
      },
      remote: {
        url: this.service.getAPI("list"),
      },
    };
  }

  borderColorByStatus(status: string) {
    if (status != "") {
      return {
        color: STATUS_BORDER_MASANSTORE[status],
        border: `2px solid ${STATUS_BORDER_MASANSTORE[status]}`,
        "border-radius": "2px",
        padding: "5px 10px",
        "font-weight": "500",
      };
    }
    return "";
  }

  search(event: any) {
    if (this.filters["Content"]) {
      this.filters["Content"] = this.filters["Content"].trim();
    }
    this.appTable["search"](this.filters);
  }

  ngAfterViewInit() {
    this.initEvent();
  }


  showPopupViewDetails(event: any) {
    const dialogRef = this.dialog.open(ViewDetailsComponent, {
      hasBackdrop: true,
      panelClass: "app-dialog",
      data: event,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.Status) {
        this.search(result);
      }
    });
  }


  async printQrCodeStore(data: any) {
    const dataPrint = {
      "label": "Nhãn vận chuyển",
      "printer_name": "PrinterPapper",
      "printer": 'PrinterPapper',
      "printerDefault": "QrcodeLabelVin",
      "template": 'QrcodeLabelVin',
      "options": { "Orientation": "portrait" },
      "data": data,
      "url": "",
      "keygen": ""
    }
    const pdfFile = await this.printService.getPDF(dataPrint);
    fs.saveAs(
      pdfFile,
      data.Code
    );
  }

  initEvent() {
    this.appTable["actionEvent"].subscribe({
      next: (event: any) => {
        if (!event) {
          return;
        }
        const action = event["action"];
        switch (action) {
          case "view":
            this.showPopupViewDetails(event["data"]);
            break;
          case "print-label":
            this.printQrCodeStore(event["data"]);
            break;
        }
      },
    });

    this.statusCombo["change"].subscribe({
      next: (data: any) => {
        if (data) {
          this.filters["Status"] = data.Code;
        } else {
          this.filters["Status"] = 0;
        }

        this.search(null);
      },
    });

    this.client['change'].subscribe({
      next: (value: any) => {
        this.filters['ClientCode'] = value ? value.Code : '';

        this.search(null);
      }
    });
  }
  private renderValueCombo(option: any) {
    return option['Code'] ? `${option['Code']} - ${option['Name']}` : option['Name'];
  }
}
