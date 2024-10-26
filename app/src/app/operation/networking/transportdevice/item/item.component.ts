import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { BasicInject } from '../../../../components/modal/basic.inject';
import { OperationNetworkingService } from '../../operation-networking.service';
import { ToastService } from '../../../../shared/toast.service';

@Component({
  selector: 'app-transportdevice-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class TransportDeviceItemComponent implements OnInit {
  isEdit: boolean = false;
  isView: boolean = false;
  isDisable:boolean = false;

  data: any = {
    transportdevicecode: "",
    description: "",
    descriptioneng: "",
    transportdevicetype: {
      type: ""
    },
    usingforsmartcart: false,
    status: false,
    usingstatus: {
      name: "Sẵn sàng"
    },
    numberoftransports: 1
  };
  validatorMsg: Object = {
    Description: {
      pattern: 'Mô tả không được để trống'
    },
    NumberOfTransports: {
      max: 'Số lượng thiết bị vận chuyển cho phép tạo cùng lúc 100, xin nhập lại'
    }
  };
  formValidator: any = null;
  formValid: boolean = false;
  statusText: string = "Inactive";
  constructor(public injectObj: BasicInject, private networkingService: OperationNetworkingService, private toast: ToastService) {
    this.initialForm();
  }
  ngOnInit() {
    if (this.formValidator != null) {
      this.formValidator.TransportDeviceCode.valueChanges.subscribe(val => { this.data['transportdevicecode'] = val.toUpperCase(); this.validate(); }, null, null);
      this.formValidator.Description.valueChanges.subscribe(val => { this.data['description'] = val; this.validate(); }, null, null);
      this.formValidator.DescriptionEng.valueChanges.subscribe(val => { this.data['descriptioneng'] = val; this.validate(); }, null, null);
      // this.formValidator.TransportDeviceType.valueChanges.subscribe(val => { this.data['transportdevicetype'] = val; this.validate(); }, null, null);
      // this.formValidator.UsingForSmartCart.valueChanges.subscribe(val => { this.data['usingforsmartcart'] = val; this.validate(); }, null, null);
      this.formValidator.NumberOfTransports.valueChanges.subscribe(val => { this.data['numberoftransports'] = val; this.validate(); }, null, null);
      // this.formValidator.UsingStatus.valueChanges.subscribe(val => { this.data['usingstatus'] = val; this.validate(); }, null, null);
    }
  }
  initialForm() {
    if (this.injectObj.data) {
      this.isEdit = this.injectObj.data['action'] === 'edit';
      this.isView = this.injectObj.data['action'] === 'view';
      this.data['transportdevicecode'] = this.injectObj.data['transportdevicecode'] || "";
      this.data['description'] = this.injectObj.data['description'] || "";
      this.data['descriptioneng'] = this.injectObj.data['descriptioneng'] || "";
      this.data['transportdevicetype']['type'] = this.injectObj.data['transportdevicetype']['type'] || "";
      this.data['usingforsmartcart'] = this.injectObj.data['usingforsmartcart'] || false;
      this.data['status'] = this.injectObj.data['status'] || false;
      this.data['usingstatus'] = this.injectObj.data['usingstatus'] || "";
      this.data['numberoftransports'] = this.injectObj.data['numberoftransports'] || 0;
      this.statusText = this.injectObj.data['status'] === true ? "Active" : "Inactive";
    }
    if (!this.isView) {
      this.formValidator = {
        TransportDeviceCode: new FormControl(this.data.transportdevicecode, [
          Validators.required,
          Validators.maxLength(6),
          Validators.minLength(6)
        ]),
        Description: new FormControl(this.data.description, [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(/^(?!\s*$).+/)
        ]),
        DescriptionEng: new FormControl(this.data.descriptioneng, [
          // Validators.required,
          Validators.maxLength(50)
        ]),
        // TransportDeviceType: new FormControl(this.data.transportdevicetype, [
        //   Validators.required
        // ]),
        // UsingForSmartCart: new FormControl(this.data.usingforsmartcart, [
        //   Validators.required
        // ]),
        // UsingStatus: new FormControl(this.data.usingstatus, [
        //   Validators.required
        // ]),
        NumberOfTransports: new FormControl(this.data.numberoftransports, [
          Validators.required,
          Validators.max(100)
        ])
      };
      if (this.isEdit) {
        this.isDisable = this.data['transportdevicecode'] && this.data['status'] ? false : true;
        this.formValidator['TransportDeviceCode'].reset({ value: this.injectObj.data['transportdevicecode'], disabled: true });
      }
    }
  }
  statusHandle(val) {
    this.statusText = val.checked === true ? "Active" : "Inactive";
    this.validate();
  }
  usingForSmartCartHandle(val) {
    this.validate();
  }
  transportDeviceTypeHandle(val) {
    if (val !== 'error') {
      this.data['transportdevicetype'] = val;
    } else {
      this.data['transportdevicetype']['type'] = null;
    }
    this.validate();
  }
  usingStatusHandle(val) {
    if (val !== 'error') {
      this.data['usingstatus'] = val;
    } else {
      this.data['usingstatus']['name'] = null;
    }
    this.validate();
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
      this.data['ref'] = this.data['transportdevicecode'];
    }
    this.trimSpace();
    this.networkingService.save('TransportDevice.save', this.data)
      .subscribe((res) => {
        if (res['Success']) {
          this.toast.success(this.isEdit ? "Cập nhật thành công" : "Tạo mới thiết bị vận chuyển thành công.", "Thành Công");
          this.injectObj.dialogRef.dismiss(true);
        } else {
          this.toast.error(res['Data'], "Error");
        }
      });
  }

  trimSpace(){
    for(let i in this.data){
      if(this.data[i] && typeof this.data[i] == 'string'){
        this.data[i] = this.data[i].trim();
      }
    }
    return this.data;
  }

  onCancelClick(): void {
    this.injectObj.dialogRef.dismiss();
  }
  onSaveClick(): void {
    this.saveHandle();
  }
  inputValidator(fieldname) {
    if(this.formValidator[fieldname].errors !== null) {
      for (let i in this.formValidator[fieldname].errors) {
        if (this.validatorMsg[fieldname] && this.validatorMsg[fieldname][i]){
          this.toast.warning(this.validatorMsg[fieldname][i], 'warning');
        }
      }
    }
  }
}
