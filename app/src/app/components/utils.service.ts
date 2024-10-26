import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  constructor(private translate: TranslateService, private adapter: DateAdapter<any>) {

    
   }
  
  parseDate2String(date: any) {
    return this.adapter.parse(date, null).format(this.translate.instant("format_date"));
  }
}