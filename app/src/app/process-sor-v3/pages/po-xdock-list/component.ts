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

import {
  STATUS_BORDER_MASANSTORE,
  PO_STATUS,
  RECEIVING_STATUS,
} from "../../../shared/constant";
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Service } from "../../service";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastService } from "../../../shared/toast.service";
import { NotificationComponent } from "../../../components/notification/notification.component";
import * as moment from "moment";
import * as CryptoJS from "crypto-js";

interface TableAction {
  icon: string;
  class?: string;
  name?: String;
  toolTip?: any;
  actionName?: any;
  disabledCondition?: any;
}

@Component({
  selector: "app-list-po",
  templateUrl: "./component.html",
  styleUrls: ["./component.css"],
})
export class ListPOXDockComponent implements OnInit, AfterViewInit {
  tableConfig: any;
  statusConfig: Object;
  filters: Object;
  // warehouseHandleConfig: Object;
  regionCode: string;
  configDate: any;
  wareHouseList: any = [];
  poStatusConfig: Object;
  // poTypeConfig: Object;
  clientConfig: Object;
  promotionConfig: Object;
  vendorConfig: Object;
  warehouseHandleConfig: any;
  warehouseBrachConfig: any;
  rootPath = `${window.getRootPath()}`;
  @ViewChild("Content", { static: false }) contentInput: ElementRef;
  @ViewChild("fromDate", { static: false }) fromDate: any;
  @ViewChild("toDate", { static: false }) toDate: any;
  @ViewChild("whCode", { static: false }) whCode: any;
  @ViewChild("status", { static: false }) status: any;
  @ViewChild("content", { static: false }) content: any;
  // @ViewChild("potype", { static: false }) potype: any;
  @ViewChild("client", { static: false }) client: any;
  @ViewChild("vendor", { static: false }) vendor: any;
  @ViewChild("appTable", { static: false }) appTable: ElementRef;
  @ViewChild("inputFile", { static: false }) inputFile: ElementRef;
  @ViewChild("whBranchCombo", { static: false }) whBranchCombo: any;

  constructor(
    private translate: TranslateService,
    private toast: ToastService,
    private service: Service,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.filters = {
      RequestType: "PO_XDOCK",
      Content: "",
      WhCode: "",
      WHBranchCode: "",
      FromDate: moment().subtract(7, "day").format("YYYY-MM-DD"),
      ToDate: moment().format("YYYY-MM-DD"),
      RegionCode: "",
      Promotion: "",
      Vendor: "",
      Client: "",
      Status: "",
      Type: "",
    };

    this.initData();
  }

  onEnter(event: any) {
    let code = event.target["value"];
    this.filters["Content"] = code;
    this.search(null);
  }
  onChange(event: any) {
    let code = event.target["value"];
    this.filters["Content"] = code;
  }
  initData() {
    this.initTable();

    let region = window.localStorage.getItem("region") || "none";
    if (region != "none") {
      this.regionCode = JSON.parse(region)["Code"];
      this.filters["RegionCode"] = this.regionCode;
    }

    this.filters['WhCode'] = window.localStorage.getItem('_warehouse');
    this.warehouseBrachConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      isSorting: false,
      isFilter: true,
      disableAutoload: true,
      val: (option: any) => {
        return option["Code"];
      },
      render: (option: any) => {
        return option["Code"]
          ? `${option["Code"]} - ${option["Name"]}`
          : option["Name"];
      },
      type: "combo",
      filter_key: "Name",
      filters: {
        data: this.filters["WhCode"],
      },
      URL_CODE: "SFT.branchscombo",
    };

    // this.poTypeConfig = {
    //   selectedFirst: false,
    //   isSelectedAll: false,
    //   val: (option: any) => {
    //     return option["Code"];
    //   },
    //   render: (option: any) => {
    //     return option["Name"];
    //   },
    //   type: "autocomplete",
    //   filter_key: "Name",
    //   data: [
    //     { Code: "Standard", Name: "Nhập hàng từ NCC" },
    //     { Code: "Transfer", Name: "Chuyển tồn DC" },
    //     { Code: "Consign", Name: "Hàng ký gửi" }
    //   ],
    // };

    this.vendorConfig = {
      selectedFirst: false,
      isSelectedAll: false,
      isSorting: false,
      disableAutoload: true,
      val: (option: any) => {
        return option["Code"];
      },
      render: (option: any) => {
        return `${option["Code"]} - ${option["Name"]}`;
      },
      type: "autocomplete",
      filter_key: "Code",
      URL_CODE: "SFT.vendorcombo",
    };

