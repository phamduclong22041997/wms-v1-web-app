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

import { Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { Observable, merge } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { ComboService } from './../combo.service';
import { FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-combo',
    templateUrl: './combo.component.html',
    styleUrls: ['./combo.component.css']
})
export class ComboComponent implements OnInit {
    @Input() configs: any;
    @Input() comboName: any;
    @Input() onChange: any;
    @Input() required: any;
    @Input() disabled: any;
    @Input() readonly: any;
    @Input() value: any;
    @Input() tabindex: any;
    @Input() title: any;
    @ViewChild(MatAutocompleteTrigger, { static: false }) autocomplete: MatAutocompleteTrigger;

    change = new EventEmitter<any>();
    myControl = new FormControl();
    filteredOptions: Observable<any[]>;
    simpleObservable = new EventEmitter<any>();

    data: any = [];
    type: string = 'autocomplete';
    selectedValue: any = '';
    selectedData: any = null;
    autocompleteDisabled: boolean = false;
    clearValue: boolean = true;

    constructor(private comboService: ComboService, private translate: TranslateService) { }

    ngOnInit() { }

    ngAfterViewInit() {
        setTimeout(() => {
            this.initData();
        }, 100)
    }

    initData() {
        if (!this.configs)
            return;
        if (this.configs.type) {
            this.type = this.configs.type;
        }
        if (this.configs['clearValue']) {
            this.clearValue = this.configs['clearValue'];

        }
        if (!this['disabled'] && !this.configs['disableAutoload']) {
            this.loadData();
        }

        if (this['value'] !== undefined) {
            this.myControl.setValue(this['value']);
            this.selectedValue = this['value'];
        }
        if (this['readonly'] === true) {
            this.myControl.setValue(this.selectedValue);
        } else
            if (this['disabled'] === true) {
                this.myControl.reset({ value: this.selectedValue, disabled: true });
            }

        if (this.configs['defaultValue'] !== undefined && this.configs['defaultValue']) {
            let _val = this.setValue(this.configs['defaultValue']);
            if (!_val) {
                this.setDefaultValue(this.configs['defaultValue']);
            } else {
                setTimeout(() => {
                    this.change.next(_val);
                }, 300)
            }
        } else {
            if (this.configs['selectedFirst'] === true && this.data[0]) {
                this.setValue(this.configs['val'](this.data[0]));
                setTimeout(() => {
                    this.change.emit(this.data[0]);
                }, 300)
            }
        }
    }

    initFileter() {
        this.filteredOptions = merge(this.myControl.valueChanges, this.simpleObservable).pipe(
            startWith(''),
            map(value => {
                return this._filter(value);
            })
        );
    }

    onBlur(event: any) {
        if (event.target.value !== this.selectedValue) {
            this.selectedValue = event.target.value;
            this.change.emit(this.selectedValue);
            event.preventDefault();
        }
        if (this.selectedValue !== '' && !event.target.value) {
            this.change.emit('error');
        }
        if (this.selectedValue == '' && !event.target.value) {
            this.simpleObservable.emit('');
        }
    }

    onFocus(event: any) {
        if (this.selectedValue !== '') {
            this.simpleObservable.emit('');
        }
    }

    onKeydown(event: any) {
        if (this.type === 'combo') {
            event.preventDefault();
        }
    }

    generateId(data: any) {
        return this.configs['val'](data);
    }
    render(data: any) {
        if (this.configs['render'] !== undefined) {
            return this.configs['render'](data);
        } else {
            return this.configs['val'](data);
        }
    }
    labelStatus(data: any) {
        if (this.configs['labelStatus'] !== undefined) {
            return this.configs['labelStatus'](data);
        }
    }
    renderLabelStyle(data: any) {
        if (this.configs['labelStyle'] !== undefined) {
            return this.configs['labelStyle'](data);
        }
    }
    renderOptionStyle(data:any) {
        if (this.configs['optionStyle'] !== undefined) {
            return this.configs['optionStyle'](data);
        }
    }
    disabledInput(isDisabled: any, value: any) {
        this.selectedValue = '';
        this.myControl.reset({
            disabled: isDisabled,
            value: value
        });
    }
    optionSelected(selectedVal: any) {
        if (selectedVal) {
            const _selectedVal = selectedVal.option.id;
            if (selectedVal.value) {
                this.selectedValue = selectedVal.value;
            }
            if (selectedVal.option && selectedVal.option.value) {
                this.selectedValue = selectedVal.option.value;
            }
            let _data = null;

            for (let i = 0; i < this.data.length; i++) {
                const key = this.configs['val'](this.data[i]);
                if (key == _selectedVal/*this.selectedValue*/) {
                    _data = this.data[i];
                    break;
                }
            }
            this.change.next(_data);
            if (this.onChange) {
                this.onChange(_data, this.comboName);
            }
        }
    }

    setDefaultOption(selectedVal: any) {
        this.setValue(this.configs['val'](selectedVal));
        setTimeout(() => {
            this.change.emit(selectedVal);
        }, 300)
    }

    setDefaultValue(selectedVal: any) {
        this.selectedValue = selectedVal;
        this.myControl.setValue(this.selectedValue);
    }

