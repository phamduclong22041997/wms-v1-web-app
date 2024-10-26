import { Component, OnInit, EventEmitter, Input, ViewChildren, QueryList } from '@angular/core';

import {ComboComponent} from './../combo/combo.component';
@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  @ViewChildren(ComboComponent) filterComboList: QueryList<ComboComponent>;
  @Input() config: any;
  disabled: Boolean = false;
  fields: Array<any> = [];
  rows: Array<any> = [];
  data: Object = {};
  change: EventEmitter<any> = null;

  constructor() {
    this.change = new EventEmitter<any>();
    // this.comboHandle = this.comboHandle.bind(this);
  }
  ngOnInit() {
    if (this.config['fields'] != undefined) {
      this.fields = this.config['fields'];
    }
    if (this.config['rows'] != undefined) {
      this.rows = this.config['rows'];
    }
    if (this.fields.length === 0 && this.rows.length == 0) {
      this.disabled = true;
    }
    for (let i in this.fields) {
      this.data[this.fields[i].name] = "";
    }

    for (let i in this.rows) {
      for (let j in this.rows[i]) {
        this.data[this.rows[i][j].name] = "";
      }
    }
  }
  ngAfterViewInit() {
    // console.log(this.filterCombo)
    this.initCombo();
  }
  isEmpty() {
    let _isEmpty = true;
    for (let i in this.data) {
      if (this.data[i]) {
        _isEmpty = false;
        break;
      }
    }
    return _isEmpty;
  }
  onKeyup(event: any) {
    if (event['code'] === 'Enter') {
      this.change.next(this.data);
    }
  }
  onClick() {
    // if(!this.isEmpty()) {
    this.change.next(this.data);
    // }
  }
  clear(field: string) {
    if (this.data[field] !== undefined) {
      this.data[field] = "";
    }
  }
  reset() {
    for(let i in this.data) {
      this.data[i] = "";
    }
    this.filterComboList.forEach((child:any) => {
      child.clearInput();
    });
  }
  getCombo(name: string) {
    return this.filterComboList.find((child: ComboComponent) => child.comboName == name);
  }
  initCombo() {
    this.filterComboList.forEach((child:ComboComponent) => {
      child.change.subscribe({
        next: (_data: any) => {
          this.data[child.comboName] = "";
          if (_data && _data !== 'error') {
            this.data[child.comboName] = child.configs['val'](_data);
          }
        }
      })
    });
  }
  // comboHandle(data: any, name: string) {
  //   this.data[name] = "";
  //   if (data && data !== 'error') {
  //     for (let i in this.fields) {
  //       if (this.fields[i]['name'] == name) {
  //         this.data[name] = this.fields[i]['config']['val'](data);
  //         break;
  //       }
  //     }

  //     for (let i in this.rows) {
  //       for (let j in this.rows[i]) {
  //         if (this.rows[i][j]['name'] == name) {
  //           this.data[name] = this.rows[i][j]['config']['val'](data);
  //           break;
  //         }
  //       }
  //     }
  //   }
  //   // this.change.next(this.data);
  // }
}
