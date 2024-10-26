import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { BasicInject } from './../../../../components/modal/basic.inject';
import { OperationNetworkingService } from './../../operation-networking.service';
import { ToastService } from './../../../../shared/toast.service';

@Component({
  selector: 'app-room-popup',
  templateUrl: './room-popup.component.html',
  styleUrls: ['./room-popup.component.css']
})
export class RoomPopupComponent implements OnInit {
  @ViewChild('roomTypeCombo', { static: false }) roomTypeCombo: ElementRef;
  configs = {
    info: 'Điền thông tin vào form bên dưới để hoàn thành việc tạo mới phòng.',
    require: 'Là thông tin bắt buộc.',
    form: {
      roomcode: "Mã Phòng",
      roomname: "Tên Phòng",
      roomname_en: "Tên Phòng (English)",
      roomtype: "Loại Phòng",
      status: "Trạng Thái",
      save: "Lưu"
    },
    msg: {
      successTitle: "Thành Công",
      successMsg: "Tạo mới phòng thành công.",
      saveMsg: "Cập nhật thành công.",
      errorTitle: "Lỗi",
      warningTitle: "Cảnh báo",
      requireField: "Xin vui lòng nhập đầy dủ các thông tin bắt buộc"
    }
  }
  isEdit: boolean = false;
  isView: boolean = false;
  data: any = {
    roomcode: "",
    roomname: "",
    roomname_en: "",
    roomtype: {
      "propertyname" : ""
    },
    status: true
  }
  roomTypeList: any = [];
  formValidator: any = null;
  formValid: boolean = false;
  statusText: string = "Active";
  roomTypeConfig: Object = {
    type: 'combo',
    filter_key: "propertyname",
    val: (option) => {
      return option['propertyname'];
    },
    URL_CODE: "Warehouse.warehousepropertycombo",
    filters: {
      'filter': JSON.stringify({
        'propertytype': 'Loại phòng'
      })
    }
  }
  validatorMsg: Object = {
    RoomCode: {
      minlength: 'Mã Tầng phải đúng 1 kí tự',
      pattern: 'Mã Tầng phải là ký tự số [0-9] hoặc alphabet [a-zA-Z]'
    },
    RoomName: {
      pattern: 'Tên Vùng không được bỏ trống'
    }
  }
  constructor(public injectObj: BasicInject, private networkingService: OperationNetworkingService, private toast: ToastService) {
    this.initialForm();
  }
  ngOnInit() {
    if (this.formValidator != null) {
      this.formValidator.RoomCode.valueChanges.subscribe(val => { this.data['roomcode'] = val.toUpperCase(); this.validate(); }, null, null);
      this.formValidator.RoomName.valueChanges.subscribe(val => { this.data['roomname'] = val; this.validate(); }, null, null);
    }
  }
  initialForm() {
    if (this.injectObj.data) {
      this.isEdit = this.injectObj.data['action'] === 'edit';
      this.isView = this.injectObj.data['action'] === 'view';
      this.data['roomcode'] = this.injectObj.data['roomcode'] || "";
      this.data['roomname'] = this.injectObj.data['roomname'] || "";
      this.data['roomname_en'] = this.injectObj.data['roomname_en'] || "";
      this.data['roomtype'] = this.injectObj.data['roomtype'] || "";
      this.data['status'] = this.injectObj.data['status'] || false;
      this.statusText = this.injectObj.data['status'] === true ? "Active" : "Inactive";
    }
    if (!this.isView) {
      this.formValidator = {
        RoomCode: new FormControl(this.data.roomcode, [
          Validators.required,
          Validators.maxLength(1),
          Validators.minLength(1),
          Validators.pattern('^[a-zA-Z0-9]{1}$')
        ]),
        RoomName: new FormControl(this.data.roomname, [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(/^(?!\s*$).+/)
        ]),
        RoomType: new FormControl(this.data['roomtype'][this.roomTypeConfig['filter_key']], [
          Validators.required
        ])
      };
      if (this.isEdit) {
        this.formValidator['RoomCode'].reset({ value: this.injectObj.data['roomcode'], disabled: true });
      }
    }
  }
  onChange(event, fieldname) {
    this.data[fieldname] = event.target.value || "";
    this.validate();
  }
  inputValidator(fieldname) {
    if(this.formValidator[fieldname].errors !== null) {
      for (let i in this.formValidator[fieldname].errors) {
        if (this.validatorMsg[fieldname] && this.validatorMsg[fieldname][i]){
          this.toast.warning(this.validatorMsg[fieldname][i], this.configs['msg']['warningTitle']);
        }
      }
    }
  }
  initialCombo() {
    this.roomTypeCombo['change'].subscribe((data:any) =>{
      if(data !== 'error') {
        this.data['roomtype'] = data;
        this.formValidator['RoomType'].reset({ value: this.data['roomtype'], disabled: false });
      } else {
        this.data['roomtype'][this.roomTypeConfig['filter_key']] = "";
      }
      this.validate();
    })
  }
  statusHandle(val) {
    this.statusText = val.checked === true ? "Active" : "Inactive";
    if (this.isEdit) {
      this.validate();
    }
  }
  enableButton() {
    return true;
  }
  validate() {
    let valid = true;
    if (this.data['roomtype'][this.roomTypeConfig['filter_key']] == ""){
      valid = false;
    }
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
      this.data['ref'] = this.data['roomcode'];
    }
    this.data['roomname'] = this.data['roomname'].trim(); // Remove Space in Begin & End of The String
    this.data['roomname_en'] = this.data['roomname_en'].trim(); // Remove Space in Begin & End of The String
    this.networkingService.save('Room.save', this.data)
      .subscribe((res) => {
        if (res['Success']) {
          this.toast.success(this.isEdit?this.configs['msg']['saveMsg']:this.configs['msg']['successMsg'], this.configs['msg']['successTitle']);
          this.injectObj.dialogRef.dismiss(true);
        } else {
          this.toast.error(res['Data'], "Lỗi");
        }
      });
  }
  onCancelClick(): void {
    this.injectObj.dialogRef.dismiss();
  }
  onSaveClick(): void {
    this.saveHandle();
  }
  ngAfterViewInit() {
    if(!this.isView) {
      this.initialCombo();
    }
  }
}
