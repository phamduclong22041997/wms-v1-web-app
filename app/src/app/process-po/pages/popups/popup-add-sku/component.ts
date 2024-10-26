import { Component, OnInit, Inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../../../shared/toast.service';
import { Service } from '../../../service';
import { NotificationComponent } from '../../../../components/notification/notification.component';
import { PopupUploadProductImageComponent } from '../popup-upload-file/component';
import { PopupPreviewProductImageComponent } from '../popup-preview-img/component';


@Component({
  selector: 'popup-add-sku',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class PopupAddSKUComponent implements OnInit, AfterViewInit {
  @ViewChild('txtSKU', { static: false }) txtSKU: ElementRef;
  @ViewChild('txtName', { static: false }) txtName: ElementRef;
  // @ViewChild('txtUom', { static: false }) txtUom: ElementRef;
  @ViewChild('txtQty', { static: false }) txtQty: ElementRef;
  @ViewChild('inputFile', { static: false }) inputFile: ElementRef;
  @ViewChild('cbbUnit', { static: false }) cbbUnit: any;
  @ViewChild('expirydateCombo', { static: false }) expirydateCombo: any;
  dataSave = {
    POCode: this.data.POCode,
    WarehouseSiteId: this.data.WarehouseSiteId,
    SKU: "",
    Name: "",
    Uom: "",
    Qty: "",
    ProductType: "Single",
    Source: "SUPRA",
    Exists: 0,
    Image: "",
    PCB: null,
    MHU: null,
    ExpirationType: 'None'
  };
  isDisable = false;
  comboUnitConfig: object;
  expiryConfig: Object;

  constructor(public dialogRef: MatDialogRef<PopupAddSKUComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toast: ToastService,
    public dialog: MatDialog,
    private service: Service) { }


  ngOnInit() {
    this.initSKUDefault();
    this.initCombo();
    //this.checkSKU(this.dataSave.SKU);
  }
  initSKUDefault() {
    if (this.data.ExternalCode && !this.dataSave.SKU) {
      let text = `${this.data.ExternalCode}`;
      this.dataSave.SKU = `SUP${text.substring(text.length - 7, text.length)}`;
      this.dataSave.Name = `Sản phẩm tặng kèm của PO ${this.data.ExternalCode}`;
    }
  }

  ngAfterViewInit(): void {
    this.cbbUnit['change'].subscribe({
      next: (value: any) => {
        this.dataSave['Uom'] = value ? value.Code : '';
      }
    });
    this.expirydateCombo['change'].subscribe({
      next: (value: any) => {
        this.dataSave['ExpirationType'] = value ? value.Code : '';
      }
    });
  }
  private initCombo() {
    this.comboUnitConfig = {
      selectedFirst: false,
      isSelectedAll: false,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return `${option['Code']} - ${option['Name']}`;
      },
      type: 'autocomplete',
      filter_key: 'Code',
      URL_CODE: 'SFT.unitcombo'
    };

    this.expiryConfig = {
      selectedFirst: true,
      isSelectedAll: false,
      readonly: true,
      filters: {
        Collection: 'INV.Product',
        Column: 'Experation'
      },
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Description'];
      },
      type: 'autocomplete',
      filter_key: 'Description',
      URL_CODE: 'SFT.enum'
    };
  }
  onCancelClick() {
    this.dialogRef.close(false);
  }
  onOkClick() {
    this.dialogRef.close(true);
  }


  onChange(event: any) {
    if (event.target.value) {
      let text = event.target.value.replace(/[^a-zA-Z0-9]/g, '');
      this.dataSave.SKU = text;
      this.checkSKU(text);
    }
  }
  onKeyUpChange(event: any) {
    // this.onChange(event);
  }
  private checkSKU(sku: string) {
    if (!sku) return;

    this.service.checkSKUSystem({ SKU: sku, 
      ProductType: this.dataSave.ProductType, WarehouseSiteId: this.data.WarehouseSiteId
    }).subscribe(resp => {
      if (resp.Status && resp.Data) {
        if (resp.Data.Source !== this.dataSave.Source) {
          this.toast.error(`Mã sản phẩm:[${sku}] đã tồn tại hoặc không thuộc loại sản phẩm tặng ngoài danh mục!`, "error_title");
          this.dataSave.SKU = "";
          this.txtSKU.nativeElement.focus();
          this.isDisable = true;
        } 
        else {
          this.dataSave.SKU = resp.Data.SKU;
          this.dataSave.Name = resp.Data.Name;
          this.dataSave.Uom = resp.Data.Uom;
          this.dataSave.ProductType = resp.Data.ProductType;
          this.dataSave.Image = resp.Data.Image ? `https://api-supra.oviots.com/${resp.Data.Image}` : "";
          this.dataSave.Exists = 1;
          this.cbbUnit.setDefaultValue(resp.Data.Uom);
          
          this.isDisable = false;
          // this.cbbUnit.focused= true;
          this.dataSave.PCB = resp.Data.PCB;
          this.dataSave.MHU = resp.Data.MHU;
          this.dataSave.ExpirationType = resp.Data.ExpirationType;
          this.expirydateCombo.setValue(resp.Data.ExpirationType || 'None');
        }
      } else {
        this.dataSave.Uom = "";
        this.dataSave.Image = "";
        this.dataSave.Exists = 0;
        this.cbbUnit.setDefaultValue();
        this.isDisable = false;
      }
    });
  }

  checkUploadFile(files: any) {
    let nameFile = files[0].name ? files[0].name : '';
    let ext = nameFile.split('.').pop();

    if (!['png', 'jpg'].includes(ext)) {
      this.toast.error(`Định dạng file [${ext}] hình không đúng!`, "error_title");
      this.isDisable = true;
      return;
    }

  }
  onChangeQty(event: any) {
    let qty = event.target.value;
    if (qty) {
      qty = parseFloat(qty);
      this.dataSave.Qty = qty;
    }
  }
  confirm(event: any) {
    if (!this.dataSave["SKU"]) {
      this.toast.warning("Chưa nhập mã sản phẩm", "warning_title");
      this.txtSKU.nativeElement.focus();
      return;
    }
    if (!this.dataSave["Name"]) {
      this.toast.warning("Chưa nhập tên sản phẩm", "warning_title");
      this.txtName.nativeElement.focus();
      return;
    }

    if (!this.dataSave["Uom"]) {
      if (this.cbbUnit["selectedValue"]) {
        let arrVal = this.cbbUnit["selectedValue"].split("-");
        this.dataSave["Uom"] = arrVal[0].trim();
      }
      let check = this.cbbUnit["data"].find(x => x.Code === this.dataSave["Uom"]);
      if (!check) {
        this.toast.warning("Chưa chọn đơn vị tính hoặc đơn vị tính chưa đúng.", "warning_title");
      }
      return;
    }
    if (!this.dataSave["Qty"]) {
      this.toast.warning("Chưa nhập số lượng", "warning_title");
      this.txtQty.nativeElement.focus();
      return;
    }
    let qty = parseFloat(this.dataSave["Qty"]);
    if (qty < 0 || qty > 999999) {
      this.toast.warning("Số lượng không hợp lệ", "warning_title");
      return;
    }
    const _dialogRef = this.dialog.open(NotificationComponent, {
      data: {
        message: `Bạn có chắc chắn muốn thêm sản phẩm này không: ${this.dataSave["SKU"]} - ${this.dataSave["Name"]}?`,
        type: 1
      }
    });
    _dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.insertSKU();
      }
    });
  }
  insertSKU() {
    this.isDisable = true;
    this.dataSave["Uom"] = this.dataSave["Uom"].toUpperCase();
    this.service.insertSKUToPO(this.dataSave).subscribe(resp => {
      if (resp.Status && resp.Data) {
        this.toast.success("Thêm dữu liệu thành công!", "success_title");
        this.dialogRef.close(true);
      } else {
        const msg = resp.ErrorMessages && resp.ErrorMessages.length ? resp.ErrorMessages.join(",") : "Có lỗi xảy ra. Vui lòng kiểm tra lại";
        this.toast.error(msg, 'error_title');
      }
    });
  }
  uploadProductImage(event: any) {
    let dialogRef = this.dialog.open(PopupUploadProductImageComponent, {
      data: {
        Data: this.dataSave,
        Title: 'Upload hình ảnh sản phẩm đại diện'
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // location.reload();
        this.checkSKU(this.dataSave.SKU);
      }
    });
  }


  previewProductImage(event: any) {
    this.dialog.open(PopupPreviewProductImageComponent, {
      data: {
        Image: this.dataSave.Image,
        Title: 'Hình ảnh sản phẩm đại diện'
      },
      disableClose: false,
    });
  }

  confirmRemoveProductImage(data: any) {
    const dialogRef = this.dialog.open(NotificationComponent, {
      data: {
        message: `Bạn có chắc chắn muốn Xoá Hình ảnh sản phẩm?`,
        type: 1
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.removeProductImage(data);
      }
    });
  }
  removeProductImage(event: any) {
    let params = {
      WarehouseSiteId: this.data.WarehouseSiteId,
      ClientCode: this.data["ClientCode"] || "WIN",
      SKU: this.data.SKU,
      IsRemoveImage: true
    }
    // this.service.editProduct(params)
    //   .subscribe((resp: any) => {
    //     if (resp.Status) {
    //       this.toast.success(`Xoá Hình ảnh sản phẩm đại diện của SKU[${params.SKU}] thành công`, 'success_title');
    //     }
    //     else {
    //       this.toast.error(`Xoá Hình ảnh sản phẩm đại diện của SKU[${params.SKU}] không thành công`, 'error_title');
    //     }
    //   })
  }
}
