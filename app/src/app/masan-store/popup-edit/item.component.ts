import { Component, OnInit, ViewChild, Inject, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Service } from '../service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastService } from '../../shared/toast.service';
import { TranslateService } from '@ngx-translate/core';

interface dataPopup {
  StoreCode?: string;
  StoreSupraCode?: string;
  StoreName?: string;
  Type?: string;
  Status?: string;
  Name?: string;
  Phone?: Number;
  Hotline?: String;
  StaffName?:String;
  StaffPhone?: String;
  FullAddress?: string;
  Street?: string;
  Region?: string,
  Province?: string;
  District?: string;
  Ward?: string;
  OfWarehouse?: string;
  EnableSTO?: Number;
  Longitude?: Number;
  Latitude?: Number;
  Area?: string;
  CreatedBy?: string;
  LeadTime?: Number;
  Country? : String
  SortCode?: String,
  StorePriority?: String
}

@Component({
  selector: 'confirm-create-store',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class EditStoreComponent implements OnInit, AfterViewInit {
  @ViewChild('District', { static: false }) DistrictCombo: any;
  @ViewChild('Ward', { static: false }) WardCombo: any;
  @ViewChild('Province', { static: false }) ProvinceCombo: any;
  @ViewChild('Region', { static: false }) RegionCombo: any;
  @ViewChild('Country', { static: false }) CountryCombo: any;
  @ViewChild('Warehouse', { static: false }) WarehouseCombo: any;
  @ViewChild('Status', { static: false }) StatusCombo: any;
  @ViewChild('StoreType', { static: false }) StoreTypeCombo: any;

  StatusConfig: Object;
  RegionConfig: Object;
  StoreTypeConfig: Object;
  CountryConfig: Object;
  DistrictConfig: Object;
  WardConfig: Object;
  ProvinceConfig: Object;
  WarehouseConfig: Object;
  dataCreateStore: dataPopup = {};
  constructor(
    public dialogRef: MatDialogRef<EditStoreComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: Service,
    private toast: ToastService
  ) { }
  ngOnInit() {
    this.dataCreateStore['StoreCode'] = this.data.Code
    this.dataCreateStore['StoreName'] = this.data.Name
    this.dataCreateStore['ClientCode'] = this.data.ClientCode
    this.dataCreateStore['ContactName'] = this.data.ContactName
    this.dataCreateStore['ContactPhone'] = this.data.ContactPhone
    this.dataCreateStore['ReceivingStaffName'] = this.data.ReceivingStaffName
    this.dataCreateStore['ReceivingStaffPhone'] = this.data.ReceivingStaffPhone
    this.dataCreateStore['Hotline'] = this.data.Hotline
    this.dataCreateStore['Street'] = this.data.Street
    this.dataCreateStore['Ward'] = this.data.Ward
    this.dataCreateStore['District'] = this.data.District
    this.dataCreateStore['Province'] = this.data.Province
    this.dataCreateStore['Region'] = this.data.Region
    this.dataCreateStore['FullAddress'] = this.data.FullAddress
    this.dataCreateStore['Country'] = this.data.Country
    this.dataCreateStore['Long'] = this.data.Long
    this.dataCreateStore['Lat'] = this.data.Lat
    this.dataCreateStore['Type'] = this.data.Type
    this.dataCreateStore['Status'] = this.data.Status
    this.dataCreateStore['LeadTime'] = this.data.LeadTime
    this.dataCreateStore['SortCode'] = this.data.SortCode
    this.dataCreateStore['StorePriority'] = this.data.Priority;
    this.initData();
  }

  initData() {
    this.RegionConfig = {
      selectedFirst: false,
      isSelectedAll: false,
      defaultValue: this.data.Region,
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

    this.StatusConfig = {
      selectedFirst: false,
      isSelectedAll: false,
      defaultValue: this.data.Status,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Name'];
      },
      type: 'autocomplete',
      filter_key: 'Name',

      data: [
        { Code: 0, Name: 'INACTIVE' },
        { Code: 1, Name: 'ACTIVED' }
      ]
    };

    this.StoreTypeConfig = {
      selectedFirst: false,
      isSelectedAll: false,
      defaultValue: this.data.Type,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Name'];
      },
      type: 'autocomplete',
      filter_key: 'Name',
      data: [
        { Code: "WMP", Name: 'WMP' },
        { Code: "WMT", Name: 'WMT' }
      ]
    };

    this.CountryConfig = {
      selectedFirst: false,
      isSelectedAll: false,
      defaultValue: this.data.Country,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Name'];
      },
      type: 'autocomplete',
      filter_key: 'Name',
      data: [
        { Code: "Việt Nam", Name: 'Việt Nam' },
      ]
    };

    this.ProvinceConfig = {
      selectedFirst: false,
      isSelectedAll: false,
      defaultValue: this.data.Province,
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
    this.WardConfig = {
      selectedFirst: false,
      isSelectedAll: false,
      defaultValue: this.data.Ward,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Name'];
      },
      type: 'autocomplete',
      filter_key: 'Name',
      URL_CODE: 'SFT.wardscombo'
    };
    this.DistrictConfig = {
      selectedFirst: false,
      isSelectedAll: false,
      defaultValue: this.data.District,
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

  ngAfterViewInit() {
    this.initEvent();
  }

  initEvent() {
    this.RegionCombo['change'].subscribe({
      next: (data: any) => {
        if (data) {
          this.dataCreateStore.Region = data.Name;
        } else {
          this.dataCreateStore.Region = '';
        }
      }
    });
    this.ProvinceCombo['change'].subscribe({
      next: (data: any) => {
        if (data) {
          this.dataCreateStore.Province = data.Name;
        } else {
          this.dataCreateStore.Province = '';
        }
      }
    });
    this.DistrictCombo['change'].subscribe({
      next: (data: any) => {
        if (data) {
          this.dataCreateStore.District = data.Name;
        } else {
          this.dataCreateStore.District = '';
        }
      }
    });
    this.WardCombo['change'].subscribe({
      next: (data: any) => {
        if (data) {
          this.dataCreateStore.Ward = data.Name;
        } else {
          this.dataCreateStore.Ward = '';
        }
      }
    });
    // this.WarehouseCombo['change'].subscribe({
    //   next: (data: any) => {
    //     if (data) {
    //       this.dataCreateStore.OfWarehouse = data.Name ? data.Name.split(" ")[0] : '';
    //     } else {
    //       this.dataCreateStore.OfWarehouse = '';
    //     }
    //   }
    // });
    this.StoreTypeCombo['change'].subscribe({
      next: (data: any) => {
        if (data) {
          this.dataCreateStore.Type = data.Code;
        }
      }
    });
    this.StatusCombo['change'].subscribe({
      next: (data: any) => {
        if (data) {
          this.dataCreateStore.Status = data.Name || 'INACTIVE';
        } else {
          this.dataCreateStore.Status = 'INACTIVE';
        }
      }
    });

    this.CountryCombo['change'].subscribe({
      next: (data: any) => {
        console.log(data)
        if (data) {
          this.dataCreateStore.Country = data.Code;
        }
      }
    });
  }

  confirm(event: any) {
    this.checkFinish();
  }

  checkFinish() {
    const _info = window.localStorage.getItem('_info');
    if (_info) {
      const userInfo = JSON.parse(_info);
      // this.dataCreateStore.UpdatedBy = userInfo['Id'] || '';
    }
    this.service.editStore(
      this.dataCreateStore
    ).subscribe((resp: any) => {
      console.log(this.dataCreateStore)
      if (resp.Status === true) {
        this.toast.success('Cập nhật thành công', 'Success');
        this.dialogRef.close({ Status: true });
      } else {
        this.toast.error(resp.Data, 'error_title');
      }
    });
  }
  changedStoreCode(){
    this.dataCreateStore.StoreCode = this.dataCreateStore.StoreCode.replace(/\s/g, '');
  }
}
