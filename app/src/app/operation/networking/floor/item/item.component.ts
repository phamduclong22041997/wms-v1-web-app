import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { BasicInject } from '../../../../components/modal/basic.inject';
import { OperationNetworkingService } from '../../operation-networking.service';
import { ToastService } from '../../../../shared/toast.service';

@Component({
  selector: 'app-floor-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class FloorItemComponent implements OnInit {
  @ViewChild('roomCombo', { static: false }) roomCombo: ElementRef;
  configs = {
    info: 'Điền thông tin vào form bên dưới để hoàn thành việc tạo mới tầng.',
    require: 'Là thông tin bắt buộc.',
    form: {
      floorcode: "Mã Tầng",
      floorname: "Tên Tầng",
      floorname_en: "Tên Tầng (English)",
      room: "Phòng",
      flooracreage: "Diện Tích Sàn (m2)",
      floorheight: "Chiều cao tầng tính từ mặt đất (m)",
      status: "Trạng Thái",
      save: "Lưu"
    },
    msg: {
      successTitle: "Thành Công",
      successMsg: "Tạo mới tầng thành công.",
      saveMsg: "Cập nhật thành công.",
      errorTitle: "Lỗi",
      warningTitle: "Cảnh báo",
      requireField: "Xin vui lòng nhập đầy dủ các thông tin bắt buộc"
    }
  }
  validatorMsg: Object = {
    FloorCode: {
      minlength: 'Mã Tầng phải đúng 2 kí tự',
      pattern: 'Mã Tầng phải là ký tự số [0-9] hoặc alphabet [a-zA-Z]'
    },
    FloorName: {
      pattern: 'Tên Vùng không được bỏ trống'
      //pattern: 'Tên Vùng không được có kí tự đặc biệt # $% & * + - / \ = ^ _ `{|} ~! (): <> @ [] " , .'
    },
    Acreage: {
      min: 'Diện tích sàn (m2) cần tạo tối thiểu 1 m2',
      max: 'Diện tích sàn (m2) tối đa 100000 m2'
    },
    Height: {
      min: 'Chiều cao tầng cần tạo tối thiểu 1 m',
      max: 'Chiều cao tầng tính từ mặt đất tối đa 500 m'
    }
  }

  roomConfig: Object = {
    type: 'combo',
    filter_key: "roomname",
    val: (option:any) => {
      return option['roomname'];
    },
    URL_CODE: "NetworkingCombo.roomcombo"
  }

  isEdit: boolean = false;
  isView: boolean = false;
  data: any = {
    floorcode: "",
    floorname: "",
    floorname_en: "",
    room: {
      "roomcode" : "",
      "roomname" : "",
      "roomname_en" : "",
      "roomtype" : ""
    },
    flooracreage: "",
    floorheight: "",
    status: true
  }
  formValidator: any = null;
  formValid: boolean = false;
  statusText: string = "Active";
  constructor(public injectObj: BasicInject, private networkingService: OperationNetworkingService, private toast: ToastService) {
    this.initialForm();
  }
  floorNumber(val) {
    return Math.floor(val * 100) / 100;
  }
  ngOnInit() {
    if (this.formValidator != null) {
      this.formValidator.FloorCode.valueChanges.subscribe(val => { this.data['floorcode'] = val.toUpperCase(); this.validate(); }, null, null);
      this.formValidator.FloorName.valueChanges.subscribe(val => { this.data['floorname'] = val; this.validate(); }, null, null);
      this.formValidator.Acreage.valueChanges.subscribe(val => { this.data['flooracreage'] = this.floorNumber(val); this.validate(); }, null, null);
      this.formValidator.Height.valueChanges.subscribe(val => { this.data['floorheight'] = this.floorNumber(val); this.validate(); }, null, null);
    }
  }
  initialForm() {
    if (this.injectObj.data) {
      this.isEdit = this.injectObj.data['action'] === 'edit';
      this.isView = this.injectObj.data['action'] === 'view';
      this.data['floorcode'] = this.injectObj.data['floorcode'] || "";
      this.data['floorname'] = this.injectObj.data['floorname'] || "";
      this.data['floorname_en'] = this.injectObj.data['floorname_en'] || "";
      this.data['room'] = this.injectObj.data['room'] || "";
      this.data['flooracreage'] = this.injectObj.data['flooracreage'] || "";
      this.data['floorheight'] = this.injectObj.data['floorheight'] || "";
      this.data['status'] = this.injectObj.data['status'] || false;
      this.statusText = this.injectObj.data['status'] === true ? "Active" : "Inactive";
    }
    if (!this.isView) {
      this.formValidator = {
        FloorCode: new FormControl(this.data.floorcode, [
          Validators.required,
          Validators.maxLength(2),
          Validators.minLength(2),
          Validators.pattern('^[a-zA-Z0-9]{2}$')
        ]),
        FloorName: new FormControl(this.data.floorname, [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(/^(?!\s*$).+/)
        ]),
        Room: new FormControl(this.data['room'][this.roomConfig['filter_key']], [
          Validators.required
        ]),
        Acreage: new FormControl(this.data.flooracreage, [
          Validators.required,
          Validators.max(100000),
          Validators.min(1)
        ]),
        Height: new FormControl(this.data.floorheight, [
          Validators.required,
          Validators.max(500),
          Validators.min(1)
        ])
      };
      if (this.isEdit) {
        this.formValidator['FloorCode'].reset({ value: this.injectObj.data['floorcode'], disabled: true });
      }
    }
  }
  onChange(event) {
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
    this.roomCombo['change'].subscribe((data:any) =>{
      if(data !== 'error') {
        this.data['room'] = data;
        this.formValidator['Room'].reset({ value: this.data['room'], disabled: false });
      } else {
        this.data['room'][this.roomConfig['filter_key']] = "";
      }
      this.validate();
    })
  }
  statusHandle(val) {
    this.statusText = val.checked === true ? "Active" : "Inactive";
    this.validate();
  }
  enableButton() {
    return true;
  }
  validate() {
    let valid = true;
    if (this.data['room'][this.roomConfig['filter_key']] == ""){
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
      this.data['ref'] = this.data['floorcode'];
    }
    this.data['floorname'] = this.data['floorname'].trim(); // Remove Space in Begin & End of The String
    this.data['floorname_en'] = this.data['floorname_en'].trim(); // Remove Space in Begin & End of The String
    this.networkingService.save('Floor.save', this.data)
      .subscribe((res) => {
        if (res['Success']) {
          this.toast.success(this.isEdit?this.configs['msg']['saveMsg']:this.configs['msg']['successMsg'], this.configs['msg']['successTitle']);
          this.injectObj.dialogRef.dismiss(true);
        } else {
          this.toast.error(res['Data'], "Error");
        }
      });
  }
  optionSelected(selectedVal) {
    if (selectedVal) {
      if (selectedVal.value)
        this.data['room'] = selectedVal.value;
      if (selectedVal.option && selectedVal.option.value)
        this.data['room'] = selectedVal.option.value;
    }
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
