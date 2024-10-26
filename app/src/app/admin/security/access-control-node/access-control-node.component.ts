import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { SecurityService } from './../security.service';


@Component({
  selector: 'app-security-access-node',
  templateUrl: './access-control-node.component.html',
  styleUrls: ['./access-control-node.component.css']
})
export class AccessControlNodeComponent implements OnInit {
  title: String = "Add New";
  data: Object = {
    ref: "",
    name: "",
    level: 1,
    path: "",
    icon: "",
    helplink: "",
    title: "",
    resourceid: "",
    position: 1,
    isview: false,
    ismenu: false
  }
  isMenu = false;
  constructor(private securityService: SecurityService,
    public dialogRef: MatDialogRef<AccessControlNodeComponent>,
    @Inject(MAT_DIALOG_DATA) public refData: any) {
  }
  ngOnInit() {
    if (this.refData == null) {
      this.isMenu = true;
      this.refData = {
        'action': 'ADD',
        'data': {}
      }
    } else {
      this.title = 'Add new';
      if (this.refData['action'] === 'EDIT') {
        this.title = 'Edit';
        this.initData(this.refData.data);
      } else
        if (this.refData['action'] === 'DELETE') {
          this.title = 'Permanently deleted?';
        } else {
          this.data['level'] = this.refData.data['level'] + 1;
        }
    }
  }
  initData(data) {
    this.data = { ...data };
    this.isMenu = data.ismenu;
  }
  toggleChange(event) {
    this.isMenu = event.checked;
  }
  onChecked(event) {
    this.data['isview'] = event.checked;
  }
  saveHandle() {
    if (this.refData && this.refData['action'] === 'ADD') {
      this.data['ref'] = this.refData.data['id'];
    }
    if (!this.isMenu) {
      this.data['title'] = this.data['name'];
    }
    if (this.isMenu) {
      this.data['ismenu'] = true;
    }
    this.securityService.createAccessControl(this.data)
      .subscribe((response) => {
        this.dialogRef.close(true);
      })
  }
  removeHandle() {
    if (this.refData && this.refData.data['id']) {
      this.securityService.removeAccessControl(this.refData.data['id'])
        .subscribe((response) => {
          this.dialogRef.close(true);
        })
    }
  }
}
