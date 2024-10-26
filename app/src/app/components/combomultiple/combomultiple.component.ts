/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2019/12/12
 * Modified by: Duy Huynh, Huy Nghiem
 */

import { Component, OnInit, EventEmitter, ElementRef, Input, ViewChild } from '@angular/core';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

import { FormControl } from '@angular/forms';
import { Observable, merge } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ComboService } from '../combo.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-combo-multiple',
  templateUrl: './combomultiple.component.html',
  styleUrls: ['./combomultiple.component.css']
})
export class ComboMultipleComponent implements OnInit {
  @Input() configs: any;
  @Input() disabled: any;
  @Input() title: any;
  @ViewChild(MatAutocompleteTrigger, { static: false }) autocomplete: MatAutocompleteTrigger;
  @ViewChild('search', { static: false }) searchTextBox: ElementRef;

  change = new EventEmitter<any>();
  myControl = new FormControl();
  searchTextboxControl = new FormControl();

  filteredOptions: Observable<any[]>;

  data: any = [];
  type: string = 'autocomplete';
  selectedData: any = [];
  selectedValue: any = [];
  autocompleteDisabled: boolean = false;
  checkedAll: boolean = false;

  constructor(private comboService: ComboService, private translate: TranslateService) { }

  selectionChange(event) {
    if (event.isUserInput && event.source.selected == false) {
      this.checkedAll = false;
      const index = this.selectedValue.indexOf(event.source.value);
      this.selectedValue.splice(index, 1)
      this.selectedData.splice(index, 1)
    }
  }

  selectionClick(event) {
    if (this.myControl.value.length == this.data.length) {
      this.checkedAll = true;
    } else {
      this.checkedAll = false;
    }
  }

  openedChange(value: any) {
    this.searchTextboxControl.patchValue('');
    // Focus to search textbox while clicking on selectbox
    if (value == true) {
      this.searchTextBox.nativeElement.focus();
    }
    else {
      this.change.emit(this.selectedValue);
    }
  }

  clearSearch(event) {
    event.stopPropagation();
    this.searchTextboxControl.patchValue('');
  }

  setSelectedValues() {
    if (this.myControl.value && this.myControl.value.length > 0) {
      const _this = this;
      this.myControl.value.forEach((e) => {
        if (_this.selectedValue.indexOf(e) == -1) {
          _this.selectedValue.push(e);
          const obj = _this.data.filter(function (x) {
            return _this.configs['val'](x) == e;
          });
          if (obj && obj.length > 0) {
            _this.selectedData.push(this.configs['render'](obj[0]));
          }
        }
      });
    }

    if (this.selectedValue.length == this.data.length) {
      this.checkedAll = true;
    }
    else {
      this.checkedAll = false;
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.initData();
  }

  initData() {
    if (!this.configs)
      return;
    if (this.configs.type) {
      this.type = this.configs.type;
    }
    if (!this['disabled'] && !this.configs['disableAutoload']) {
      this.loadData();
    }
  }


  initFileter() {
    this.filteredOptions = this.searchTextboxControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        return this._filter(value);
      })
    );
  }

  setDefaultData(data: any) {
    for (const i in this.data) {
      if (data === this.configs['val'](this.data[i])) {
        this.selectedData.push(this.configs['render'](this.data[i]));
        this.selectedValue.push(this.configs['val'](this.data[i]));
      }
    }
  }

  generateId(data: any) {
    return this.configs['val'](data);
  }
  render(data: any) {
    return this.configs['render'](data);
  }
  renderVal(data: any) {
    return this.configs['val'](data);
  }

  renderCheckboxAllTitle(data: any) {
    return this.translate.instant('combo.all');
  }

  renderSelectTrigger() {
    let result = '';
    if (this.selectedData) {
      result = this.selectedData[0];
      if (this.selectedData.length > 1) {
        result += `+ (${this.selectedData.length - 1} mục khác)`;
      }
    }
    return result;
  }

  private _filter(value: string): string[] {
    this.setSelectedValues();
    this.myControl.patchValue(this.selectedValue);
    const _pattern = new RegExp(value, 'i');
    const _filterKey = this.configs['filter_key'] || this.configs['filterKey'];
    const _data = this.data;
    return _data.filter((item: any) => {
      if (this.type === 'autocomplete' && item) {
        return _pattern.test(item[_filterKey]); // this.removeAscent(item[_filterKey]));
      } else {
        return item !== value;
      }
    });
  }


  // public reload(filters: any) {
  //   if (filters) {
  //     this.configs['filters'] = filters;
  //     this.loadData();
  //   }
  // }

  onChecked(event: any) {
    this.checkedAll = event.checked;
    this.selectedValue = [];
    this.selectedData = [];
    if (this.checkedAll) {
      for (let i in this.data) {
        this.selectedValue.push(this.configs['val'](this.data[i]));
        this.selectedData.push(this.configs['render'](this.data[i]));
      }
    }
    this.myControl.patchValue(this.selectedValue);
  }

  private compareSort(fieldName: string = 'Code') {
    return function (itemA: any, itemB: any) {
      if (itemA[fieldName] == undefined || itemB[fieldName] == undefined) {
        return 0;
      }
      if (itemA[fieldName].toLowerCase() < itemB[fieldName].toLowerCase()) {
        return -1;
      }
      if (itemA[fieldName].toLowerCase() > itemB[fieldName].toLowerCase()) {
        return 1;
      }
      return 0;

    };
  }

  private loadData() {
    if (this.configs['URL_CODE'] === undefined) {
      if (this.configs['data'] !== undefined) {
        this.data = this.configs['data'];
        this.myControl.reset({ value: this.selectedValue, disabled: false });
        this.initFileter();
      }
      return;
    }

    let filters = {};
    if (this.configs['filters']) {
      filters = this.configs['filters'];
    }
    this.comboService.get(this.configs['URL_CODE'], filters)
      .subscribe(resp => {
        let _data = [];
        if (resp['Success'] === true) {
          _data = resp['Data']['rows'] || resp['Data']['Rows'] || [];
        } else {
          if (resp['Status'] === true) {
            _data = resp['Data']['rows'] || resp['Data']['Rows'] || resp['Data'] || [];
          }
        }

        // Sorting Data
        if (this.configs['isSorting']) {
          const fieldName = this.configs['sortField'] ? this.configs['sortField'] : undefined;
          _data = _data.sort(this.compareSort(fieldName));
        }

        this.data = _data;
        this.myControl.reset({ value: this.selectedValue, disabled: false });
        this.initFileter();
        if (this.configs['defaultData'] !== undefined) {
          this.setDefaultData(this.configs['defaultData'])
        }
      });
  }
}
