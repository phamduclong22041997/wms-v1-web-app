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

import { Component, ViewChild, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of as observableOf, BehaviorSubject } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatMenu } from '@angular/material';
import { Router } from '@angular/router';
import { NotificationComponent } from './../../components/notification/notification.component';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { RequestService } from './../../shared/request.service';

export class MatPaginatorIntlCro extends MatPaginatorIntl {
  itemsPerPageLabel = 'Số dòng mỗi trang';
  nextPageLabel = 'Trang tiếp theo';
  previousPageLabel = 'Trang trước';
  firstPageLabel = 'Đầu trang';
  lastPageLabel = 'Cuối trang';
}

/**
 * @title Table retrieving data through HTTP
 */
@Component({
  selector: 'app-edit-table',
  templateUrl: './edit-table.component.html',
  styleUrls: ['./table.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useClass: MatPaginatorIntlCro }],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('0ms')),
    ]),
  ],
})
export class EditTableComponent implements AfterViewInit {
  @Input() configs: String;
  @Input() matMenu: MatMenu;
  @Input() actions: any;
  @Output('onFirstChange') change = new EventEmitter<any>();
  @Output('clickRow') clickRowEvent = new EventEmitter<any>();
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild('selectAll', { static: false }) selectAllElement: any;
  @Output() rowCheck = new EventEmitter<any>();

  bSubject = new BehaviorSubject({});
  rowEvent: EventEmitter<any> = null;
  actionEvent: EventEmitter<any> = null;
  inputEvent: EventEmitter<any> = null;
  tableInitEvent: EventEmitter<any> = null;
  selection = new SelectionModel(true, []);
  enableIndex: Boolean = false;
  disableTools: Boolean = false;
  enableSelected: Boolean = false;
  enableAddNew: Boolean = false;
  enableCollapse: Boolean = false;
  expandedElement: any;
  enableCheckbox: Boolean = false;
  selectedAll: Boolean = false;
  isDisabledHeaderCheckbox: Boolean = false;
  enableFirstLoad: Boolean = true;
  requestOptions: any = null;
  FLAG: any = 0;
  options: object = {
    pageSizeOptions: [10, 25, 50, 100],
    pageSize: 10
  };

  remoteDatabase: any;
  noDataTxt: String = 'Không tìm thấy dữ liệu';
  columns: object = {
    displayedColumns: [],
    options: [],
    actions: [],
    actionTitle: ''
  };
  total: number;
  data: object = {
    total: 0,
    rows: <any>[]
  };
  remote: Object = {
    url: '',
    params: {},
    callback: function(){}
  };
  isLoadingResults: Boolean = false;
  isEmpty: Boolean = true;
  filters: Object = null;
  enableSelectRow: Boolean = false;
  selectedRow: any = null;

