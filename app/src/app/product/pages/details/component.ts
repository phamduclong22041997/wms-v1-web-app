/*
 * @copyright
 * Copyright (c) 2022 OVTeam
 *
 * All Rights Reserved
 *
 * Licensed under the MIT License;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://choosealicense.com/licenses/mit/
 *
 */

import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Service } from '../../service';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../shared/toast.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationComponent } from '../../../components/notification/notification.component';
import { ConfirmTotalPrintComponent } from '../confirm-print/component';
import { PrintService } from '../../../shared/printService';
import { Utils } from '../../../shared/utils';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { STATUS_COLOR } from '../../../shared/constant';

interface TableAction {
  icon: string;
  toolTip?: any;
  actionName?: any;
  name: string,
  class: string,
  disabledCondition?: any;
}

@Component({
  selector: 'app-po-details',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class ProductDetailComponent implements OnInit, AfterViewInit {
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('productStatus', { static: false }) statusCombo: any;
  @ViewChild('expirydateCombo', { static: false }) expirydateCombo: any;
  @ViewChild('inventorymethodCombo', { static: false }) inventorymethodCombo: any;
  @ViewChild('producttype', { static: false }) producttype: any;
  @ViewChild('effectiveDate', { static: false }) effectiveDate: any;
  @ViewChild('vendorCombo', { static: false }) vendorCombo: any;
  @ViewChild('unitTable', { static: false }) unitTable: ElementRef;
  @ViewChild('barcodeTable', { static: false }) barcodeTable: ElementRef;
  @ViewChild('combounit', { static: false }) combounit: any;
  @ViewChild('unitUom', { static: false }) unitUom: ElementRef;
  @ViewChild('unitnumerator', { static: false }) unitnumerator: ElementRef;
  @ViewChild('unitDenominator', { static: false }) unitDenominator: ElementRef;
  @ViewChild('productUnitTrackingTable', { static: false }) productUnitTrackingTable: ElementRef;

  @ViewChild('barcodetype', { static: false }) barcodetype: any;
  @ViewChild('barcodeunit', { static: false }) barcodeunit: any;
  @ViewChild('storagetype', { static: false }) storagetype: any;

  tableConfig: any;
  WarehouseConfig: Object;
  statusConfig: Object;
  productTypeConfig: Object;
  storageConditionConfig: Object;
  storageTypeConfig: Object;
  expiryConfig: object;
  inventoryMethodConfig: Object;
  vendorConfig: Object;
  barcodeTypeConfig: Object;
  barcodeUnitConfig: Object;
  comboUnitConfig: Object;
  productUnitTrackingConfig: Object;

  unitConfig: Object;
  unitData: any[];
  barcodeConfig: Object;
  barcodeData: any[];
  vendorData: any[];
  productUnitTrackingData: any[];
  sku: string;
  client: string;
  dcSite: string;
  productsDataSource: any;
  tabIndexActive: string;

  data: any = {
    Brand: "",
    ClientCode: "",
    ClientName: "",
    DCSite: "",
    CreatedBy: "",
    CreatedDate: "",
    EffectiveDate: "",
    ExpirationAlertInterval: "",
    ExpirationType: "",
    InboundInterval: "",
    IsActived: "",
    Manufacturer: "",
    Name: "",
    Origin: "",
    OutboundInterval: "",
    ProductType: "",
    SKU: "",
    Desc: "",
    SelfLife: "",
    Status: "",
    StockManagementType: "",
    StorageCondition: "",
    StorageType: "",
    Uom: "",
    UpdatedBy: "",
    UpdatedDate: "",
    VendorId: "",
    VendorName: "",
    PCB: "",
    MHU: "",
    BUSettings: {}
  }

  barcodeEntity: any = {
    SKU: "",
    Barcode: "",
    Uom: "",
    UomName: "",
    Type: "",
    Width: "",
    Height: "",
    Length: "",
    Volume: "",
    GrossWeight: "",
    Capacity: "",
    IsEdit: false
  };

  currentUnit: any = {}
  unitEntity: any = {
    Uom: '',
    UomName: '',
    Denominator: 1,
    Numerator: 1,
    IsAllowOutbound: 1,
    IsAllowStorage: 1,
    IsAllowInbound: 1,
    IsCreate: true,
    ConversionFactor: 1
  }

  vendorEntity: any = {
    VendorId: '',
    VendorName: '',
    OrderUnit: '',
    LeadTimePO: 7,
    VSR: ''
  }

  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private toast: ToastService,
    private service: Service,
    public dialog: MatDialog,
    private printService: PrintService) {
    this.sku = this.route.snapshot.params.sku;
    this.client = this.route.snapshot.params.client;
    this.dcSite = this.route.snapshot.params.dc;

    const fragment: string = route.snapshot.fragment;
    switch (fragment) {
      case "product-vendor":
        this.tabIndexActive = "3";
        break;
      case "product-barcode":
        this.tabIndexActive = "2";
        break;
      case "product-unit":
        this.tabIndexActive = "1";
        break;
      default:
        this.tabIndexActive = "0";
        break;
    }
  }

  ngOnInit() {
    this.unitData = [];
    this.barcodeData = [];
    this.vendorData = [];
    this.productUnitTrackingData = [];

    this.initData();
    this.initTable();
  }
  ngAfterViewInit() {
    this.initialCombo();
    this.initEvent();
    this.loadData();
  }

  initEvent() {
    this.barcodeTable['actionEvent'].subscribe({
      next: (event: any) => {
        if (!event) {
          return;
        }
        const action = event["action"];
        switch (action) {
          // case 'edit-barcode':
          //   this.setDataBarcode(event.data);
          //   break;
          case 'remove-barcode':
            this.confirmRemoveBarcode(event.data);
            break;
          case 'print-barcode':
            this.printProductBarcode(event.data);
            break;
        }
      }
    });

    this.barcodeunit['change'].subscribe({
      next: (value: any) => {
        this.barcodeEntity['Uom'] = value ? value.Code : '';
        this.barcodeEntity['UomName'] = value ? value.Name : '';
        this.barcodeEntity['Numerator'] = value ? value.Numerator : '';
        this.barcodeEntity['Denominator'] = value ? value.Denominator : '';
      }
    });

    this.barcodetype['change'].subscribe({
      next: (value: any) => {
        this.barcodeEntity['Type'] = value ? value.Code : '';
      }
    });

    this.unitTable['actionEvent'].subscribe({
      next: (event: any) => {
        if (!event) {
          return;
        }
        const action = event['action'];
        switch (action) {
          case 'edit-unit':
            let ed = event.data;
            this.currentUnit = ed;
            this.unitEntity = {
              Uom: ed.Uom,
              UomName: ed.UomName,
              Denominator: ed.Denominator,
              Numerator: ed.Numerator,
              ConversionFactor: Utils.formatNumber(ed.ConversionFactor, 3),
              IsAllowOutbound: ed.IsAllowOutbound,
              IsAllowStorage: ed.IsAllowStorage,
              IsAllowInbound: ed.IsAllowInbound,
              IsCreate: false
            };
            this.combounit.setValue(this.unitEntity.Uom);
            this.combounit.disabledInput(!this.unitEntity.IsCreate, `${this.unitEntity.Uom} - ${this.unitEntity.UomName}`);
            break;

          case 'remove-unit':
            this.conformRemoveUnit(event.data);
            break;
        }
      }
    });
  }

  initData() {
    this.statusConfig = {
      selectedFirst: true,
      isSelectedAll: false,
      filters: {
        Collection: 'INV.Product',
        Column: 'Status'
      },
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Description'];
      },
      type: 'autocomplete',
      filter_key: 'Description',
      URL_CODE: 'SFT.enum'
    };
    this.productTypeConfig = {
      selectedFirst: true,
      isSelectedAll: false,
      filters: {
        Collection: 'INV.Product',
        Column: 'Type'
      },
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Description'];
      },
      type: 'autocomplete',
      filter_key: 'Description',
      URL_CODE: 'SFT.enum'
    };
    this.storageTypeConfig = {
      selectedFirst: true,
      isSelectedAll: false,
      filters: {
        Collection: 'INV.Product',
        Column: 'StorageType'
      },
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Description'];
      },
      type: 'autocomplete',
      filter_key: 'Description',
      URL_CODE: 'SFT.enum'
    };
    this.storageConditionConfig = {
      selectedFirst: true,
      isSelectedAll: false,
      filters: {
        Collection: 'INV.Product',
        Column: 'StorageCondition'
      },
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Description'];
      },
      type: 'autocomplete',
      filter_key: 'Description',
      URL_CODE: 'SFT.enum'
    };
    this.expiryConfig = {
      selectedFirst: true,
      isSelectedAll: false,
      readonly: true,
      filters: {
        Collection: 'INV.Product',
        Column: 'Experation'
      },
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Description'];
      },
      type: 'autocomplete',
      filter_key: 'Description',
      URL_CODE: 'SFT.enum'
    };
    this.inventoryMethodConfig = {
      selectedFirst: true,
      isSelectedAll: false,
      filters: {
        Collection: 'INV.Product',
        Column: 'Method'
      },
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Description'];
      },
      type: 'autocomplete',
      filter_key: 'Description',
      URL_CODE: 'SFT.enum'
    };

    // this.vendorConfig = {
    //   selectedFirst: false,
    //   isSelectedAll: false,
    //   val: (option: any) => {
    //     return option['Code'];
    //   },
    //   render: (option: any) => {
    //     return option['Code'] + ' - ' + option['Name'];
    //   },
    //   type: 'autocomplete',
    //   filter_key: 'Code',
    //   URL_CODE: 'SFT.vendorcombo'
    // };

    this.barcodeTypeConfig = {
      selectedFirst: true,
      isSelectedAll: false,
      filters: {
        Collection: 'INV.ProductBarcode',
        Column: 'Type'
      },
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Description'];
      },
      type: 'autocomplete',
      filter_key: 'Description',
      URL_CODE: 'SFT.enum'
    };
    this.barcodeUnitConfig = {
      selectedFirst: false,
      isSelectedAll: false,
      filters: {
        SKU: this.sku,
        ClientCode: this.client,
        WarehouseSiteId: this.dcSite
      },
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return `${option['Code']} - ${option['Name']}`;
      },
      type: 'autocomplete',
      filter_key: 'Code',
      URL_CODE: 'SFT.productunitcombo'
    };

    this.comboUnitConfig = {
      selectedFirst: false,
      isSelectedAll: false,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return `${option['Code']} - ${option['Name']}`;
      },
      type: 'autocomplete',
      filter_key: 'Name',
      URL_CODE: 'SFT.unitcombo'
    };
  }

  initTableAction(): TableAction[] {
    return [
      // {
      //   icon: "mode_edit",
      //   name: 'edit-barcode',
      //   toolTip: {
      //     name: "Cập nhật barcode",
      //   },
      //   class: "ac-task",
      //   disabledCondition: (row: any) => {
      //     return (row.IsDefault == 0);
      //   }
      // },
      {
        icon: "remove_circle",
        name: 'remove-barcode',
        toolTip: {
          name: "Huỷ barcode",
        },
        class: "ac-remove",
        disabledCondition: (row: any) => {
          return (row.IsDefault == 0 && row.Status !== 'Canceled');
        }
      },
      {
        icon: "print",
        name: 'print-barcode',
        toolTip: {
          name: "In tem barcode",
        },
        class: "",
        disabledCondition: (row: any) => {
          return (['PLH'].includes(row.ClientCode) && row.IsDefault === 0 && ['GCP'].includes(row.Source));
        }
      }
    ];
  }
  initUnitTableAction(): TableAction[] {
    return [
      {
        icon: "mode_edit",
        name: 'edit-unit',
        toolTip: {
          name: "Cập nhật đơn vị tính",
        },
        class: "ac-task",
        disabledCondition: (row: any) => {
          return (['T', 'PAL'].indexOf(row.Uom) != - 1);
          //return false;
        }
      },
      {
        icon: "remove_circle",
        name: 'remove-unit',
        toolTip: {
          name: "Huỷ đơn vị tính",
        },
        class: "ac-remove",
        disabledCondition: (row: any) => {
          return false; // su dung create - edit
        }
      }]
  }

  initTable() {
    this.unitConfig = {
      style: {
        'overflow-x': 'hidden'
      },
      columns: {
        actionTitle: 'action',
        isContextMenu: false,
        actions: this.initUnitTableAction(),
        displayedColumns: [
          'index',
          'Uom',
          'UomName',
          'BaseUomName',
          'ConversionFactor',
          'Numerator',
          'Denominator',
          'IsAllowInbound',
          'IsAllowOutbound',
          'IsAllowStorage',
          'actions'
        ],
        options: [
          {
            title: 'Product.UomName',
            name: 'UomName',
          },
          {
            title: 'Product.Uom',
            name: 'BaseUomName',
          },
          {
            title: 'Product.BaseUom',
            name: 'Uom',
          },
          {
            title: 'Numerator',
            name: 'Numerator',
            render: (data: any) => {
              return Utils.formatNumber(data.Numerator, 0)
            }
          },
          {
            title: 'Denominator',
            name: 'Denominator',
          },
          {
            title: 'Product.ConversionFactor',
            name: 'ConversionFactor',
            render: (data: any) => {
              return Utils.formatNumber(data.ConversionFactor, 3)
            }
          },
          {
            title: 'Product.IsAllowInbound',
            name: 'IsAllowInbound',
            type: 'checkbox'
          },
          {
            title: 'Product.IsAllowOutbound',
            name: 'IsAllowOutbound',
            type: 'checkbox'
          },
          {
            title: 'Product.IsAllowStorage',
            name: 'IsAllowStorage',
            type: 'checkbox'
          }
        ]
      },
      data: {
        rows: [],
        total: 0
      }
    }

    this.barcodeConfig = {
      style: {
        'overflow-x': 'hidden'
      },
      enableFirstLoad: false,
      columns: {
        actionTitle: 'action',
        isContextMenu: false,
        actions: this.initTableAction(),
        displayedColumns: [
          'index',
          'SKU',
          'Barcode',
          'Status',
          // 'Type',
          'UomName',
          'ConversionFactor',
          'Length',
          'Width',
          'Height',
          'GrossWeight',
          'Volume',
          'Capacity',
          'UpdatedBy',
          'UpdatedDate',
          'actions'
        ],
        options: [
          {
            title: 'SKU',
            name: 'SKU',
            style: {
              'min-width': '90px',
              'max-width': '90px'
            }
          },
          {
            title: 'Barcode',
            name: 'Barcode',
            style: {
              'min-width': '150px',
              'max-width': '150px'
            }
          },
          // {
          //   title: 'Product.BarcodeType',
          //   name: 'Type'
          // },
          {
            title: 'Product.Status',
            name: 'Status',
            borderStyle: (row: any) => {
              return row['Status'] ? this.borderColor(row['Status']):null;
            },
            render: (row:any)=>{
              return row['Status'] ? this.translate.instant(`Product.${row['Status']}`) : '';
            }
          },
          {
            title: 'Product.Unit',
            name: 'UomName'
          },
          {
            title: 'Product.ConversionFactor',
            name: 'ConversionFactor',
            render: (data: any) => {
              return Utils.formatNumber(data.Numerator / (data.Denominator ? data.Denominator : 1), 3)
            }
          },
          {
            title: 'Product.Width',
            name: 'Width'
          },
          {
            title: 'Product.Height',
            name: 'Height'
          },
          {
            title: 'Product.Length',
            name: 'Length'
          },
          {
            title: 'Product.GrossWeight',
            name: 'GrossWeight',
            style: {
              "min-width": "75px",
              "max-width": "75px"
            }
          },
          {
            title: 'Product.Volume',
            name: 'Volume',
            style: {
              "min-width": "75px",
              "max-width": "75px"
            }
          },
          {
            title: 'Product.Capacity',
            name: 'Capacity',
            style: {
              "min-width": "75px",
              "max-width": "75px"
            }
          },
          {
            title: 'Pickingwave.UpdatedBy',
            name: 'UpdatedBy'
          },
          {
            title: 'Pickingwave.UpdatedDate',
            name: 'UpdatedDate'
          }
        ]
      },
      remote: {
        url: this.service.getAPI('productbarcodes')
      }
      // data: {
      //   rows: [],
      //   total: 0
      // }
    }

    this.productUnitTrackingConfig = {
      style: {
        'overflow-x': 'hidden'
      },
      columns: {
        actionTitle: 'action',
        isContextMenu: false,
        displayedColumns: [
          'index',
          'Note',
          'CreatedBy',
          'CreatedDate'
        ],
        options: [
          {
            title: 'note',
            name: 'Note',
          },
          {
            title: 'Cập nhật bởi',
            name: 'CreatedBy',
          },
          {
            title: 'Ngày cập nhật',
            name: 'CreatedDate'
          }
        ]
      },
      data: {
        rows: [],
        total: 0
      }
    }
  }
  borderColor(status: string) {
    return {
      'color': STATUS_COLOR[status]
    };
  }
  initialCombo() {
    this.expirydateCombo['change'].subscribe({
      next: (data: any) => {
        if (data.Code == 'None') {
          this.inventorymethodCombo.setValue('FIFO')
        }
        else {
          this.inventorymethodCombo.setValue('FEFO')
        }
      }
    });
    this.combounit['change'].subscribe({
      next: (value: any) => {
        this.unitEntity['Uom'] = value ? value.Code : '';
        this.unitEntity['UomName'] = value ? value.Name : '';
        this.unitnumerator.nativeElement.focus();
      }
    });

  }
  loadData() {
    this.service.getProductDetails({ ClientCode: this.client, WarehouseSiteId: this.dcSite, SKU: this.sku })
      .subscribe((resp: any) => {
        if (resp.Data && resp.Data.length) {
          let r = resp.Data[0];
          this.data = {
            Brand: r.Brand,
            ClientCode: r.ClientCode,
            DCSite: r.DCSite,
            CreatedBy: r.CreatedBy,
            CreatedDate: r.CreatedDate,
            EffectiveDate: r.EffectiveDate,
            ExpirationAlertInterval: r.ExpirationAlertInterval,
            ExpirationType: r.ExpirationType,
            InboundInterval: r.InboundInterval,
            IsActived: r.IsActived,
            Manufacturer: r.Manufacturer,
            Name: r.Name,
            Origin: r.Origin,
            OutboundInterval: r.OutboundInterval,
            ProductType: r.ProductType,
            SKU: r.SKU,
            Desc: r.Desc,
            SelfLife: r.SelfLife,
            Status: r.Status,
            StockManagementType: r.StockManagementType,
            StorageCondition: r.StorageCondition,
            StorageType: r.StorageType,
            Uom: r.Uom,
            UpdatedBy: r.UpdatedBy,
            UpdatedDate: r.UpdatedDate,
            VendorId: r.VendorId,
            VendorName: r.VendorName,
            PCB: r.PCB || '',
            MHU: r.MHU || '',
            BUSettings: r.BUSettings
          }
          if (r.ClientCode) {
            this.data.ClientName = r.ClientCode;
            this.loadClientInfo(r.ClientCode);
          }
          this.statusCombo.setValue(this.data.Status);
          setTimeout(() => {
            this.expirydateCombo.setValue(this.data.ExpirationType);
            this.inventorymethodCombo.setValue(this.data.StockManagementType);
            this.storagetype.setValue(this.data.StorageType);
            this.producttype.setValue(this.data.ProductType);
            if (this.data.EffectiveDate) {
              const effectiveDate = moment(this.data.EffectiveDate, 'DD/MM/YYYY');
              this.effectiveDate.setValue(effectiveDate.toDate());
            }
            //this.vendorCombo.setValue('000' + this.data.VendorId);
          }, 1000);
          let index = parseInt(this.tabIndexActive);
          this.selectTab(index);
        }
      });
  }
  loadClientInfo(code: string) {
    this.service.getClients(code)
      .subscribe((resp: any) => {
        if (resp.Data && resp.Data && resp.Data.Rows && resp.Data.Rows.length) {
          let r = resp.Data.Rows[0];
          this.data.ClientName = `${r.Code} - ${r.Name}`;
        }
      });
  }
  onTabClick(event: any) {
    this.selectTab(event.index);
  }
  selectTab(index: any) {
    switch (index) {
      case 1:
        if (!this.unitData.length) {
          this.getProductUnits();
        }
        break;
      case 2:
        if (!this.barcodeData.length) {
          this.getProductBarcodes();
        }
        break;
      case 3:
        if (!this.vendorData.length) {
          this.getProductVendors();
        }
        break;
      case 4:
        if (!this.productUnitTrackingData.length) {
          this.getObjectTracking({ BizType: 'PRODUCT_UNIT_CHANGE_UOM', BizObject: `${this.client}-${this.dcSite}-${this.sku}` });
        }
        break;
    }
  }
  getProductUnits() {
    this.service.getProductUnits({ ClientCode: this.client, WarehouseSiteId: this.dcSite, SKU: this.sku })
      .subscribe((resp) => {
        if (resp.Status && resp.Data && resp.Data.Rows) {
          let results = [];
          let units = {};
          for (let p of resp.Data.Rows) {
            results.push({
              "SKU": p.SKU,
              "BaseUom": p.BaseUom,
              "Uom": p.Uom,
              "Denominator": p.Denominator,
              "Numerator": p.Numerator,
              "Height": p.Height,
              "Length": p.Length,
              "Width": p.Width,
              "GrossWeight": p.GrossWeight,
              "Barcode": p.Barcode,
              "ClientCode": p.ClientCode,
              "IsAllowInbound": p.IsAllowInbound,
              "IsAllowStorage": p.IsAllowStorage,
              "IsAllowOutbound": p.IsAllowOutbound,
              "ConversionFactor": p.Numerator / (p.Denominator ? p.Denominator : 1)
            });
            units[p.Uom] = p.Uom;
            units[p.BaseUom] = p.BaseUom;
          }
          this.unitData = results;
          if (Object.keys(units).length) {
            this.getUnits(Object.values(units).join(','))
          }
        }
      })
  }

  getUnits(codes: string) {
    this.service.getUnits(codes)
      .subscribe((resp) => {
        if (resp.Status && resp.Data && resp.Data.Rows) {
          let units = resp.Data.Rows;
          for (let p of this.unitData) {
            p.BaseUomName = units.find(x => x.Code === p.BaseUom).Name;
            p.UomName = units.find(x => x.Code === p.Uom).Name;
          }
        }
        this.unitTable['renderData'](this.unitData);
      })
  }

  getProductBarcodes(barcode = '') {
    this.barcodeTable['search']({
      ClientCode: this.client, WarehouseSiteId: this.dcSite,
      SKU: this.sku,
      Barcode: barcode
    });
  }
  getProductVendors() {
    this.service.getProductVendorBySKU({ ClientCode: this.client, WarehouseSiteId: this.dcSite, SKU: this.sku })
      .subscribe((resp) => {
        if (resp.Status && resp.Data) {
          this.vendorData = resp.Data;
          console.log('getProductVendorBySKU', this.vendorData);
          let vendor = this.vendorData[0];
          if(vendor){
            this.vendorEntity = {
              SKU: vendor.SKU,
              WarehouseSiteId: vendor.WarehouseSiteId,
              VendorId: vendor.VendorId,
              VendorName: vendor.VendorName,
              VendorCode: vendor.VendorCode,
              VSR: vendor.VSR,
              Uom: vendor.Uom,
              ClientCode: vendor.ClientCode,
              CreatedDate:vendor.CreatedDate,
              UpdatedDate: vendor.UpdatedDate,
              LeadTimeByDays: vendor.LeadTimeByDays
            }
          }
        }
      })
  }
  getObjectTracking(filters) {
    this.service.getObjectTracking(filters)
      .subscribe((resp) => {
        if (resp.Status && resp.Data && resp.Data.Rows) {
          this.productUnitTrackingData = resp.Data.Rows;
          this.productUnitTrackingTable['renderData'](this.productUnitTrackingData);
        }
      })
  }
  printProductBarcode(data: any) {
    const printer = window.localStorage.getItem("_printer");
    if (!printer) {
      this.toast.error(`Vui lòng chọn máy in`, 'error_title');
      return;
    }
    const dialogRef = this.dialog.open(ConfirmTotalPrintComponent, {
      data: {
        title: `Nhập vào số lượng tem cần in cho Barcode: ${data.Barcode} ?`
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.NumberOfLabel) {
        this.doPrintListBarcode(data.Barcode, result.NumberOfLabel, printer);
      }
    });
  }
  async doPrintListBarcode(barcode: any, numberOfLabel: number, printer: string) {
    const dataPrint = this.printService.repairMultiDataBarcodeProduct(barcode, numberOfLabel);
    const rsPrint = await this.printService.sendToSmartPrintV2(dataPrint, dataPrint.data.PointCode, printer);
    if (rsPrint) {
      this.toast.success(`In Barcode : ${barcode} thành công`, 'success_title');
    } else {
      this.toast.error(`In Barcode ${barcode} thất bại`, 'error_title');
    }

  }
  confirmRemoveBarcode(data: any) {
    const dialogRef = this.dialog.open(NotificationComponent, {
      data: {
        message: `Bạn có chắc chắn muốn HỦY "Barcode" ${data.Barcode}?`,
        type: 1
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.removeBarcode(data);
      }
    });
  }
  removeBarcode(data: any) {
    this.service.removeBarcode({
      "SKU": data.SKU,
      "Barcode": data.Barcode,
      "ClientCode": data.ClientCode,
      "WarehouseSiteId": data.WarehouseSiteId
    })
      .subscribe((resp: any) => {
        if (resp.Status) {
          this.getProductBarcodes();
          this.toast.success(`Hủy Barcode ${data.Barcode} thành công`, 'success_title');

        }
        else {
          this.toast.error(`Hủy Barcode ${data.Barcode} không thành công`, 'error_title');
        }
      })
  }
  isCreateBarcode() {
    return (this.barcodeEntity.Barcode &&
      this.barcodeEntity.Width &&
      this.barcodeEntity.Height &&
      this.barcodeEntity.Length &&
      this.barcodeEntity.Volume &&
      this.barcodeEntity.GrossWeight &&
      this.barcodeEntity.Uom
    );
  }

  isCreateUnit() {
    return (this.data.Uom &&
      this.unitEntity.UomName &&
      this.unitEntity.Denominator &&
      this.unitEntity.Numerator
    );
  }

  confirmCreateBarcode(event: any) {
    const dialogRef = this.dialog.open(NotificationComponent, {
      data: {
        message: `Bạn chắc chắn muốn tạo Barcode ${this.barcodeEntity.UomName} [${this.barcodeEntity.Barcode}] (${this.barcodeEntity.Uom} = ${this.barcodeEntity['Numerator']}${this.data.Uom})`,
        note: 'Vui lòng kiểm tra SỐ LƯỢNG thực tế được IN trên Thùng/Sản phẩm so với SỐ LƯỢNG đơn vị tính của Barcode',
        type: 1
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createBarcode();
      }
    });
  }
  createBarcode() {
    this.barcodeEntity['SKU'] = this.sku;
    this.barcodeEntity['ClientCode'] = this.client;
    this.barcodeEntity['WarehouseSiteId'] = this.dcSite;
    this.barcodeEntity['IsDefault'] = 0;
    this.service.createBarcode(this.barcodeEntity)
      .subscribe((resp: any) => {
        if (resp.Status && resp.Data) {
          this.toast.success(`Tạo Barcode ${this.barcodeEntity.Barcode} thành công`, 'success_title');
          // this.barcodeTable['addRow'](this.barcodeEntity);
          this.getProductBarcodes();
        }
        else if (resp.ErrorMessages && resp.ErrorMessages.length) {
          this.toast.error(resp.ErrorMessages[0], 'error_title');
        }
        else {
          this.toast.error(`Tạo Barcode ${this.barcodeEntity.Barcode} không thành công`, 'error_title');
        }
      })
  }

  confirmCreateUnit(event: any) {
    if (this.currentUnit && this.currentUnit.Uom && this.unitEntity && this.unitEntity.Uom && this.currentUnit.Numerator == this.unitEntity.Numerator && this.currentUnit.Denominator == this.unitEntity.Denominator ) {
      return;
    }
    let msg = `Bạn chắc chắn muốn tạo Đơn vị tính [${this.unitEntity.Uom} - ${this.unitEntity.UomName}] với Số lượng ${this.unitEntity.Numerator} ${this.data.Uom}/${this.unitEntity.UomName}?`
    if (!this.unitEntity.IsCreate) {
      msg = `Bạn chắc chắn muốn Cập nhật Đơn vị tính [${this.unitEntity.Uom} - ${this.unitEntity.UomName}] với Số lượng ${this.unitEntity.Numerator} ${this.data.Uom}/${this.unitEntity.UomName}?`
    }
    const dialogRef = this.dialog.open(NotificationComponent, {
      data: {
        message: msg,
        type: 1
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.unitEntity.IsCreate) {
          this.createUnit();
        }
        else {
          this.editUnit();
        }
      }
    });
  }

  createUnit() {
    this.unitEntity['SKU'] = this.sku;
    this.unitEntity['ClientCode'] = this.client;
    this.unitEntity['WarehouseSiteId'] = this.dcSite;
    this.unitEntity['BaseUom'] = this.data.Uom;
    this.unitEntity['BaseUomName'] = this.unitData.find(x => x.Uom == this.data.Uom).UomName;
    this.service.createUnit(this.unitEntity)
      .subscribe((resp: any) => {
        if (resp.Status) {
          this.unitTable['addRow'](this.unitEntity);
          this.toast.success(`Tạo thành công Đơn vị tính ${this.unitEntity.Uom} với Số lượng ${this.unitEntity.Numerator} ${this.data.Uom}/${this.unitEntity.UomName}`, 'success_title');
        }
        else if (resp.ErrorMessages && resp.ErrorMessages.length) {
          this.toast.error(resp.ErrorMessages[0], 'error_title');
        }
        else {
          this.toast.error(resp.ErrorMessages && resp.ErrorMessages.length ? resp.ErrorMessages[0] : `Tạo Đơn vị tính ${this.unitEntity.Uom} không thành công`, 'error_title');
        }
      })
  }

  editUnit() {
    let obj = {
      SKU: this.sku,
      ClientCode: this.client,
      WarehouseSiteId: this.dcSite,
      Numerator: this.unitEntity['Numerator'],
      Denominator: this.unitEntity['Denominator'],
      IsAllowInbound: this.unitEntity.IsAllowInbound,
      IsAllowStorage: this.unitEntity.IsAllowStorage,
      IsAllowOutbound: this.unitEntity.IsAllowOutbound,
      Uom: this.unitEntity['Uom']
    };

    this.service.editUnit(obj)
      .subscribe((resp: any) => {
        if (resp.Status) {
          let tmp = this.unitTable['data']['rows']['_data']['_value'];
          let index = -1;
          for (let i = 0; i < tmp.length; i++) {
            if (tmp[i].Uom == obj.Uom) {
              index = i;
              break;
            }
          }
          if (index != -1) {
            tmp[index].Numerator = obj.Numerator;
            tmp[index].Denominator = obj.Denominator;
            tmp[index].ConversionFactor = this.unitEntity['ConversionFactor'];
          }
          this.toast.success(`Cập nhập Đơn vị tính ${this.unitEntity.Uom} với Số lượng ${this.unitEntity.Numerator} ${this.data.Uom}`, 'success_title');
        }
        else {
          this.toast.error(resp.ErrorMessages && resp.ErrorMessages.length ? resp.ErrorMessages[0] : `Cập nhập Đơn vị tính ${this.unitEntity.Uom} không thành công`, 'error_title');
        }
      })
  }

  importNewBarcode(event: any) {

  }
  onChangeConversion(event: any) {
    let val = event.target['value'];
    let name = event.target['name'];
    if (val < 0) {
      val = val.replace('-', '');
    }
    if (val) {
      val = val * 1;
      switch (name) {
        case 'Denominator':
        case 'Numerator':
          if (val > 10000)
            event.target['value'] = '';
          if (this.unitEntity['Numerator'] && this.unitEntity['Denominator']) {
            this.unitEntity['ConversionFactor'] = this.unitEntity['Numerator'] / (this.unitEntity['Denominator'] ? this.unitEntity['Denominator'] : 1);
          }
          break;
      }
      this.unitEntity[name] = event.target['value'];
    }
  }
  onChangeBarcode(event: any) {
    let val = event.target['value'];
    let name = event.target['name'];
    if (val < 0) {
      val = val.replace('-', '');
    }
    else if (val) {
      val = val * 1;
      switch (name) {
        case 'Width':
        case 'Height':
        case 'Length':
          if (val > 1000)
            event.target['value'] = '';
          if (this.barcodeEntity['Width'] && this.barcodeEntity['Height'] && this.barcodeEntity['Length']) {
            this.barcodeEntity['Volume'] = this.barcodeEntity['Width'] * this.barcodeEntity['Height'] * this.barcodeEntity['Length'];
          }
          break;
        case 'Volume':
          if (val > 30000000)
            event.target['value'] = '';
          break;
        case 'GrossWeight':
          if (val > 1000000)
            event.target['value'] = '';
          break;
        case 'Capacity':
          if (val > 10000)
            event.target['value'] = '';
          break;
      }
      this.barcodeEntity[name] = event.target['value'];
    }
  }
  clearBarcode(event: any) {
    this.barcodeEntity = {
      Barcode: "",
      Uom: "",
      UomName: "",
      Type: "",
      Width: "",
      Height: "",
      Length: "",
      Volume: "",
      GrossWeight: "",
      Capacity: "",
      IsEdit: false
    };

  }

  onEnter(event: any) {
    if (event.keyCode === 13 || event.code == "Enter") {
      this.getProductBarcodes(event.target.value);
    }
  }
  clearUnit(event: any) {
    this.unitEntity = {
      Uom: '',
      UomName: '',
      Denominator: 1,
      Numerator: 1,
      IsAllowOutbound: 1,
      IsAllowStorage: 1,
      IsAllowInbound: 1,
      ConversionFactor: 1,
      IsCreate: true
    };
    this.currentUnit = {}
    this.combounit.setValue(this.unitEntity.Uom);
    this.combounit.disabledInput(!this.unitEntity.IsCreate, '');
  }
  linkCreateUnit() {
    this.tabIndexActive = "1";
    setTimeout(() => {
      this.combounit.nativeElement.focus();
    }, 3000);
  }

  private conformRemoveUnit(row: any) {
    const dialogRef = this.dialog.open(NotificationComponent, {
      data: {
        message: `Bạn chắc chắn muốn hủy Đơn vị tính ${row.Uom} với Số lượng ${row.Numerator} ${row.Uom}?`,
        type: 1
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.removeUnit(row);
      }
    });
  }
  private removeUnit(row: any) {
    this.service.removeUnit({
      ClientCode: this.client,
      WarehouseSiteId: this.dcSite,
      SKU: row.SKU,
      Uom: row.Uom
    }).subscribe(resp => {
      if (resp.Status && resp.Data) {
        // this.getProductUnits();
        let tmp = this.unitTable['data']['rows']['_data']['_value'];
        let index = -1;
        for (let i = 0; i < tmp.length; i++) {
          if (tmp[i].Uom == row.Uom) {
            index = tmp[i].index;
            break;
          }
        }
        if (index != -1) {
          this.unitTable['removeRow'](index);
        }
        this.toast.success(`Hủy Đơn vị ${row.Uom} thành công`, 'success_title');
      } else {
        this.toast.error(resp.ErrorMessages && resp.ErrorMessages.length ? resp.ErrorMessages[0] : `Hủy Đơn vị ${row.Uom} không thành công`, 'error_title');
      }
    });
  }
}
