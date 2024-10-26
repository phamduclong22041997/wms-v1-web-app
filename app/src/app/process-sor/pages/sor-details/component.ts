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

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Service } from '../../service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../shared/toast.service';
import { MatDialog } from '@angular/material/dialog';

import { NUMBERIC } from '../../../shared/constant';
import { Utils } from '../../../shared/utils';

// interface TableAction {
//   icon: string;
//   class?: string;
//   name?: String;
//   toolTip?: any;
//   actionName?: any;
//   disabledCondition?: any;
// }

@Component({
  selector: 'app-sor-details',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})


export class SORDetailsComponent implements OnInit {
  @ViewChild('appTable', { static: false }) appTable: ElementRef;


  SORCode: String;
  tableConfig: any;

  data: any = {
    ClientCode:'',
    SORCode: '',
    SOCode: '',
    SOExternalCode: '',
    SiteId: '',
    SiteName: '',
    WarehouseSite: '',
    Type: '',
    Status: '',
    CreatedDate: null,
    CreatedBy: '',
    CanceledBy: '',
    CanceledDate: null,
    Note: '',
    Details: []
  };

  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private toast: ToastService,
    private service: Service,
    public dialog: MatDialog,
    private router: Router) {
    this.SORCode = this.route.snapshot.params.SORCode;
  }

  ngOnInit() {
    this.initTable();
    this.loadData();
  }

  initTable() {
    this.tableConfig = {
      style: {
        'overflow-x': 'hidden'
      },
      columns: {
        actionTitle: 'action',
        isContextMenu: false,
        displayedColumns: [
          'index',
          'SKU',
          'Name',
          'BaseReturnQty',
          'BaseUom',
          'PackedQty',  
          'Weight',
          'Volume',
          'ReturnReason',
        ],
        options: [
          {
            title: 'SOReturns.SKU',
            name: 'SKU',
            style: {
              'min-width': '90px',
              'max-width': '120px'
            },
          },
          {
            title: 'SOReturns.Name',
            name: 'Name'
          },
          {
            title: 'SOReturns.BaseReturnQty',
            name: 'BaseReturnQty'
          },
          {
            title: 'SOReturns.BaseUom',
            name: 'BaseUom'
          },
          {
            title: 'SOReturns.TotalWeight',
            name: 'Weight'
          },
          {
            title: 'SOReturns.TotalVolume',
            name: 'Volume'
          },
          {
            title: 'SOReturns.PackedQty',
            name: 'PackedQty'
          },
          {
            title: 'SOReturns.ReturnReason',
            name: 'ReturnReason'
          },
        ]
      },
      data: {
        rows: this.data.Details || [],
        total: this.data.Details.length
      }
    };

  }

  loadData() {
    if(!this.SORCode) return;
    this.service.getSODetails({SORCode: this.SORCode})
      .subscribe((resp: any) => {
        if (resp.Status && resp.Data) {
          this.data = {
            ClientCode: resp.Data.ClientCode,
            SORCode: resp.Data.SORCode,
            SOCode: resp.Data.SOCode,
            SOExternalCode: resp.Data.SOExternalCode,
            SiteId: resp.Data.SiteId,
            SiteName: resp.Data.SiteName,
            WarehouseSite: resp.Data.WarehouseSite,
            WarehouseCode: resp.Data.WarehouseCode,           
            Type: this.translate.instant(`SOReturns.${resp.Data.Type}`),
            Status: this.translate.instant(`SOReturns.Status_${resp.Data.Status}`),            
            CreatedDate: resp.Data.CreatedDate,
            CreatedBy: resp.Data.CreatedBy,
            CanceledBy: resp.Data.CanceledBy,
            Note: resp.Data.Note,
            Details: resp.Data.Details,
            TotalVolume: resp.Data.TotalVolume,
            TotalWeight: resp.Data.TotalWeight,
            TotalPackedQty: resp.Data.TotalPackedQty,          
            TotalReturnQty: resp.Data.TotalReturnQty,         
            TotalSKU: resp.Data.TotalSKU,
            CompletedBy: resp.Data.CompletedBy,
            CompletedDate: resp.Data.CompletedDate
          };

          this.appTable['renderData'](this.data.Details);
        }
      });
  }
  exportExcel() {
    return this.service.exportSORDetails({SORCode: this.SORCode});
  }
  backToList() {
    this.router.navigate([`/${window.getRootPath()}/sor/list`, {}]);
  }
}
