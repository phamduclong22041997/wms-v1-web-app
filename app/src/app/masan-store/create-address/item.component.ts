import { Component, OnInit, ViewChild, Inject, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Service } from '../service';
import { ToastService } from '../../shared/toast.service';

@Component({
  selector: 'create-address',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class CreateAddressComponent implements OnInit, AfterViewInit {

  @ViewChild('Region', { static: false }) RegionCombo: any;
  @ViewChild('Province', { static: false }) ProvinceCombo: any;
  @ViewChild('District', { static: false }) DistrictCombo: any;
  Region: String
  Province: String
  District: String
  type: String
  text: String
  textCombo: String
  RegionConfig: Object
  ProvinceConfig: Object
  WardConfig: Object
  DistrictConfig: Object
  inputValue: String
  isRegionHidden: boolean
  isProvinceHidden: boolean
  isDistrictHidden: boolean
  constructor(
    public dialogRef2: MatDialogRef<CreateAddressComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: Service,
    private toast: ToastService
  ) {

  }

  ngOnInit() {
    this.type = this.data
    this.initData()
    this.hidden()
    this.convertName()
  }
  initData() {
    this.RegionConfig = {
      selectedFirst: true,
      isSelectedAll: false,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Name'];
      },
      type: 'autocomplete',
      filter_key: 'Name',
      URL_CODE: 'SFT.regioncombo'
    };
    this.ProvinceConfig = {
      selectedFirst: false,
      isSelectedAll: false,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Name'];
      },
      type: 'autocomplete',
      filter_key: 'Name',
      URL_CODE: 'SFT.provincescombo'
    };
    this.DistrictConfig = {
      selectedFirst: false,
      isSelectedAll: false,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Name'];
      },
      type: 'autocomplete',
      filter_key: 'Name',
      URL_CODE: 'SFT.districtscombo'
    };
  }
  hidden() {
    if (this.type === 'Provinces') {
      this.isProvinceHidden = true
      this.isDistrictHidden = true

    } else if (this.type === 'Districts') {
      this.isRegionHidden = true
      this.isDistrictHidden = true
    } else {
      this.isRegionHidden = true
      this.isProvinceHidden = true
    }
  }
  convertName() {
    this.text = this.type === 'Provinces' ? 'Tỉnh/Thành Phố' : this.type === 'Districts' ? 'Quận/Huyện' : 'Phường/Xã'
    this.textCombo = this.type === 'Provinces' ? 'Khu Vực' : this.type === 'Districts' ? 'Tỉnh/Thành Phố' : 'Quận/Huyện'
  }

  ngAfterViewInit() {
    this.initEvent();
  }

  initEvent() {
    this.RegionCombo['change'].subscribe({
      next: (data: any) => {
        if (data) {
          this.Region = data.Name;
        } else {
          this.Region = '';
        }
      }
    });
    this.ProvinceCombo['change'].subscribe({
      next: (data: any) => {
        console.log(data.name)
        if (data) {
          this.Province = data.Name;
        } else {
          this.Province = '';
        }
      }
    });
    this.DistrictCombo['change'].subscribe({
      next: (data: any) => {
        if (data) {
          this.District = data.Name;
        } else {
          this.District = '';
        }
      }
    });
  }

  confirm(event: any) {
    if (!this.inputValue) {
      this.toast.error('Vui lòng không để trống', 'error_title');
      return;
    }
    this.checkFinish()
  }

  checkFinish() {
    this.service.createAddress(
      {
        Name: this.inputValue,
        Type: this.type,
        Region: this.type == "Provinces" ? this.Region : '',
        Province: this.type == "Districts" ? this.Province : '',
        District: this.type == "Wards" ? this.District : ''
      }
    ).subscribe((resp: any) => {
      if (resp.Status == true) {
        this.toast.success(`Thêm ${this.text}: ${this.inputValue} thành công`, 'Success');
        this.dialogRef2.close({ Status: true, Type: this.type });
      } else {
        this.toast.error(resp.Data, 'error_title');
      }
    });
  }
}
