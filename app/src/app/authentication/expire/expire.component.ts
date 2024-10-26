import { Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-expire',
  templateUrl: './expire.component.html',
  styleUrls: ['./expire.component.css']
})
export class ExpireComponent implements OnInit {
  message:string = "Bạn đã hết quyền truy cập.";
  constructor(public dialogRef: MatDialogRef<ExpireComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

      ngOnInit() {}
}
