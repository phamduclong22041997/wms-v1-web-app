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

import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-cancel',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class ConfirmCancelComponent implements OnInit {
  render: any;
  @ViewChild('noteContent', { static: false }) noteContent: String;
  constructor(public dialogRef: MatDialogRef<ConfirmCancelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  ngOnInit() {
    if (!this.data['Items']) {
      this.data['Items'] = []
    }
  }

  onCancelClick() {
    this.dialogRef.close(false);
  }
  onOkClick() {
    this.dialogRef.close({ Note: this.noteContent });
  }
}