    this.clientConfig = {
      selectedFirst: true,
      isSelectedAll: true,
      val: (option: any) => {
        return option["Code"];
      },
      render: (option: any) => {
        return option["Code"]
          ? `${option["Code"]} - ${option["Name"]}`
          : option["Name"];
      },
      type: "combo",
      filter_key: "Name",
      URL_CODE: "SFT.clientcombo",
    };

    let poStatus = [
      { Code: PO_STATUS.New, Name: "Mới" },
      { Code: PO_STATUS.Processing, Name: "Đang xử lý" },
      { Code: PO_STATUS.Finished, Name: "Hoàn thành" },
      { Code: PO_STATUS.Canceled, Name: "Đã hủy" },
    ];
    this.poStatusConfig = {
      selectedFirst: false,
      isSelectedAll: false,
      val: (option: any) => {
        return option["Code"];
      },
      render: (option: any) => {
        return option["Name"];
      },
      type: "autocomplete",
      filter_key: "Name",
      data: poStatus,
    };
  }

  initTableAction(): TableAction[] {
    return [
      {
        icon: "post_add",
        name: "pallet-receive",
        toolTip: {
          name: "Nhận hàng pallet",
        },
        class: "ac-task",
        disabledCondition: (row: any) => {
          if (row.ReceivingSessionStatus) {
            return (
              [RECEIVING_STATUS.New].indexOf(row.ReceivingSessionStatus) != -1
            );
          }
          return row.Status === PO_STATUS.New;
        },
      },
      {
        icon: "local_shipping",
        name: "finish-receiving",
        class: "ac-finish-second",
        toolTip: {
          name: this.translate.instant("POPallet.BtnFinishReceive"),
        },
        disabledCondition: (row: any) => {
          if (row.ReceivingSessionStatus) {
            return (
              [RECEIVING_STATUS.Receiving].indexOf(
                row.ReceivingSessionStatus
              ) != -1
            );
          }
          return !row.ReceivedDate && row.ReceivingDate && !row.FinishedDate;
        },
      },
      {
        icon: "check_circle",
        name: "finish-po",
        class: "ac-finish",
        toolTip: {
          name: "Hoàn thành",
        },
        disabledCondition: (row: any) => {
          return row.Status === PO_STATUS.Processing && row.ReceivedDate;
        },
      },
      // {
      //   icon: "remove_circle",
      //   class: 'ac-remove',
      //   name: 'cancel-po',
      //   toolTip: {
      //     name: "Hủy",
      //   },
      //   disabledCondition: (row:any) => {
      //     return [PO_STATUS.New].indexOf(row.Status) != -1;
      //   }
      // },
      {
        icon: "upload_file",
        name: "upload-doc",
        class: "ac-finish",
        toolTip: {
          name: "Upload chứng từ",
        },
        disabledCondition: (row: any) => {
          return row.Status === PO_STATUS.Finished;
        },
      },
      {
        icon: "print",
        name: "print-doc",
        class: "ac-task",
        toolTip: {
          name: "In phiếu nhập hàng",
        },
        disabledCondition: (row: any) => {
          return row.Status === PO_STATUS.Finished;
        },
      },
    ];
  }

  initTable() {
    this.tableConfig = {
      style: {
        "overflow-x": "hidden",
      },
      columns: {
        isContextMenu: false,
        actionTitle: this.translate.instant("FinishPo.Action"),
        actions: this.initTableAction(),
        displayedColumns: [
          "index",
          // "ClientCode",
          "WarehouseSiteName",
          "POCode",
          "ExternalCode",
          "VendorName",
          "PoStatus",
          "POType",
          "Source",
          "PODate",
          "FinishedDate",
          // "Promotion",
          "actions",
        ],
        options: [
          {
            title: "FinishPo.PoCode",
            name: "POCode",
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${this.rootPath}/purchaseorder/details/${data.POCode}`;
            },
            style: {
              "min-width": "160px",
              "max-width": "160px",
            },
          },
          {
            title: "client",
            name: "ClientCode",
            style: {
              "min-width": "70px",
              "max-width": "70px",
            },
          },
          {
            title: "DCSite",
            name: "WarehouseSiteName",
          },
          {
            title: "FinishPo.ExternalCode",
            name: "ExternalCode",
            borderStyle: (row: any) => {
              if (row.GRStatus) {
                return {
                  color: row.GRStatus == "ERR" ? "#f05858" : "#7bbd7b",
                };
              }
              return "";
            },
          },
          {
            title: "FinishPo.CreatedDate",
            name: "PODate",
            style: {
              "min-width": "90px",
              "max-width": "90px",
            },
          },
          {
            title: "FinishPo.VendorName",
            name: "VendorName",
          },
          {
            title: "FinishPo.FinishedDate",
            name: "FinishedDate",
            style: {
              "min-width": "90px",
              "max-width": "90px",
            },
          },
          {
            title: "FinishPo.POType",
            name: "POType",
            render: (data: any) => {
              return this.translate.instant(`POType.${data.POType}`);
            },
            style: {
              "min-width": "90px",
              "max-width": "90px",
            },
          },
          {
            title: "FinishPo.Source",
            name: "Source",
            render: (data: any) => {
              return this.translate.instant(`FinishPo.SourceType.${data.Source}`);
            },
            style: {
              "min-width": "120px",
              "max-width": "120px",
            },
          },
          {
            title: "FinishPo.Status",
            name: "PoStatus",
            render: (data: any) => {
              return this.translate.instant(`POStatus.${data.Status}`);
            },
          },
          // {
          //   title: "FinishPo.PromotionCode",
          //   name: "Promotion",
          //   style: {
          //     "min-width": "90px",
          //     "max-width": "90px",
          //   },
          // },
          {
            title: "FinishPo.Action",
            name: "Action",
            link: true,
            newpage: true,
            render: (row: any, options: any) => {
              if (row.Status == PO_STATUS.New) {
                return this.translate.instant(`FinishPo.PalletReceive`);
              } else if (row.Status == PO_STATUS.Processing) {
                return this.translate.instant(`FinishPo.FinishPO`);
              }
            },
            onClick: (row: any) => {
              if (row.Status == PO_STATUS.New) {
                return `${this.rootPath}/purchaseorder/receive-pallet/${row.POCode}`;
              }
            },
            showConfirm: (row: any) => {
              if (row.Status == PO_STATUS.Processing) {
                return this.translate.instant(`FinishPo.FinishPO`);
              }
            },
          },
        ],
      },
      remote: {
        url: this.service.getAPI("list"),
        params: {
          filter: JSON.stringify(this.filters),
        },
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

  ngAfterViewInit() {
    this.initEvent();
    // this.getBranchs(this.filters['WhCode'])
    setTimeout(() => {
      if (this.contentInput) this.contentInput.nativeElement.focus();
    }, 200);

    const sevenDayBefore = moment().subtract(7, "day").toDate();
    this.fromDate.setValue(sevenDayBefore);

    let region = window.localStorage.getItem("region") || "none";
    if (region != "none") {
      this.regionCode = JSON.parse(region)["Code"];
      this.filters["RegionCode"] = JSON.parse(region)["Code"];
    }
    this.appTable["search"](this.filters);
  }

  downloadMDLPO(data: any) {
    if (!data.EtonCode) {
      this.toast.error("UploadSTO.InvalidPO", "error_title");
      return;
    }
    if (data.SortCode != "MDL") {
      this.toast.error("UploadSTO.InvalidMDLPO", "error_title");
      return;
    }
    if (!this.wareHouseList) {
      this.toast.error("UploadSTO.InvalidWH", "error_title");
      return;
    }
  }
  reloadComboWHBranch(data: any) {
    if (this.whBranchCombo) {
      this.whBranchCombo["clear"](false, true);
      if (
        this.whBranchCombo &&
        this.whBranchCombo["reload"] &&
        data.Data.length
      ) {
        this.whBranchCombo["setData"](data.Data);
        this.whBranchCombo["setDefaultValue"](data.Data[0].Name);
      }
    }
  }

  initEvent() {
    this.fromDate["change"].subscribe({
      next: (value: any) => {
        this.compareDate();
      },
    });

    this.toDate["change"].subscribe({
      next: (value: any) => {
        this.compareDate();
      },
    });

    this.appTable["actionEvent"].subscribe({
      next: (event: any) => {
        if (!event) {
          return;
        }
        const action = event["action"];
        switch (action) {
          case "pallet-receive":
            this.showConfirmReceive(event.data);
            break;
          case "cancel-po":
            this.showConfirm(event.data, event.index);
            break;
          case "finish-po":
            this.finishPO(event.data["POCode"], false);
            // this.showConfirmFinish(event.data, event.index);
            break;
          case "upload-doc":
            window.open(
              `/${this.rootPath}/purchaseorder/details/${event.data["POCode"]}#document`,
              "_blank"
            );
            break;
          case "print-doc":
            window.open(
              `/${this.rootPath}/purchaseorder/details/${event.data["POCode"]}#receive`,
              "_blank"
            );
            break;
          case "finish-receiving":
            //this.confirmFinsihReceive(event.data);
            window.open(
              `/${this.rootPath}/purchaseorder/details/${event.data["POCode"]}#receive`,
              "_blank"
            );
            break;
        }
      },
    });
    this.whBranchCombo["change"].subscribe({
      next: (data: any) => {
        if (data) {
          if (this.filters["WhCode"]) {
            this.filters["WhBranchCode"] = data.Code || "";
            this.search(null);
          }
        }
      },
    });
    this.status["change"].subscribe({
      next: (value: any) => {
        this.filters["Status"] = value && value.Code ? value.Code : "";
      },
    });
    this.client["change"].subscribe({
      next: (value: any) => {
        this.filters["Client"] = value && value.Code ? value.Code : "";

        if (this.whBranchCombo) {
          this.whBranchCombo["reload"]({
            ClientCode: this.filters["Client"],
            data: this.filters["WhCode"],
          });
        }
        if (this.vendor) {
          this.vendor["reload"]({ ClientCode: this.filters["Client"] });
        }
      },
    });
    // this.potype["change"].subscribe({
    //   next: (value: any) => {
    //     this.filters["Type"] = value ? value.Code : "";
    //   },
    // });
    this.vendor["change"].subscribe({
      next: (value: any) => {
        this.filters["Vendor"] = value ? value.Code : "";
      },
    });
  }
  createPOPrint(data: any) {
    const printer = window.localStorage.getItem("_printer");
    if (!printer) {
      this.toast.error(`Vui lòng chọn máy in`, "error_title");
      return;
    }
    this.service.getPODetails(data.id).subscribe((resp: any) => {
      if (resp.Data) {
        const dataPrint = this.repairData(resp.Data);
        this.sendToSmartPrint(dataPrint, data.POCode, printer);
      }
    });
  }
  sendToSmartPrint(dataPrint: any, keyCode: String, printer: String) {
    const bodyPrint = {
      Keygen: keyCode,
      ClientId: printer,
      Data: CryptoJS.enc.Base64.stringify(
        CryptoJS.enc.Utf8.parse(JSON.stringify(dataPrint))
      ),
    };
    this.service.smartPrint(bodyPrint).subscribe((resp: any) => {
      if (resp.Status) {
        this.toast.success(
          `In phiếu nhập kho ${keyCode} thành công`,
          "success_title"
        );
      } else {
        this.toast.error(
          `In phiếu xuất kho ${keyCode} thất bại: ${resp.Data}`,
          "error_title"
        );
      }
    });
  }
  repairData(data: any) {
    const dataPrint = {
      label: "In Phiếu Nhập Kho.",
      printer_name: "PrinterPaper",
      printer: "PrinterPaper",
      printerDefault: "PrinterPurchase_Landscape",
      template: "PrinterPurchase_Landscape_V3",
      options: { Orientation: "portrait" },
      data: null,
      url: "",
    };
    dataPrint.data = data;
    return dataPrint;
  }
  showConfirmReceive(data: any) {
    const dialogRef = this.dialog.open(NotificationComponent, {
      data: {
        message: `Bạn có muốn nhận hàng đơn hàng?`, 
        note: data.POCode,
        styles: {textAlign: "center"},
        type: 1,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        window.open(
          `/${this.rootPath}/purchaseorder/receive-pallet/${data.POCode}`,
          "_blank"
        );
      }
    });
  }
  showConfirm(data: any, index: any) {
    const dialogRef = this.dialog.open(NotificationComponent, {
      data: {
        message: `Bạn có chắc chắn muốn HỦY PO ${data.POCode}?`,
        type: 1,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cancelPO(data.POCode);
      }
    });
  }
  showConfirmFinish(data: any, msg: string = "") {
    const dialogRef = this.dialog.open(NotificationComponent, {
      data: {
        message: msg,
        note: `Bạn có chắc chắn muốn Hoàn thành PO ${data.POCode}?`,
        type: 1,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.finishPO(data.POCode, true);
      }
    });
  }

  confirmFinsihReceive(data: any) {
    const dialogRef = this.dialog.open(NotificationComponent, {
      data: {
        title: `Bạn có muốn kết thúc Phiên nhận hàng của PO ${data.POCode}?`,
        type: 1,
        Data: {
          Name: "FinishReceive",
          POCode: data["POCode"],
        },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.finishReceive(data);
      }
    });
  }

  finishPO(code: String, isConfirmed: boolean = false) {
    this.service
      .finishPO({
        POCode: code,
        IsConfirmed: isConfirmed,
      })
      .subscribe((resp: any) => {
        if (resp.ErrorMessages && resp.ErrorMessages.length) {
          this.toast.error(
            `POPallet.Error.${resp.ErrorMessages[0]}`,
            "error_title"
          );
        } else {
          let isConfirmed = resp.Data["IsConfirmed"];
          if (isConfirmed === false) {
            let msg = "";
            if (resp.Data["TotalReceiveQty"] < resp.Data["TotalQty"]) {
              msg = `PO nhận hàng thiếu ${resp.Data["TotalReceiveQty"]}/${resp.Data["TotalQty"]} units.`;
            }
            this.showConfirmFinish(resp.Data, msg);
          } else {
            let tmp = this.appTable["data"]["rows"];
            let index = -1;
            for (let i = 0; i < tmp.length; i++) {
              if (tmp[i].POCode == code) {
                index = i;
                break;
              }
            }
            if (index != -1) {
              this.appTable["data"]["rows"][index].Status = "Finished";
              this.appTable["updateRow"](index, 6);
            }
            this.toast.success(`Hoàn thành PO ${code} thành công`, "");
          }
        }
      });
  }
  cancelPO(code: String) {
    this.service
      .cancelPO({
        POCode: code,
      })
      .subscribe((resp: any) => {
        if (resp.ErrorMessages && resp.ErrorMessages.length) {
          this.toast.error(
            `POPallet.Error.${resp.ErrorMessages[0]}`,
            "error_title"
          );
        } else {
          this.toast.success(`Hủy PO ${code} thành công`, "");
        }
      });
  }

  finishReceive(data: any) {
    this.service
      .finishReceivePO({
        POCode: data["POCode"],
        DirectPO: 1,
      })
      .subscribe((resp: any) => {
        if (resp.Status === true) {
          this.toast.success("POPallet.FinishPOSuccess", "success_title");
          setTimeout(() => {
            this.search(null);
          }, 500);
        } else {
          if (resp.ErrorMessages && resp.ErrorMessages.length) {
            this.toast.error(
              `POPallet.Error.${resp.ErrorMessages[0]}`,
              "error_title"
            );
          }
        }
      });
  }
  search(event: any) {
    const fromDate = this.fromDate.getValue();
    const toDate = this.toDate.getValue();
    if (fromDate) {
      const _date = moment(fromDate);
      this.filters["FromDate"] = _date.format("YYYY-MM-DD");
    } else {
      this.filters["FromDate"] = "";
    }
    if (toDate) {
      const _date = moment(toDate);
      this.filters["ToDate"] = _date.format("YYYY-MM-DD");
    } else {
      this.filters["ToDate"] = "";
    }
    this.appTable["search"](this.filters);
  }

  importNewPO() {
    this.router.navigate([`/${window.getRootPath(true)}/rocket/planning-po-list`]);
  }

  importSTO() {
    window.open("/app/fresh-product/sto-process", "_blank");
  }

  exportExcel(data: any = {}) {
    return this.service.exportPO(this.filters);
  }

  compareDate() {
    const createdFromDate = this.fromDate.getValue();
    const createdToDate = this.toDate.getValue();
    if (createdFromDate && createdToDate) {
      const formatCreatedFromDate = new Date(
        createdFromDate.getFullYear(),
        createdFromDate.getMonth(),
        createdFromDate.getDate()
      );
      const formatCreatedToDate = new Date(
        createdToDate.getFullYear(),
        createdToDate.getMonth(),
        createdToDate.getDate()
      );
      if (formatCreatedFromDate > formatCreatedToDate) {
        this.toast.error("invalid_date_range", "error_title");
        this.toDate.setValue(new Date());
      }
    }
  }
}