  constructor(
    public dialog: MatDialog,
    private request: RequestService,
    private router: Router,
  ) {
    this.rowEvent = new EventEmitter<any>();
    this.actionEvent = new EventEmitter<any>();
    this.inputEvent = new EventEmitter<any>();
    this.tableInitEvent = new EventEmitter<any>();

    if (this.columns['displayedColumns'].indexOf('index')) {
      this.enableIndex = true;
    }
    if (this.columns['displayedColumns'].indexOf('selected')) {
      this.enableSelected = true;
    }
  }
  highlightCondition(row: any, option: any) {
    if (option['highlight'] && option['highlight']['condition'] != undefined) {
      return option['highlight']['condition'](row);
    }
    return;
  }
  customStyle(row:any, option:any) {
    if (option['customStyle'] != undefined) {
      return option['customStyle'](row);
    }
    return null;
  }
  renderBorderStyle(row: any, option: any) {
    if (option['borderStyle'] !== undefined) {
      return option['borderStyle'](row);
    }
  }
  renderText(row: any, option: any) {
    if (option['render'] !== undefined) {
      return option['render'](row);
    }
    const field = option.name;
    if (row[field] == undefined) {
      return '';
    }
    return row[field];
  }
  firshChangeHandle() {
    this.change.emit(this.paginator);
  }
  refresh() {
    this.filters = null;
    this.paginator.pageIndex = 0;
    this.bSubject.next({action: "refresh"});
  }
  search(data: Object, requestOptions: any = {}) {

    this.filters = data;
    if (this.requestOptions == null) {
      this.requestOptions = requestOptions;
      this.initLoadData();
    }

    this.paginator.pageIndex = 0;
    this.bSubject.next({action: "refresh"});
  }
  renderData(data: any, selectedRow: number = null) {
    this.data['rows'].data = this.reIndexRows(data);
    this.data['total'] = data.length;
    
    if(this.configs['enableSelectRow'] && this.configs['selectedFirstRow'] && data.length) {
      this.onSelectRow(null, this.data['rows'].data[0]);
    }
    if(this.configs['enableSelectRow'] && selectedRow > 0 && data.length && this.data['rows'].data[selectedRow]) {
      this.onSelectRow(null, this.data['rows'].data[selectedRow]);
    }
  }
  getData() {
    return {
      'data': this.data['rows'] && this.data['rows'].data ? this.data['rows'].data : this.data['rows'],
      'summary': this.data['summary'] && this.data['summary'].data ? this.data['summary'].data : this.data['summary'],
      'total': this.data['rows'] && this.data['rows'].data && this.data['rows'].data.length ? this.data['rows'].data.length:this.data['rows'].length,
    }
  }
  addRow(row: any) {
    if (row) {
      let _data = this.data['rows'].data;
      _data.unshift(row);
      this.data['rows'].data = this.reIndexRows(_data);
      this.data['total'] += 1;
      this.data['rows'].filter = '';
    }
  }
  clearData() {
    this.data['rows'].data = [];
    this.data['total'] = 0;
    this.data['rows'].filter = '';
  }
  removeRow(index: any) {
    let _data = [];
    for (let i in this.data['rows'].data) {
      let _row = this.data['rows'].data[i];
      if (parseInt(i) !== index) {
        _row['index'] = _data.length + 1;
        _data.push(_row);
      }
    }
    this.data['rows'].data = _data;
    this.data['total'] -= 1;
    this.data['rows'].filter = '';
  }
  updateRow(row: any, index: any) {
    if (this.data['rows'].data[index]) {
      this.data['rows'].data[index] = row;
      this.data['rows'].filter = '';
    }
  }
  reIndexRows(data: any) {
    let idx = 0;
    for (let i in data) {
      data[i]['index'] = ++idx;
    }
    return data;
  }
  disabledAction(isDisabled = false) {
    return isDisabled;
  }
  resetSelectedData() {
    this.selectedAll = false;
    for (let i in this.data['rows'].data) {
      this.data['rows'].data[i].selected = false;
    }
  }
  denySelectedAll() {
    this.selectedAll = false;
  }
  selectedAllData() {
    this.selectedAll = true;
    for (let i in this.data['rows'].data) {
      this.data['rows'].data[i].selected = true;
    }
    this.rowEvent.next(this.data['rows'].data);
  }
  disabledHeaderCheckbox(value: boolean): void {
    this.isDisabledHeaderCheckbox = value;
  }
  onHeaderChecked(event: any) {
    const _checked = event.checked;
    this.selectedAll = _checked;
    let _data = this.data['rows'] && this.data['rows'].length ? this.data['rows'] : this.data['rows'].data;
    for (let i in _data) {
      _data[i].selected = _checked;
    }
    this.rowEvent.next(this.data['rows'].data);
  }

  onRowChecked(event: any, row: any) {
    row.selected = event.checked;
    if (!event.checked) {
      this.selectedAll = false;
    }
    else {
      let _selectedAll = true;
      let _data = this.data['rows'] && this.data['rows'].length ? this.data['rows'] : this.data['rows'].data;
      for (let i in _data) {
        if (!_data[i].selected) {
          _selectedAll = false;
          break;
        }
      }
      this.selectedAll = _selectedAll;
    }
    
    this.rowCheck.next(row); // check on row
    this.rowEvent.next(this.data['rows'].data);
  }

  getdata() {
    return this.data['rows'].data;
  }

