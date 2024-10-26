/**
 * Copyright (c) 2019 OVTeam
 * Modified date: 2019/12/12
 * Modified by: Duy Huynh, Huy Nghiem
 */

import { Component, OnInit, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css']
})
export class DatePickerComponent implements OnInit {
  @Input() options: any;
  @Input() datePickerName: any;
  @Input() onSelected: any;
  @Input() required: any;
  @Input() placeholder: any;
  @Input() disabled: any;
  @Input() tabindex: any;
  @Input() mindate: any;
  @Input() isReadonly: boolean;

  @ViewChild('ref', { static: false }) ref: ElementRef;

  change = new EventEmitter<any>();
  formDate = new FormControl(new Date());
  formDateValue = new Date();

  minDate = new Date(2000, 1, 1);
  maxDate = new Date();
  
  constructor(private translate: TranslateService) { }

  ngOnInit() { 
    this.initDate();
  }

  ngAfterViewInit() {}

  initDate() {
    if (this.options) {
      if (this.options.setDefaultDate === false) {
        this.formDate.setValue('');
        this.formDateValue  = null;
      }
      if (this.options.setMaxDate === false) {
        this.maxDate = new Date();
      }
      if (this.options.setMaxDate) {
        this.maxDate = new Date(9999, 1, 1);
      }
      if (this.options.setMinDate) {
        this.minDate = this.options.minDate;
      }
    }
  }

  setValue(dateTime: any) {
    this.formDate.setValue(dateTime);
    this.change.next(this.formDateValue);
  }

  getValue() {
    return this.formDateValue;
  }

  removeAlphabet(text: string) {
    return text.replace(/[a-zA-Z]/g, '');
  }

  validationDateString(text: string) {
    return (/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/).test(text);
  }

  changeDate($event: any) {
    this.formatDate($event.target.value, true);
  }

  selectedDate($event: any) {
    this.change.next(this.formDateValue);
  }

  orgValueChange(value: any) {
    this.formatDate(value, false);
  }

  formatDate(value: any, defaultCurrentDate: boolean){
    const dateString = this.removeAlphabet(value);
    if (!dateString) {
      this.formDate.setValue('');
      return;
    }
    if (this.validationDateString(dateString) || dateString.length === 8) {
      const _selectedDate = moment(dateString, ['DD/MM/YYYY']);
      if (this.maxDate && _selectedDate.toDate() > new Date() && (this.options && !this.options.setMaxDate)) {
        this.formDate.setValue(new Date());
        return;
      }
      this.formDate.setValue(new Date(_selectedDate.toISOString()));
    } else {
      if(defaultCurrentDate){
        this.formDate.setValue(new Date());
      }
    }
  }
}
