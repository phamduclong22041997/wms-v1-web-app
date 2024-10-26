import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { BasicInject } from '../../../../components/modal/basic.inject';
import { OperationNetworkingService } from '../../operation-networking.service';
import { ToastService } from '../../../../shared/toast.service';

const TITLE = "Thiết bị vận chuyển trên xe đẩy";

@Component({
  selector: 'app-transportdeviceonsmartcart-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class TransportDeviceOnSmartcartItemComponent implements OnInit {
  isEdit: boolean = false;
  isView: boolean = false;

  data: any = {
    bincode: "",
    smartcartcode: "",
    configuration: "",
    purposeusing: "",
    transportdevicecode: ""
  }
  formValidator: any = null;
  formValid: boolean = false;
  statusText: string = "Inactive";
  constructor(public injectObj: BasicInject, private networkingService: OperationNetworkingService, private toast: ToastService) {
    this.initialForm();
  }
  ngOnInit() {
    if (this.formValidator != null) {
      this.formValidator.BinCode.valueChanges.subscribe(val => { this.data['bincode'] = val; this.validate(); }, null, null);
      this.formValidator.TransportDeviceCode.valueChanges.subscribe(val => { this.data['transportdevicecode'] = val; this.validate(); }, null, null);
    }
  }
  initialForm() {
    if (this.injectObj.data) {
      this.isEdit = this.injectObj.data['action'] === 'edit';
      this.isView = this.injectObj.data['action'] === 'view';
      this.data['smartcartcode'] = this.injectObj.data['smartcartcode'] || "";
      this.data['bincode'] = this.injectObj.data['bincode'] || "";
      this.data['configuration'] = this.injectObj.data['configuration'] || "";
      this.data['purposeusing'] = this.injectObj.data['purposeusing'] || "";
      this.data['transportdevicecode'] = this.injectObj.data['transportdevicecode'] || "";
    }
    if (!this.isView) {
      this.formValidator = {
        BinCode: new FormControl(this.data.bincode, [
          Validators.required,
          Validators.maxLength(50)
        ]),
        TransportDeviceCode: new FormControl(this.data.transportdevicecode, [
          Validators.required,
          Validators.maxLength(50)
        ])
      };
      if (this.isEdit) {
        this.formValidator['BinCode'].reset({ value: this.injectObj.data['bincode'], disabled: true });
      }
    }
  }
  enableButton() {
    return true;
  }
  validate() {
    let valid = true;
    for (let index in this.formValidator) {
      if (this.formValidator[index].errors !== null) {
        valid = false;
      }
    }
    this.formValid = valid;
    return valid;
  }
  saveHandle() {
    if (this.isEdit) {
      this.data['ref'] = this.data['bincode'];
    }
    this.networkingService.save('TransportDeviceOnSmartcart.save', this.data)
      .subscribe((res) => {
        if (res['Success']) {
          this.toast.success(this.isEdit ? "Cập nhật thành công" : `Tạo mới ${TITLE} thành công.`, "Thành Công");
          this.injectObj.dialogRef.dismiss(true);
        } else {
          this.toast.error(res['Data'], "Error");
        }
      });
  }
  onChangeBin(bincode) {
    this.networkingService.get('Smartcart.getbininfo', {
      bincode: bincode
    }).subscribe((res) => {
      if (res.Success && res.Data) {
        this.data['configuration'] = res.Data['configuration'] || "";
        this.data['purposeusing'] = res.Data['purposeusing'] || "";
        this.data['smartcartcode'] = res.Data['smartcartcode'] || "";
      } else {
        this.data['bincode'] = "";
        this.data['configuration'] = "";
        this.data['purposeusing'] = "";
        this.data['smartcartcode'] = "";
        this.toast.error("Mã bin không tồn tại trong hệ thống. Vui long kiểm tra lại.", "Error");
      }
    });
  }
  onChangeTransport(transportdevicecode) {
    this.networkingService.get('TransportDevice.getone', {
      transportdevicecode: transportdevicecode
    }).subscribe((res) => {
      let _formValid = true;
      if (!res.Success) {
        this.data.transportdevicecode = "";
        _formValid = false;
        this.toast.error("Mã thiết bị vận chuyển không tồn tại trong hệ thống. Vui lòng kiểm tra lại.", "Error");
      } else {
        if (res.Data && !res.Data.usingforsmartcart) {
          this.data.transportdevicecode = "";
          _formValid = false;
          this.toast.error("Thiết bị vận chuyển này không sử dụng trên smart cart . Vui lòng kiểm tra lại", "Error");
        }
      }
      this.formValid = _formValid;
    });
  }
  onCancelClick(): void {
    this.injectObj.dialogRef.dismiss();
  }
  onSaveClick(): void {
    this.saveHandle();
  }
}