  comboHandle(row: any, option: any) {
    return (data: any) => {
      row[option.name] = data;
    }
  }
  inputNumberHandle(event: any, row: any) {
    let rowevent = {
      'typeinput': event.srcElement.type,
      'type': event.type,
      'data': row
    }

    this.inputEvent.next(rowevent);
  }
  onClickHeaderAction(event: any, headerAction:any) {
    if (headerAction.onClick) {
      headerAction.onClick(this.selection.selected);
    }
  }
  onToggleCheck(row?: any): string {
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
  masterToggle() {
    this.data['rows'].forEach(row => {
      this.selection.select(row);
    });
  }
  onSelectRow(event: any, row: any) {
    this.expandedElement = this.expandedElement == row ? null : row;
    // this.selection.toggle(row);
    if (!this.configs['rowSelected'] && !this.configs['enableSelectRow']) {
      return;
    }
    this.selectedRow = row;
    this.rowEvent.next(row);
  }
  showConfirm(data: any, index: any) {
    const dialogRef = this.dialog.open(NotificationComponent, {
      data: {
        message: this.configs['removeMsg'] || 'msg_remove_row',
        ref: ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.removeRow(index);
        this.actionEvent.emit({ action: 'delete', data: data, index: index });
      }
    });
  }
  createNewRow() {
    if (this.configs['addRoute'])
      this.router.navigate([this.configs['addRoute'], {}]);
  }
  clickRow(row: any) {
    this.clickRowEvent.emit({ selectedRow: row });
  }
  onClickCell(event: any, row: any, options: any) {
    if (options.link && options.onClick) {
      let _link = options.onClick(row);
      this.router.navigate([_link, {}]);
    }
    if (options.action && options.onClick) {
      options.onClick(row);
    }
    else if(options.onClick){
      options.onClick(row);
    }
  }
  onLeftClickHref(event: any, row: any, options: any) {
    event.preventDefault();
    if (options.link && options.onClick) {
      const _link = options.onClick(row);
      if (options.newpage) {
        window.open(_link, '_blank');
      }
      else {
        this.router.navigate([_link, {}]);
      }

    }
  }
  onClickContextMenu() {
    document.getElementsByClassName('context-menu-btn')[0]['style'].color = '#d0333a';
  }
  closeContextMenu() {
    document.getElementsByClassName('context-menu-btn')[0]['style'].color = null;
  }
  renderLink(row: any, options: any) {
    const _link = options.onClick(row);
    return _link;
  }

  renderTooltip(toolTip: any = null) {
    if (toolTip && toolTip.name) {
      return toolTip['name'];
    }
  }
  isCustomizeAction(action: any) {
    if (typeof action === 'object') {
      return true;
    }
    return false;
  }
  onClickActionHandle(event: any, action: any, row: any) {
    let _action = action;
    if (_action === 'notes') {
      _action = 'view';
    }
    if (_action === 'new') {
      this.createNewRow();
    } else {
      const _index = row ? (row['index'] || 0) - 1 : -1;
      if (_action === 'delete') {
        this.showConfirm(row, _index);
      } else {
        this.actionEvent.emit({ action: _action, data: row, index: _index });
      }
      event.preventDefault();
    }
  }
  onCheckboxHandle(event: any, row: any) {
    this.rowEvent.next(row);
  }

  guidGenerator() {
    const S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
  }
  setConfig(configs: any = null) {
      this.ngOnInit()
  }
  ngOnInit() {
    this.columns = this.configs['columns'] || {};
    this.configs['id'] = this.guidGenerator();
    if (this.configs['data']) {
      this.data = {
        total: this.configs['data']['rows'].length,
        rows: new MatTableDataSource(this.configs['data']['rows'])
      }
    }
    if (this.configs['enableFirstLoad'] !== undefined) {
      this.enableFirstLoad = this.configs['enableFirstLoad'];
    }
    if (this.configs['pageSize']) {
      this.options['pageSize'] = this.configs['pageSize'];
    }
    if (this.configs['showFirstLastButton']) {
      this.options['showFirstLastButton'] = this.configs['showFirstLastButton'];
    }
    if (this.configs['remote']) {
      this.remote = this.configs['remote'];
    }
    if (this.configs['enableAddNew'] !== undefined) {
      this.enableAddNew = this.configs['enableAddNew'];
    }
    if (this.configs['enableCheckbox'] !== undefined) {
      this.enableCheckbox = this.configs['enableCheckbox'];
    }
    if (this.configs['selectedAll'] !== undefined) {
      this.selectedAll = this.configs['selectedAll'];
    }
    if (this.configs['enableSelectRow'] !== undefined) {
      this.enableSelectRow = this.configs['enableSelectRow'];
    }
    if (this.configs['enableCollapse'] !== undefined) {
      this.enableCollapse = this.configs['enableCollapse'];
    }
  }
  ngAfterViewInit() {
    if (this.enableFirstLoad) {
      this.initLoadData();
    }
  }
  initLoadData() {
    if (this.FLAG == 1) {
      return;
    }
    this.FLAG = 1;
    if (this.selectAllElement) {
      this.selectAllElement['change'].subscribe({
        next: (event: any) => {
          for (const i in this.data['rows']) {
            this.data['rows'][i]['selected'] = event['checked'];
            this.onCheckboxHandle(event, this.data['rows'][i]);
          }
        }
      });
    }
    if (this.remote !== undefined && this.configs['remote'] && this.configs['remote']['url'] !== '') {
      this.remoteDatabase = new RemoteDatabase(this.request);
      this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
      merge(this.sort.sortChange, this.paginator.page, this.bSubject).pipe(
        startWith({}),
        switchMap(() => {
          const _params = { ...(this.configs['remote']['params'] || {}) };
          _params['page'] = this.paginator.pageIndex + 1;
          _params['limit'] = this.paginator.pageSize;
          _params['PageIndex'] = this.paginator.pageIndex + 1;
          _params['RecordsPerPage'] = this.paginator.pageSize;
          if (this.filters !== null) {
            if (this.filters['keyword'] !== undefined) {
              _params['keyword'] = this.filters['keyword'];
            } else {
              _params['filter'] = JSON.stringify(this.filters);
              _params['regionCode'] = this.filters['regionCode'] ? this.filters['regionCode'] : null;
            }
          }
          if (this.sort.active) {
            const _sort = _params['sort'] ? _params['sort'] : {};
            _sort[this.sort.active] = this.sort.direction;
            _params['sort'] = JSON.stringify(_sort);
          }
          return this.remoteDatabase!.getList(
            this.configs['remote']['url'],
            _params,
            this.requestOptions
          );
        }),
        map(data => {
          let _data = [];
          if (data['Success'] || data['Status']) {
            _data = data['Data']['rows'] || data['Data']['Rows'] || data['Data']['Data'] || data['Data'] || [];;
            this.total = data['Data']['total'] || data['Data']['Total'] || data['Data']['TotalRecords'] || data['TotalRecords'] || 0;
            this.isEmpty = this.total === 0;
            if (data['Data']) {
              this.tableInitEvent.emit(data['Data']);
            }
            if (!this.isEmpty) {
              this.clickRow(_data[0]);
            }
          } else {
            this.total = 0;
            this.isEmpty = true;
            _data = [];
          }
          this.data['rows'] = data['Data']['rows'] || data['Data']['Rows'] || data['Data']['Data'] || data['Data'] || [];
          this.data['total'] = data['Data']['total'] || data['Data']['Total'] || data['Data']['TotalRecords'] || data['TotalRecords'] || 0;
          this.data['summary'] = data['Data']['summary'] || data['Data']['Summary'] || [];

          return _data;
        }),
        catchError(() => {
          return observableOf([]);
        })
      ).subscribe(data => {
        // Reset Selection to empty when fetch data table if enableCheckbox
        if (this.enableCheckbox) {
          this.selection = new SelectionModel(true, []);
          this.selectedAll = false;
        }
        this.data['rows'] = data;

        if(this.configs['remote'] && this.configs['remote']['callback'])
          this.configs['remote']['callback'](data)
        
        this.actionEvent.emit({ action: 'loaded_data', data: {} });
      });
      this.firshChangeHandle();
    } else {
      if (this.data && this.data['rows']) {
        this.data['rows']['paginator'] = this.paginator;
      }
    }
  }
}

/** An example database that the data source uses to retrieve data for the table. */
export class RemoteDatabase {
  constructor(private request: RequestService) { }

  getList(url: string, params: Object, options: any = {}): any {
    return this.request.get(url, params || {}, options)
  }
}
