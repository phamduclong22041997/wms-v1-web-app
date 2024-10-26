import { Component, OnInit, EventEmitter } from '@angular/core';

import {FormControl} from '@angular/forms';
import {Observable, merge} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { OperationNetworkingService } from './../../operation-networking.service';

@Component({
  selector: 'app-pointtype-combo',
  templateUrl: './pointtype.component.html',
  styleUrls: ['./pointtype.component.css'],
  inputs: ['title', 'tabindex', 'value', 'disabled'],
  outputs: ['change:onChange']
})
export class PointTypeComboComponent implements OnInit {
  public change = new EventEmitter<any>();
  myControl = new FormControl();
  filteredOptions: Observable<any[]>;
  simpleObservable = new EventEmitter<any>();

  data: any = [];
  selectedValue: any = "";
  autocompleteDisabled: boolean = false;
  constructor(private networkingService: OperationNetworkingService) {
    if(!this['disabled']) {
      this.loadData();
    }
  }

  ngOnInit() {}
  ngAfterViewInit() {
    if(this['value'] !== undefined) {
      this.myControl.setValue(this['value']);
      this.selectedValue = this['value'];
    }
    if(this['disabled'] !== undefined && this['disabled'] === "true") {
      this.myControl.reset({value: this.selectedValue, disabled: true});
    }
  }

  initFileter() {
    this.filteredOptions = merge(this.myControl.valueChanges, this.simpleObservable).pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  onBlur(event) {
   if(this.selectedValue && event.target.value !== this.selectedValue.propertyname) {
    event.target.value = this.selectedValue.propertyname;
    event.preventDefault();
   }
   if(!event.target.value) {
    this.change.emit("error");
   }
  }

  onFocus(event) {
    if(this.selectedValue && this.selectedValue.propertyname !== '') {
      this.simpleObservable.emit(null);
    }
  }

  optionSelected(selectedVal) {
    this.selectedValue = selectedVal.option.value;
    let _data = null;
    for(let i = 0; i < this.data.length; i++) {
      if(this.data[i].propertyname == this.selectedValue.propertyname) {
        _data = this.data[i];
        break;
      }
    }
    this.change.emit(_data);
  }

  closed(a) {
    this.myControl.setValue(this.selectedValue.propertyname);
  }

  private _filter(value: string): string[] {
    if(this.autocompleteDisabled) {
      return [];
    }
    // let _pattern = new RegExp(value, 'i');
    // return this.data.filter(item => _pattern.test(item['propertyname']));
    return this.data;
  }

  private loadData() {
    this.networkingService.get('Point.pointtype', {})
    .subscribe(resp=>{
      let _data = [];
      if(resp['Success'] === true) {
        _data = resp['Data']['rows'] || [];
      }
      this.data = _data;
      this.initFileter();
    })
  }

}
