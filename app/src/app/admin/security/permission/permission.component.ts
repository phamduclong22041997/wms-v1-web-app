import { Component, OnInit, Injectable, ViewChild} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

import { SecurityService } from '../security.service';

@Injectable()
export class Database {
  dataChange = new BehaviorSubject<any[]>([]);

  data:any;

  constructor(private securityService: SecurityService) {
    this.getData();
  }

  initialize() {
    // Notify the change.
    this.dataChange.next(this.data);
  }

  getData() {
    this.securityService.getRoleList()
    .subscribe((response:any)=>{
      this.data = [];
      if(response.Success) {
        this.data = response.Data.rows || {};
      }
      this.initialize();
    })
  }
}

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.css'],
  providers: [Database]
})
export class PermissionComponent implements OnInit {
  @ViewChild('plist', {static: true}) pList;
  dataRole:any;
  constructor(private _database: Database) {
    _database.dataChange.subscribe(data => {
      this.dataRole = data;
    });
  }

  ngOnInit() {
    console.log(this.pList)
  }

  selectHandle(event:any) {
    this.pList._database.getData({role: event.value});
  }
}
