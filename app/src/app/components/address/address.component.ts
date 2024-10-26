import { Component, OnInit, ViewChild, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {
  //View child for combox
  @ViewChild('countryCombo', { static: false }) countryCombo: any;
  @ViewChild('provinceCombo', { static: false }) provinceCombo: any;
  @ViewChild('cityCombo', { static: false }) cityCombo: any;
  @ViewChild('districtCombo', { static: false }) districtCombo: any;
  @ViewChild('wardCombo', { static: false }) wardCombo: any;
  @ViewChild('form', { static: false }) _form: any;
  @ViewChild('statusInput', {static: false}) statusInput: any;
  @Input() deafaultdata: any;
  @Input() readonly: any;

  change:EventEmitter<any> = new EventEmitter<any>();
  countryConfig: Object = {
    filter_key: "countryname",
    val: (option) => {
      return option['countrycode'] + "-" + option['countryname'];
    },
    URL_CODE: "AddressCombo.countrycombo"
  }

  provinceConfig: Object = {
    filter_key: "provincename",
    val: (option) => {
      return option['provincename']
    },
    URL_CODE: "AddressCombo.provincecombo",
    disableAutoload: true
  }

  cityConfig: Object = {
    filter_key: "cityname",
    val: (option) => {
      return option['cityname']
    },
    URL_CODE: "AddressCombo.citycombo",
    disableAutoload: true
  }

  wardConfig: Object = {
    filter_key: "wardname",
    val: (option) => {
      return option['wardname']
    },
    URL_CODE: "AddressCombo.wardcombo",
    disableAutoload: true
  }

  districtConfig: Object = {
    filter_key: "districtname",
    val: (option) => {
      return option['districtname']
    },
    URL_CODE: "AddressCombo.districtcombo",
    disableAutoload: true
  }

  configs: Object = {
    form: {
      zipcode: "Zipcode",
      warehousename: "Tên Kho",
      warehousename_en: "Tên Kho (English)",
      telephone: "Điện Thoại",
      fax: "Fax",
      country: "Quốc Gia",
      region: "Vùng",
      status: "Trạng Thái",
      province: "Tỉnh",
      address1: "Địa Chỉ 1",
      address2: "Địa Chỉ 2",
      ward: "Phường/Xã",
      district: "Quận/Huyện",
      warehousetype: "Loại Kho",
      city: "Thành Phố",
    }
  }

  data: any = {
    address: {
      country: null,
      region: null,
      province: null,
      address1: "",
      address2: "",
      ward: null,
      district: null,
      zipcode: "",
      telephone: "",
      fax: ""
    }
  }

  isEdit: boolean = false;
  isView: boolean = false;
  isCreate: boolean = false;
  formValidator: any = null;
  formValid: boolean = false;
  warehousefunction: String = "";
  warehousetype: String = "";
  wardname: String = "";
  districtname: String = "";
  cityname: String = "";
  provincename: String = "";
  regionname: String = "";
  countryname: String = "";
  status: Boolean = true;

  constructor() {
    this.initialForm();
  }
  ngOnInit() {
    if(this['deafaultdata'] !== undefined) {
      this.data.address = this.deafaultdata;
      let _address = this.data.address;
      if (_address && _address.country && _address.country.countryname) 
        this.countryname = _address.country.countryname;
      if (_address && _address.ward && _address.ward.wardname) 
        this.wardname = this.data.address.ward.wardname;
      if (_address && _address.district && _address.district.districtname) 
        this.districtname = this.data.address.district.districtname;
      if (_address && _address.city && _address.city.cityname) 
        this.cityname = this.data.address.city.cityname;
      if (_address && _address.province && _address.province.provincename) 
        this.provincename = this.data.address.province.provincename;
      if (_address && _address.region && _address.region.regionname) 
        this.regionname = this.data.address.region.regionname;
    }
    this.isView = this.readonly;
  }

  initialForm() {
  }

  initialCombo() {
    this.countryCombo['change'].subscribe({
      next: (data: any) => {
        //Load region data
        if (data !== 'error') {
          this.data['address']['country'] = data;
          if(data !== null && data !== "") {
            this.provinceCombo['reload']({ country: data.countrycode });
            this.provinceCombo['clear'](true, true); 
          } else { 
            this.provinceCombo['clear'](true, true); 
            this.cityCombo['clear'](true, true); 
            this.districtCombo['clear'](true, true); 
            this.wardCombo['clear'](true, true);
          }
        }
        this.change.next(this.data);
        this.validate();
      }
    });

    this.provinceCombo['change'].subscribe({
      next: (data: any) => {
        //Load city data
        if (data !== 'error') {
          this.data['address']['province'] = data;
          if(data !== null && data !== "") {
            let filters = {};
            if(this.data['address']['country']) {
              filters['country'] = this.data['address']['country']['countrycode'];
            }
            if(this.data['address']['region']) {
              filters['region'] = this.data['address']['region']['regioncode'];
            }
            filters['province'] = data['provincecode'];
            
            this.cityCombo['reload'](filters);

            //Load Quan/Huyen
            this.districtCombo['reload'](filters);

            // this.cityCombo['clear'](false, false); 
            // this.districtCombo['clear'](false, false);
          } else {
            this.cityCombo['clear'](true, true); 
            this.districtCombo['clear'](true, true); 
            this.wardCombo['clear'](true, true);
          }
        }
        this.change.next(this.data);
        this.validate();
      }
    });

    this.cityCombo['change'].subscribe({
      next: (data: any) => {
        if (data !== 'error') {
          this.data['address']['city'] = data;

          let filters = {};
            if(this.data['address']['country']) {
              filters['country'] = this.data['address']['country']['countrycode'];
            }
            if(this.data['address']['region']) {
              filters['region'] = this.data['address']['region']['regioncode'];
            }
            if(this.data['address']['province']) {
              filters['province'] = this.data['address']['province']['provincecode'];
            }

          if(data !== null && data !== "") {
            if(this.data['address']['city']) {
              filters['city'] = this.data['address']['city']['citycode'];
            }

            //Disable Tinh
            if (data.istw) {
              this.provinceCombo['disabledInput'](true);
            } else {
              this.wardCombo['reload'](filters); 
            }
            //Load Quan/Huyen
            this.districtCombo['reload'](filters);
          } else {
            //Load Quan/Huyen

            if(data === "") {
              this.districtCombo['reload'](filters);
            } else {

            }
          }
        }
        this.change.next(this.data);
        this.validate();
      }
    });

    this.districtCombo['change'].subscribe({
      next: (data: any) => {
        if (data !== 'error') {
          this.data['address']['district'] = data;

          if(data !== null && data !== "") {
            let filters = {};
            if(this.data['address']['country']) {
              filters['country'] = this.data['address']['country']['countrycode'];
            }
            if(this.data['address']['region']) {
              filters['region'] = this.data['address']['region']['regioncode'];
            }
            if(this.data['address']['province']) {
              filters['province'] = this.data['address']['province']['provincecode'];
            }
            if(this.data['address']['city']) {
              filters['city'] = this.data['address']['city']['citycode'];
            }
            if(this.data['address']['district']) {
              filters['district'] = this.data['address']['district']['districtcode'];
            }

            //Load Phuong/Xa
            this.wardCombo['reload'](filters);
            this.wardCombo['clear'](false, false);
          } else {
            this.wardCombo['clear'](true, true); 
          }
        }
        this.change.next(this.data);
        this.validate();
      }
    });

    this.wardCombo['change'].subscribe({
      next: (data: any) => {
        if (data !== 'error') {
          this.data['address']['ward'] = data;
        }
        this.change.next(this.data);
        this.validate();
      }
    });

    if(this.isEdit) {
      let filters = {};
      filters['country'] = this.data['address']['country']['countrycode'];

      //Load province
      filters['region'] = this.data['address']['region']['regioncode'];
      this.provinceCombo['reload'](filters);

      //Load City
      filters['province'] = this.data['address']['province']['provincecode'];
      this.cityCombo['reload'](filters);

      //Load District
      if(this.data['address']['city']) {
        filters['city'] = this.data['address']['city']['citycode'];
      }
      this.districtCombo['reload'](filters);

      if(this.data['address']['district']) {
        filters['district'] = this.data['address']['district']['districtcode'];
        this.wardCombo['reload'](filters);
      }
    }

  }
  validate() {
    let valid = true;
    for (let index in this.formValidator) {
      if (this.formValidator[index].errors !== null) {
        valid = false;
      }
    }

    if(!this.data['warehousetype']) {
      valid = false;
    }

    if(this.data['address']) {
      if(!this.data['address']['country']) {
        valid = false;
      }

      if(!this.data['address']['region']) {
        valid = false;
      }

      if(!this.data['address']['province']) {
        valid = false;
      }

      if(!this.data['address']['address1']) {
        valid = false;
      }
    }

    this.formValid = valid;
    return valid;
  }
  onChange(event) {
    this.change.next(this.data);
  }
  ngAfterViewInit() {
    this.initialCombo();
  }
}
