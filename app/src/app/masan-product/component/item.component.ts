/**
 * Copyright (c) 2019 OVTeam
 * Modified by: Duy Huynh
 * Modified date: 2020/08
 */

import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { Service } from '../service';
import { ToastService } from '../../shared/toast.service';
import { BasicInject } from '../../components/modal/basic.inject';
import { UtilsService } from '../../components/utils.service';


@Component({
  selector: 'app-sopool-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  data: any = {
    producttype: null,
    potype: 'NORMAL',
    postatus: 'NEW',
    contact: "",
    phonenumber: "",
    originaldocumentcode: "",
    refcode: "",
    sourcewarehouse: null,
    destinationwarehouse: null,
    shippingdate: new Date(),
    arrivaldate: new Date(),
    items:[],
    note: ""
  }

  isEdit:boolean = false;
  isView:boolean = false;

  minDate: Date;
  tableConfig: any;
  tableAttachedServiceConfig:any;
  selectedRow:any = null;

  formValid: boolean = false;
  formValidator: any = null;
 
  validatorMsg: Object = {
    Contact: {
      required:'purchaseorder.validate.requirecontact',          
    },
    Phonenumber: {
      required:'purchaseorder.validate.requirephonenumber',    
      pattern: 'purchaseorder.validate.formatphonenumber'
    },    
  }
  msglist:  Object = {
    success_create: 'purchaseorder.msg_create_success',
    success_update: 'purchaseorder.msg_update_success',
    error_qty:      'purchaseorder.validate.qty',
    error_shipdate: 'purchaseorder.validate.shipdate'
    
  }
  @ViewChild('transactionTypeCombo', { static: false }) transactionTypeCombo: any;
  @ViewChild('poTypeCombo', { static: false }) poTypeCombo: any;
  @ViewChild('sourceWarehouseCombo', { static: false }) sourceWarehouseCombo: any;
  @ViewChild('destinationWarehouseCombo', { static: false }) destinationWarehouseCombo: any;
  @ViewChild('productTable', { static: false }) productTable: ElementRef;
  @ViewChild('attachedServiceConfigTable', { static: false }) attachedServiceConfigTable: ElementRef;
  poTypeConfig: Object = {
    filter_key: "description",
    val: (option) => {
      return option['description'];
    },
    type: "combo",
    URL_CODE: "PO.potypecombo"
  };
  warehouseConfig: Object = {
    filter_key: "warehousename",
    val: (option: any) => {
      return option['warehousename'];
    },
    URL_CODE: "Warehouse.warehousecombo"
  };
  transactionTypeConfig: Object = {   
    val: (option) => {   
      return option['name'];
    },
    type: "combo",
    URL_CODE: "PO.transactioncombo"
  };

  constructor(public dialog: MatDialog, public injectObj: BasicInject, private service: Service, private toast: ToastService, private utils: UtilsService) {   
    this.initialForm();
  }

  ngOnInit() {
    let columns = (!this.isView) ?  ['index', 'sku', 'productname', 'unit', 'qty', 'isattachedservice', 'actions'] : ['index', 'sku', 'productname', 'unit', 'qty', 'isattachedservice']
    let actions =  (!this.isView) ? ['delete'] : [];
    this.tableConfig = {
      disableTools: true,
      editable: true,
      rowSelected: true,
      disabled: (this.isView) ? true : false,          
      style: {
        height: "355px"
      },
      columns: {
        actions: actions,
        displayedColumns: columns,
        options: [
          {
            title: 'purchaseorder.sku',
            name: 'sku',
            align: 'center',
            style: ''
          },
          {
            title: 'purchaseorder.productname',
            name: 'productname',
            align: 'center',
            style: ''
          },
          {
            title: 'purchaseorder.unit',
            name: 'unit',
            align: 'center',
            style: { "flex": "0 0 130px" }
          },
          {
            title: 'purchaseorder.qty',
            name: 'qty',
            align: 'center',
            type: 'number',
            style: { "flex": "0 0 80px" }            
          },
          {
            title: 'purchaseorder.attachedservices',
            name: 'isattachedservice',
            align: 'center',
            type: 'checkbox',
            style: { "flex": "0 0 80px", "text-align": "center"}
          }
        ]
      },
      data: {
        rows: this.data.items || [],
        total: this.data.items.length
      },
    };


    this.tableAttachedServiceConfig = {
      disableTools: true,
      editable: true,
      disabled: true,
      //disablePagination: true,
      style: {
        height: "355px"
      },
      columns: {
        displayedColumns: ['index', 'service', 'selected'],
        options: [
          {
            title: 'purchaseorder.service',
            name: 'service',
            align: 'center',
            style: ''
          }
        ]
      },
      remote: {
        url: '/api/productconfigurationattachedservice/getservice',
        params: {'filter': JSON.stringify({'type':1})}
      }     
    };

    if (this.formValidator !== null) {
      this.formValidator.Contact.valueChanges.subscribe((val:any) => { this.data['contact'] = val; this.validate(); }, null, null);
      this.formValidator.Phonenumber.valueChanges.subscribe((val:any) => { this.data['phonenumber'] = val; this.validate(); }, null, null);           
    }
  } 
  initialForm(){
    if(this.injectObj.data) {
      this.isEdit = this.injectObj.data['action'] === 'edit';
      this.isView = this.injectObj.data['action'] === 'view';
      let shippingdate = ""; 
      let arrivaldate = ""
      if(this.injectObj.data['shippingdate'])
      {
        shippingdate = (this.isView) ?  this.utils.parseDate2String(this.injectObj.data['shippingdate']) :  this.injectObj.data['shippingdate'];
      }

      if(this.injectObj.data['arrivaldate'])
      {
        arrivaldate = (this.isView) ?  this.utils.parseDate2String(this.injectObj.data['arrivaldate']) :  this.injectObj.data['arrivaldate'];
      }
      this.data['pocode'] = this.injectObj.data['pocode'] || ''; 
      this.data['producttype'] = this.injectObj.data['producttype'] || '';
      this.data['potype'] = this.injectObj.data['potype'] || '';
      this.data['postatus'] = this.injectObj.data['postatus'] || '';
      this.data['contact'] = this.injectObj.data['contact'] || '';
      this.data['phonenumber'] = this.injectObj.data['phonenumber'] || '';
      this.data['originaldocumentcode'] =  this.injectObj.data['originaldocumentcode'] || '';
      this.data['refcode'] = this.injectObj.data['refcode'] || '';
      this.data['sourcewarehouse'] = this.injectObj.data['sourcewarehouse'] || '';    
      this.data['destinationwarehouse'] = this.injectObj.data['destinationwarehouse'] || '';
      this.data['shippingdate'] = shippingdate;//this.injectObj.data['shippingdate'] || '';
      this.data['arrivaldate'] = arrivaldate;
      this.data['items'] = this.injectObj.data['items'] || '';
      this.data['note'] = this.injectObj.data['note'] || '';   
    }   
    

    this.minDate = new Date();   

    this.formValidator = {
      Contact: new FormControl(this.data.contact, [
        Validators.required       
      ]),
      Phonenumber: new FormControl(this.data.phonenumber, [
        Validators.required,
        Validators.pattern(/^[+]{0,1}[0-9]{0,1}[-\s\.]{0,1}[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{0,44}$/)          
      ]),    
      Shippingdate: new FormControl(this.data.shippingdate, []),            
      Arrivaldate: new FormControl(this.data.arrivaldate, []),     
    };
  }  
  ngAfterViewInit() {   
    if(!this.isView){
      this.initialCombo();     
    }
    this.initEvent()
  } 
  selectProduct(event:any) {    
    let sku = event.target.value.toUpperCase();   
    let params = {'sku': sku};  

    /*this.productTable['addRow'](data);
    event.target.value = "";*/  
    if (!sku) {
      event["target"].value = "";
      event.preventDefault();
      return;
    }    
    this.service.get(params)
    .subscribe((res) => {
      if (res['Success']) {
        let data = {
          sku: sku, productname: res['Data']['productname'], unit: "Cái", qty: 1, isattachedservice: false, attachedservice: []
        };
        this.productTable['addRow'](data);
        this.data.items = this.productTable['getData']()['data']; 
        event.target.value = "";        
      } else {
         this.toast.error(res['Data'], 'error_title');
         event.target.value = "";
      }
    });
    this.validate();
  }
 
  searchProductHandle() {    
    // let searchdialog = this.productService.searchProduct();
    // searchdialog.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.addRowHanlde(result);
    //   }
    // });
  }
  addRowHanlde(data: any){
      for(let i in data){
        this.productTable['addRow']({
          sku: data[i].sku, productname:  data[i].productname, unit: "Cái", qty: 1, isattachedservice: false, attachedservice: []  
        }); 
      }
      this.data.items = this.productTable['getData']()['data']; 
      this.validate();
  }
  resetSelectedAttachedService(row:any) {     
    if(!row['isattachedservice'])
    {
      this.selectedRow['attachedservice'] = [];     
    }

    let data = row['attachedservice'];
    for(let i in this.attachedServiceConfigTable['data']['rows']) {
      if(data.indexOf(this.attachedServiceConfigTable['data']['rows'][i].service) !== -1) {       ;
        this.attachedServiceConfigTable['data']['rows'][i].selected = true;
      } else {
        this.attachedServiceConfigTable['data']['rows'][i].selected = false;
      }
    }
   
    this.attachedServiceConfigTable['selectedAll'] = this.attachedServiceConfigTable['data']['rows'].length == data.length;
    
    
  }
  checkDuplicateSKU() {   
    let griddata = this.productTable['getData']()['data']; 
    let duplistid = []
    let data = [];    
    data = griddata.reduce((acc, current) => { 
      const x = acc.find(item => item.sku + '-' + JSON.stringify(item.attachedservice) === current.sku + '-' +  JSON.stringify(current.attachedservice));
      if (!x) {        
        return acc.concat([current]);
      } else {
        if(!duplistid[x.index])
        {
          duplistid[x.index] = 1;
        }else{
          duplistid[x.index] = duplistid[x.index] + 1 ; 
        }        
        return acc;
      }
    }, []);    
    for(let i in data)
    {      
      if(duplistid[data[i]['index']])
      {
        data[i]['qty'] = data[i]['qty'] + duplistid[data[i]['index']];
      }
      data[i]['index'] = parseInt(i) + 1;
    }
    this.productTable['renderData'](data);   
  }  
  validate() {
    let valid = true;
    for (let index in this.formValidator) {
      if (this.formValidator[index].errors !== null) {       
        valid = false;
      }
    }
    if (!this.data.producttype) {     
      valid = false;
    }
    if (!this.data.sourcewarehouse) {     
      valid = false;
    }

    if (!this.data.destinationwarehouse) {
       valid = false;
    }
    
   
    if (this.data.sourcewarehouse && this.data.destinationwarehouse && this.data.destinationwarehouse.name !== this.data.sourcewarehouse.name) {      
      valid = false;
    }
    
    if (!this.data.items.length) {
      valid = false;
   }
 
    this.formValid = valid;
  }

  inputValidator(fieldname) {    
    if (this.formValidator[fieldname].errors !== null) {
      for (let i in this.formValidator[fieldname].errors) {
        if (this.validatorMsg[fieldname] && this.validatorMsg[fieldname][i]) {         
          this.toast.warning(this.validatorMsg[fieldname][i], 'warning_title');
        }
      }
    }
  }

 
  shippingDateChange(event:any)
  {    
    
    let shippingdate = event.target.value;   
    if(!shippingdate){    
      this.formValidator['Shippingdate'].reset();         
      event.target.value = new Date();  
      
      return;      
    }

    if(!this.data['arrivaldate']){       
      return;
    }

    if(shippingdate > this.data['arrivaldate']){    
      this.formValidator['Shippingdate'].reset();  
      event.target.value = new Date();         
      this.toast.warning(this.msglist['error_shipdate'], 'warning_title'); 
      return;  
    }
       
  }
  arrivalDateChange(event:any)
  {
    let arrivaldate = event.target.value;    
    if(!arrivaldate){      
      this.formValidator['Arrivaldate'].reset();       
      event.target.value = new Date();     
      return;      
    }

    if(!this.data['shippingdate']){      
      return;
    }

    if(arrivaldate < this.data['shippingdate']){
      this.formValidator['Arrivaldate'].reset();  
      event.target.value = new Date();         
      this.toast.warning(this.msglist['error_shipdate'], 'warning_title'); 
      return;  
    } 
  }
  deleteRowHanlde(data: any){
      this.productTable['removeRow'](data);
      this.data.items = this.productTable['getData']()['data'];
      this.validate();
  }
  onSaveClick() {
    this.checkDuplicateSKU();
    this.data.items = this.productTable['getData']()['data']; 
    if (this.isEdit) {
      this.data['ref'] = this.data['pocode'];
    }
    // this.service.create(this.data)
    // .subscribe((res) => {
    //   if (res['Success']) {        
    //     this.toast.success(this.isEdit ? this.msglist['success_update'] : this.msglist['success_create'], 'success_title');        
    //     this.injectObj.dialogRef.dismiss(true);
    //   } else {
    //     this.toast.error(res['Data'], 'error_title');
    //   }
    // });
  }
  initialCombo() {
    /*this.poTypeCombo['change'].subscribe({
      next: (data: any) => {
        if (data !== 'error') {
          this.data['potype'] = data;
        } else {
          this.data['potype'] = null;
        }
        // this.validate();
      }
    });*/

    this.sourceWarehouseCombo['change'].subscribe({
      next: (data: any) => {
       
        if (data !== 'error') {
          this.data['sourcewarehouse'] = data;
        } else {
          this.data['sourcewarehouse'] = null;
        }
        this.validate();
      }
    });

    this.destinationWarehouseCombo['change'].subscribe({
      next: (data: any) => {
        if (data !== 'error') {
          this.data['destinationwarehouse'] = data;
        } else {
          this.data['destinationwarehouse'] = null;
        }
        this.validate();
      }
    });

    this.transactionTypeCombo['change'].subscribe({
      next: (data: any) => {       
        if (data !== 'error') {
          this.data['producttype'] = data;
        } else {
          this.data['producttype'] = null;
        }
        this.validate();
      }
    });
  }
  initEvent() {
    //Attached Service event
    this.attachedServiceConfigTable['rowEvent'].subscribe({
      next: (event: any) => {    
        let _index = this.selectedRow['attachedservice'].indexOf(event.service);    
        if(this.selectedRow) {
          if(event.selected === true) {
            if(_index > -1)
            {
              return;
            }
            this.selectedRow['attachedservice'].push(event.service);
          } else {
           
            if(_index !== -1) {
              this.selectedRow['attachedservice'].splice(_index, 1);
            }
          }
          this.attachedServiceConfigTable['selectedAll'] = (this.attachedServiceConfigTable['data']['rows'].length == this.selectedRow['attachedservice'].length)
          
        }
      }
    });
    //Row Event
    this.productTable['rowEvent'].subscribe({
      next: (event:any) => {       
          this.tableAttachedServiceConfig.disabled = (this.isView) ? true : !event.isattachedservice;                  
          this.selectedRow = event;         
          this.resetSelectedAttachedService(this.selectedRow);        
      }
    });
    //Action event
    this.productTable['actionEvent'].subscribe({
      next: (event:any) => {
        if(event['action'] === 'delete') {
          this.deleteRowHanlde(event['index']);                        
          this.productTable['removeRow'](event['index']);
          
        }
      }
    });
    this.productTable['inputEvent'].subscribe({
      next: (event:any) => {
         if(event['typeinput'] == 'number'){
              if(event['data'].qty <= 0){
                event['data'].qty = 1;
                this.toast.error(this.msglist['error_qty'], 'error_title');  
              }  
         }
        
      }
    });
  }
}
