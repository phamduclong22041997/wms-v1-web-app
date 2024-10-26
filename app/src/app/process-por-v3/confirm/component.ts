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

import { Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-upload-confirm-sto',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class ConfirmExportComponent implements OnInit {
  render:any;
  constructor(public dialogRef: MatDialogRef<ConfirmExportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

      ngOnInit() {}

      onCancelClick() {
        this.dialogRef.close(false);
      }
      onOkClick() {
        this.dialogRef.close(true);
      }
}
