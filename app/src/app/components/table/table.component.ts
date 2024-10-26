import { Component, ViewChild, AfterViewInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { RequestService } from './../../shared/request.service';
import { NotificationComponent } from './../../components/notification/notification.component';

export class MatPaginatorIntlCro extends MatPaginatorIntl {
  itemsPerPageLabel = 'Số dòng mỗi trang';
}

// export class TableDatarows {
//   public total: Number = 0;
//   public rows: any = new MatTableDataSource();
// }

// export class TableColumn {
//   displayedColumns: any = [];
//   options: object = []
//   actions: any = [];
// }

/**
 * @title Table retrieving data through HTTP
 */
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useClass: MatPaginatorIntlCro }],
})
export class TableComponent implements AfterViewInit {
  @HostListener('window:resize') onResize() {
    this.resizeView();
  }
  @Input() configs: any;
  @Input() header: any;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @Output('onFirstChange') change = new EventEmitter<any>();
  @Output('onActionHandle') actionEvent = new EventEmitter<any>();
  @Output('clickRow') clickRowEvent = new EventEmitter<any>();
  
  enableIndex: boolean = false;
  disableTools: boolean = false;
  editable: boolean = false;
  autoResize: boolean = false;
  currentHeight: Number = 0;
  tools: object = [
    { icon: "add", name: "add_new", enable: true },
    { icon: "refresh", name: "refresh", enable: true }
  ];
  remoteDatabase: any;
  options: object = {
    pageSizeOptions: [5, 10, 25, 100],
    pageSize: 10
  };

  noDataTxt: string = "Không tìm thấy dữ liệu";

  columns: object = {
    displayedColumns: [],
    options: [],
    actions: []
  };
  data: object = {
    total: 0,
    rows: <any>[]
  }
  // dataSource:any = new MatTableDataSource([]);
  total: number;

  remote: Object = {
    url: "",
    params: {}
  };
  isLoadingResults: Boolean = false;
  isEmpty: Boolean = true;
  smallDevice: boolean = false;
  filters: Object = null;

