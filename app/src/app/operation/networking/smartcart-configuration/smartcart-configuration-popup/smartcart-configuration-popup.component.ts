import { Component, OnInit, ViewChild, ViewContainerRef, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { BasicInject } from './../../../../components/modal/basic.inject';
import { OperationNetworkingService } from './../../operation-networking.service';
import { ToastService } from './../../../../shared/toast.service';

const TITLE = "Smartcart Configuration";
const ACTIVE = "Active";
const INACTIVE = "Inactive";

@Component({
  selector: 'app-smartcartconfiguration-popup',
  templateUrl: './smartcart-configuration-popup.component.html',
  styleUrls: ['./smartcart-configuration-popup.component.css']
})
export class SmartcartConfigurationPopupComponent implements OnInit {
  @ViewChild('container', { read: ViewContainerRef, static: true }) _vcr: ViewContainerRef;
  @ViewChild('theader', { static: true }) tableheader: ElementRef;
  isEdit: boolean = false;
  isView: boolean = false;
  data: any = {
    configurationcode: "",
    configuration: "",
    configdescription: "",
    configdescription_en: "",
    _length: "",
    width: "",
    height: "",
    numoflevel: "",
    naminglevel: "A",
    levelheight: "",

  };
  formValidator: any = null;
  formValid: boolean = false;
  purposeUsingControl = new FormControl();
  configurationControl = new FormControl();
  statusText: string = ACTIVE;
  isHideSubTableHeader: boolean = true;
  constructor(public injectObj: BasicInject, private networkingService: OperationNetworkingService,
    private toast: ToastService, private changeDetectorRefs: ChangeDetectorRef) {
    this.initialForm();
  }
  ngOnInit() {
    if (this.formValidator != null) {
      this.formValidator.Description.valueChanges.subscribe(val => {this.data['configdescription']=val;this.validate();}, null, null);
      this.formValidator.Numoflevel.valueChanges.subscribe(val => { this.data['numoflevel'] = val; this.validate(); }, null, null);
      this.formValidator.Naminglevel.valueChanges.subscribe(val => {this.data['naminglevel'] = val;this.validate();}, null, null);
      this.formValidator._Length.valueChanges.subscribe(val => { this.data['_length'] = val; this.validate(); }, null, null);
      this.formValidator.Width.valueChanges.subscribe(val => { this.data['width'] = val; this.validate(); }, null, null);
      this.formValidator.Height.valueChanges.subscribe(val => { this.data['height'] = val; this.validate(); }, null, null);
      this.formValidator.Levelheight.valueChanges.subscribe(val => { this.data['levelheight'] = val; this.validate(); }, null, null);
    } 
  }

  initialForm() {
    if (this.injectObj.data) {
      this.isEdit = this.injectObj.data['action'] === 'edit';
      this.isView = this.injectObj.data['action'] === 'view';
      this.data['configurationcode'] = this.injectObj.data['configurationcode'] || "";
      this.data['configuration'] = this.injectObj.data['configurationcode'] || "";
      this.data['configdescription'] = this.injectObj.data['configdescription'] || "";
      this.data['configdescription_en'] = this.injectObj.data['configdescription_en'] || "";
      this.data['status'] = this.injectObj.data['status'];
      this.data['_length'] = this.injectObj.data['_length'] || "";
      this.data['width'] = this.injectObj.data['width'] || "";
      this.data['height'] = this.injectObj.data['height'] || "";
      this.data['numoflevel'] = this.injectObj.data['numoflevel'] || 1;
      this.data['naminglevel'] = this.injectObj.data['naminglevel'] || "A";
      this.data['levelheight'] = this.injectObj.data['levelheight'] || "";
    }
    if (!this.isView) {
      this.formValidator = {
        Description: new FormControl(this.data.configdescription, [
          Validators.required
        ]),
        Numoflevel: new FormControl(this.data.numoflevel, [
          Validators.required
        ]),
        Naminglevel: new FormControl(this.data.naminglevel, [
          Validators.required
        ]),
        _Length: new FormControl(this.data._length, [
          Validators.required
        ]),
        Width: new FormControl(this.data.width, [
          Validators.required
        ]),
        Height: new FormControl(this.data.height, [
          Validators.required
        ]),
        Levelheight: new FormControl(this.data.levelheight, [
          Validators.required
        ])
      };
    }
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

  scroll(event){
    event.preventDefault();
  }

  saveHandle() {
    if (this.isEdit) {
      this.data['ref'] = this.data['configurationcode'];
    }
      
    this.networkingService.save('SmartcartConfiguration.save', this.data)
      .subscribe((res) => {
        if (res['Success']) {
          this.toast.success(`${this.isEdit ? "Cập nhật" : "Tạo mới"} ${TITLE} thành công`, "Thành Công");
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
  ngAfterViewInit() {}
}