    setDefaultData(data: any) {
        let _selectedData: any = null;
        for (const i in this.data) {
            if (data === this.configs['val'](this.data[i])) {
                _selectedData = this.data[i];
                break;
            }
        }
        if (_selectedData != null) {
            this.selectedValue = this.render(_selectedData);
            this.myControl.setValue(this.selectedValue);
            this.simpleObservable.emit('');
        }
    }

    setValue(value: any) {
        let _selectedData: any = null;
        for (const i in this.data) {
            if (value === this.configs['val'](this.data[i])) {
                _selectedData = this.data[i];
                break;
            }
        }
        if (_selectedData != null) {
            this.selectedValue = this.render(_selectedData);
        } else {
            this.selectedValue = '';
        }

        this.myControl.setValue(this.selectedValue);
        this.simpleObservable.emit('');
        this.change.emit(_selectedData);

        return _selectedData;
    }

    closed(a: any) {
        // this.myControl.setValue(this.selectedValue);
    }

    closeCombo() {
        this.autocomplete.closePanel();
    }

    clearData() {
        this.data = [];
        this.selectedValue = '';
    }
    clear(disabled: any, includeData: any) {
        this.selectedValue = '';
        const val = { value: '', disabled: false };
        if (disabled === true) {
            val['disabled'] = true;
        }
        if (includeData === true) {
            this.data = [];
        }
        this.myControl.reset(val);
        this.change.emit(null);

        if (this.onChange) {
            this.onChange(null, this.comboName);
        }
    }

    clearInput() {
        this.selectedValue = '';
        this.myControl.setValue('');
        this.change.emit('');

        if (this.onChange) {
            this.onChange(null, this.comboName);
        }
    }

    setData(data: any) {
        this.data = data;
        if (this.configs['isSelectedAll'] && this.data && this.data.length > 1) {
            let _item = {
                'Code': this.configs['isSelectedAllValueIsEmpty'] ? '' : 0,
                'Name': this.translate.instant('combo.all'),
                'ShortName': this.translate.instant('combo.all'),
                'FullName': this.translate.instant('combo.all')
            }
            _item[this.configs['filter_value'] || 'Code'] = this.configs['isSelectedAllValueIsEmpty'] ? '' : 0;
            _item[this.configs['filter_key'] || 'Name'] = this.translate.instant('combo.all');
            let p = this.data.find(x => !x.Code || x.Code === _item.Code);
            if(!p){
                this.data.unshift(_item);
            }
        }
    }

    resetInput() {
        this.selectedValue = '';
        this.myControl.setValue('');
    }

    private removeAscent(str: string) {
        if (str === null || str === undefined) {
            return str;
        }
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
        str = str.replace(/đ/g, 'd');
        return str;
    }

    private _filter(value: string): string[] {
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

    public reload(filters: any = {}) {
        if (filters) {
            this.configs['filters'] = filters;
            this.loadData();
        }
    }

    public reset() {
        if (this.configs['selectedFirst'] && !this.selectedValue && this.data[0]) {
            this.setValue(this.configs['val'](this.data[0]));
            setTimeout(() => {
                this.change.emit(this.data[0]);
            }, 300);
        }
        this.initFileter();
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

                // Set Default Option - All
                if (this.configs['isSelectedAll'] && this.data && this.data.length > 1) {
                    let _item = {
                        'Code': this.configs['isSelectedAllValueIsEmpty'] ? '' : 0,
                        'Name': this.translate.instant('combo.all'),
                        'ShortName': this.translate.instant('combo.all'),
                        'FullName': this.translate.instant('combo.all')
                    }
                    _item[this.configs['filter_value'] || 'Code'] = this.configs['isSelectedAllValueIsEmpty'] ? '' : 0;
                    _item[this.configs['filter_key'] || 'Name'] = this.translate.instant('combo.all');
                    this.data.unshift(_item);
                }

                this.myControl.reset({ value: this.selectedValue, disabled: false });
                this.initFileter();

                if (this.configs['defaultValue'] && typeof this.configs['defaultValue'] === 'string') {
                    this.change.next(this.setValue(this.configs['defaultValue']));
                } else {
                    const optionSelectedFirst = this.configs['optionSelectedFirst'] || 0;
                    if (this.configs['selectedFirst'] === true && this.data[optionSelectedFirst]) {
                        this.setValue(this.configs['val'](this.data[optionSelectedFirst]));
                        this.change.next(this.data[optionSelectedFirst]);
                    }
                }

                if (this.configs['defaultData'] !== undefined) {
                    this.setDefaultData(this.configs['defaultData'])
                }

                if (this.configs['selectedFirst'] && !this.selectedValue && this.data[0]) {

                    this.setValue(this.configs['val'](this.data[0]));
                    setTimeout(() => {
                        this.change.emit(this.data[0]);
                    }, 300)
                }
            });
    }

    private compareSort(fieldName: string = 'Code') {
        return function (itemA: any, itemB: any) {
            if (itemA[fieldName] && itemB[fieldName]) {
                if (itemA[fieldName].toLowerCase() < itemB[fieldName].toLowerCase()) {
                    return -1;
                }
                if (itemA[fieldName].toLowerCase() > itemB[fieldName].toLowerCase()) {
                    return 1;
                }
            }
            return 0;
        };
    }
}