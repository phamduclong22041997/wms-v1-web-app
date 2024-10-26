
/**
 * Copyright (c) 2019 OVTeam
 * Modified by: HuuChi
 * Modified date: 10/03/2021
 */

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material';
import * as _ from 'lodash';
import { ServiceRegion } from './service';
import { RegionService } from '../../../shared/region-storage.service';
@Component({
  selector: 'region-modal',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class RegionModalComponent implements OnInit {
  areaConfig: Object;
  optionData: any;
  selected = {};
  region: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RegionModalComponent>,
    public dialog: MatDialog,
    private service: ServiceRegion,
    public regionService: RegionService,
  ) { }

  ngOnInit() {

    this.service.getArea().subscribe(res => {
      if (res.Data) {
        this.optionData = res.Data;
        const region = this.regionService.get('region');
        if (region) {
          this.selected = region;
          this.region = region;
        }
      }
    })
  }

  close() {
    this.regionService.store('region', this.region);
    this.dialogRef.close();
  }

  setRegion(val: any) {
    this.region = this.optionData.find((item: any) => item.Code === val.value);
  }

}
