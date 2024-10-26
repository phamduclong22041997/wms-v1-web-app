import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

import {FormControl, Validators} from '@angular/forms';
import {Observable, merge} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { OperationNetworkingService } from '../../operation-networking.service';

@Component({
  selector: 'smartcart-purpose-combo',
  templateUrl: './smartcart-purposeusing.component.html',
  styleUrls: ['./smartcart-purposeusing.component.css'],
  inputs: ['title', 'tabindex', 'value', 'disabled'],
  outputs: ['change:onChange']
})
export class SmartcartPurposeComboComponent implements OnInit {
  @Input() disableField = false;
  public change = new EventEmitter<any>();  
  justASimpleArray = [];
  filteredOptions: Observable<any[]>;
  simpleObservable = new EventEmitter<any>();
  @Output() @Input() purposeValue = "";
  myControl = new FormControl(this.purposeValue, [Validators.required]);
  data: any = [];
  selectedValue: any = "";
  selectedData:any = null;
  autocompleteDisabled: boolean = false;
  constructor(private networkingService: OperationNetworkingService) {
    if(!this['disabled']) {
      this.loadData();
    }
  }

  ngOnInit() {
    // if(this.disableField){
    //   this.myControl.disable();
    // } else {
    //   this.myControl.enable();
    // }
    // if(this.purposeValue){
    //   this.selected = this.purposeValue;
    // }
  }
  ngAfterViewInit() {
    if(this['value'] !== undefined) {
      //this.myControl.setValue(this['value']);
      this.selectedValue = this['value'];
    }
    // if(this['disabled'] !== undefined && this['disabled'] === "true") {
    //   this.myControl.reset({value: this.selectedValue, disabled: true});
    // }
    
  }

  // initFileter() {
  //   this.filteredOptions = merge(this.myControl.valueChanges, this.simpleObservable).pipe(
  //     startWith(''),
  //     map(value => this._filter(value))
  //   );
  // }

  onBlur(event) {
   if(event.target.value !== this.selectedValue) {
    event.target.value = this.selectedValue;
    event.preventDefault();
   }
   if(!event.target.value) {
    this.change.emit("error");
   }
  }

  onFocus(event) {
    if(this.selectedValue !== '') {
      this.simpleObservable.emit("");
    }
  }

  optionSelected(selectedVal) {
    this.purposeValue = selectedVal.value;
    this.change.emit(selectedVal.value);
    // this.myControl.setValue(selectedVal);
    // this.selectedValue = selectedVal.option.value;
    // let _data = null;
    // for(let i = 0; i < this.data.length; i++) {
    //   if(this.data[i]['purposeusing'] == this.selectedValue) {
    //     _data = this.data[i];
    //     break;
    //   }
    // }    
    // this.change.emit(_data.purposeusing);
  }

  closed(a) {
    //this.myControl.setValue(this.selectedValue); 
  }

  // private _filter(value: string): string[] {
  //   if(this.autocompleteDisabled) {
  //     return [];
  //   }
  //   let _pattern = new RegExp(value, 'i');
  //   return this.data.filter(function(item){
  //     for(let i = 0; i < item.length; i++){
  //       item => _pattern.test(item[i]['purposeusing']);
  //     }      
  //   });
  // }

  private loadData() {
    this.networkingService.get('Smartcart.purposecombo', {})
    .subscribe(resp=>{
      let _data = [];
      if(resp['Success'] === true) {
        _data = resp['Data']['rows'] || [];
      }
      this.data = _data;
      this.justASimpleArray = _data;
      //this.initFileter();
    })
  }

  handleKeydown(event){
    event.preventDefault();
  }
}
