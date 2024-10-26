
/**
 * Copyright (c) 2019 OVTeam
 * Modified by: Duy Huynh, Huy Nghiem
 * Modified date: 2020/08
 */

import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Service } from '../../service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../shared/toast.service';
import * as moment from 'moment';
interface TableAction {
  icon: string;
  class?: string;
  name?: String;
  toolTip?: any;
  actionName?: any;
  disabledCondition?: any;
}

@Component({
  selector: "app-masan-store",
  templateUrl: "./component.html",
  styleUrls: ["./component.css"],
})
export class MappingLostFoundComponent implements OnInit, AfterViewInit {
  @ViewChild("appTable", { static: false }) appTable: ElementRef;
  @ViewChild('fromDate', { static: false }) fromDate: any;
  @ViewChild('toDate', { static: false }) toDate: any;
  @ViewChild('whBranch', { static: false }) whBranch: any;
  @ViewChild('location', { static: false }) location: any;
  @ViewChild('bin', { static: false }) bin: ElementRef;
  @ViewChild('client', { static: false }) client: any;

  tableConfig: any;
  filters: Object;
  configDate: any;
  clientConfig: Object;
  whBranchConfig: Object;
  binConfig: Object;

  constructor(
    private translate: TranslateService,
    private service: Service,
    private toast: ToastService,
    public dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit() {
    this.initData();
    this.loadCurrentMapping();
  }

  initData() {
    this.filters = {
      ClientCode:'',
      Content: '',
      TransportCode: "",
      LocationLabel: "",
      FromDate: moment().subtract(7, 'day').format('YYYY-MM-DD'),
      ToDate: moment().format('YYYY-MM-DD'),
      WarehouseCode: window.localStorage.getItem('_warehouse')
    };
    this.initTable();
    this.initCombo();
  }

  initTableAction(): TableAction[] {
    return [
      {
        icon: "forward",
        name: 'forward',
        toolTip: {
          name: "Xử lý",
        },
        class: "ac-task",
        disabledCondition: (row: any) => {
          return row.MatchQty > 0;
        }
      }
    ];
  }

  initCombo() {
    this.clientConfig = {
      selectedFirst: true,
      isSelectedAll: false,
      isSorting: false,
      isSelectedAllValueIsEmpty: true,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return `${option['Code']} - ${option['Name']}`;
      },
      type: 'combo',
      filter_key: 'Name',
      URL_CODE: 'SFT.clientcombo'
    };

    this.whBranchConfig = {
      selectedFirst: true,
      isSelectedAll: false,
      isSorting: false,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return `${option['Code']} - ${option['Name']}`;
      },
      type: 'autocomplete',
      filter_key: 'Code',
      URL_CODE:'SFT.branchscombo',
      filters: {
        WarehouseCode: this.filters['WarehouseCode']
      }
    };
    this.binConfig = {
      selectedFirst: false,
      isSelectedAll: false,
      filters: {},
      isFilter: true,
      disableAutoload: true,
      val: (option: any) => {
        return option['Code'];
      },
      render: (option: any) => {
        return option['Code'];
      },
      type: 'autocomplete',
      filter_key: 'Code',
      URL_CODE: 'SFT.foundBins'
    }
  }

  initTable() {
    this.tableConfig = {
      columns: {
        actionTitle: "action",
        isContextMenu: false,
        actions: this.initTableAction(),
        displayedColumns: [
          "index",
          'ClientCode',
          "SKU",
          "SKUName",
          "Uom",
          "LostCode",
          "FoundCode",
          "FoundExpiredDate",
          "LostQty",
          // "LostRemainQty",
          "FoundQty",
          // "FoundRemainQty",
          "MatchQty",
          "actions",
        ],
        options: [
          {
            title: 'client',
            name: 'ClientCode',
            style: {
              'min-width': '60px',
              'max-width': '90px'
            }
          },
          {
            title: "LostFound.SKU",
            name: "SKU",
            isEllipsis: true,
          },
          {
            title: "LostFound.SKUName",
            name: "SKUName",
            isEllipsis: true,
          },
          {
            title: "uom",
            name: "Uom",
          },
          {
            title: "LostFound.LostCode",
            name: "LostCode",
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/lost-found/lost-detail/${data.LostCode}`;
            }
          },
          {
            title: "LostFound.LostQty",
            name: "LostQty",
          },
          // {
          //   title: "LostFound.LostRemainQty",
          //   name: "LostRemainQty",
          //   style: {
          //     "min-width": "80px",
          //     "max-width": "100px"
          //   }
          // },
          // {
          //   title: "LostFound.FoundRemainQty",
          //   name: "FoundRemainQty",
          //   style: {
          //     "min-width": "80px",
          //     "max-width": "100px"
          //   }
          // },
          {
            title: "LostFound.FoundCode",
            name: "FoundCode",
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/lost-found/found-detail/${data.FoundCode}`;
            }
          },

          {
            title: "LostFound.FoundExpiredDate",
            name: "FoundExpiredDate",
          },
          
          {
            title: "LostFound.FoundQty",
            name: "FoundQty",
          },
          {
            title: "LostFound.Grid.MappingQty",
            name: "MatchQty",
          },
        ]
      },
      data: {
        rows: [],
        total: 0
      }
    };
  }

  loadCurrentMapping() {
    this.service.loadCurrentMapping(this.filters)
      .subscribe((resp: any) => {
        let data = []
        if (resp.Status) {
          data = resp.Data || [];
        }
        this.appTable['renderData'](data);
      })
  }

  autoMapping() {
    this.service.autoMapping(this.filters)
      .subscribe((resp: any) => {
        let data = []
        if (resp.Status) {
          data = resp.Data || [];
        }
        this.appTable['renderData'](data);

        if(data.length == 0) {
          this.toast.info("Không tìm thấy liên kết hàng thất lạc và hàng tìm thấy.", "Thông báo")
        }
      })
  }

  search(event: any) {
    const fromDate = this.fromDate.getValue();
    const toDate = this.toDate.getValue();
    if (fromDate) {
      const _date = moment(fromDate);
      this.filters['FromDate'] = _date.format('YYYY-MM-DD');
    } else {
      this.filters['FromDate'] = '';
    }
    if (toDate) {
      const _date = moment(toDate);
      this.filters['ToDate'] = _date.format('YYYY-MM-DD');
    } else {
      this.filters['ToDate'] = '';
    }
    this.autoMapping();
  }

  ngAfterViewInit() {
    this.initEvent();

    const sevenDayBefore = moment().subtract(7, 'day').toDate();
    this.fromDate.setValue(sevenDayBefore);
    this.appTable['search'](this.filters);
  }

  initEvent() {    
    this.client['change'].subscribe({
      next: (value: any) => {
        this.filters['ClientCode'] = value ? value.Code : '';
        if(this.whBranch) {
          this.whBranch['reload']({ClientCode: this.filters['ClientCode'], data: this.filters['WarehouseCode']});
        }
      }
    });
   
    this.fromDate['change'].subscribe({
      next: (value: any) => {
        this.compareDate();
      }
    });

    this.toDate['change'].subscribe({
      next: (value: any) => {
        this.compareDate();
      }
    });

    this.whBranch['change'].subscribe({
      next: (data: any) => {
        let val = data ? data.Code : "";
        if(this.filters['WarehouseSiteId'] != val){
          this.filters['WarehouseSiteId'] = val;
          if (this.bin) {
            this.bin['clear'](false, true);
            this.bin['reload']({ ClientCode: this.filters['ClientCode'], WarehouseSiteId: this.filters['WarehouseSiteId'] });
          }
        }
      }
    });

    this.bin['change'].subscribe({
      next: (data: any) => {
        this.filters['LocationLabel'] = data ? data.Code : "";
        this.filters['LocationType'] = data ? data.Type : "";
      }
    });

    this.appTable['actionEvent'].subscribe({
      next: (event: any) => {
        if (!event) {
          return;
        }
        const action = event["action"];
        switch (action) {
          case 'forward':
            this.router.navigate([`/${window.getRootPath()}/lost-found/mapping-lost-found/${event['data'].Code}`]);
            break;
        }
      }
    });
  }

  onEnter(event: any) {
    this.search(null);
  }
  compareDate() {
    const createdFromDate = this.fromDate.getValue();
    const createdToDate = this.toDate.getValue();
    if (createdFromDate && createdToDate) {
      const formatCreatedFromDate = new Date(createdFromDate.getFullYear(), createdFromDate.getMonth(), createdFromDate.getDate());
      const formatCreatedToDate = new Date(createdToDate.getFullYear(), createdToDate.getMonth(), createdToDate.getDate());
      if (formatCreatedFromDate > formatCreatedToDate) {
        this.toast.error('invalid_date_range', 'error_title');
        this.toDate.setValue(new Date());
      }
    }
  }
}
