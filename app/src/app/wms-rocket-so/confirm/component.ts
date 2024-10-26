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

      ngOnInit() {
        console.log(this.data);
        
      }

      onCancelClick() {
        this.dialogRef.close(false);
      }
      onOkClick() {
        this.dialogRef.close(true);
      }
}