  constructor(public dialog: MatDialog,private request: RequestService, breakpointObserver: BreakpointObserver) {   
    // this.isEmpty = false;
    if (this.columns["displayedColumns"].indexOf('index')) {
      this.enableIndex = true;
    }

    breakpointObserver.observe([
      Breakpoints.Small
    ]).subscribe(result => {
      this.smallDevice = result.matches;
    });

  }
  clickRow(row:any) {
    this.clickRowEvent.emit({ selectedRow: row });
  }
  onClickActionHandle(event:any, action:any, row:any) {
    let _action = action;
    if (_action === 'notes') {
      _action = 'view';
    }
    let _index = (row['index'] || 0) - 1;
    if(_action == "delete" && this.configs['enableConfirm']) {
      this.showConfirm(row, _index);
    } else {
      this.actionEvent.emit({ action: _action, data: row, index: _index });
    }
    event.preventDefault();
  }
  renderText(row:any, option:any) {
    if (option['render'] != undefined) {
      return option['render'](row);
    }
    let field = option.name;
    if (!row[field]) {
      return "";
    }
    return row[field];
  }
  firshChangeHandle() {
    this.change.emit(this.paginator);
  }
  refresh() {
    this.filters = null;
    this.paginator.pageIndex = 0;
    this.paginator._changePageSize(this.paginator.pageSize);
  }
  search(data: Object) {
    this.filters = data;
    this.paginator.pageIndex = 0;
    this.paginator._changePageSize(this.paginator.pageSize);
  }
  addNew(event:any) {
    this.actionEvent.emit({ action: "new", data: null, index: null });
  }
  addRow(row:any) {
    if (row) {
      row['index'] = this.data['rows'].length + 1;
      this.data['rows'].push(row);
      this.data['rows'].filter = "";
    }
  }
  renderData(data: any) {
    this.data['rows'].data = data;
    this.data['total'] = data.length;
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
    this.data['rows'].filter = "";
  }
  updateRow(row: any, index: any) {
    if (this.data['rows'].data[index]) {
      this.data['rows'].data[index] = row;
      this.data['rows'].filter = "";
    }
  }
  addData(data: any) {
    this.data['rows'].data = data;
    this.data['rows'].filter = "";
  }
  onClickEventHandle(event:any) {
    if (event.name === "refresh") {
      this.refresh();
    } else {
      this.actionEvent.emit({ action: event.name, data: null, index: null });
    }
  }
  showConfirm(data:any, index:any) {
    const dialogRef = this.dialog.open(NotificationComponent, {
      data: {
        message: this.configs['removeMsg'] || 'msg_remove_row',
        ref: ""
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.actionEvent.emit({ action: "delete", data: data, index: index });
      }
    });
  }
  resizeView() {
    if (this.autoResize) {
      let appPageHeaderEle: any = document.querySelector('.app-page-header');
      let appHeaderEle = document.getElementById("app-header");
      let _h = 0;
      if (appPageHeaderEle != null) {
        _h += appPageHeaderEle.offsetHeight;
      }
      if (appHeaderEle != null) {
        _h += appHeaderEle.offsetHeight;
      }
      let tableHeight = (window.innerHeight - _h - 140);
      if (this.currentHeight != tableHeight) {
        this.currentHeight = tableHeight;
        let appTableEle: any = document.querySelector('.app-table-container .responsive-table');
        appTableEle.style.height = tableHeight + 'px';
      }
    }
  }
  ngOnInit() {
    this.columns = this.configs['columns'] || {};
    if (this.configs['data']) {
      this.total = this.configs['data'].total || 0;
      this.isEmpty = this.configs['data'].total == 0;
      this.data['rows'] = new MatTableDataSource<any>(this.configs['data']['rows'] || []);
    }
    if (this.configs['remote']) {
      this.remote = this.configs['remote'];
      //this.isLoadingResults = true;
    }
    if (this.configs['disableTools'] !== undefined) {
      this.disableTools = this.configs['disableTools'];
    }
    if (this.configs['editable'] !== undefined) {
      this.editable = this.configs['editable'];
    }
    if (this.configs['enableTools'] !== undefined) {
      for (var i in this.tools) {
        let _name = this.tools[i].name;
        if (this.configs['enableTools'][_name] !== undefined) {
          this.tools[i]['enable'] = this.configs['enableTools'][_name];
        }
      }
    }

    if (this.configs['externalTools'] !== undefined) {
      this.tools = { ...this.tools, ...this.configs['externalTools'] }
    }

    if (this.configs['autoResize'] !== undefined) {
      this.autoResize = this.configs['autoResize'];
    }
  }
  ngAfterViewInit() {
    this.resizeView();

    if (this.remote !== undefined && this.configs['remote'] && this.configs['remote']['url'] !== "") {
      this.remoteDatabase = new RemoteDatabase(this.request);      
      this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
      merge(this.sort.sortChange, this.paginator.page).pipe(
        startWith({}),
        switchMap(() => {
          // this.isLoadingResults = true;
          let _params = { ...(this.configs['remote']['params'] || {}) };
          _params['page'] = this.paginator.pageIndex;
          _params['limit'] = this.paginator.pageSize;
          if (this.filters !== null) {
            if (this.filters['keyword'] !== undefined) {
              _params['keyword'] = this.filters['keyword'];
            } else {
              _params['filter'] = JSON.stringify(this.filters);
            }
          }
          if (this.sort.active) {
            let _sort = _params['sort'] ? _params['sort'] : {}
            _sort[this.sort.active] = this.sort.direction;
            _params['sort'] = JSON.stringify(_sort);
          }
          //  if(!this.isLoadingResults)
          //   this.isLoadingResults = true;
          return this.remoteDatabase!.getList(
            this.configs['remote']['url'],
            _params
          );
        }),
        map(data => {
          // this.isLoadingResults = false;
          let _data = [];
          if (data['Success']) {
            _data = data['Data']['rows'];
            this.total = data['Data']['total'];
            this.isEmpty = this.total == 0;
            if (!this.isEmpty)
              this.clickRow(_data[0]);
          } else {
            this.total = 0;
            this.isEmpty = true;
            _data = [];
          }
          return _data;
        }),
        catchError(() => {
          // this.isLoadingResults = false;
          return observableOf([]);
        })
      ).subscribe(data => this.data['rows'] = data);

      this.firshChangeHandle();
    }
  }
}

/** An example database that the data source uses to retrieve data for the table. */
export class RemoteDatabase {
  constructor(private request: RequestService) { }

  getList(url:string, params: Object, sort: string, order: string, page: number): any {
    return this.request.get(url, params || {})
  }
}
