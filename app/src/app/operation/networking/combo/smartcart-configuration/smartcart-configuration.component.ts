import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

import {FormControl, Validators, MaxLengthValidator} from '@angular/forms';
import {Observable, merge} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { OperationNetworkingService } from '../../operation-networking.service';

@Component({
  selector: 'smartcart-config-combo',
  templateUrl: './smartcart-configuration.component.html',
  styleUrls: ['./smartcart-configuration.component.css'],
  inputs: ['title', 'tabindex', 'value', 'disabled'],
  outputs: ['change:onChange']
})
export class SmartcartConfigComboComponent implements OnInit {
  @Input() disableField = false;
  @Output() @Input() configValue = "";
  justASimpleArray = [];
  public change = new EventEmitter<any>();
  formValidation = new FormControl(this.configValue, [
    Validators.required
  ]);
  filteredOptions: Observable<any[]>;
  simpleObservable = new EventEmitter<any>();
  data: any = [];
  selectedValue: any = "";
  selectedData:any = null;
  autocompleteDisabled: boolean = false;
  constructor(private networkingService: OperationNetworkingService) {
    if(!this['disabled']) {
      this.loadData();
    }
  }

  ngOnInit() {}
  ngAfterViewInit() {
    if(this['value'] !== undefined) {
      this.formValidation.setValue(this['value']);
      this.selectedValue = this['value'];
    }
    if(this['disabled'] !== undefined && this['disabled'] === "true") {
      this.formValidation.reset({value: this.selectedValue, disabled: true});
    }
  }

  optionSelected(selectedVal) {
    this.configValue = selectedVal.option.value;
    let _data = {};
    for(let i = 0; i < this.justASimpleArray.length; i++){
      if(selectedVal.option.value == this.justASimpleArray[i].configurationcode){
        _data = this.justASimpleArray[i];
        break;
      }
    }
    this.change.emit(_data);
  }

  closed(a) {
    this.formValidation.setValue(this.configValue); 
  }

  private loadData() {
    this.networkingService.get('Smartcart.configcombo', {})
    .subscribe(resp=>{
      let _data = [];
      if(resp['Success'] === true) {
        _data = resp['Data']['rows'] || [];
      }
      this.data = _data;
      this.justASimpleArray = _data;
    })
  }

  handleKeydown(event){
    event.preventDefault();
  }

}
