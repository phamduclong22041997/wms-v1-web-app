import { Component, OnInit, Inject, ViewChild} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-upload-confirm-sto',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class ConfirmBookingComponent implements OnInit {
  render:any;
  @ViewChild('noteContent',{static: false}) noteContent:String;
  constructor(public dialogRef: MatDialogRef<ConfirmBookingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
    // noteContent='';
      ngOnInit() {
      }

      onCancelClick() {
        this.dialogRef.close(false);
      }
      onOkClick() {
        this.dialogRef.close(this.data.type ===1 ? this.noteContent: true);
      }
}
