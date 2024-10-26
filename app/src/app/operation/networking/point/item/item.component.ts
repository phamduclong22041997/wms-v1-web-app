import { Component, OnInit, ɵCodegenComponentFactoryResolver } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

import { BasicInject } from './../../../../components/modal/basic.inject';
import { OperationNetworkingService } from './../../operation-networking.service';
import { ToastService } from './../../../../shared/toast.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class PointItemComponent implements OnInit {
  configs = {
    info: 'Điền thông tin vào form bên dưới để hoàn thành việc tạo mới vị trí.',
    require: 'Là thông tin bắt buộc.',
    form: {
      pointcode: "Mã Vị Trí",
      room: "Phòng",
      floor: "Tầng",
      pointtype: "Loại Vị Trí",
      status: "Trạng Thái",
      coordinate: "Toạ Độ",
      xcoordinate: "Hoành Độ (m)",
      ycoordinate: "Tung Độ (m)",
      xcoordinatefull: "Toạ Độ: Hoành Độ (m)",
      ycoordinatefull: "Toạ Độ: Tung Độ (m)",
      save: "Lưu"
    },
    msg: {
      successMsg: "Tạo mới thành công.",
      successTitle: "Thành Công",
      saveMsg: "Cập nhật thành công.",
      errorTitle: "Lỗi",
      warningTitle: "Cảnh báo",
      requireField: "Xin vui lòng nhập đầy dủ các thông tin bắt buộc"
    }
  };

  msgValidator = {
    xCoordinate:{
      pattern: 'Hoành độ (m) phải lớn hơn 0 và tối đa 999'
    },
    yCoordinate:{
      pattern: 'Tung độ (m) phải lớn hơn 0 và tối đa 999'
    }
  };

  isEdit:boolean = false;
  isView:boolean = false;
  data: any = {
    isused: false,
    pointcode: "",
    room: null,
    floor: null,
    pointtype: null,
    xCoordinate: "",
    yCoordinate: "",
    status: true
  }

  formValidator:any =null;
  formValid:boolean = false;
  statusText:string = "Active";
  total:any=0;
  roomname: string = "";
  floorname: string = "";
  pointtypename: string = "";
  constructor(public injectObj: BasicInject, private networkingService: OperationNetworkingService, private toast: ToastService) {
    this.initialForm();
  }
  ngOnInit() {
    if(this.formValidator != null) {
      this.formValidator.xCoordinate.valueChanges.subscribe(val => {this.data['xcoordinate']=val;this.validate();}, null, null);
      this.formValidator.yCoordinate.valueChanges.subscribe(val => {this.data['ycoordinate']=val;this.validate();}, null, null);
    }
  }
  initialForm() {
    if(this.injectObj.data) {
      let _create = this.injectObj.data['action'] === 'create';
      if(_create) {
          let total = this.injectObj.data['total']||0;
          total = this.hashLastCode(this.injectObj.data.lastrecord);
          if(total < 10) {
            this.total = '00' + total;
          } else if(total > 10) {
            this.total = '0' + total;
          } else {
            this.total = total;
          }          
        }
      this.isEdit = this.injectObj.data['action'] === 'edit' || !this.injectObj.data['action'];
      this.isView = this.injectObj.data['action'] === 'view';
      if(!_create && (this.isEdit || this.isView)) {
        this.data['pointcode'] = this.injectObj.data['pointcode'] || "";
        this.data['room'] = this.injectObj.data['room'] || null;
        this.data['floor'] = this.injectObj.data['floor'] || null;
        this.data['pointtype'] = this.injectObj.data['pointtype'] || null;
        this.data['xcoordinate'] = this.injectObj.data['xcoordinate'] || "";
        this.data['ycoordinate'] = this.injectObj.data['ycoordinate'] || "";
        this.data['status'] = this.injectObj.data['status'] || false;
        this.data['isused'] = this.injectObj.data['isused'] || false;
        this.roomname = this.data['room']['roomname'];
        this.floorname = this.data['floor']['floorname'];
        this.pointtypename = this.data['pointtype']['propertyname'];
      }
    }
    if(!this.isView) {
      this.formValidator = {
        xCoordinate: new FormControl(this.data.xcoordinate, [
          Validators.pattern('^[0-9]{1,3}$'),
          Validators.required
        ]),
        yCoordinate: new FormControl(this.data.ycoordinate, [
          Validators.pattern('^[0-9]{1,3}$'),
          Validators.required
        ]),
      };
    }
  }
  hashLastCode(data){
    let code = 0;
    code = data && data.pointcode ? Number(data.pointcode.slice(-3)) : 0;
    return code + 1;
  }
  statusHandle(val) {
    this.statusText = val.checked === true?"Active":"Inactive";
    this.validate();
  }
  roomHandle(val) {
    if(val !== 'error') {
      this.data['room'] = val;
    }else {
      this.data['room'] = null;
    }
    this.validate();
    this.buildPointCode();
  }
  floorHandle(val) {
    if(val !== 'error') {
      this.data['floor'] = val;
    }else {
      this.data['floor'] = null;
    }
    this.validate();
    this.buildPointCode();
  }
  pointTypeHandle(val) {
    if(val !== 'error') {
      this.data['pointtype'] = val;
      this.pointtypename = this.data['pointtype']['propertyname'];
      this.data['pointcode'] = val['propertycode'];
    } else {
      this.data['pointtype'] = null;
      this.data['pointcode'] = null;
    }
    this.validate();
    this.buildPointCode();
  }
  buildPointCode() {
    let _text = "";
    if(this.data.pointtype && this.data.pointtype.propertycode) {
      _text += this.data.pointtype.propertycode + '_';
    }
    if(this.data.room) {
      _text += this.data.room['roomcode'] + '_';
    }
    if(this.data.floor) {
      _text +=  this.data.floor['floorcode'];
      _text += '_' + (this.total);
    }
    this.data['pointcode'] = _text;
  }
  enableButton() {
    return true;
  }
  validate() {
    let valid = true;
    for(let index in this.formValidator) {
      if(this.formValidator[index].errors !== null) {
        valid = false;
      }
    }
    if(this.data['room'] === null) {
      valid = false;
    }
    if(this.data['floor'] === null) {
      valid = false;
    }
    if(this.data['pointtype'] === null) {
      valid = false;
    }
    if(this.data.xcoordinate <= 0){
      valid = false;
    }
    if(this.data.ycoordinate <= 0){
      valid = false;
    }
    this.formValid = valid;
    return valid;
  }
  saveHandle() {
    if(this.isEdit) {
      this.data['ref'] = this.data['pointcode'];
    }

    this.networkingService.save('Point.save', this.data)
    .subscribe((res) => {
      if(res['Success']) {
        this.toast.success(this.isEdit?"Cập nhật vị trí thành công.":"Tạo mới vị trí thành công.", "Thành Công");
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
  handleKeydown(event){
    if(event.keyCode == 69 || event.key == '-') event.preventDefault();
  }

  inputValidator(fieldname) {
    if(this.formValidator[fieldname].errors !== null) {
      for (let i in this.formValidator[fieldname].errors) {
        if (this.msgValidator[fieldname] && this.msgValidator[fieldname][i])
          this.toast.warning(this.msgValidator[fieldname][i], this.configs['msg']['warningTitle']);        
      }
    }
  }
}
