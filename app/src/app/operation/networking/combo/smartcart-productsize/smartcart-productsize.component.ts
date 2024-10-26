import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

import {FormControl} from '@angular/forms';
import {Observable, merge} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { OperationNetworkingService } from '../../operation-networking.service';

@Component({
  selector: 'smartcart-productsize-combo',
  templateUrl: './smartcart-productsize.component.html',
  styleUrls: ['./smartcart-productsize.component.css'],
  inputs: ['title', 'tabindex', 'value', 'disabled'],
  outputs: ['change:onChange']
})
export class SmartcartProductSizeComboComponent implements OnInit {
  @Input() disableField = false;
  @Output() @Input() productSize = "";
  justASimpleArray = [];
  public change = new EventEmitter<any>();
  myControl = new FormControl();
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
  ngAfterViewInit() {}  

  optionSelected(selectedVal) {
    this.productSize = selectedVal.value;
    this.change.emit(this.productSize);
  }

  closed(a) {}

  private loadData() {
    this.networkingService.get('Smartcart.productsizecombo', {})
    .subscribe(resp=>{
      let _data = [];
      if(resp['Success'] === true) {
        _data = resp['Data']['rows'] || [];
      }
      this.data = _data;
      this.justASimpleArray = _data;
    })
  }

}
