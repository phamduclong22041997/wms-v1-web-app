import { Component, OnInit, ViewChild, ViewContainerRef, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { BasicInject } from './../../../../components/modal/basic.inject';
import { OperationNetworkingService } from './../../operation-networking.service';
import { ToastService } from './../../../../shared/toast.service';

const TITLE = "Smart cart";
const ACTIVE = "Active";
const INACTIVE = "Inactive";

@Component({
  selector: 'app-smartcart-popup',
  templateUrl: './smartcart-popup.component.html',
  styleUrls: ['./smartcart-popup.component.css']
})
export class SmartcartPopupComponent implements OnInit {
  @ViewChild('container', { read: ViewContainerRef, static: true }) _vcr: ViewContainerRef;
  @ViewChild('theader', { static: true }) tableheader: ElementRef;
  @ViewChild('transportTable', { static: false }) transportTable: ElementRef;
  @ViewChild('binListTable', { static: false }) binListTable: ElementRef;
  transportTableConfigs: any;
  binTableConfigs: any;
  isEdit: boolean = false;
  isView: boolean = false;
  data: any = {
    smartcartcode: "",
    ismapping: false,
    configinfo: {
      configuration: "",
      configdescription: "",
      configdescription_en: "",
      length: "",
      width: "",
      height: "",
      numoflevel: "",
      naminglevel: "",
      levelheight: ""
    },
    status: true,
    purposeusing: "",
    currentpoint: "",
    usagestatus: "Sẵn sàng",
    numofsmartcart: 1,
    bininfo: {
      numofbinperlevel: "",
      binlength: "",
      binwidth: "",
      binheight: "",
      productsize: "",
      binlist: ""
    },
    toteinfo: {
      totelist: ""
    }
  };
  formValidator: any = null;
  formValid: boolean = false;
  purposeUsingControl = new FormControl();
  configurationControl = new FormControl();
  statusText: string = ACTIVE;
  isHideSubTableHeader: boolean = true;

  validatorMsg: Object = {
    Numofbinperlevel: {
      min: 'Số lượng Bin trên 1 tầng cần tạo tối thiểu 1'
    },
    Binlength: {
      min: 'Chiều dài (m) cần tạo tối thiểu 0.1'
    },
    Binwidth: {
      min: 'Chiều rộng (m) cần tạo tối thiểu 0.1'
    },
    Binheight: {
      min: 'Chiều cao (m) cần tạo tối thiểu 0.1'
    }
  };

  constructor(public injectObj: BasicInject, private networkingService: OperationNetworkingService,
    private toast: ToastService, private changeDetectorRefs: ChangeDetectorRef) {
    this.initialForm();
  }
  ngOnInit() {
    this.transportTableConfigs = {
      columns: {
        displayedColumns: ['index', 'bincode', 'level', 'transportdevicecode'],
        options: [
          {
            title: "Mã bin",
            name: "bincode",
            style: ""
          },
          {
            title: "Tầng",
            name: "level",
            style: ""
          },
          {
            title: "Thiết bị vận chuyển",
            name: "transportdevicecode",
            style: ""
          }
        ]
      },
      data: {
        rows: []
      }
    };

    this.binTableConfigs = {
      columns: {
        displayedColumns: ['index', 'bincode', 'level'],
        options: [
          {
            title: "Mã bin",
            name: "bincode",
            style: ""
          },
          {
            title: "Tầng",
            name: "level",
            style: ""
          }
        ]
      },
      data: {
        rows: []
      }
    };

    if (this.formValidator != null) {
      //this.formValidator.SmartcartCode.valueChanges.subscribe(val => { this.data['smartcartcode'] = val.toUpperCase(); this.validate(); }, null, null);
      //this.formValidator.Configuration.valueChanges.subscribe(val => {this.data['configinfo']['configuration']=val;this.validate();}, null, null);
      //this.formValidator.PurposeUsing.valueChanges.subscribe(val => { this.data['purposeusing'] = val; this.validate(); }, null, null);
      this.formValidator.Status.valueChanges.subscribe(val => {this.data['status']=val;this.validate();}, null, null);
      this.formValidator.UsageStatus.valueChanges.subscribe(val => { this.data['usagestatus'] = val; this.validate(); }, null, null);
      //this.formValidator.CurrentPoint.valueChanges.subscribe(val => { this.data['currentpoint'] = val; this.validate(); }, null, null);
      this.formValidator.Numofbinperlevel.valueChanges.subscribe(val => {this.data['numofbinperlevel'] = val;this.validate();}, null, null);
      this.formValidator.Binlength.valueChanges.subscribe(val => { this.data['bininfo']['binlength'] = val; this.validate(); }, null, null);
      this.formValidator.Binwidth.valueChanges.subscribe(val => { this.data['bininfo']['binwidth'] = val; this.validate(); }, null, null);
      this.formValidator.Binheight.valueChanges.subscribe(val => { this.data['bininfo']['binheight'] = val; this.validate(); }, null, null);
      if(this.data.ismapping){
        this.formValidator.Numofbinperlevel.disable();
      } else {
        this.formValidator.Numofbinperlevel.enable();
      }
    } 
    
  }

  generateBinList(numOfBin){
    let namingLevel = this.data['configinfo']['naminglevel'].split(',');
    let tempArr = [];
    let _index = 1;
    for( let i = 0; i < namingLevel.length; i++){
      for(let j = 0; j < numOfBin; j++){
        let _row = {
          index: _index,
          bincode: this.data['smartcartcode'] + "_" + namingLevel[i] + "_" + _index, 
          level: namingLevel[i]
        }
        tempArr.push(_row);
        _index++;
      }    
    }
    this.binListTable['data']['rows'] = tempArr;
    return tempArr;    
  }

  initialForm() {
    if (this.injectObj.data) {
      this.isEdit = this.injectObj.data['action'] === 'edit';
      this.isView = this.injectObj.data['action'] === 'view';
      this.data['smartcartcode'] = this.injectObj.data['smartcartcode'] || "";
      this.data['ismapping'] = this.injectObj.data['ismapping'] || false;
      this.data['configinfo']['configuration'] = this.injectObj.data['configinfo']['configuration'] || "";
      this.data['configinfo']['configdescription'] = this.injectObj.data['configinfo']['configdescription'] || "";
      this.data['configinfo']['configdescription_en'] = this.injectObj.data['configinfo']['configdescription_en'] || "";
      this.data['status'] = this.injectObj.data['status'];
      this.data['configinfo']['length'] = this.injectObj.data['configinfo']['length'] || "";
      this.data['configinfo']['width'] = this.injectObj.data['configinfo']['width'] || "";
      this.data['configinfo']['height'] = this.injectObj.data['configinfo']['height'] || "";
      this.data['configinfo']['numoflevel'] = this.injectObj.data['configinfo']['numoflevel'] || 1;
      this.data['configinfo']['naminglevel'] = this.injectObj.data['configinfo']['naminglevel'] || "";
      this.data['configinfo']['levelheight'] = this.injectObj.data['configinfo']['levelheight'] || "";
      this.data['purposeusing'] = this.injectObj.data['purposeusing'] || "";
      this.data['currentpoint'] = this.injectObj.data['currentpoint'] || "";
      this.data['usagestatus'] = this.injectObj.data['usagestatus'] || "In Using";
      this.data['numofsmartcart'] = this.injectObj.data['numofsmartcart'] || 1;
      this.data['bininfo']['bincode'] = this.data['smartcartcode'] + "_" + this.data['configinfo']['numoflevel'] || "";
      this.data['bininfo']['numofbinperlevel'] = this.injectObj.data['bininfo']['numofbinperlevel'] || "";
      this.data['bininfo']['binlength'] = this.injectObj.data['bininfo']['binlength'] || "";
      this.data['bininfo']['binwidth'] = this.injectObj.data['bininfo']['binwidth'] || "";
      this.data['bininfo']['binheight'] = this.injectObj.data['bininfo']['binheight'] || "";
      this.data['bininfo']['productsize'] = this.injectObj.data['bininfo']['productsize'] || "";
      this.data['bininfo']['binlist'] = this.injectObj.data['bininfo']['binlist'] || "";
      this.data['toteinfo']['totelist'] = this.injectObj.data['toteinfo']['totelist'] || "";
      this.statusText = this.injectObj.data['status'] === true ? ACTIVE : INACTIVE;
    }
    if (!this.isView) {
      this.formValidator = {
        // SmartcartCode: new FormControl(this.data.smartcartcode, [
        //   Validators.required,
        //   Validators.maxLength(10),
        //   Validators.minLength(10),
        // ]),
        // Configuration: new FormControl(this.data.configinfo.configuration, [
        //   Validators.required
        // ]),
        // PurposeUsing: new FormControl(this.data.purposeusing, [
        //   Validators.required
        // ]),
        Status: new FormControl(this.data.status, [
          Validators.required
        ]),
        UsageStatus: new FormControl(this.data.usagestatus, [
          Validators.required
        ]),
        // CurrentPoint: new FormControl(this.data.currentpoint, [
        //   Validators.required
        // ]),
        Numofbinperlevel: new FormControl(this.data.bininfo.numofbinperlevel, [
          Validators.required,
          Validators.max(99),
          Validators.min(1),
          Validators.pattern('^[1-9][0-9]*$'),// match a number starting with any digit but zero
        ]),
        Binlength: new FormControl(this.data.bininfo.binlength, [
          Validators.required,
          Validators.min(0.1),
          Validators.max(99),
          Validators.pattern('[0-9]+(\.[0-9][0-9]?)?') // x.xx
        ]),
        Binwidth: new FormControl(this.data.bininfo.binwidth, [
          Validators.required,
          Validators.min(0.1),
          Validators.max(99),
          Validators.pattern('[0-9]+(\.[0-9][0-9]?)?') // x.xx
        ]),
        Binheight: new FormControl(this.data.bininfo.binheight, [
          Validators.required,
          Validators.min(0.1),
          Validators.max(99),
          Validators.pattern('[0-9]+(\.[0-9][0-9]?)?') // x.xx
        ])
      };
      if (this.isEdit) {
        //this.formValidator['SmartcartCode'].reset({ value: this.injectObj.data['smartcartcode'], disabled: true });
      }
    }
  }

  scroll(event){
    event.preventDefault();
  }

  handleKeydown(event, type){
    if(event.keyCode == 69 || event.keyCode == 189){
      event.preventDefault();
    }
    
    if(type && type == 'Numofbinperlevel' && event.keyCode == 190){
      event.preventDefault();
    }
  }

  statusHandle(val) {
    this.statusText = val.checked === true ? ACTIVE : INACTIVE;
    this.validate();
  }

  numOfBinHandle(val){
    this.data['bininfo']['numofbinperlevel'] = val;
    if(this.data['bininfo']['numofbinperlevel'] && this.data['smartcartcode'] && this.isEdit){
      this.data['bininfo']['binlist'] = this.generateBinList(this.data['bininfo']['numofbinperlevel']);
    }
  }

  configHandle(val) {
    if(!val.configurationcode) return;
    this.data['configinfo'] = {
      configuration: val.configurationcode,
      configdescription: val.configurationdescription,
      configdescription_en: val.configurationdescription_en,
      length: val.size.length,
      width: val.size.width,
      height: val.size.height,
      numoflevel: val.numoflevel,
      naminglevel: val.naminglevel,
      levelheight: val.size.levelheight
    }
    this.validate();
    if(this.data['bininfo']['numofbinperlevel'] && this.data['smartcartcode'] && this.isEdit){
      this.data['bininfo']['binlist'] = this.generateBinList(this.data['bininfo']['numofbinperlevel']);
    }
  }
  purposeHandle(val) { if(!val) return;
    this.data['purposeusing'] = val;
    this.validate();
  }
  productSizeHandle(val) {
    this.data['bininfo']['productsize'] = val;
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
      this.data['ref'] = this.data['smartcartcode'];
      this.data['bininfo']['binlist'] = this.generateBinList(this.data['bininfo']['numofbinperlevel']);
    }
      
    this.networkingService.save('Smartcart.save', this.data)
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
  ngAfterViewInit() {
    if(this.binListTable) {
      this.binListTable['data']['rows'] = this.data['bininfo']['binlist'];
      this.networkingService.get('Smartcart.getTransportDevices', {smartcartcode: this.data.smartcartcode})
        .subscribe((res) => {
          if (res['Success']) {
            this.transportTable['data']['rows'] = res.Data.rows;
          }
        });
    }   
  }

  inputValidator(fieldname) {
    if(this.formValidator[fieldname].errors !== null) {
      for (let i in this.formValidator[fieldname].errors) {
        if (this.validatorMsg[fieldname] && this.validatorMsg[fieldname][i])
          this.toast.warning(this.validatorMsg[fieldname][i], "Cảnh báo");
      }
    }
  }
}
