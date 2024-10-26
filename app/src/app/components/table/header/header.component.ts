import {
  Component,
  OnInit,
  ChangeDetectorRef,
  EventEmitter,
  Output,
  Input,
  ViewChild
} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-table-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class TableHeaderComponent implements OnInit {
  @Input() placeholder: any;
  @Input() headerInputs: any;
  @Output('onChange') change = new EventEmitter<any>();
  @ViewChild('headerCombo', { static: false }) headerCombo: any;
  mobileQuery: MediaQueryList;
  public data:any;
  private _mobileQueryListener: () => void;

  configs = {
    search: "Tìm Kiếm",
    addNew: "Tạo Mới",
    inputList: []
  }

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () =>  changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  ngOnInit() {
    if (this.placeholder) {
      this.configs['search'] = this.placeholder;
    }
    if (this.headerInputs) {
      this.configs['inputList'] = this.headerInputs;
    }
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  applyFilter(event) {
    this.change.emit({type: 'FILTER', data: event.target.value});
  }
  onPaste(event: ClipboardEvent) {
    let clipboardData = event.clipboardData;
    let pastedText = clipboardData.getData('text');
    this.change.emit({type: 'FILTER', data: pastedText});
  }
  doFilter(event) {
    this.change.emit({type: 'FILTER', data: this.data});
  }
  reset() {
    if(this.data) {
      this.data = "";
      this.change.emit({type: 'FILTER', data: ""});
    }
  }
  ngAfterViewInit() {
    if (this.headerInputs && this.headerCombo) {
      this.headerCombo['change'].subscribe({
        next: (_data: any) => {
          if (_data !== 'error') {
            this.change.emit({type: 'FILTER', filterdata: _data});
          }
        }
      });
    }
  }
}