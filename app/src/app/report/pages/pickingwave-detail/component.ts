import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../../shared/toast.service';
import { Service } from '../../service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

interface TableAction {
  name: string,
  icon: string;
  class?: string;
  toolTip?: any;
  actionName?: any;
  disabledCondition?: any;
}

@Component({
  selector: 'app-pickingwave-detail',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class PickingwaveDetailComponent implements OnInit, AfterViewInit {
  @ViewChild('appTable', { static: false }) appTable: ElementRef;
  @ViewChild('fromDate', { static: false }) fromDate: any;
  @ViewChild('toDate', { static: false }) toDate: any;
  @ViewChild('status', { static: false }) statusCombo: ElementRef;
  @ViewChild('store', { static: false }) store: ElementRef;
  @ViewChild('content', { static: false }) contentInput: ElementRef;

  code: String;
  tableConfig: any;
  configDate: any;
  provinceConfig: any;
  service3PLConfig: any;
  statusConfig: any;
  storeConfig: any;
  allowCreatePickList: boolean;
  data: any = {
    Code: "",
    CreatedBy: '',
    CreatedDate: '',
    Status: '',
    UpdatedBy: '',
    UpdatedDate: '',
    SOList: [],
    TotalSO: 0,
    TotalPickQty: 0,
    TotalPickedQty: 0,
    Details: []
  };
  
  constructor(
    public dialog: MatDialog,
    private service: Service,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private toast: ToastService) {
      this.code = this.route.snapshot.params.code;
    }

  ngOnInit() {
    this.initTable();
  }

  ngAfterViewInit() {
    this.initEvent();
    this.loadData()
  }

  initEvent() {

  }

  initTable() {
    this.tableConfig = {
      disablePagination: false,
      columns: {
        isContextMenu: false,
        displayedColumns: [
          'index',  'Code', 'SOCode', 'TotalPickQty', 'TotalPickedQty', 'Status', 
          'CreatedDate', 'CreatedBy', 'UpdatedDate', "UpdatedBy"
        ],
        options: [
          {
            title: 'Pickingwave.PLCode',
            name: 'Code',
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/saleorder/auto-pickpack/${data.Code}`;
            },
            style: {
              'min-width': '150px',
              'max-width': '150px'
            }
          },
          {
            title: 'Pickingwave.SOCode',
            name: 'SOCode',
            link: true,
            newpage: true,
            onClick: (data: any) => {
              return `/${window.getRootPath()}/saleorder/details/${data.SOCode}`;
            },
            style: {
              'min-width': '160px',
              'max-width': '160px'
            }
          },
          {
            title: 'Pickingwave.TotalPick',
            name: 'TotalPickQty',
            style: {
              'min-width': '90px',
              'max-width': '90px'
            }
          },
          {
            title: 'Pickingwave.TotalPicked',
            name: 'TotalPickedQty',
            style: {
              'min-width': '90px',
              'max-width': '90px'
            }
          },
          {
            title: 'Pickingwave.Status',
            name: 'Status',
            render: (data: any) => {
              return this.translate.instant(`PickListStatus.${data.Status}`);
            },
            style: {
              'min-width': '140px',
              'max-width': '140px'
            }
          },
          {
            title: 'Pickingwave.CreatedDate',
            name: 'CreatedDate',
            style: {
              'min-width': '140px',
              'max-width': '140px'
            }
          },
          {
            title: 'Pickingwave.CreatedBy',
            name: 'CreatedBy'
          },
          {
            title: 'Pickingwave.UpdatedDate',
            name: 'UpdatedDate',
            style: {
              'min-width': '140px',
              'max-width': '140px'
            }
          },
          {
            title: 'Pickingwave.UpdatedBy',
            name: 'UpdatedBy'
          }
        ]
      },
      data: {
        rows: this.data.Details || [],
        total: this.data.Details.length
      }
    };

  }

  loadData() {
    this.service.getPickwaveDetail({Code: this.code})
      .subscribe((resp: any) => {
        if (resp.Data) {
          console.log('resp.Data', resp.Data);
          let data = resp.Data;
          this.data = {
            Code: data.Code,
            CreatedBy: data.CreatedBy,
            CreatedDate: data.CreatedDate,
            Status: data.Status,
            UpdatedBy: data.UpdatedBy,
            UpdatedDate: data.UpdatedDate,
            SOList: data.SOList,
            TotalSO: data.SOList.length,
            TotalPickQty: data.Details.reduce((a, { TotalPickQty }) => a + TotalPickQty, 0),
            TotalPickedQty: data.Details.reduce((a, { TotalPickedQty }) => a + TotalPickedQty, 0),
            Details: data.Details
          }
          this.appTable['renderData'](this.data.Details);
        }
      });
  }

  exportExcel(data: any = {}) {
    return this.service.exportPickwaveDetail({Code: this.code});
  }
}
