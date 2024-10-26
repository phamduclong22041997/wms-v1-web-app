import { Component, OnInit, ViewChild, Inject, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Service } from '../service';
import { ToastService } from '../../shared/toast.service';
import { CreateAddressComponent } from '../create-address/item.component';

interface dataPopup {
  StoreCode?: string;
  StoreName?: string;
  Type?: string;
  Status?: string;
  Name?: string;
  Phone?: String;
  Hotline?: String;
  StaffName?: String;
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
  Country?: String;
  SortCode?: String
};


@Component({
  selector: 'confirm-create-store',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class CreateStoreComponent implements OnInit, AfterViewInit {
  @ViewChild('District', { static: false }) DistrictCombo: any;
  @ViewChild('Ward', { static: false }) WardCombo: any;
  @ViewChild('Province', { static: false }) ProvinceCombo: any;
  @ViewChild('Region', { static: false }) RegionCombo: any;
  @ViewChild('Country', { static: false }) CountryCombo: any;
  @ViewChild('Warehouse', { static: false }) WarehouseCombo: any;
  @ViewChild('Status', { static: false }) StatusCombo: any;
  @ViewChild('StoreType', { static: false }) StoreTypeCombo: any;

  District: any = [];
  Ward: any = [];
  Warehouse: any = [];
  RegionConfig: Object;
  StoreTypeConfig: Object;
  CountryConfig: Object;
  StatusConfig: Object;
  DistrictConfig: Object;
  WardConfig: Object;
  ProvinceConfig: Object;
  WarehouseConfig: Object;
  dataCreateStore: dataPopup = {};
  typeStore: String
  isCreated: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<CreateAddressComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: Service,
    public dialog: MatDialog,
    private toast: ToastService
  ) {
  }
  ngOnInit() {
    this.dataCreateStore.Phone = "0"
    this.dataCreateStore.StaffPhone = "0"
    this.initData();
  }

  // enterStoreName(event: any) {
  //   let textInput = event.target.value ? event.target.value : "";
  //   let vintype = textInput.substr(0, 3)
  //   this.dataCreateStore.Type = vintype == 'VM+' ? 'VMT' : vintype == 'VM ' ? 'VMP' : '';
  //   this.typeStore = vintype == 'VM+' ? 'VMP' : vintype == 'VM ' ? 'VMT' : '';
  // }

  initData() {
    this.dataCreateStore.Status = 'INACTIVE';
    this.dataCreateStore.EnableSTO = 1;

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

    this.StatusConfig = {
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
      // defaultValue: this.dataCreateStore.Status,
      data: [
        { Code: 0, Name: 'INACTIVE' },
        { Code: 1, Name: 'ACTIVED' }
      ]
    };

    this.StoreTypeConfig = {
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
      data: [
        { Code: "WMP", Name: 'WMP' },
        { Code: "WMT", Name: 'WMT' }
      ]
    };

    this.CountryConfig = {
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
      data: [
        { Code: "Việt Nam", Name: 'Việt Nam' },
      ]
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
    this.WardConfig = {
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
      URL_CODE: 'SFT.wardscombo'
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
    this.WarehouseConfig = {
      selectedFirst: false,
      isSelectedAll: false,
      val: (option: any) => {
        return option['SupraCode'];
      },
      render: (option: any) => {
        if (option['Name'] === 'Tất cả') {
          return option['Name'];
        }
        return `${option['Name']} - ${option['FullName']}`;
      },
      type: 'autocomplete',
      filter_key: 'Name',
      URL_CODE: 'SFT.warehouse_combo_by_region'
    };
  }

  ngAfterViewInit() {
    this.initEvent();
    this.changedStoreCode();
    this.changedPhone();


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
    if (!this.dataCreateStore.StoreCode) {
      this.toast.error('ImportStore.Msg_Error_Code', 'error_title');
      return;
    }
    if (this.dataCreateStore.StoreCode.length != 4) {
      this.toast.error('ImportStore.Msg_Error_LengthCode', 'error_title');
      return;
    }

    if (!this.dataCreateStore.StoreName) {
      this.toast.error('ImportStore.Msg_Error_StoreName', 'error_title');
      return;
    }
    if (!this.dataCreateStore.Name) {
      this.toast.error('ImportStore.Msg_Error_Name', 'error_title');
      return;
    }
    if (!this.dataCreateStore.Phone) {
      this.toast.error('ImportStore.Msg_Error_Phone', 'error_title');
      return;
    }
    if (!this.dataCreateStore.Province) {
      this.toast.error('ImportStore.Msg_Error_Province', 'error_title');
      return;
    }
    if (!this.dataCreateStore.District) {
      this.toast.error('ImportStore.Msg_Error_District', 'error_title');
      return;
    }
    if (!this.dataCreateStore.FullAddress) {
      this.toast.error('ImportStore.Msg_Error_FullAddress', 'error_title');
      return;
    }
    if (!this.dataCreateStore.Region) {
      this.toast.error('ImportStore.Msg_Error_Region', 'error_title');
      return;
    }
    if (!this.dataCreateStore.LeadTime) {
      this.toast.error('ImportStore.Msg_Error_LeadTime', 'error_title');
      return;
    }
    if (!this.dataCreateStore.Longitude) {
      this.toast.error('ImportStore.Msg_Error_Longitude', 'error_title');
      return;
    }
    if (!this.dataCreateStore.Latitude) {
      this.toast.error('ImportStore.Msg_Error_Latitude', 'error_title');
      return;
    }
    this.isCreated = true;
    this.checkFinish();
  }

  // changedStoreCode() {
  //   this.dataCreateStore.StoreCode = this.dataCreateStore.StoreCode.replace(/\D/g, '');
  //   if (this.dataCreateStore.StoreCode.slice(0, 2) != '00') {
  //     this.dataCreateStore.StoreCode = '00'
  //   }
  // }
  changedStoreCode(){
    this.dataCreateStore.StoreCode = this.dataCreateStore.StoreCode.replace(/\s/g, '');
  }

  changedPhone() {
    this.dataCreateStore.Phone = this.dataCreateStore.Phone.replace(/\D/g, '');
    if (this.dataCreateStore.Phone.slice(0, 1) != '0') {
      this.dataCreateStore.Phone = '0'
    }
    this.dataCreateStore.StaffPhone = this.dataCreateStore.StaffPhone.replace(/\D/g, '');
    if (this.dataCreateStore.StaffPhone.slice(0, 1) != '0') {
      this.dataCreateStore.StaffPhone = '0'
    }
  }


  checkFinish() {
    const _region = window.localStorage.getItem("region");
    const _info = window.localStorage.getItem('_info');
    if (_info) {
      const userInfo = JSON.parse(_info);
      this.dataCreateStore.CreatedBy = userInfo['Id'] || '';
    }
    if (_region) {
      const obj = JSON.parse(_region);
      this.dataCreateStore.Area = obj.Name || null
    }
    // if (this.dataCreateStore.StoreCode && this.dataCreateStore.StoreCode.trim()) {
    //   this.dataCreateStore.StoreCode = this.dataCreateStore.StoreCode.trim();
    // }
    this.service.createStore(
      this.dataCreateStore
    ).subscribe((resp: any) => {
      if (resp.Status == true) {
        if (resp.Data) {
          this.toast.success('Tạo cửa hàng thành công', 'Success');
          this.dialogRef.close({ Status: true });
        } else {
          this.isCreated = false;
          this.toast.error(`Mã Supra ${this.dataCreateStore.StoreCode} đã tồn tại`, 'error_title');
        }
      } else {
        this.isCreated = false;
        this.toast.error('Tạo không thành công vui lòng thử lại', 'error_title');
      }
    });
  }

  showPopupCreateAddress(event: any) {
    const dialogRef = this.dialog.open(CreateAddressComponent, {
      hasBackdrop: true,
      panelClass: 'app-dialog',
      data: event
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.Status && result.Type) {
        this.reloadCombo(result.Type)
      }
    });
  }

  reloadCombo(type: any) {
    switch (type) {
      case 'Provinces':
        this.ProvinceCombo.reload()
        break;
      case 'Districts':
        this.DistrictCombo.reload()
        break;
      case 'Wards':
        this.WardCombo.reload()
        break;
    }
  }

}
